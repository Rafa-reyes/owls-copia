
const fs = require('fs');

/**
 * Firmas binarias (magic numbers) de los formatos de imagen permitidos.
 * Estos bytes son parte del formato real del archivo y NO pueden ser
 * falsificados simplemente cambiando la extensión o el header
 * Content-Type que envía el cliente.
 */
function matchesSignature(buffer, signature) {
    return signature.every((byte, i) => buffer[i] === byte);
}

function detectRealMimeType(buffer) {
    // JPEG -> FF D8 FF
    if (matchesSignature(buffer, [0xFF, 0xD8, 0xFF])) {
        return 'image/jpeg';
    }

    // PNG -> 89 50 4E 47 0D 0A 1A 0A
    if (matchesSignature(buffer, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
        return 'image/png';
    }

    // WEBP -> "RIFF" (bytes 0-3) + tamaño (bytes 4-7) + "WEBP" (bytes 8-11)
    if (
        buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP'
    ) {
        return 'image/webp';
    }

    return null;
}

const ALLOWED_REAL_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Debe ejecutarse DESPUÉS de multer (upload.single/array...).
 * Lee los primeros bytes del archivo ya escrito en disco y valida
 * su firma real, sin confiar en req.file.mimetype ni en la extensión.
 */
const verifyMagicNumber = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se recibió ningún archivo' });
    }

    const filePath = req.file.path;

    let fd;
    try {
        // Con 12 bytes alcanza para identificar cualquiera de los 3 formatos permitidos
        const buffer = Buffer.alloc(12);
        fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 12, 0);
        fs.closeSync(fd);
        fd = undefined;

        const realMimeType = detectRealMimeType(buffer);

        if (!realMimeType || !ALLOWED_REAL_MIME_TYPES.includes(realMimeType)) {
            // El contenido real no es una imagen válida: podría ser un web shell,
            // un script, o cualquier binario disfrazado con extensión de imagen.
            fs.unlinkSync(filePath);
            return res.status(400).json({
                mensaje: 'El contenido del archivo no coincide con un formato de imagen válido'
            });
        }

        // Dejamos constancia del mimetype real verificado, útil para logs/auditoría
        req.file.verifiedMimeType = realMimeType;
        return next();
    } catch (error) {
        if (fd !== undefined) {
            try { fs.closeSync(fd); } catch (_) { /* noop */ }
        }
        try { fs.unlinkSync(filePath); } catch (_) { /* el archivo puede no existir ya */ }
        return res.status(500).json({ mensaje: 'Error al verificar el archivo' });
    }
};

module.exports = verifyMagicNumber;

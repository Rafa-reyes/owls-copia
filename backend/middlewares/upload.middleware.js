const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const crearUploader = (carpetaDestino) => {
    const directory = path.join(__dirname, "..", "uploads", carpetaDestino);
    
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, directory);
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLocaleLowerCase();
            const correctName = crypto.randomBytes(16).toString('hex') + extension;
            cb(null, correctName);
        }
    });

    const typeFile = (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo inválido'), false);
        }
    };

    return multer({
        storage,
        fileFilter: typeFile,
        limits: { fileSize: 5 * 1024 * 1024 }
    });
};

module.exports = {
    uploadPerfil: crearUploader('perfiles'),
    uploadInsignia: crearUploader('insignias')
};
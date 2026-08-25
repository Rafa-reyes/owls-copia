const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const MAX_INTENTOS = 100; //cambiar a 5 en produccion
const TIEMPO_BLOQUEO = 15; // Mantenemos el nombre de la variable
const isProd = process.env.NODE_ENV === 'production';

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'El correo y la contraseña son obligatorios.' });
        }

        const usuario = await prisma.usuarios.findUnique({
            where: {
                correo
            },
            include: {
                usuario_rol: true
            }
        });
        if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
        const arr_rol= usuario.usuario_rol.map(r => Number(r.rol_id))

        //Verificar si esta bloqueado
        if (usuario.bloqueado_hasta && new Date() < usuario.bloqueado_hasta) {
            const minutosRestantes = Math.ceil((usuario.bloqueado_hasta - new Date()) / 60000);
            return res.status(403).json({
                error: `Cuenta bloqueada por demasiados intentos. Intenta de nuevo en ${minutosRestantes} minutos.` 
            });
        }

        // Comparación de contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            //Si falla, sumar un intento
            const nuevosIntentos = usuario.intentos_fallidos + 1;
            let nuevoBloqueo = null;

            if (nuevosIntentos >= MAX_INTENTOS) {
                nuevoBloqueo = new Date(Date.now() + TIEMPO_BLOQUEO * 60000);
            }

            await prisma.usuarios.update({
                where: { id: usuario.id },
                data: {
                    intentos_fallidos: nuevosIntentos,
                    bloqueado_hasta: nuevoBloqueo
                }
            });

            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Si el login es exitoso, reiniciar intentos
        await prisma.usuarios.update({
            where: { id: usuario.id },
            data: { intentos_fallidos: 0, bloqueado_hasta: null }
        });
        
        // Agregar el rol al payload del JWT
        const token = jwt.sign(
            {
                id: usuario.id.toString(),
                roles: arr_rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie('access_token', token, {
            httpOnly: false,
            secure: isProd, //poner true en produccion
            sameSite: 'lax',
            maxAge: 2 * 60 * 60 * 1000
        });

        return res.json({
            mensaje: 'Login exitoso',
            usuario: { id: usuario.id.toString(), correo: usuario.correo }
        });

    } catch (error) {
        console.error('Error en login: ', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    return res.status(200).json({
        success: true,
        message: 'Sesión limpiada correctamente'
    });
};

module.exports = { login, logout };
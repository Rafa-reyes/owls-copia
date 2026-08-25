const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma');

const verificarToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(403).json({ mensaje: 'Acceso denegado, se requiere autenticación' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next(); 
    } catch (error) {
        return res.status(401).json({ mensaje: 'Tiempo expirado. Inicia sesión' });
    }
};

const requerirRoles = (rolesRequeridos) => {
    return async (req, res, next) => {
        if (!req.user) {
            const token = req.cookies.access_token;
            if (!token) return res.status(403).json({ mensaje: 'Acceso denegado, se requiere autenticación' });
            
            try {
                req.user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(401).json({ mensaje: 'Tiempo expirado. Inicia sesión' });
            }
        }
        const userId = req.user.id || req.user.usuario_id;

        if (!userId) {
            return res.status(403).json({ mensaje: 'Acceso denegado. Token inválido.' });
        }

        try {
            const usuario = await prisma.usuarios.findUnique({
                where: { id: BigInt(userId) },
                include: {
                    usuario_rol: {
                        include: { roles_usuario: true }
                    }
                }
            });

            if (!usuario || !usuario.usuario_rol || usuario.usuario_rol.length === 0) {
                return res.status(403).json({ mensaje: 'Acceso denegado. Usuario sin roles asignados.' });
            }

            const rolesUsuarioIds = usuario.usuario_rol.map(ur => Number(ur.rol_id));
            const rolesUsuarioNombres = usuario.usuario_rol.map(ur => ur.roles_usuario.nombre.toLowerCase());

            const tieneRol = rolesRequeridos.some(rolReq => {
                if (typeof rolReq === 'number') return rolesUsuarioIds.includes(rolReq);
                if (typeof rolReq === 'string') return rolesUsuarioNombres.includes(rolReq.toLowerCase());
                return false;
            });

            if (!tieneRol) {
                return res.status(403).json({ mensaje: 'Acceso denegado. Permisos insuficientes.' });
            }

            next();
        } catch (error) {
            console.error("Error al verificar roles en la BD:", error);
            return res.status(500).json({ mensaje: 'Error interno al verificar permisos.' });
        }
    };
};
module.exports = { verificarToken, requerirRoles };
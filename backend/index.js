
    const express = require('express');
    const cors = require('cors');
    const cookieParser = require('cookie-parser');
    const helmet = require('helmet');
    require('dotenv').config();


    const isProd = process.env.NODE_ENV === 'production';

    const app = express();
    const PORT = process.env.PORT || 3000;
    app.set('trust proxy', 1);

    //Nuevo ruteo a ranking
    const rankingRoutes = require('./src/routes/ranking.routes');
    const authRoutes = require('./src/routes/auth.routes');
    const patrocinio = require('./src/routes/patrocinios.routes');
    const dashboardRoutes = require('./src/routes/dashboard.routes');
    const eventosRoutes = require('./src/routes/eventos.routes');
    const cursosRoutes = require('./src/routes/cursos.routes');
    const proyectosRoutes = require('./src/routes/proyectos.routes');
    const feedRoutes = require('./src/routes/feed.routes');
    const novedadRoutes = require('./src/routes/novedad.routes');
    const insigniasRoutes = require('./src/routes/insignias.router');

    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200
    };
    // Middlewares basicos
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());
    const logger = require('./src/config/logger');

    // Usar la ruta en la API
    app.use('/api/auth', authRoutes);
    app.use('/api/ranking', rankingRoutes);
    app.use('/api/patrocinios', patrocinio);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/admin/eventos', eventosRoutes);
    app.use('/api/admin/cursos', cursosRoutes);
    app.use('/api/admin/proyectos', proyectosRoutes);
    app.use('/api/admin', novedadRoutes);
    app.use('/api/feed', feedRoutes);
    app.use('/api/admin/insignias', insigniasRoutes);

    // Ruta de prueba
    app.get('/api/status', (req, res) => {
        res.json({ mensaje: "Servidor de Owls corriendo al 100%" });
    });
    const alumnosRoutes = require('./src/routes/alumnos.routes');
    const perfilRoutes = require('./src/routes/perfil.routes');
    const adminRoutes = require('./src/routes/admin.routes');
    app.use('/api/alumnos', alumnosRoutes);
    app.use('/api/perfil', perfilRoutes);
    app.use('/api/admin', adminRoutes);
    app.use(express.json({ limit: '10mb' }));//para subir las fotos de perfil
    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
                imgSrc: ["'self'", "data:"],
                connectSrc: isProd ? ["'self'"] : ["'self'", "http://localhost:3000"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'none'"],
            },
        },
        hsts: isProd
            ? { maxAge: 31536000, includeSubDomains: true, preload: true }
            : false, // en dev no tiene sentido forzar HTTPS
    }));
    
    if (!process.env.JWT_SECRET) {
        console.error('Error critico, se necesita el JWT en variables de entorno');
        process.exit(1); // Apaga el servidor automaticamente
    }


    app.listen(PORT, () => {
        console.log(`Servidor backend encendido en http://localhost:${PORT}`);
        logger.info('Iniciando el servidor de OWLS y verificando el sistema de logs...');
    });

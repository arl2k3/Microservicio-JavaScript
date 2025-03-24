const { getByEmail, getByUsername } = require('../services/userServices');



const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
    console.error(err.stack);
  
    const statusCode = err.status || 500;
    const message = err.message || getDefaultErrorMessage(statusCode);
    const response = err.response || getDefaultErrorResponse(statusCode, req);
  
    res.status(statusCode).json({
        status: statusCode,
        message,
        response,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};

const getDefaultErrorMessage = (statusCode) => {
    switch (statusCode) {
        case 400: return "Solicitud incorrecta";
        case 401: return "No autorizado";
        case 403: return "Prohibido";
        case 404: return "Recurso no encontrado";
        case 422: return "Error de validación";
        default: return "Error interno del servidor";
    }
};

const getDefaultErrorResponse = (statusCode, req) => {
    switch (statusCode) {
        case 400: return `Datos inválidos: ${JSON.stringify(req.body)}`;
        case 401: return "Error de autorización";
        case 403: return "Acceso denegado";
        case 404: return `Ruta no encontrada: ${req.originalUrl}`;
        case 422: return "Datos no cumplen con la validación requerida";
        default: return "Error inesperado";
    }
};
  
const notFoundHandler = (req, res, next) => {
    const error = new Error(`La ruta ${req.originalUrl} no existe en este servidor`);
    error.status = 404;
    next(error);
};
  
const malformedJsonHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        const error = new Error("El cuerpo de la solicitud contiene un JSON inválido");
        error.status = 400;
        return next(error);
    }
    next(err);
};

const canManageUsers = async (req, res, next) => {
    try {
        const requestedUsername = req.params.user;
        const authenticatedEmail = req.user.email;
        
        const authenticatedUser = await getByEmail(authenticatedEmail);
        
        if (!authenticatedUser) {
            const error = new Error('Usuario autenticado no encontrado');
            error.status = 401;
            return next(error);
        }

        if (authenticatedUser.isAdmin) {
            return next();
        }

        const requestedUser = await getByUsername(requestedUsername);

        if (!requestedUser) {
            const error = new Error('Usuario solicitado no encontrado');
            error.status = 404;
            return next(error);
        }

        if (requestedUser.email === authenticatedEmail) {
            return next();
        }

        const error = new Error('No tienes permiso para gestionar este usuario');
        error.status = 403;
        return next(error);

    } catch (error) {
        error.status = 500;
        error.message = 'Error al verificar permisos: ' + error.message;
        next(error);
    }
};
  
module.exports = {
    errorHandler,
    notFoundHandler,
    malformedJsonHandler,
    canManageUsers
};
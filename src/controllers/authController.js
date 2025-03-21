const authServices = require('../services/authServices');
const { verifyAccSchema, loginSchema, userSchema } = require('../util/validationSchema');
const { verifyCode, comparePassword, generateVerificationCode, hashVerificationCode, hashPassword } = require('../util/helper');
const { sendEmail } = require('../config/emailConfig');
const { getByEmail, patchUser } = require('../services/userServices');

const verifyAcc = async (req, res) => {
    try {
        const userData = req.body;

        // Validar el formato de los datos
        if(!verifyAccSchema.safeParse(userData).success) {
            return res.status(400).json({ 
                status: 400, 
                message: "Datos inválidos", 
                response: "Formato de datos incorrecto" 
            });
        }

        // Obtener el usuario por email
        const user = await getByEmail(userData.email);
        
        if (!user) {
            return res.status(404).json({ 
                status: 404, 
                message: "Usuario no encontrado", 
                response: "No existe un usuario con este email" 
            });
        }

        // Verificar si el usuario ya está verificado
        if (user.verified) {
            return res.status(400).json({ 
                status: 400, 
                message: "Usuario ya verificado", 
                response: "Esta cuenta ya ha sido verificada previamente" 
            });
        }

        // Verificar el código
        const isCodeValid = await verifyCode(userData.verificationCode, user.verificationCode);
        
        if (!isCodeValid) {
            return res.status(400).json({ 
                status: 400, 
                message: "Código de verificación inválido", 
                response: "El código ingresado no es válido" 
            });
        }

        // Actualizar el estado de verificación
        const updatedUser = await authServices.verifyByEmail(userData.email);
        
        if (!updatedUser) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error al verificar la cuenta", 
                response: "No se pudo completar la verificación" 
            });
        }

        // Enviar correo de confirmación
        await sendEmail(
            userData.email,
            "¡Felicidades! Cuenta verificada correctamente",
            `Hola ${updatedUser.user},

¡Felicidades! Tu cuenta ha sido verificada correctamente.
Ahora puedes disfrutar de todos los beneficios de nuestra plataforma.

Gracias por confiar en nosotros.

Saludos,
El equipo de soporte`
        );

        return res.status(200).json({ 
            status: 200, 
            message: "Usuario verificado correctamente", 
            response: "Se ha enviado un correo de confirmación" 
        });

    } catch (error) {
        return res.status(400).json({ 
            status: 400, 
            message: "Error al verificar el email", 
            response: error.message 
        });
    }
}


const loginUser = async (req, res) => {
    
    try {
        const userData = req.body;
        const user = await getByEmail(userData.email);

        if(!loginSchema.safeParse(userData).success) {
            return res.status(400).json({ 
                status: 400, 
                message: "Datos inválidos", 
                response: "Formato de datos incorrecto" 
            });
        }

        if (!user) {
            return res.status(404).json({ 
                status: 404, 
                message: "Usuario no encontrado", 
                response: "No existe un usuario con este email" 
            });
        }

        if (!user.verified) {
            return res.status(400).json({ 
                status: 400, 
                message: "Usuario no verificado", 
                response: "Por favor verifica tu cuenta antes de iniciar sesión" 
            });
        }

        if(!await comparePassword(userData.password, user.password)) {
            return res.status(400).json({ 
                status: 400, 
                message: "Contraseña incorrecta", 
                response: "La contraseña ingresada es incorrecta" 
            });
        }

        return res.status(200).json({ 
            status: 200, 
            message: "Inicio de sesión exitoso", 
            response: "¡Bienvenido de vuelta!" 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 400, 
            message: "Error al iniciar sesión", 
            response: error.message
        });
    }
}



module.exports = { verifyAcc, loginUser };

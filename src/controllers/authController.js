const authServices = require('../services/authServices');
const { verifyAccSchema, loginSchema, userSchema } = require('../util/validationSchema');
const { verifyCode, comparePassword, generateVerificationCode, hashVerificationCode, hashPassword } = require('../util/helper');
const { sendEmail } = require('../config/emailConfig');
const { getByEmail, patchUser } = require('../services/userServices');
const { generateToken } = require('../config/jwt');

const verifyAcc = async (req, res) => {
    try {
        const userData = req.body;

        if(!verifyAccSchema.safeParse(userData).success) {
            return res.status(400).json({ 
                status: 400, 
                message: "Datos inválidos", 
                response: "Formato de datos incorrecto" 
            });
        }

        const user = await getByEmail(userData.email);
        
        if (!user) {
            return res.status(404).json({ 
                status: 404, 
                message: "Usuario no encontrado", 
                response: "No existe un usuario con este email" 
            });
        }

        if (user.verified) {
            return res.status(400).json({ 
                status: 400, 
                message: "Usuario ya verificado", 
                response: "Esta cuenta ya ha sido verificada previamente" 
            });
        }

        const isCodeValid = await verifyCode(userData.verificationCode, user.verificationCode);
        
        if (!isCodeValid) {
            return res.status(400).json({ 
                status: 400, 
                message: "Código de verificación inválido", 
                response: "El código ingresado no es válido" 
            });
        }

        const updatedUser = await authServices.verifyByEmail(userData.email);
        
        if (!updatedUser) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error al verificar la cuenta", 
                response: "No se pudo completar la verificación" 
            });
        }

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

        const token = generateToken(user);

        return res.status(200).json({ 
            status: 200, 
            message: "Inicio de sesión exitoso", 
            response: "¡Bienvenido de vuelta!",
            token: token
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 400, 
            message: "Error al iniciar sesión", 
            response: error.message
        });
    }
}

const requestPasswordReset = async (req, res) => {
    try {
        const userData = req.body;

        if (!userSchema.shape.email.safeParse(userData.email).success) {
            return res.status(400).json({ 
                status: 400, 
                message: "Email inválido", 
                response: "Por favor ingresa un email válido" 
            });
        }
        
        const user = await getByEmail(userData.email);
        
        if (!user) {
            return res.status(404).json({ 
                status: 404, 
                message: "Usuario no encontrado", 
                response: "No existe un usuario con este email" 
            });
        }
        
        const code = generateVerificationCode();
        const hashedCode = await hashVerificationCode(code);
        
        await patchUser(user.user, { verificationCode: hashedCode });

        const emailSubject = "Código de verificación para restablecer contraseña";
        const emailBody = `Hola ${user.user},

                            Notamos que pediste un cambio de contraseña.
                            Tu código de verificación es: ${code}

                            Gracias por confiar en nosotros.

                            Saludos,
                            El equipo de soporte`;

        try {
            await sendEmail(userData.email, emailSubject, emailBody);
            
            return res.status(200).json({
                status: 200,
                message: "Código de verificación enviado",
                response: "Se ha enviado un correo con el código de verificación"
            });
        } catch (emailError) {
            console.error("Error al enviar el correo:", emailError);
            return res.status(500).json({
                status: 500,
                message: "Error al enviar el correo de verificación",
                response: "No se pudo enviar el correo. Intente nuevamente más tarde."
            });
        }
        
    } catch (error) {
        console.error("Error en requestPasswordReset:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al solicitar el cambio de contraseña",
            response: "Ha ocurrido un error interno. Intente nuevamente más tarde."
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email } = req.params;
        const userData = req.body;
        const user = await getByEmail(email);

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
                response: "Por favor verifica tu cuenta antes de cambiar tu contraseña" 
            });
        }

        if (!user.verificationCode) {
            return res.status(400).json({ 
                status: 400, 
                message: "Código de verificación no encontrado", 
                response: "Por favor solicita un nuevo código de verificación" 
            });
        }

        const isCodeValid = await verifyCode(userData.verificationCode, user.verificationCode);

        if (!isCodeValid) {
            return res.status(400).json({ 
                status: 400, 
                message: "Código de verificación inválido", 
                response: "El código ingresado no es válido" 
            });
        }
        
        const hashedPassword = await hashPassword(userData.password);
        const updatedUser = await authServices.resetPass(email, hashedPassword);

        if (!updatedUser) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error al cambiar la contraseña", 
                response: "No se pudo completar el cambio de contraseña" 
            });
        }

        await sendEmail(
            email,
            "Contraseña cambiada correctamente",
            `Hola ${updatedUser.user},
            
            Tu contraseña ha sido cambiada correctamente.
            Si no fuiste tú, por favor contacta a soporte.

            Gracias por confiar en nosotros.

            Saludos,
            El equipo de soporte`
        );

        return res.status(200).json({ 
            status: 200, 
            message: "Contraseña cambiada correctamente", 
            response: "Se ha enviado un correo de confirmación" 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 500, 
            message: "Error al cambiar la contraseña", 
            response: error.message 
        });
    }
}

module.exports = { verifyAcc, loginUser, requestPasswordReset, resetPassword };
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
                message: "Datos inv�lidos", 
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
                message: "C�digo de verificaci�n inv�lido", 
                response: "El c�digo ingresado no es v�lido" 
            });
        }

        const updatedUser = await authServices.verifyByEmail(userData.email);
        
        if (!updatedUser) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error al verificar la cuenta", 
                response: "No se pudo completar la verificaci�n" 
            });
        }

        await sendEmail(
            userData.email,
            "�Felicidades! Cuenta verificada correctamente",
            `Hola ${updatedUser.user},

            �Felicidades! Tu cuenta ha sido verificada correctamente.
            Ahora puedes disfrutar de todos los beneficios de nuestra plataforma.

            Gracias por confiar en nosotros.

            Saludos,
            El equipo de soporte`
        );

        return res.status(200).json({ 
            status: 200, 
            message: "Usuario verificado correctamente", 
            response: "Se ha enviado un correo de confirmaci�n" 
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
                message: "Datos inv�lidos", 
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
                response: "Por favor verifica tu cuenta antes de iniciar sesi�n" 
            });
        }

        if(!await comparePassword(userData.password, user.password)) {
            return res.status(400).json({ 
                status: 400, 
                message: "Contrase�a incorrecta", 
                response: "La contrase�a ingresada es incorrecta" 
            });
        }

        const token = generateToken(user);

        return res.status(200).json({ 
            status: 200, 
            message: "Inicio de sesi�n exitoso", 
            response: "�Bienvenido de vuelta!",
            token: token
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 400, 
            message: "Error al iniciar sesi�n", 
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
                message: "Email inv�lido", 
                response: "Por favor ingresa un email v�lido" 
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

        const emailSubject = "C�digo de verificaci�n para restablecer contrase�a";
        const emailBody = `Hola ${user.user},

                            Notamos que pediste un cambio de contrase�a.
                            Tu c�digo de verificaci�n es: ${code}

                            Gracias por confiar en nosotros.

                            Saludos,
                            El equipo de soporte`;

        try {
            await sendEmail(userData.email, emailSubject, emailBody);
            
            return res.status(200).json({
                status: 200,
                message: "C�digo de verificaci�n enviado",
                response: "Se ha enviado un correo con el c�digo de verificaci�n"
            });
        } catch (emailError) {
            console.error("Error al enviar el correo:", emailError);
            return res.status(500).json({
                status: 500,
                message: "Error al enviar el correo de verificaci�n",
                response: "No se pudo enviar el correo. Intente nuevamente m�s tarde."
            });
        }
        
    } catch (error) {
        console.error("Error en requestPasswordReset:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al solicitar el cambio de contrase�a",
            response: "Ha ocurrido un error interno. Intente nuevamente m�s tarde."
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
                response: "Por favor verifica tu cuenta antes de cambiar tu contrase�a" 
            });
        }

        if (!user.verificationCode) {
            return res.status(400).json({ 
                status: 400, 
                message: "C�digo de verificaci�n no encontrado", 
                response: "Por favor solicita un nuevo c�digo de verificaci�n" 
            });
        }

        const isCodeValid = await verifyCode(userData.verificationCode, user.verificationCode);

        if (!isCodeValid) {
            return res.status(400).json({ 
                status: 400, 
                message: "C�digo de verificaci�n inv�lido", 
                response: "El c�digo ingresado no es v�lido" 
            });
        }
        
        const hashedPassword = await hashPassword(userData.password);
        const updatedUser = await authServices.resetPass(email, hashedPassword);

        if (!updatedUser) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error al cambiar la contrase�a", 
                response: "No se pudo completar el cambio de contrase�a" 
            });
        }

        await sendEmail(
            email,
            "Contrase�a cambiada correctamente",
            `Hola ${updatedUser.user},
            
            Tu contrase�a ha sido cambiada correctamente.
            Si no fuiste t�, por favor contacta a soporte.

            Gracias por confiar en nosotros.

            Saludos,
            El equipo de soporte`
        );

        return res.status(200).json({ 
            status: 200, 
            message: "Contrase�a cambiada correctamente", 
            response: "Se ha enviado un correo de confirmaci�n" 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 500, 
            message: "Error al cambiar la contrase�a", 
            response: error.message 
        });
    }
}

module.exports = { verifyAcc, loginUser, requestPasswordReset, resetPassword };
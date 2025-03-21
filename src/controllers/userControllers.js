const userServices = require('../services/userServices');
const { registerUserSchema, userSchema } = require('../util/validationSchema');
const { hashPassword, generateVerificationCode, hashVerificationCode } = require('../util/helper');
const { sendEmail } = require('../config/emailConfig');

const getUserByUsername = async (req, res) => {
    try {
        const { user } = req.params;
        const foundUser = await userServices.getByUsername(user);

        if (!foundUser) {
            return res.status(404).json({ status: 404, message: "Usuario no encontrado", response: error.message });
        }

        return res.status(200).json({ status: 200, message: "Usuario encontrado", response: foundUser.email });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error al obtener el usuario por user", response: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        if (!registerUserSchema.safeParse(userData)) {
            return res.status(400).json({ status: 400, message: "Datos inv�lidos", response: "Formato de datos incorrecto" });
        }

        if (await userServices.getByEmail(userData.email)) {
            return res.status(400).json({ status: 400, message: "Email ya registrado", response: "Este email ya est� en uso" });
        }

        if (await userServices.getByUsername(userData.user)) {
            return res.status(400).json({ status: 400, message: "Usuario ya registrado", response: "Este nombre de usuario ya est� en uso" });
        }

        // Generar y hashear la contrase�a
        const hashedPassword = await hashPassword(userData.password);
        userData.password = hashedPassword;

        // Generar c�digo de verificaci�n de 6 d�gitos
        const verificationCode = generateVerificationCode();
        
        // Hashear el c�digo de verificaci�n
        const hashedVerificationCode = await hashVerificationCode(verificationCode);
        
        // Agregar el c�digo hasheado a los datos del usuario
        userData.verificationCode = hashedVerificationCode;
        userData.verified = false; // Marcar como no verificado
        
        // Crear el usuario con los datos actualizados
        const newUser = await userServices.create_User(userData);
        
        if (newUser) {
            // Enviar el c�digo de verificaci�n en texto plano por email
            sendEmail(
                newUser.email, 
                "Verifica tu email", 
                `Hola ${newUser.user}, verifica tu email en: /api/v1/verify , tu c�digo de verificaci�n es: ${verificationCode}`
            );
        }

        return res.status(201).json({ 
            status: 201, 
            message: "Usuario creado, revisa tu email para verificar tu cuenta", 
            response: newUser.email 
        });

    } catch (error) {
        return res.status(400).json({ 
            status: 400, 
            message: "Error al crear el usuario", 
            response: error.message 
        });
    }
}

const allUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        return res.status(200).json({ status: 200, message: "Usuarios encontrados", response: users.map(user => ({
            email: user.email,
            username: user.user
          })),
         });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error al obtener los usuarios", response: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        try {
            const validatedEmail = userSchema.shape.email.parse(email);
            
            const foundUser = await userServices.getByEmail(validatedEmail);
            
            if (!foundUser) {
                return res.status(404).json({ 
                    status: 404, 
                    message: "Usuario no encontrado"
                });
            }
            
            return res.status(200).json({ 
                status: 200, 
                message: "Usuario encontrado", 
                response: foundUser.user 
            });
            
        } catch (zodError) {
            return res.status(400).json({ 
                status: 400, 
                message: "Email inv�lido o no enviado", 
                response: zodError.message 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            status: 500, 
            message: "Error al obtener el usuario", 
            response: error.message 
        });
    }
};

const updatedUser = async (req, res) => {
    try {
        const { user } = req.params;
        const userData = req.body;

        const validatedData = userSchema.partial().safeParse(userData);

        if (!validatedData.success) {
            return res.status(400).json({ 
                status: 400, 
                message: "Datos de usuario inv�lidos", 
                errors: validatedData.error.errors 
            });
        }

        await userServices.putUser(user, validatedData.data);

        return res.status(200).json({ 
            status: 200, 
            message: "Usuario actualizado correctamente", 
            data: req.body.email || req.body.user
        });

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return res.status(500).json({ 
            status: 500, 
            message: "Error al actualizar el usuario", 
            error: error.message 
        });
    }
};

const patchedUser = async (req, res) => {
    try {
        const { user } = req.params;
        const userData = req.body;

        const patchSchema = userSchema.partial().pick({
            email: true,
            password: true,
            recovery_email: true
        });
        
        const validatedData = patchSchema.safeParse(userData);
        
        if (!validatedData.success) {
            return res.status(400).json({ 
                status: 400, 
                message: "Datos de usuario inv�lidos", 
                errors: validatedData.error.errors 
            });
        }
        
        const updatedUser = await userServices.patchUser(user, validatedData.data);

        return res.status(200).json({ 
            status: 200, 
            message: "Usuario actualizado parcialmente", 
            data: req.body.email || req.body.user
        });

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return res.status(500).json({ 
            status: 500, 
            message: "Error al actualizar el usuario", 
            error: error.message 
        });
    }
};

const deletedUser = async (req, res) => {
    try {
      const { user } = req.params;
      
      if (!user) {
        return res.status(400).json({
          status: 400,
          message: "Usuario no enviado",
          response: []
        });
      }
      await userServices.deleteUser(user);
      return res.json({
        status: 200,
        message: "Usuario eliminado",
        response: req.params.user
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        response: []
      });
    }
  }

module.exports = { getUserByUsername, registerUser, allUsers, getUserByEmail, updatedUser, patchedUser, deletedUser };

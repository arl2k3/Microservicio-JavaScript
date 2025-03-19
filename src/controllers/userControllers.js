const userServices = require('../services/userServices');
const { registerUserSchema, userSchema } = require('../util/validationSchema');

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


const allUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        return res.status(200).json({ status: 200, message: "Usuarios encontrados", response: users.map(user => ({
            email: user.email,
            user: user.user
          })),
         });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error al obtener los usuarios", response: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        if (!registerUserSchema.safeParse(userData)) {
            return res.status(400).json({ status: 400, message: "Datos invalidos", response: registerUserSchema.errors });
        }
        const newUser = await userServices.postUser(userData);
        return res.status(201).json({ status: 201, message: "Usuario creado", response: newUser.email });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error al crear el usuario", response: error.message });
    }
}

const updatedUser = async (req, res) => {
    try {
        const { user } = req.params;
        const userData = req.body;

        const validatedData = userSchema.partial().safeParse(userData);

        if (!validatedData.success) {
            return res.status(400).json({ status: 400, message: "Datos invalidos", response: userSchema.errors }); //ojo
        }

        const updatedUser = await userServices.putUser(user, validatedData.data);
        return res.status(200).json({ status: 200, message: "Usuario actualizado", response: updatedUser.email || updatedUser.user }); //ojo

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error al actualizar el usuario", response: error.message });
    }
}

module.exports = { getUserByUsername, allUsers, registerUser, updatedUser};

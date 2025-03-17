const userServices = require('../services/userServices');

const getUser = async (req, res) => {
    try {
        const { user } = req.params;
        const foundUser = await userServices.getUser(user);
        res.json(foundUser);
        if (!foundUser) {
            res.status(404).json({ status: 404, message: "Usuario no encontrado",response:[] });
        }
        return res.status(200).json({ status: 200, message: "Usuario encontrado", response: foundUser });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
  
}

module.exports = { getUser };

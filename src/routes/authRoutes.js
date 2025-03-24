const express = require('express');
const { loginUser, requestPasswordReset, resetPassword, verifyAcc } = require('../controllers/authController');

const router = express.Router();

router.post('/verifyEmail', verifyAcc);


// Tarea

router.post('/login', loginUser);

router.post("/request-password-reset", requestPasswordReset);

router.patch("/reset-password/:email", resetPassword);



module.exports = router;
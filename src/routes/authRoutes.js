const express = require('express');
const { loginUser, requestPasswordReset, resetPassword, verifyAcc } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints para autenticacion y gestion de cuentas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user
 *         - email
 *         - password
 *       properties:
 *         user:
 *           type: string
 *           minLength: 5
 *           maxLength: 15
 *           description: Nombre de usuario unico
 *         email:
 *           type: string
 *           format: email
 *           description: Email unico del usuario
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 20
 *           description: Contrasena del usuario
 *         recovery_email:
 *           type: string
 *           format: email
 *           description: Email de recuperacion opcional
 *         verified:
 *           type: boolean
 *           default: false
 *           description: Indica si la cuenta esta verificada
 *         isAdmin:
 *           type: boolean
 *           default: false
 *           description: Indica si el usuario es administrador
 *       example:
 *         user: "usuario123"
 *         email: "correo@ejemplo.com"
 *         password: "password12345"
 *         recovery_email: "correo@ejemplo.com"
 *
 *     VerifyAccount:
 *       type: object
 *       required:
 *         - email
 *         - verificationCode
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario a verificar
 *         verificationCode:
 *           type: string
 *           description: Codigo de verificacion de 6 digitos
 *       example:
 *         email: "correo@ejemplo.com"
 *         verificationCode: "123456"
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contrasena del usuario
 *       example:
 *         email: "correo@ejemplo.com"
 *         password: "contraseña123"
 *
 *     PasswordReset:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario que solicita restablecer contrasena
 *       example:
 *         email: "correo@ejemplo.com"
 *
 *     NewPassword:
 *       type: object
 *       required:
 *         - verificationCode
 *         - password
 *       properties:
 *         verificationCode:
 *           type: string
 *           description: Codigo de verificacion enviado al email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 20
 *           description: Nueva contraseña
 *       example:
 *         verificationCode: "123456"
 *         password: "password12345"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Ingresa el token JWT con el prefijo 'Bearer '
 *
 *   responses:
 *     UnauthorizedError:
 *       description: No autorizado, token inválido o expirado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 401
 *               message:
 *                 type: string
 *                 example: "No autorizado"
 *               response:
 *                 type: string
 *                 example: "Token invalido o expirado"
 */



/**
 * @swagger
 * /api/v1/auth/verifyAcc:
 *   post:
 *     tags: [Authentication]
 *     summary: Verifica una cuenta de usuario
 *     description: Verifica la cuenta de un usuario usando el codigo enviado por email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyAccount'
 *     responses:
 *       200:
 *         description: Cuenta verificada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Usuario verificado correctamente"
 *                 response:
 *                   type: string
 *                   example: "Se ha enviado un correo de confirmacion"
 *       400:
 *         description: Datos invalidos o usuario ya verificado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.post('/verifyAcc', verifyAcc);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Inicia sesion
 *     description: Inicia sesion en la cuenta de un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Sesion iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Sesion iniciada correctamente"
 *                 response:
 *                   type: string
 *                   example: "Bienvenido, de vuelta"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.post('/login', loginUser);

/**
 * @swagger
 * /api/v1/auth/request-password-reset:
 *   post:
 *     tags: [Authentication]
 *     summary: Solicita restablecer contrasena
 *     description: Solicita restablecer la contrasena de un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordReset'
 *     responses:
 *       200:
 *         description: Solicitud enviada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Solicitud enviada correctamente"
 *                 response:
 *                   type: string
 *                   example: "Se ha enviado un correo con instrucciones"
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /api/v1/auth/reset-password/{email}:
 *   patch:
 *     tags: [Authentication]
 *     summary: Restablece contrasena
 *     description: Restablece la contrasena de un usuario
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewPassword'
 *     responses:
 *       200:
 *         description: Contrasena restablecida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Contrasena restablecida correctamente"
 *                 response:
 *                   type: string
 *                   example: "Se ha restablecido la contrasena"
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */


router.patch("/reset-password/:email", resetPassword);



module.exports = router;
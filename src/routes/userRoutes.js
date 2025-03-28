const express = require('express');
const { registerUser, allUsers, getUserByEmail, getUserByUsername, updatedUser, patchedUser, deletedUser} = require('../controllers/userControllers');
const { authToken } = require('../config/jwt');
const { canManageUsers } = require('../middleware/errorHandler'); 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Endpoints para gestion de usuarios
*/

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags: [Usuarios]
 *     summary: Registro de usuario
 *     description: Crea un nuevo usuario en la base de datos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Usuario creado"
 *                 response:
 *                   type: string
 *                   example: "Se ha creado el usuario"
 *       400:
 *         description: Datos invalidos
 *       500:
 *         description: Error en el servidor
*/
router.post('/', registerUser);

/**
 * @swagger
 * /api/v1/users/all:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listado de usuarios
 *     description: Obtiene un listado de todos los usuarios registrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *        description: Listado de usuarios
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Usuarios encontrados"
 *                response:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */

router.get('/all', authToken, allUsers);

/**
 * @swagger
 * /api/v1/users/{user}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Buscar usuario por nombre de usuario
 *     description: Obtiene un usuario por su nombre de usuario
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         description: Nombre de usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.get('/:user', getUserByUsername);

/**
 * @swagger
 * /api/v1/users/email/{email}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Buscar usuario por email
 *     description: Obtiene un usuario por su email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.get('/email/:email', getUserByEmail);

/**
 * @swagger
 * /api/v1/users/{user}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar usuario
 *     description: Actualiza un usuario por su nombre de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         description: Nombre de usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.put('/:user', authToken, canManageUsers, updatedUser);

/**
 * @swagger
 * /api/v1/users/{user}:
 *   patch:
 *     tags: [Usuarios]
 *     summary: Actualizar usuario
 *     description: Actualiza un usuario por su nombre de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         description: Nombre de usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.patch('/:user', authToken, canManageUsers, patchedUser);

/**
 * @swagger
 * /api/v1/users/{user}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar usuario
 *     description: Elimina un usuario por su nombre de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         description: Nombre de usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
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
 *                   example: "Usuario eliminado"
 *                 response:
 *                   type: string
 *                   example: "Se ha eliminado el usuario"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.delete('/:user', authToken, canManageUsers, deletedUser);

module.exports = router;


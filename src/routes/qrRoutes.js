const express = require('express');
const {createQRCode, createQRCodeImage} = require('../controllers/qrController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: QR Code
 *   description: Apartado de generacion de QR Codes
 */

/**
 * @swagger
 * /api/v1/qr/generate:
 *   post:
 *     summary: Genera un QR Code
 *     tags: [QR Code]
 *     description: Genera un QR Code a partir de un texto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               text: "Texto para generar QR"
 *     responses:
 *       200:
 *         description: QR Code generado exitosamente
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
 *                   example: QR Code generado exitosamente
 *                 response:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       description: QR Code generado en formato base64
 *                       example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
 *       400:
 *         description: Error en la generacion del QR Code
 *       500:
 *         description: Error interno del servidor
 */

router.post('/generate', createQRCode);

/**
 * @swagger
 * /api/v1/qr/image:
 *   post:
 *     summary: Genera un QR Code en formato de imagen
 *     tags: [QR Code]
 *     description: Genera un QR Code a partir de un texto y lo devuelve como imagen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               text: "Texto para generar QR"
 *     responses:
 *       200:
 *         description: QR Code generado exitosamente
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en la generacion del QR Code
 *       500:
 *         description: Error interno del servidor
 */
router.post('/image', createQRCodeImage);

module.exports = router;
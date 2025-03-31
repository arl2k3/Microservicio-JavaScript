const { generateQR, generateQRBuffer } = require('../services/qrServices');

const createQRCode = async (req, res) => {
  try {
    const data = req.body;
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No se proporcionaron datos para generar el codigo QR',
        response: []
      });
    }
    
    const qrCode = await generateQR(data);
    
    return res.json({
      status: 200,
      message: 'Codigo QR generado correctamente',
      response: {
        qrCode
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      response: []
    });
  }
};

const createQRCodeImage = async (req, res) => {
  try {
    const data = req.body;
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No se proporcionaron datos para generar el codigo QR',
        response: []
      });
    }
    
    const qrBuffer = await generateQRBuffer(data);
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qrcode.png"'
    });
    
    return res.send(qrBuffer);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      response: []
    });
  }
};

module.exports = {
  createQRCode,
  createQRCodeImage
};
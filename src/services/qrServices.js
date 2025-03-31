const QRCode = require('qrcode');

const generateQR = async (data, options = {}) => {
    try {
      const content = typeof data === 'object' ? JSON.stringify(data) : data.toString();
      
      const defaultOptions = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      };
      
      const qrOptions = { ...defaultOptions, ...options };
      
      const qrImage = await QRCode.toDataURL(content, qrOptions);
      
      return qrImage;
    } catch (error) {
      throw new Error(`Error generando codigo QR: ${error.message}`);
    }
  };
  

  const generateQRBuffer = async (data, options = {}) => {
    try {
      const content = typeof data === 'object' ? JSON.stringify(data) : data.toString();
      
      const defaultOptions = {
        errorCorrectionLevel: 'H',
        type: 'png',
        quality: 0.92,
        margin: 1,
        width: 300
      };
      
      const qrOptions = { ...defaultOptions, ...options };
      
      const qrBuffer = await QRCode.toBuffer(content, qrOptions);
      
      return qrBuffer;
    } catch (error) {
      throw new Error(`Error generando codigo QR: ${error.message}`);
    }
  };
  
  module.exports = {
    generateQR,
    generateQRBuffer
  };
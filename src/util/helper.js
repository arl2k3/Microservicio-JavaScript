const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const hashVerificationCode = async (code) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(code, salt);
}

const verifyCode = async (inputCode, hashedCode) => {
    return await bcrypt.compare(inputCode, hashedCode);
}

module.exports = { 
    hashPassword, 
    comparePassword, 
    generateVerificationCode, 
    hashVerificationCode, 
    verifyCode 
};
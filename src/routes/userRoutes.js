const express = require('express');
const { getUser } = require('../controllers/userControllers');
const router = express.Router();

router.get('/:user', getUser ); 
router.get('/users', getAllUsers);
router.post('/', createUser);
router.put('/:user', updateUser);
router.patch('/:user', updateUser);
router.delete('/:user', deleteUser);

//CRUD Users

module.exports = router;
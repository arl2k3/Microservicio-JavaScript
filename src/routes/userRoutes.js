const express = require('express');
const { registerUser, allUsers, getUserByEmail, getUserByUsername, updatedUser, patchedUser, deletedUser} = require('../controllers/userControllers');
const { authToken } = require('../config/jwt');
const { canManageUsers } = require('../middleware/errorHandler'); 

const router = express.Router();

// CRUD Users
router.post('/', registerUser);

router.get('/all', authToken, allUsers);
router.get('/:user', getUserByUsername); 
router.get('/:email?', getUserByEmail); 

router.put('/:user', authToken, canManageUsers, updatedUser);
router.patch('/:user', authToken, canManageUsers, patchedUser);
router.delete('/:user', authToken, canManageUsers, deletedUser);

module.exports = router;


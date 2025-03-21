const express = require('express');
const { registerUser, allUsers, getUserByEmail, getUserByUsername, updatedUser, patchedUser, deletedUser} = require('../controllers/userControllers');

const router = express.Router();

//CRUD Users
router.post('/', registerUser);

router.get('/all', allUsers);
router.get('/:email?', getUserByEmail ); 
router.get('/:user', getUserByUsername ); 


router.put('/:user', updatedUser);

router.patch('/:user', patchedUser);

router.delete('/:user', deletedUser);


module.exports = router;
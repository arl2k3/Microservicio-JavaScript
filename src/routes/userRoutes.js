const express = require('express');
const { allUsers, getUserByUsername, registerUser, updatedUser} = require('../controllers/userControllers');

const router = express.Router();

//CRUD Users
router.post('/', registerUser);

router.get('/all', allUsers);
router.get('/:user', getUserByUsername ); 


router.put('/:user', updatedUser);

// router.patch('/:user', patchedUser);

// router.delete('/:user', deletedUser);


module.exports = router;
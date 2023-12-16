const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');


router.get('/getUsers', verifyToken, userController.getUsers);

router.post('/login', userController.login);


// Ici, vous pouvez ajouter d'autres routes liées aux utilisateurs, comme l'inscription ou la connexion

module.exports = router;
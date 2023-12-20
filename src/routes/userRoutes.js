const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/authMiddleware');


router.get('/getUsers', verifyToken, userController.getUsers);
router.get('/getMessages',verifyToken, messageController.getMessages);
router.post('/sendMessage',verifyToken, messageController.sendMessage);
router.post('/sendPrivateMessage',verifyToken, messageController.sendPrivateMessage);
router.get('/getPrivateMessages/:partnerUsername',verifyToken, messageController.getPrivateMessages);
router.post('/login', userController.login);


// Ici, vous pouvez ajouter d'autres routes liées aux utilisateurs, comme l'inscription ou la connexion

module.exports = router;
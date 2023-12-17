const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

// Assurez-vous d'ajouter une méthode pour obtenir l'ID de l'utilisateur à partir du token JWT
const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error("Erreur de décodage du token:", error);
        return null;
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const sender = getUserIdFromToken(token);

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: "Le contenu du message ne peut pas être vide" });
        }

        if (!sender) {
            return res.status(401).json({ message: "L'envoi de messages nécessite une authentification" });
        }

        const newMessage = new Message({ sender, content });
        await newMessage.save();
        res.status(201).json({ message: "Message envoyé avec succès", newMessage });
    } catch (error) {
        console.error("Erreur d'envoi du message:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getMessages = async (req, res) => {
  try {
      const limit = 50;
      const messages = await Message.find({})
          .populate('sender', 'username') // Remplacez 'username' par le champ approprié dans votre modèle User
          .sort({ createdAt: 1 })
          .limit(limit);

      res.json(messages);
  } catch (error) {
      console.error("Erreur de récupération des messages:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


const Message = require('../models/Message');
const User = require('../models/User'); // Assurez-vous que le chemin vers le modèle User est correct
const jwt = require('jsonwebtoken');

// Méthode pour obtenir l'ID de l'utilisateur à partir du token JWT
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
        const senderId = getUserIdFromToken(token);

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: "Le contenu du message ne peut pas être vide" });
        }

        if (!senderId) {
            return res.status(401).json({ message: "L'envoi de messages nécessite une authentification" });
        }

        const newMessage = new Message({ sender: senderId, content });
        await newMessage.save();
        res.status(201).json({ message: "Message envoyé avec succès", newMessage });
    } catch (error) {
        console.error("Erreur d'envoi du message:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getMessages = async (req, res) => {
  try {
      const limit = 200;
      const messages = await Message.find({})
          .populate('sender', 'username')
          .sort({ createdAt: 1 })
          .limit(limit);

      res.json(messages);
  } catch (error) {
      console.error("Erreur de récupération des messages:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getPrivateMessages = async (req, res) => {
  try {
    const { partnerUsername } = req.params;
    const currentUserId = req.user._id; // Assurez-vous que req.user est défini et contient les données de l'utilisateur actuel.

    const partnerUser = await User.findOne({ username: partnerUsername });
    if (!partnerUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: partnerUser._id },
        { sender: partnerUser._id, receiver: currentUserId }
      ]
    })
    .populate('sender', 'username')
    .populate('receiver', 'username')
    .sort({ createdAt: 1 })
    .exec();

    res.json(messages);
  } catch (error) {
    console.error("Erreur de récupération des messages privés:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.sendPrivateMessage = async (req, res) => {
  try {
      const { receiverUsername, content } = req.body;

      if (!content) {
          return res.status(400).json({ message: "Le contenu du message ne peut pas être vide." });
      }

      const senderId = req.user.userId;
      const receiverUser = await User.findOne({ username: receiverUsername });
      if (!receiverUser) {
          return res.status(404).json({ message: "Destinataire non trouvé." });
      }

      const newMessage = new Message({
          sender: senderId,
          receiver: receiverUser.userId,
          content
      });

      await newMessage.save();

      res.status(201).json({ message: "Message privé envoyé avec succès." });
  } catch (error) {
      console.error("Erreur d'envoi du message privé:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

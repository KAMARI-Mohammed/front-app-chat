// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



exports.register = async (req, res) => {
  try {
    console.log(req.body); // Ajoutez cette ligne pour le debugging
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'inscription", error });
  }
};

  //req.session.username = user.username;

  exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Identifnts incorrects" });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects" });
}

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { algorithm: 'HS384', expiresIn: '1h' });

        res.json({
            message: "Connexion réussie",
            user: {
                id: user._id,
                username: user.username,
                // Autres informations utilisateur nécessaires
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


exports.logout = (req, res) => {
  // La déconnexion est généralement gérée côté client en supprimant le token JWT
  res.status(200).json({ message: "Déconnexion réussie" });
};

exports.getUsers = async (req, res) => {
  try {
      const users = await User.find({ _id: { $ne: req.user.userId } }).select('username');
      res.json(users);
  } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};




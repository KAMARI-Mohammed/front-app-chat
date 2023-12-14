// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      // Ici, user est une instance de document Mongoose et peut utiliser comparePassword
      const isMatch = await user.comparePassword(password);
      // ...
    }
    else{
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

exports.logout = (req, res) => {
  // La déconnexion est généralement gérée côté client en supprimant le token JWT
  res.status(200).json({ message: "Déconnexion réussie" });
};

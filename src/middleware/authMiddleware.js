const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "Un token est requis pour l'authentification" });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer'
  if (!token) {
    return res.status(403).json({ message: "Token non fourni dans l'en-tête d'autorisation" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS384'] });
    req.user = decoded;
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Token invalide" });
  }

  return next();
};

module.exports = verifyToken;

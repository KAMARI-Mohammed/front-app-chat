const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Un token est requis pour l'authentification" });
  }

  const token = authHeader.split(' ')[1]; // Extraire le token après 'Bearer'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }

  return next();
};

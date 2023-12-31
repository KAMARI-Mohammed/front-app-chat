// Importer express
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuration de la base de données MongoDB
const mongoDB = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1';
mongoose.connect(mongoDB)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'front-app-chat/src/views'));
app.use(express.static(path.join(__dirname, '/public')));

// Importation et configuration des routes
const userRoutes = require('./front-app-chat/src/routes/userRoutes'); // Chemin à ajuster si nécessaire

app.use('/api/users', userRoutes);

// Routes pour les vues
app.get('/api/views/register', (req, res) => res.render('register'));
app.get('/api/views/login', (req, res) => res.render('login'));
app.get('/api/views/chat', (req, res) => res.render('chat'));
app.get('/', (req, res) => res.send('Bienvenue sur mon serveur Express!'));

// Gestion des événements de Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    // Diffusion du message à tous les clients
    if (msg && msg.username && msg.content) {
      io.emit('new message', { username: msg.username, content: msg.content });
    } else {
      console.error('Invalid message format received:', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

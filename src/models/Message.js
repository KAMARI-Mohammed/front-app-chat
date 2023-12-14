const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: mongoose.Schema.Types.ObjectId, // Référence à un 'User'
  content: String,
  // Autres champs comme la date d'envoi, etc.
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

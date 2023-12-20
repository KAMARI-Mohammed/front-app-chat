const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle 'User', si applicable
        required: true
    },
    content: {
        type: String,
        required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  // ... au
    // Autres champs comme la date d'envoi, etc.
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

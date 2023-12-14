import React from 'react';

function MessageList() {
  // Données fictives pour l'exemple
  const messages = [
    { id: 1, sender: 'Alice', content: 'Bonjour!' },
    { id: 2, sender: 'Bob', content: 'Salut comment vas-tu ?' },
    { id: 3, sender: 'Alice', content: 'Je vais bien, merci!' }
  ];

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.sender}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
}

export default MessageList;

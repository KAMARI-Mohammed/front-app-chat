// src/api.js
import axios from 'axios';

const baseURL = 'http://localhost:3000/'; // L'URL de base de votre serveur Express

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}users`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
  }
};

// Vous pouvez ajouter d'autres fonctions pour différentes routes ici

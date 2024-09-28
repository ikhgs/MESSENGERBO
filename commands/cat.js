const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const catCommand = async (senderId) => {
    // Message d'attente
    sendMessage(senderId, "Recherche d'une image de chat... 🐱");

    try {
        // Appel à l'API pour obtenir une image de chat
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        
        // Vérifier si l'API a renvoyé une image
        if (response.data && response.data.length > 0) {
            const catImageUrl = response.data[0].url; // URL de l'image de chat
            
            // Envoyer l'image au utilisateur
            sendMessage(senderId, { files: [catImageUrl] });
        } else {
            sendMessage(senderId, "Désolé, je n'ai pas trouvé d'image de chat.");
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API de chat:', error);
        sendMessage(senderId, "Désolé, une erreur s'est produite lors de la récupération de l'image de chat.");
    }
};

module.exports = catCommand;

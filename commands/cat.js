const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const catCommand = async (senderId) => {
    try {
        // Appel à l'API Cat pour obtenir une image de chat
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catImageUrl = response.data[0].url; // Récupérer l'URL de l'image

        // Envoyer l'image au destinataire
        const messageContent = {
            files: [catImageUrl] // Mettre l'URL de l'image dans un tableau
        };
        await sendMessage(senderId, messageContent);

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image du chat:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de la récupération d\'une image de chat.');
    }
};

module.exports = catCommand;

const axios = require('axios');

module.exports = {
    execute: async (event, prompt) => {
        const senderId = event.sender.id;

        // Appeler l'API NashBot avec le prompt
        try {
            const response = await axios.get(`https://nash-rest-api-production.up.railway.app/nashbot?prompt=${encodeURIComponent(prompt)}`);
            const reply = response.data;  // Supposons que la réponse soit du texte

            // Envoyer la réponse au user
            const sendMessage = require('../handles/sendMessage');
            sendMessage(senderId, reply);
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API NashBot:', error);
            sendMessage(senderId, 'Désolé, une erreur est survenue lors de l\'appel à NashBot.');
        }
    }
};

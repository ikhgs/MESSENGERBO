const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

// État pour suivre si gem29 est activé
let isGem29Active = false; // variable globale pour gérer l'état

const gem29Command = async (senderId, userText) => {
    const prompt = userText.slice(6).trim(); // Enlever 'gem29 ' pour récupérer le prompt

    // Vérifier si l'utilisateur veut arrêter gem29
    if (prompt.toLowerCase() === 'stop') {
        isGem29Active = false; // Désactiver gem29
        sendMessage(senderId, 'La réponse de gem29 est maintenant désactivée.');
        return; // Sortir de la fonction
    }

    // Si gem29 est activé, répondre avec l'API
    if (isGem29Active) {
        try {
            const response = await axios.get(`https://gem2-9b-it-njiv.vercel.app/api?ask=${encodeURIComponent(prompt)}`);
            const reply = response.data.reply; // Assurez-vous que votre API renvoie 'reply'.

            // Envoyer la réponse au user
            sendMessage(senderId, reply);
        } catch (error) {
            console.error('Error calling the gem29 API:', error);
            sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de l\'appel à l\'API gem29.');
        }
    } else {
        // Si gem29 n'est pas activé, l'activer
        isGem29Active = true; // Activer gem29
        const initialReply = 'Bonjour! Je suis gem29. Comment puis-je vous aider ?'; // Message d'initialisation
        sendMessage(senderId, initialReply); // Répondre à l'utilisateur

        // Traiter le prompt après l'activation
        try {
            const response = await axios.get(`https://gem2-9b-it-njiv.vercel.app/api?ask=${encodeURIComponent(prompt)}`);
            const reply = response.data.reply;

            // Envoyer la réponse au user
            sendMessage(senderId, reply);
        } catch (error) {
            console.error('Error calling the gem29 API:', error);
            sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de l\'appel à l\'API gem29.');
        }
    }
};

module.exports = gem29Command;

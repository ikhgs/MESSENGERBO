const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const gem29Command = async (senderId, userText) => {
    const prompt = userText || "Salut"; // Utiliser un texte par défaut si l'utilisateur n'envoie rien

    try {
        const apiUrl = `https://gem2-9b-it-njiv.vercel.app/api?ask=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.reply) {
            const reply = response.data.reply;
            sendMessage(senderId, reply); // Envoyer la réponse de l'API gem29
        } else {
            sendMessage(senderId, "Désolé, je n'ai pas compris votre question.");
        }
    } catch (error) {
        console.error('Error calling gem29 API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de l\'appel à l\'API gem29.');
    }
};

module.exports = gem29Command;

// ai.js
const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const aiCommand = async (senderId, userText) => {
    const prompt = userText.slice(3); // Enlever 'ai ' pour récupérer la question

    try {
        const response = await axios.get(`https://nash-rest-api-production.up.railway.app/nashbot?prompt=${encodeURIComponent(prompt)}`);
        const reply = response.data.response; // Assurez-vous que votre API renvoie 'response'.

        // Envoyer la réponse au user
        sendMessage(senderId, reply);
    } catch (error) {
        console.error('Error calling the AI API:', error);
        sendMessage(senderId, 'Sorry, something went wrong when processing your question.');
    }
};

module.exports = aiCommand;

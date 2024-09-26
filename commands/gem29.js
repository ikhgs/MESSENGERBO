const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const gem29Command = async (senderId, userText) => {
    const prompt = userText.slice(6).trim(); // Enlever 'gem29 ' et enlever les espaces vides

    // Vérifier si le prompt est vide
    if (!prompt) {
        sendMessage(senderId, 'Veuillez fournir une question ou un sujet pour que je puisse vous aider.'); // Message par défaut
        return; // Sortir de la fonction si le prompt est vide
    }

    try {
        const response = await axios.get(`https://gem2-9b-it-njiv.vercel.app/api?ask=${encodeURIComponent(prompt)}`);
        const reply = response.data.response; // Assurez-vous que votre API renvoie 'response'.

        // Envoyer la réponse à l'utilisateur
        sendMessage(senderId, reply);
    } catch (error) {
        console.error('Error calling the gem29 API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre question.');
    }
};

module.exports = gem29Command;

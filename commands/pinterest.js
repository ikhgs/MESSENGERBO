const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const pinterestCommand = async (senderId, userText) => {
    const prompt = userText.slice(10).trim(); // Enlever 'pinterest ' et enlever les espaces vides

    // Vérifier si le prompt est vide
    if (!prompt) {
        sendMessage(senderId, 'Veuillez fournir une question ou un sujet pour que je puisse vous aider.'); // Message par défaut
        return; // Sortir de la fonction si le prompt est vide
    }

    try {
        const response = await axios.get(`https://deku-rest-api.gleeze.com/api/pinterest?q=${encodeURIComponent(prompt)}`);
        const reply = response.data.response; // Assurez-vous que votre API renvoie 'response'.

        // Envoyer la réponse à l'utilisateur
        sendMessage(senderId, reply);
    } catch (error) {
        console.error('Error calling the Pinterest API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre question.');
    }
};

module.exports = pinterestCommand;

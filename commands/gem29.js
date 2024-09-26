// gem29.js

const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const gem29Command = async (senderId, userText) => {
    const prompt = userText.trim(); // Utiliser le texte fourni par l'utilisateur

    try {
        // URL de l'API GEM29 avec le prompt
        const apiUrl = `https://gem2-9b-it-njiv.vercel.app/api?ask=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        // Vérifier si des données ont été renvoyées avec succès
        if (response.data) {
            const reply = response.data.reply || response.data;  // Extraire la réponse si elle est présente
            sendMessage(senderId, `Réponse de GEM29: ${reply}`);
        } else {
            sendMessage(senderId, "Désolé, je n'ai pas reçu de réponse valide de l'API GEM29.");
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API GEM29:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de l\'appel à l\'API GEM29.');
    }
};

module.exports = gem29Command;

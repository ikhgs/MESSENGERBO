// bacc.js
const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const baccCommand = async (senderId, userText) => {
    const candidateNumber = userText.trim(); // Utiliser le texte fourni par l'utilisateur

    try {
        // URL de l'API BACC
        const apiUrl = `https://bacc.univ-fianarantsoa.mg/api/search/num/${candidateNumber}`;
        const response = await axios.get(apiUrl);
        
        // Vérifier si des données ont été trouvées
        if (response.data && response.data.success) {
            const data = response.data.data;
            let reply = `Voici les informations pour le candidat numéro **${candidateNumber}** :\n`;

            // Ajouter les informations pertinentes à la réponse
            reply += `Nom : ${data.name}\n`;
            reply += `Prénom : ${data.firstName}\n`;
            reply += `Mention : ${data.mention}\n`;
            reply += `Résultat : ${data.result}\n`;
            reply += `Note : ${data.note}\n`;

            sendMessage(senderId, reply);
        } else {
            sendMessage(senderId, 'Désolé, je n\'ai trouvé aucune information pour ce numéro de candidat.');
        }
    } catch (error) {
        console.error('Error calling the BACC API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de la recherche des informations du candidat.');
    }
};

module.exports = baccCommand;

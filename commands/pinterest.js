const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const pinterestCommand = async (senderId, userText) => {
    const prompt = userText.slice(10).trim(); // Enlever 'pinterest ' et enlever les espaces vides

    // Vérifier si le prompt est vide
    if (!prompt) {
        sendMessage(senderId, 'Veuillez fournir une question ou un sujet pour que je puisse vous aider.'); // Message par défaut
        return; // Sortir de la fonction si le prompt est vide
    }

    // Envoyer un message indiquant que le bot rédige une réponse
    sendMessage(senderId, '🇲🇬 *Bruno* rédige sa réponse... un instant, s\'il vous plaît 🍟');

    // Pause de 2 secondes avant de faire l'appel API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Message pour indiquer que la recherche est en cours
    sendMessage(senderId, '🔄 Recherche en cours, un instant...');

    try {
        // Appel à l'API Pinterest
        const response = await axios.get(`https://deku-rest-api.gleeze.com/api/pinterest?q=${encodeURIComponent(prompt)}`);
        const data = response.data.result || []; // Assurez-vous que votre API renvoie 'result'.
        
        if (data.length === 0) {
            sendMessage(senderId, '😕 Désolé, je n\'ai trouvé aucun résultat.');
            return;
        }

        // Traitement et envoi des images
        const imgData = [];
        for (let i = 0; i < Math.min(5, data.length); i++) { // Limiter à 5 images
            imgData.push(data[i]);
        }

        // Attendre encore 2 secondes avant d'envoyer les résultats
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Envoyer les résultats à l'utilisateur
        sendMessage(senderId, {
            attachment: imgData, // Adapter cela selon la façon dont vous souhaitez envoyer les images
            body: `Voici les résultats pour "${prompt}":`
        });
    } catch (error) {
        console.error('Error calling the Pinterest API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre question.');
    }
};

module.exports = pinterestCommand;

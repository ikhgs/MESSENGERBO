const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const pinterestCommand = async (senderId, userText) => {
    const prompt = userText.slice(10).trim(); // Enlever 'pinterest ' et enlever les espaces vides

    // Vérifier si le prompt est vide
    if (!prompt) {
        sendMessage(senderId, 'Veuillez fournir une question ou un sujet pour que je puisse vous aider.'); // Message par défaut
        return; // Sortir de la fonction si le prompt est vide
    }

    // Pause de 2 secondes avant de faire l'appel API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Message pour indiquer que la recherche est en cours
    sendMessage(senderId, '🔄 Recherche en cours, un instant...');

    try {
        // Appel à l'API Pinterest
        const response = await axios.get(`https://deku-rest-api.gleeze.com/api/pinterest?q=${encodeURIComponent(prompt)}`);
        console.log(response.data); // Vérifiez la structure des données

        // Vérifiez si la réponse contient des résultats
        if (response.data.status !== 200 || !response.data.result || response.data.result.length === 0) {
            sendMessage(senderId, '😕 Désolé, je n\'ai trouvé aucun résultat.');
            return;
        }

        // Récupérer jusqu'à 5 images
        const imgData = response.data.result.slice(0, 5); // Limiter à 5 images

        // Attendre encore 2 secondes avant d'envoyer les résultats
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Construire le message à envoyer avec les images
        const imagesToSend = imgData.map(url => {
            return { url }; // Formate chaque URL dans un objet
        });

        // Envoyer les images à l'utilisateur
        sendMessage(senderId, {
            attachment: imagesToSend, // Assurez-vous que cela correspond à la méthode d'envoi des images
            body: `Voici les résultats pour "${prompt}":`
        });
    } catch (error) {
        console.error('Error calling the Pinterest API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre question.');
    }
};

module.exports = pinterestCommand;

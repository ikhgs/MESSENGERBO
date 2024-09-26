const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Importer la fonction sendMessage

module.exports = async (senderId, prompt) => {
    try {
        // Test : Confirmer que le message a été reçu
        await sendMessage(senderId, "Message reçu, je prépare une réponse...");

        // Appeler l'API GPT avec le prompt de l'utilisateur
        const apiUrl = `https://deku-rest-api.gleeze.com/new/gpt-3_5-turbo?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        // Vérifier la structure de la réponse et récupérer le texte
        const reply = response.data.result.reply; // Récupérer la bonne clé dans la réponse

        // Test : Confirmer que l'API a bien répondu
        await sendMessage(senderId, "Réponse API reçue, envoi de la réponse...");

        // Envoyer la réponse à l'utilisateur
        await sendMessage(senderId, reply);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API GPT:', error);

        // Envoyer un message d'erreur à l'utilisateur en cas de problème
        await sendMessage(senderId, "Désolé, une erreur s'est produite lors du traitement de votre message.");
    }
};

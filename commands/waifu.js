const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Importer la fonction sendMessage

module.exports = async (senderId, userText) => {
    // Extraire le nom du personnage en retirant le préfixe 'waifu' et en supprimant les espaces superflus
    const characterName = userText.trim();

    // Vérifier si le nom du personnage est vide
    if (!characterName) {
        await sendMessage(senderId, 'Veuillez fournir le nom d\'un personnage pour que je puisse vous aider.');
        return;
    }

    try {
        // Envoyer un message de confirmation que la requête est en cours de traitement
        await sendMessage(senderId, "Message reçu, je prépare une réponse...");

        // Appeler l'API Waifu avec le nom du personnage fourni
        const apiUrl = `https://waifu-info.vercel.app/kshitiz?name=${encodeURIComponent(characterName)}`;
        const response = await axios.get(apiUrl);

        // Debug: Log de la réponse de l'API pour vérifier ce qui est retourné
        console.log('Réponse API:', response.data);

        // Récupérer les données de la réponse de l'API
        const { name, image, info } = response.data;

        // Attendre 2 secondes avant d'envoyer la réponse pour un délai naturel
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Construire le message de réponse avec l'image et l'info
        const reply = `**Nom :** ${name}\n**Info :** ${info}\n**Image :** ${image}`;

        // Envoyer la réponse à l'utilisateur
        await sendMessage(senderId, reply);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Waifu:', error.response ? error.response.data : error.message);

        // Envoyer un message d'erreur à l'utilisateur en cas de problème
        await sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre demande.');
    }
};

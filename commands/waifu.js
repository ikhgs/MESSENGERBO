const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Importer la fonction sendMessage

module.exports = async (senderId, userText) => {
    // Extraire le nom du personnage en retirant le préfixe 'waifu' et en supprimant les espaces superflus
    const characterName = userText.slice(6).trim(); // Enlever 'waifu' et enlever les espaces vides

    // Vérifier si le nom du personnage est vide
    if (!characterName) {
        sendMessage(senderId, 'Veuillez fournir le nom d\'un personnage pour que je puisse vous aider.');
        return;
    }

    try {
        // Appeler l'API Waifu avec le nom du personnage fourni
        const apiUrl = `https://waifu-info.vercel.app/kshitiz?name=${encodeURIComponent(characterName)}`;
        const response = await axios.get(apiUrl);

        // Debug : Afficher la réponse complète de l'API dans la console
        console.log('Réponse API Waifu:', response.data);

        // Récupérer les données de la réponse de l'API
        const { name, image, info } = response.data;

        // Construire le message de réponse avec l'image et l'info
        const reply = `**Nom :** ${name}\n**Info :** ${info}\n**Image :** ${image}`;

        // Envoyer la réponse à l'utilisateur
        sendMessage(senderId, reply);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Waifu:', error.response ? error.response.data : error.message);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre demande.');
    }
};

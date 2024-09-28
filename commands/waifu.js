const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

// Stocker l'état des utilisateurs (s'ils ont utilisé 'waifu' récemment)
let userHasUsedWaifu = {};

module.exports = async (senderId, userText) => {
    let characterName;

    // Si l'utilisateur utilise "waifu <nom>", on active l'état 'waifu' pour cet utilisateur
    if (userText.toLowerCase().startsWith('waifu')) {
        characterName = userText.slice(6).trim();  // Supprimer 'waifu' et les espaces vides
        userHasUsedWaifu[senderId] = true;  // Activer l'état waifu pour cet utilisateur
    } else if (userHasUsedWaifu[senderId]) {
        // Si l'utilisateur n'a pas utilisé 'waifu' mais a déjà utilisé la commande avant
        characterName = userText.trim();
    } else {
        // Si l'utilisateur n'a jamais utilisé 'waifu', on leur demande d'entrer la commande correctement
        await sendMessage(senderId, 'Veuillez d\'abord utiliser la commande "waifu <nom>" pour commencer.');
        return;
    }

    // Vérifier si le nom du personnage est vide
    if (!characterName) {
        await sendMessage(senderId, 'Veuillez fournir un nom de personnage pour que je puisse vous aider.');
        return;
    }

    try {
        // Envoyer un message de confirmation que la requête est en cours de traitement
        await sendMessage(senderId, `Recherche en cours pour : ${characterName}`);

        // Appeler l'API avec le nom du personnage
        const apiUrl = `https://waifu-info.vercel.app/kshitiz?name=${encodeURIComponent(characterName)}`;
        console.log(`Appel à l'API avec URL: ${apiUrl}`); // Log de l'URL
        
        const response = await axios.get(apiUrl);

        console.log('Réponse de l\'API:', response.data); // Log des données reçues

        // Récupérer les données de la réponse de l'API
        const { name, image, info } = response.data;

        // Vérifier que les données existent dans la réponse
        if (!name || !image || !info) {
            console.log('Données manquantes dans la réponse API:', response.data); // Log si les données sont manquantes
            await sendMessage(senderId, `Désolé, je n'ai pas trouvé d'informations sur "${characterName}".`);
            return;
        }

        // Construire le message de réponse avec l'image et l'info
        const reply = `**Nom :** ${name}\n**Info :** ${info}\n**Image :** ${image}`;

        // Envoyer la réponse à l'utilisateur
        await sendMessage(senderId, reply);
    } catch (error) {
        // Enregistrer les détails de l'erreur
        console.error('Erreur lors de l\'appel à l\'API Waifu:', error.response ? error.response.data : error.message);
        
        // Envoyer un message d'erreur à l'utilisateur
        await sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre demande.');
    }
};

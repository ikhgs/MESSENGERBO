const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const waifuCommand = async (senderId, userText) => {
    // Extraire le nom du personnage recherché
    const characterName = userText.trim();

    // Vérifier si le nom du personnage est vide
    if (!characterName) {
        sendMessage(senderId, 'Veuillez fournir le nom d\'un personnage pour que je puisse vous aider.');
        return;
    }

    try {
        // Envoyer un message de confirmation que la requête est en cours de traitement
        console.log("Processing request for:", characterName); // Log pour vérifier que la requête démarre
        sendMessage(senderId, { message: { text: "Message reçu, je prépare une réponse..." }});

        // Appeler l'API Waifu avec le nom du personnage fourni
        const apiUrl = `https://waifu-info.vercel.app/kshitiz?name=${encodeURIComponent(characterName)}`;
        const response = await axios.get(apiUrl);

        // Vérifier si la réponse de l'API est correcte
        console.log("API Response:", response.data);

        // Récupérer les données de l'API
        const { name, image, info } = response.data;

        // Construire le message de réponse (texte et image)
        const messageData = {
            recipient: {
                id: senderId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: image, // URL de l'image à envoyer
                        is_reusable: true // Réutiliser l'image sur d'autres messages
                    }
                }
            }
        };

        // Envoyer l'image
        console.log("Sending image...");
        sendMessage(senderId, messageData);

        // Envoyer ensuite le texte (info sur le personnage)
        const replyText = `**Nom :** ${name}\n**Info :** ${info}`;
        console.log("Sending text...");
        sendMessage(senderId, { message: { text: replyText } });

    } catch (error) {
        // En cas d'erreur, afficher l'erreur et envoyer un message d'erreur à l'utilisateur
        console.error('Erreur lors de l\'appel à l\'API Waifu:', error.message);
        sendMessage(senderId, { message: { text: 'Désolé, une erreur s\'est produite lors du traitement de votre demande.' } });
    }
};

module.exports = waifuCommand;

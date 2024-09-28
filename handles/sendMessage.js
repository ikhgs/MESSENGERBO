const axios = require('axios');

const sendMessage = (recipientId, messageContent) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    let messageData;

    // Vérification du contenu du message
    if (typeof messageContent === 'string') {
        messageData = {
            recipient: { id: recipientId },
            message: { text: messageContent }
        };
    } else if (messageContent.files && messageContent.files.length > 0) {
        messageData = {
            recipient: { id: recipientId },
            message: {
                attachment: {
                    type: 'image',
                    payload: {
                        url: messageContent.files[0],  // Assurez-vous que c'est une URL valide
                        is_reusable: true
                    }
                }
            }
        };
    } else {
        console.error('Contenu du message non valide:', messageContent);
        return;
    }

    // Envoi de la requête à l'API Messenger
    axios.post(`https://graph.facebook.com/v16.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, messageData)
        .then(response => {
            console.log('Message envoyé avec succès:', response.data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi du message:', error.response ? error.response.data : error.message);
        });
};

module.exports = sendMessage;

const sendMessage = require('./sendMessage');

const handlePostback = (event) => {
    const senderId = event.sender.id;
    const payload = event.postback.payload;

    // Traitement de différents types de postbacks
    if (payload === 'GET_STARTED') {
        sendMessage(senderId, "Bienvenue ! Veuillez m'envoyer une image pour commencer.");
    } else {
        sendMessage(senderId, "Je n'ai pas compris cette action.");
    }
};

module.exports = handlePostback;

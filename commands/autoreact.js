// autoreact.js
const sendMessage = require('../handles/sendMessage');

const autoreactCommand = async (senderId, event) => {
    // Liste des émojis à utiliser comme réactions
    const reactions = [
      "😘", "😂", "🤣", "🍟", "😎", "❤️", "💕", "🍓", "🍒", "💥", "👈", "🐔", "🐓", "🎉", 
      "👉", "⚾", "😍", "💗", "😗", "👍", "🥰", "🤩", "🥳", "😊", "😜", "🤪", "😛", "🥴", 
      "😹", "😻", "❤️", "♥️", "❣️", "💓", "💝", "💅", "🤼", "👷", "👸", "👩‍🚒", "👩‍🏫", 
      "👩‍🔧", "👩‍⚖️", "👩‍💼", "👩‍🏭", "👭", "💏", "👯", "👨‍❤️‍👨", "👩‍❤️‍👩", "🌺", 
      "💐", "💮", "🌾", "🍃", "🍂", "🌲", "🌵", "❄️"
    ];

    // Choisir un émoji aléatoire dans la liste des réactions
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

    // Affiche le message reçu pour le débogage
    console.log("Message reçu:", event.body);
    console.log("Réaction choisie:", randomReaction);

    try {
        // Ajoute la réaction aléatoire au message
        await sendMessage(senderId, `Auto-réaction : ${randomReaction}`);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la réaction:", error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de l\'ajout de la réaction.');
    }
};

module.exports = autoreactCommand;

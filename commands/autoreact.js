// autoreact.js

const autoreactCommand = async (senderId, event, api) => {
    // Liste des émojis à utiliser comme réactions
    const reactions = [
      "😘", "😂", "🤣", "🍟", "😎", "❤️", "💕", "🍓", "🍒", "💥", "👈", "🐔", "🐓", "🎉", 
      "👉", "⚾", "😍", "💗", "😗", "👍", "🥰", "🤩", "🥳", "😊", "😜", "🤪", "😛", "🥴", 
      "😹", "😻", "❤️", "♥️", "❣️", "💓", "💝", "💅", "🤼", "👷", "👸", "👩‍🚒", "👩‍🏫", 
      "👩‍🔧", "👩‍⚖️", "👩‍🏭", "👭", "💏", "👯", "👨‍❤️‍👨", "👩‍❤️‍👩", "🌺", "💐", 
      "💮", "🌾", "🍃", "🍂", "🌲", "🌵", "❄️"
    ];

    // Choisir un émoji aléatoire dans la liste des réactions
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

    // Ajoute la réaction aléatoire au message via l'API
    try {
        // Utiliser l'API pour ajouter une réaction au message
        await api.setMessageReaction(randomReaction, event.messageID, senderId);

        console.log(`Réaction ajoutée: ${randomReaction}`);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la réaction:", error);
    }
};

module.exports = autoreactCommand;

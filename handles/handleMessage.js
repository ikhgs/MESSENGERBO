const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');
const userStates = {}; // Stocker l'état des utilisateurs
const commandsPath = path.join(__dirname, '../commands'); // Chemin vers le dossier des commandes

// Charger dynamiquement les commandes
const commands = {};
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const commandName = file.replace('.js', '').toUpperCase(); // Le nom de la commande
        commands[commandName] = require(path.join(commandsPath, file));
    }
});

module.exports = function handleMessage(event) {
    const senderId = event.sender.id;
    const message = event.message.text.toLowerCase(); // Normaliser le texte du message

    // Si l'utilisateur envoie "stop", réinitialiser l'état
    if (message === 'stop') {
        userStates[senderId] = null;
        sendPostbackOptions(senderId); // Afficher à nouveau les options "Menu" et "Gemini"
    } else if (message === 'fin') {
        // Réinitialiser les états et afficher les options Menu et Gemini
        userStates[senderId] = null;
        sendPostbackOptions(senderId);
    } else if (!userStates[senderId]) {
        // Si aucune commande active, afficher les boutons "Menu" et "Gemini"
        sendPostbackOptions(senderId);
    } else {
        // Dynamique gestion des commandes
        const currentState = userStates[senderId];
        if (commands[currentState]) {
            // Exécuter la commande si elle est définie
            commands[currentState].handleMessage(senderId, message);
        } else {
            // Pour tout autre message, afficher les options Menu et Gemini
            sendPostbackOptions(senderId);
        }
    }
};

// Fonction pour afficher les options "Menu" et "Gemini"
function sendPostbackOptions(senderId) {
    const message = {
        recipient: { id: senderId },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Que souhaitez-vous faire?",
                    buttons: [
                        {
                            type: "postback",
                            title: "Menu",
                            payload: "MENU"
                        },
                        {
                            type: "postback",
                            title: "Gemini",
                            payload: "GEMINI"
                        }
                    ]
                }
            }
        }
    };
    sendMessage(message);
}

const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');
const commandsPath = path.join(__dirname, '../commands'); // Chemin vers le dossier des commandes
const userStates = {}; // Stocker l'état des utilisateurs

// Charger dynamiquement les commandes
const commands = {};
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const commandName = file.replace('.js', '').toUpperCase(); // Nom de la commande
        commands[commandName] = require(path.join(commandsPath, file));
    }
});

module.exports = function handlePostback(event) {
    const senderId = event.sender.id;
    const payload = event.postback.payload;

    if (payload === 'GET_STARTED') {
        // Afficher les boutons "Menu" et "Gemini" après le premier contact
        sendPostbackOptions(senderId);
    } else if (payload === 'GEMINI') {
        // Activer le mode Gemini
        userStates[senderId] = 'GEMINI';
        sendMessage({
            recipient: { id: senderId },
            message: { text: "Vous utilisez maintenant Gemini. Envoyez 'stop' pour arrêter." }
        });
    } else if (payload === 'MENU') {
        // Afficher les commandes disponibles sous forme de boutons
        sendCommandsMenu(senderId);
    } else {
        // Gérer dynamiquement les commandes
        const commandName = payload.toUpperCase();
        if (commands[commandName]) {
            userStates[senderId] = commandName;
            sendMessage({
                recipient: { id: senderId },
                message: { text: `Vous êtes maintenant dans le mode ${commandName}. Envoyez 'stop' pour revenir au menu.` }
            });
        }
    }
};

// Fonction pour envoyer le menu des commandes disponibles
function sendCommandsMenu(userId) {
    const buttons = [];

    // Générer dynamiquement des boutons pour chaque commande disponible
    fs.readdirSync(commandsPath).forEach(file => {
        if (file.endsWith('.js')) {
            const commandName = file.replace('.js', '');
            buttons.push({
                type: "postback",
                title: commandName.charAt(0).toUpperCase() + commandName.slice(1),
                payload: commandName.toUpperCase()
            });
        }
    });

    const message = {
        recipient: { id: userId },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Voici le menu des commandes:",
                    buttons
                }
            }
        }
    };
    sendMessage(message);
}

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
            

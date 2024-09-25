const sendMessage = require('./sendMessage');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Stockage de l'état de chaque utilisateur
let activeCommands = {};

// Charger dynamiquement toutes les commandes du répertoire "commands/"
const commands = {};
const commandsPath = path.join(__dirname, '../commands');
fs.readdirSync(commandsPath).forEach(file => {
    const commandName = file.replace('.js', ''); // Nom de la commande sans l'extension
    const command = require(`../commands/${file}`);
    commands[commandName] = command; // Ajouter la commande au dictionnaire des commandes
});

const handleMessage = async (event) => {
    const senderId = event.sender.id;
    const message = event.message.text.toLowerCase(); // Convertir le message en minuscule pour une correspondance insensible à la casse

    // Vérifier si l'utilisateur a envoyé "stop" pour arrêter la commande active
    if (message === 'stop') {
        activeCommands[senderId] = null;  // Désactiver la commande active
        sendMessage(senderId, "Vous êtes revenu au bot par défaut.");
        return;
    }

    // Vérifier si l'utilisateur a envoyé une commande disponible (ex: "ai bonjour")
    const messageParts = message.split(' ');
    const commandName = messageParts[0]; // Le premier mot est le nom de la commande
    const commandPrompt = messageParts.slice(1).join(' '); // Le reste est le prompt

    if (commands[commandName]) {
        // Si la commande existe, l'activer pour l'utilisateur
        activeCommands[senderId] = commandName;
        await commands[commandName].execute(event, commandPrompt); // Exécuter la commande
        return;
    }

    // Si une commande est déjà active, continuer à utiliser cette commande
    if (activeCommands[senderId]) {
        const activeCommand = activeCommands[senderId];
        await commands[activeCommand].execute(event, message);  // Utiliser la commande active
    } 
    // Sinon, utiliser le bot Gemini par défaut
    else {
        const typingMessage = "🇲🇬 *Bruno* rédige sa réponse... un instant, s'il vous plaît 🍟";
        await sendMessage(senderId, typingMessage); // Envoyer le message d'attente

        // Ajouter un délai de 2 secondes
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Appeler Gemini si c'est un message texte
        if (message) {
            const prompt = message;
            const customId = senderId;

            try {
                const response = await axios.post('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
                    prompt,
                    customId
                });
                const reply = response.data.message;

                // Envoyer la réponse au user
                sendMessage(senderId, reply);
            } catch (error) {
                console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
                sendMessage(senderId, 'Désolé, une erreur est survenue lors du traitement de votre message.');
            }
        }
    }
};

module.exports = handleMessage;

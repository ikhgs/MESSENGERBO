// handles/handleMessage.js
const fs = require('fs');
const path = require('path'); // Assurez-vous d'importer path pour les chemins
const sendMessage = require('./sendMessage');
const axios = require('axios');

// Importation dynamique des commandes
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
const commands = {};
for (const file of commandFiles) {
    const commandName = file.replace('.js', '');
    commands[commandName] = require(`../commands/${file}`);
}

const handleMessage = async (event) => {
    const senderId = event.sender.id;
    const message = event.message;

    // Message d'attente
    const typingMessage = "🇲🇬 *Bruno* rédige sa réponse... un instant, s'il vous plaît 🍟";
    await sendMessage(senderId, typingMessage); // Envoyer le message d'attente

    // Ajouter un délai de 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Vérifier si l'utilisateur a envoyé une image
    if (message.attachments && message.attachments[0].type === 'image') {
        const imageUrl = message.attachments[0].payload.url;

        // Appeler l'API Flask avec l'image
        const prompt = "Veuillez analyser l'image et continuer la conversation.";
        const customId = senderId;

        try {
            const response = await axios.post('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
                prompt,
                customId,
                link: imageUrl
            });
            const reply = response.data.message;

            // Envoyer la réponse au user
            sendMessage(senderId, reply);
        } catch (error) {
            console.error('Error calling the API:', error);
            sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de l\'image.');
        }
    } 
    // Si c'est un message texte, continuer la conversation
    else if (message.text) {
        const userText = message.text.trim().toLowerCase();

        // Vérifier si l'utilisateur a demandé le menu
        if (userText === 'menu') {
            commands.menu(senderId); // Appeler la commande menu
            return; // Sortir pour ne pas exécuter d'autres commandes
        }

        // Vérifier les autres commandes dynamiquement
        for (const commandName in commands) {
            if (userText.startsWith(commandName)) {
                const commandPrompt = userText.replace(commandName, '').trim();
                await commands[commandName](senderId, commandPrompt); // Appeler la commande correspondante
                return; // Sortir après l'exécution de la commande
            }
        }

        // Si aucune commande ne correspond, traiter comme un texte normal
        // Exemple de gestion des réponses standards
        const prompt = userText; // Vous pouvez ajuster cela si nécessaire
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
            console.error('Error calling the API:', error);
            sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de votre message.');
        }
    }
};

module.exports = handleMessage;

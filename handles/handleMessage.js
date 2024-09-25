const sendMessage = require('./sendMessage');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
            sendMessage(senderId, 'Sorry, something went wrong when processing the image.');
        }
    } 
    // Si c'est un message texte, gérer les commandes
    else if (message.text) {
        const userText = message.text.trim().toLowerCase();

        // Extraire le nom de la commande et le prompt
        const [commandName, ...args] = userText.split(' '); // 'ai bonjour' devient ['ai', 'bonjour']
        const prompt = args.join(' '); // Reconstituer le prompt

        // Vérifier si la commande existe
        if (commands[commandName]) {
            // Appeler la commande dynamique
            try {
                await commands[commandName](senderId, prompt);
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
                sendMessage(senderId, 'Sorry, something went wrong when executing your command.');
            }
        } else {
            // Si aucune commande, traiter avec Gemini par défaut
            try {
                const response = await axios.post('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
                    prompt: userText,
                    customId: senderId
                });
                const reply = response.data.message;

                // Envoyer la réponse au user
                sendMessage(senderId, reply);
            } catch (error) {
                console.error('Error calling the API:', error);
                sendMessage(senderId, 'Sorry, something went wrong when processing your message.');
            }
        }
    }
};

module.exports = handleMessage;

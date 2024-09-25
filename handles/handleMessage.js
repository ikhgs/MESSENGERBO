const sendMessage = require('./sendMessage'); // Pour envoyer des messages
const axios = require('axios');

module.exports = async function handleMessage(sender_psid, received_message) {
    try {
        // Vérifier si le message contient du texte
        if (received_message.text) {
            // Envoyer le message d'attente
            const typingMessage = "🇲🇬 *Bruno* rédige sa réponse... un instant, s'il vous plaît 🍟";
            await sendMessage(sender_psid, typingMessage);

            // Appel à ton API Flask Gemini pour obtenir la réponse
            const prompt = received_message.text;

            // Délai de 2 secondes avant d'appeler l'API
            setTimeout(async () => {
                const response = await axios.post('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
                    prompt: prompt,
                    customId: sender_psid // Utiliser l'identifiant du sender pour la session
                });

                // Envoyer la réponse finale de l'API Gemini
                const geminiResponse = response.data.message;
                await sendMessage(sender_psid, geminiResponse);
            }, 2000); // Délai de 2000 ms (2 secondes)

        } else if (received_message.attachments) {
            // Si une image est reçue
            const attachment_url = received_message.attachments[0].payload.url;

            // Envoyer le message d'attente
            const typingMessage = "🇲🇬 *Bruno* rédige sa réponse... un instant, s'il vous plaît 🍟";
            await sendMessage(sender_psid, typingMessage);

            // Délai de 2 secondes avant d'appeler l'API
            setTimeout(async () => {
                // Envoyer l'image et obtenir la réponse via l'API Flask
                const response = await axios.post('https://gemini-ap-espa-bruno.onrender.com/api/gemini', {
                    prompt: "Voici une image pour analyse",
                    customId: sender_psid,
                    link: attachment_url // Envoyer l'URL de l'image à l'API
                });

                // Envoyer la réponse finale de l'API Gemini
                const geminiResponse = response.data.message;
                await sendMessage(sender_psid, geminiResponse);
            }, 2000); // Délai de 2000 ms (2 secondes)
        }
    } catch (error) {
        console.error('Erreur lors du traitement du message : ', error);
        await sendMessage(sender_psid, "Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
};

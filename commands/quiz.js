const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Assurez-vous que cette fonction envoie le message via le bot

module.exports = async (senderId, prompt) => {
    // Vérifier si l'utilisateur demande un quiz
    if (prompt.trim().toLowerCase() === 'quiz') {
        try {
            // Appel à l'API Open Trivia Database pour obtenir une question
            const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
            const response = await axios.get(apiUrl);

            // Vérifier si l'API a renvoyé une question avec succès
            if (response.data.response_code === 0) {
                // Convertir la réponse JSON en chaîne de caractères (stringify)
                const jsonResponse = JSON.stringify(response.data, null, 2); // null et 2 pour formater avec des indentations

                // Envoyer la réponse JSON brute au bot
                await sendMessage(senderId, `Voici la réponse JSON brute :\n\`\`\`\n${jsonResponse}\n\`\`\``);
            } else {
                await sendMessage(senderId, "Désolé, une erreur s'est produite lors de la récupération du quiz.");
            }
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API Open Trivia Database:', error);
            await sendMessage(senderId, "Désolé, une erreur s'est produite lors de la récupération du quiz.");
        }
    } else {
        // Réponse par défaut si l'utilisateur ne demande pas de quiz
        await sendMessage(senderId, "Veuillez envoyer 'quiz' pour obtenir une question de quiz.");
    }
};

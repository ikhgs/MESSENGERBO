const axios = require('axios');

module.exports = {
    name: 'gpt',
    description: 'Commande pour interagir avec GPT',
    execute: async function(senderId, prompt) {
        const apiUrl = `https://deku-rest-api.gleeze.com/new/gpt-3_5-turbo?prompt=${encodeURIComponent(prompt)}`;
        
        try {
            const response = await axios.get(apiUrl);
            const reply = response.data.reply; // Assurez-vous que la structure de la réponse correspond
            await sendMessage(senderId, reply);
        } catch (error) {
            console.error('Erreur lors de l\'appel de l\'API GPT :', error);
            await sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de l\'appel à l\'API GPT.');
        }
    }
};

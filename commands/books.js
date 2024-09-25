// books.js
const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

const booksCommand = async (senderId, userText) => {
    const prompt = userText.trim(); // Utiliser le texte fourni par l'utilisateur

    try {
        // URL de l'API Google Books
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        
        // Vérifier si des livres ont été trouvés
        if (response.data.totalItems > 0) {
            const books = response.data.items.slice(0, 5); // Limiter les résultats à 5 livres
            let reply = 'Voici quelques livres que j\'ai trouvés :\n';

            // Construire le message de réponse
            books.forEach((book, index) => {
                const title = book.volumeInfo.title || 'Titre non disponible';
                const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Aucun auteur';
                const link = book.volumeInfo.infoLink || 'Pas de lien disponible';

                reply += `${index + 1}. **${title}** par ${authors}\nLien : ${link}\n\n`;
            });

            sendMessage(senderId, reply);
        } else {
            sendMessage(senderId, 'Désolé, je n\'ai trouvé aucun livre pour votre recherche.');
        }
    } catch (error) {
        console.error('Error calling the Google Books API:', error);
        sendMessage(senderId, 'Désolé, une erreur s\'est produite lors de la recherche de livres.');
    }
};

module.exports = booksCommand;

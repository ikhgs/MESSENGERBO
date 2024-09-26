const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

let selectedCategory = null; // Variable pour stocker la catégorie choisie
let currentQuestion = null; // Variable pour stocker la question actuelle
let currentAnswer = null; // Variable pour stocker la réponse correcte

// Fonction pour récupérer les catégories de quiz
const fetchCategories = async () => {
    try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        return response.data.trivia_categories; // Retourne les catégories
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return [];
    }
};

// Fonction pour récupérer une question d'une catégorie donnée
const fetchQuestion = async (categoryId) => {
    try {
        const response = await axios.get(`https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`);
        return response.data.results[0]; // Retourne la première question
    } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
        return null;
    }
};

const quizCommand = async (senderId, userText) => {
    // Si l'utilisateur envoie "quiz", afficher les catégories
    if (userText.trim().toLowerCase() === 'quiz') {
        const categories = await fetchCategories();
        let reply = 'Voici les catégories de quiz disponibles :\n';
        categories.forEach((category) => {
            reply += `${category.id}: ${category.name}\n`;
        });
        sendMessage(senderId, reply);
        return;
    }

    // Si l'utilisateur envoie un numéro de catégorie
    const categoryId = parseInt(userText.trim());
    if (!isNaN(categoryId)) {
        const categories = await fetchCategories();
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
            selectedCategory = categoryId; // Stocker la catégorie sélectionnée
            currentQuestion = await fetchQuestion(selectedCategory);
            if (currentQuestion) {
                // Stocker la réponse correcte
                currentAnswer = currentQuestion.correct_answer;
                let options = [...currentQuestion.incorrect_answers, currentAnswer];
                options = options.sort(() => Math.random() - 0.5); // Mélanger les options
                reply = `Catégorie: ${category.name}\nQuestion: ${currentQuestion.question}\n`;
                options.forEach((option, index) => {
                    reply += `${index + 1}: ${option}\n`;
                });
                sendMessage(senderId, reply);
            } else {
                sendMessage(senderId, 'Désolé, je n\'ai pas pu récupérer une question pour cette catégorie.');
            }
        } else {
            sendMessage(senderId, 'Catégorie invalide. Veuillez choisir un numéro de catégorie valide.');
        }
        return;
    }

    // Vérifier si l'utilisateur a envoyé une réponse
    const answer = parseInt(userText.trim());
    if (!isNaN(answer) && currentQuestion) {
        const userResponse = currentQuestion.incorrect_answers.concat(currentAnswer);
        if (userResponse[answer - 1] === currentAnswer) {
            sendMessage(senderId, 'Réponse correcte ! 🎉');
        } else {
            sendMessage(senderId, `Réponse incorrecte. La bonne réponse est : ${currentAnswer}`);
        }
        // Réinitialiser pour une nouvelle question
        selectedCategory = null;
        currentQuestion = null;
        currentAnswer = null;
        return;
    }

    sendMessage(senderId, 'Veuillez entrer un numéro de catégorie ou une réponse valide.');
};

module.exports = quizCommand;

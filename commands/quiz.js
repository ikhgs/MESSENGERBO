const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

let currentQuestion = null; // Variable pour stocker la question actuelle
let currentAnswer = null; // Variable pour stocker la réponse correcte

// Fonction pour récupérer une question aléatoire
const fetchQuestion = async () => {
    try {
        const response = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple`);
        
        // Vérification de la réponse
        if (response.data && response.data.results.length > 0) {
            return response.data.results[0]; // Retourne la première question
        } else {
            console.error('Aucune question trouvée dans la réponse de l\'API.');
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
        return null;
    }
};

const quizCommand = async (senderId, userText) => {
    // Si l'utilisateur envoie "quiz", récupérer et envoyer une question
    if (userText.trim().toLowerCase() === 'quiz') {
        currentQuestion = await fetchQuestion();
        if (currentQuestion) {
            // Stocker la réponse correcte
            currentAnswer = currentQuestion.correct_answer;
            let options = [...currentQuestion.incorrect_answers, currentAnswer];
            options = options.sort(() => Math.random() - 0.5); // Mélanger les options
            let reply = `Question: ${currentQuestion.question}\n`;
            options.forEach((option, index) => {
                reply += `${index + 1}: ${option}\n`;
            });
            sendMessage(senderId, reply);
        } else {
            sendMessage(senderId, 'Désolé, je n\'ai pas pu récupérer une question.');
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
        currentQuestion = null;
        currentAnswer = null;
        return;
    }

    sendMessage(senderId, 'Veuillez entrer une réponse valide.');
};

module.exports = quizCommand;

const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

// Stocker la question et la réponse correcte pour chaque utilisateur
const userQuizData = {};

module.exports = async (senderId, prompt) => {
    // Si l'utilisateur envoie "quiz", obtenir une nouvelle question
    if (prompt.trim().toLowerCase() === 'quiz') {
        try {
            // Appel à l'API Open Trivia Database pour obtenir une question de quiz
            const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
            const response = await axios.get(apiUrl);
            const questionData = response.data.results[0];

            // Extraire les informations de la question
            const question = questionData.question;
            const correctAnswer = questionData.correct_answer;
            const incorrectAnswers = questionData.incorrect_answers;

            // Mélanger les réponses (correcte + incorrectes)
            const answers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

            // Stocker la question et la réponse correcte pour l'utilisateur
            userQuizData[senderId] = {
                correctAnswer: correctAnswer,
                answers: answers
            };

            // Construire le message de la question avec les options
            let message = `🧠 *Question Quiz :*\n${question}\n\n`;
            answers.forEach((answer, index) => {
                message += `${index + 1}. ${answer}\n`; // Afficher les réponses avec les numéros
            });

            // Envoyer la question à l'utilisateur
            await sendMessage(senderId, message);
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API Open Trivia Database:', error);
            await sendMessage(senderId, "Désolé, une erreur s'est produite lors de la récupération du quiz.");
        }
        return;
    }

    // Vérifier si l'utilisateur a répondu par un numéro (1, 2, 3 ou 4)
    const userResponse = parseInt(prompt.trim());
    if (!isNaN(userResponse) && userQuizData[senderId]) {
        const userData = userQuizData[senderId];
        const selectedAnswer = userData.answers[userResponse - 1]; // Obtenir la réponse choisie

        if (selectedAnswer === userData.correctAnswer) {
            // Réponse correcte
            await sendMessage(senderId, "✅ Réponse correcte ! Bien joué 🎉");
        } else {
            // Réponse incorrecte, envoyer la correction
            await sendMessage(senderId, `❌ Réponse incorrecte. La bonne réponse était : *${userData.correctAnswer}*`);
        }

        // Supprimer les données de quiz pour l'utilisateur après la réponse
        delete userQuizData[senderId];
    } else if (!userQuizData[senderId]) {
        // Si l'utilisateur n'a pas encore demandé de quiz, ou les données de quiz ne sont pas disponibles
        await sendMessage(senderId, "Veuillez d'abord demander un quiz en envoyant 'quiz'.");
    } else {
        // Si l'utilisateur n'a pas envoyé une réponse valide
        await sendMessage(senderId, "Veuillez répondre avec un numéro entre 1 et 4.");
    }
};

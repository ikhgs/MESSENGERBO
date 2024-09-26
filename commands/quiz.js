const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

// Stocker la question et la réponse correcte pour chaque utilisateur
const userQuizData = {};

module.exports = async (senderId, prompt) => {
    const userResponse = prompt.trim().toLowerCase();

    // Si l'utilisateur envoie "quiz", obtenir une nouvelle question
    if (userResponse === 'quiz') {
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

    // Si l'utilisateur a déjà un quiz en cours
    if (userQuizData[senderId]) {
        const userData = userQuizData[senderId];

        // Vérifier si l'utilisateur a répondu par un numéro valide (1, 2, 3 ou 4)
        const userChoice = parseInt(userResponse);
        if (isNaN(userChoice) || userChoice < 1 || userChoice > 4) {
            await sendMessage(senderId, "Veuillez répondre avec un numéro entre 1 et 4.");
            return;
        }

        // Obtenir la réponse choisie
        const selectedAnswer = userData.answers[userChoice - 1]; // Obtenir la réponse choisie (1 = 0, 2 = 1, etc.)

        // Vérifier si la réponse est correcte
        if (selectedAnswer === userData.correctAnswer) {
            // Réponse correcte
            await sendMessage(senderId, "✅ Réponse correcte ! Bien joué 🎉");
        } else {
            // Réponse incorrecte, envoyer la correction
            await sendMessage(senderId, `❌ Réponse incorrecte. La bonne réponse était : *${userData.correctAnswer}*`);
        }

        // Supprimer les données de quiz pour cet utilisateur après la réponse
        delete userQuizData[senderId];
    } else {
        // Si aucune question de quiz n'est stockée pour cet utilisateur
        await sendMessage(senderId, "Veuillez d'abord demander un quiz en envoyant 'quiz'.");
    }
};

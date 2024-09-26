const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Importer la fonction sendMessage

// Stocker l'état du quiz pour chaque utilisateur
const quizState = {};

module.exports = async (senderId, prompt) => {
    try {
        // Si l'utilisateur demande un quiz
        if (prompt.trim().toLowerCase() === 'quiz') {
            // Envoyer un message de confirmation que le message a été reçu
            await sendMessage(senderId, "Message reçu, je prépare une réponse...");
            
            // Appeler l'API pour obtenir une question de quiz
            const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
            const response = await axios.get(apiUrl);

            // Récupérer les données de la question
            const questionData = response.data.results[0];
            const question = questionData.question;
            const correctAnswer = questionData.correct_answer;
            const incorrectAnswers = questionData.incorrect_answers;

            // Créer une liste des réponses possibles
            const options = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

            // Stocker l'état du quiz pour cet utilisateur
            quizState[senderId] = {
                question: question,
                correctAnswer: correctAnswer,
                options: options
            };

            // Envoyer la question et les options à l'utilisateur
            const optionsText = options.map((opt, index) => `${index + 1}. ${opt}`).join('\n');
            await sendMessage(senderId, `Voici votre question de quiz :\n${question}\nChoisissez une réponse :\n${optionsText}`);
        } else {
            // Vérifier si l'utilisateur a déjà demandé un quiz
            const currentQuiz = quizState[senderId];
            if (currentQuiz) {
                // Vérifier la réponse de l'utilisateur
                const userAnswerIndex = parseInt(prompt.trim()) - 1;
                if (userAnswerIndex >= 0 && userAnswerIndex < currentQuiz.options.length) {
                    const userAnswer = currentQuiz.options[userAnswerIndex];
                    // Envoyer un message d'attente
                    await sendMessage(senderId, "🇲🇬 *Bruno* rédige sa réponse... un instant, s'il vous plaît 🍟");

                    // Vérifier si la réponse est correcte
                    if (userAnswer === currentQuiz.correctAnswer) {
                        await sendMessage(senderId, "✅ Réponse correcte !");
                    } else {
                        await sendMessage(senderId, `❌ Réponse incorrecte. La bonne réponse est : ${currentQuiz.correctAnswer}.`);
                    }

                    // Appeler à nouveau l'API pour obtenir une nouvelle question
                    const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
                    const response = await axios.get(apiUrl);
                    const newQuestionData = response.data.results[0];
                    const newQuestion = newQuestionData.question;
                    const newCorrectAnswer = newQuestionData.correct_answer;
                    const newIncorrectAnswers = newQuestionData.incorrect_answers;
                    const newOptions = [newCorrectAnswer, ...newIncorrectAnswers].sort(() => Math.random() - 0.5);

                    // Mettre à jour l'état du quiz
                    quizState[senderId] = {
                        question: newQuestion,
                        correctAnswer: newCorrectAnswer,
                        options: newOptions
                    };

                    // Envoyer la nouvelle question à l'utilisateur
                    const newOptionsText = newOptions.map((opt, index) => `${index + 1}. ${opt}`).join('\n');
                    await sendMessage(senderId, `Voici votre nouvelle question de quiz :\n${newQuestion}\nChoisissez une réponse :\n${newOptionsText}`);
                } else {
                    await sendMessage(senderId, "Veuillez envoyer un numéro valide pour votre réponse.");
                }
            } else {
                await sendMessage(senderId, "Veuillez d'abord demander un quiz en envoyant 'quiz'.");
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API de quiz:', error);
        await sendMessage(senderId, "Désolé, une erreur s'est produite lors du traitement de votre message.");
    }
};

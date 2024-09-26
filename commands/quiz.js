const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Importer la fonction sendMessage

module.exports = async (senderId, prompt) => {
    try {
        // Envoyer un message de confirmation que le message a été reçu
        await sendMessage(senderId, "Message reçu, je prépare une réponse...");

        // Appeler l'API Open Trivia Database pour obtenir une question
        const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
        const response = await axios.get(apiUrl);

        // Vérifier si l'API a renvoyé une question avec succès
        if (response.data.response_code === 0) {
            // Récupérer la question et les réponses
            const quizData = response.data.results[0];
            const question = quizData.question;
            const correctAnswer = quizData.correct_answer;
            const incorrectAnswers = quizData.incorrect_answers;

            // Créer un tableau des réponses possibles
            const allAnswers = [correctAnswer, ...incorrectAnswers];
            const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5); // Mélanger les réponses

            // Formater la réponse à envoyer à l'utilisateur
            const formattedAnswers = shuffledAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n');

            // Attendre 2 secondes avant d'envoyer la réponse
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Envoyer la question et les réponses mélangées à l'utilisateur
            await sendMessage(senderId, `Voici votre question de quiz :\n${question}\n\nChoisissez une réponse :\n${formattedAnswers}`);
        } else {
            await sendMessage(senderId, "Désolé, une erreur s'est produite lors de la récupération du quiz.");
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Open Trivia Database:', error);
        
        // Envoyer un message d'erreur à l'utilisateur en cas de problème
        await sendMessage(senderId, "Désolé, une erreur s'est produite lors du traitement de votre message.");
    }
};

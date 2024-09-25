const express = require('express');
const bodyParser = require('body-parser');
const handleMessage = require('./handles/handleMessage');
const handlePostback = require('./handles/handlePostback');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Dynamically load all command files from commands directory
const commands = {};
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const commandName = file.replace('.js', '');
        commands[commandName] = require(`./commands/${file}`);
    }
});

// Store the current active command for each user
const userActiveCommand = {};

app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    const body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const event = entry.messaging[0];
            const senderId = event.sender.id;

            if (event.message && event.message.text) {
                const messageText = event.message.text.toLowerCase();

                // Check if the user sent 'stop'
                if (messageText === 'stop') {
                    userActiveCommand[senderId] = null;
                    handleMessage(event); // Revert to default Gemini
                    return;
                }

                // Check for a command trigger (e.g., "ai bonjour")
                const [command, ...promptParts] = messageText.split(' ');
                const prompt = promptParts.join(' ');

                if (commands[command]) {
                    // Activate the command for the user
                    userActiveCommand[senderId] = command;
                    commands[command].execute(event, prompt);
                } else if (userActiveCommand[senderId]) {
                    // Use the currently active command
                    const activeCommand = userActiveCommand[senderId];
                    commands[activeCommand].execute(event, messageText);
                } else {
                    // Default behavior using Gemini if no command is active
                    handleMessage(event);
                }
            } else if (event.postback) {
                handlePostback(event);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

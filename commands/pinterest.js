const axios = require('axios');
const fs = require('fs-extra');
const sendMessage = require('../handles/sendMessage');

const cacheFolder = './cache'; // Définir le dossier de cache

const ensureCacheFolderExists = async () => {
    try {
        await fs.ensureDir(cacheFolder);
    } catch (error) {
        console.error(`[ERROR] Failed to create cache folder: ${cacheFolder}\n`, error);
    }
};

const pinterestCommand = async (senderId, userText) => {
    const keySearch = userText.slice(9).trim(); // Enlever 'pinterest ' et enlever les espaces vides

    // Vérifier si le format est correct
    if (!keySearch.includes('-')) {
        sendMessage(senderId, '📢 | Please follow this format:\n-pinterest cat -5'); // Message par défaut
        return; // Sortir de la fonction si le format est incorrect
    }

    const [keySearchs, numberSearch] = keySearch.split('-').map((str, index) => index === 1 ? str || 6 : str.trim());

    await ensureCacheFolderExists();
    await sendMessage(senderId, '🔄 Recherche en cours, un instant...'); // Informer l'utilisateur que la recherche est en cours

    try {
        const res = await axios.get(`https://deku-rest-api.gleeze.com/api/pinterest?q=${encodeURIComponent(keySearchs)}`);
        const data = res.data.result || [];
        const imgData = [];

        for (let i = 0; i < Math.min(parseInt(numberSearch), data.length); i++) {
            const imageBuffer = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
            const path = `${cacheFolder}/${i + 1}.jpg`;
            await fs.writeFile(path, imageBuffer);
            imgData.push(fs.createReadStream(path));
        }

        sendMessage(senderId, {
            attachment: imgData,
            body: `Voici ${imgData.length} résultats pour "${keySearchs}"`
        });

    } catch (error) {
        console.error('Error calling the Pinterest API:', error);
        sendMessage(senderId, '🚨 | Une erreur s\'est produite lors de la récupération des images. Veuillez réessayer plus tard.');
    } finally {
        // Suppression des fichiers d'images du cache
        for (let index = 0; index < imgData.length; index++) {
            const filePath = `${cacheFolder}/${index + 1}.jpg`;
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error(`[ERROR] Failed to delete cache file: ${filePath}\n`, error);
            }
        }
    }
};

module.exports = pinterestCommand;

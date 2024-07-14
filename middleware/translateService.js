// const { Configuration, OpenAIApi } = require('openai');
// require('dotenv').config();

// const configuration = new Configuration({
//     apiKey: process.env.API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// async function translateText(text, targetLanguage) {
//     try {
//         const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
//         const response = await openai.createChatCompletion({
//             model: 'gpt-3.5-turbo',
//             messages: [{ role: 'user', content: prompt }],
//             max_tokens: 1000,
//             temperature: 0.5,
//         });
//         console.log(prompt);
//         return response.data.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error translating text:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// }

// module.exports = { translateText };

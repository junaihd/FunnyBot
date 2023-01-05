const TelegramBot = require('node-telegram-bot-api');
const openai = require('openai');
const sentiment = require('sentiment');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a new bot
const bot = new TelegramBot(token, {polling: true});

// Set the API key for OpenAI
openai.apiKey = 'YOUR_OPENAI_API_KEY';

// Matches "/chat [whatever]"
bot.onText(/\/chat (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const prompt = match[1]; // the captured "whatever"

  // Use the OpenAI API to generate a response to the prompt
  openai.completions.create({
    engine: 'text-davinci-002',
    prompt: prompt,
    max_tokens: 2048,
    n: 1,
    stop: '.',
    temperature: 0.7,
  }, function(error, response) {
    const reply = response.choices[0].text;

    // Use the sentiment library to classify the sentiment of the reply
    const result = sentiment(reply);

    // If the reply has a positive sentiment, send it back to the chat
    if (result.score > 0) {
      bot.sendMessage(chatId, reply);
    } else {
      // Otherwise, send a message to the chat saying that the bot couldn't think of a funny response
      bot.sendMessage(chatId, "Sorry, I couldn't think of a funny response.");
    }
  });
});

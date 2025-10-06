const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    // Vérifie si le message mentionne James Liwis (ID : 348117765762056193)
    if (message.mentions.users.has("348117765762056193")) {
        const réponses = [
            "On ne ping pas James Liwis. On dépose une offrande et on attend qu’il vienne.",
            "Ping pas James Liwis... il te regarde déjà.",
            "Ping encore James Liwis et c’est lui qui te pingera… depuis ta penderie.",
            "James Liwis ne répond pas aux pings. Il les hante.",
            "Ping pas James Liwis… le dernier qui l’a fait tape encore “désolé” en morse."
        ];

        // Choisir une réponse aléatoire
        const réponse = réponses[Math.floor(Math.random() * réponses.length)];

        message.reply(réponse);
    }
});



client.login(process.env.TOKEN);

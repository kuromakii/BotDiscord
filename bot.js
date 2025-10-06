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

    // Vérifie si le message mentionne kuromakii (remplace l’ID ci-dessous par le tien si besoin)
    if (message.mentions.users.has("348117765762056193")) {
        const réponses = [
            "On ne ping pas Kuromakii. On dépose une offrande et on attend qu’il vienne.",
            "Ping pas Kuromakii... il te regarde déjà.",
            "Ping encore Kuromakii et c’est lui qui te pingera… depuis ta penderie.",
            "Kuromakii ne répond pas aux pings. Il les hante.",
            "Ping pas Kuromakii… le dernier qui l’a fait tape encore “désolé” en morse."
        ];

        // Choisir une réponse aléatoire
        const réponse = réponses[Math.floor(Math.random() * réponses.length)];

        message.reply(réponse);
    }
});



client.login(process.env.TOKEN);

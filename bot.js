const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const targetId = "348117765762056193"; // ton ID Discord

  // Vérifie si le message mentionne l’utilisateur par ID OU texte
  if (
    message.mentions.users.has(targetId) || // mention classique
    message.content.toLowerCase().includes("@kuromakii") // écrit manuellement
  ) {
    const réponses = [
      "On ne ping pas **James Liwis**. On dépose une offrande et on attend qu’il vienne.",
      "Ping pas **James Liwis**... il te regarde déjà.",
      "Ping encore **James Liwis** et c’est lui qui te pingera… depuis ta penderie.",
      "**James Liwis** ne répond pas aux pings. Il les hante.",
      "Ping pas **James Liwis**… le dernier qui l’a fait tape encore “désolé” en morse."
    ];

    const réponse = réponses[Math.floor(Math.random() * réponses.length)];
    message.reply({ content: réponse, allowedMentions: { repliedUser: false } });
  }
});

client.login(process.env.TOKEN);

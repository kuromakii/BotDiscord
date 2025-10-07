const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// Création du bot
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

  // ====== 🎯 Réponses à la mention de James Liwis ======
  const targetId = "348117765762056193"; // Ton ID Discord

  if (
    message.mentions.users.has(targetId) ||
    message.content.toLowerCase().includes("@kuromakii")
  ) {
    const réponses = [
      "On ne ping pas **James Liwis**. On dépose une offrande et on attend qu’il vienne.",
      "Ping pas **James Liwis**... il te regarde déjà.",
      "Ping encore **James Liwis** et c’est lui qui te pingera… depuis ta penderie.",
      "**James Liwis** ne répond pas aux pings. Il les hante.",
      "Ping pas **James Liwis**… le dernier qui l’a fait tape encore 'désolé' en morse."
    ];

    const réponse = réponses[Math.floor(Math.random() * réponses.length)];
    message.reply({
      content: réponse,
      allowedMentions: { repliedUser: false }
    });
    return; // évite de faire aussi le "ping pong"
  }

  // ====== 🏓 Ping -> Pong ======
  if (message.content.toLowerCase() === "ping") {
    message.reply({
      content: "🏓 Pong !",
      allowedMentions: { repliedUser: false }
    });
  }
});

// Garder le bot actif sur Koyeb
const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(8000, () => console.log("✅ Fake web server for Koyeb started on port 8000"));

// Connexion Discord
client.login(process.env.TOKEN);

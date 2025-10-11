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
        `> 🍇 **James Liwis (Essence Marlowienne)**
      Énergie vitale circulant dans les caves du Marlowe Vine-Yard.  
      Invisible à l’œil nu, mais perceptible à chaque idée brillante ou verre bien servi.  
      Présence détectable par une légère vibration du sol et un “j’ai une idée” murmuré dans l’air.` ,

        `> 🥂 **James Liwis (Terme œnologique)**
      Se dit d’un millésime rare, plein de caractère, laissant en bouche un goût de réussite et une petite note d’insomnie.  
      > _“Ce champagne a du Liwis, ça se sent !”_`,

        `> 🍾 **James Liwis (Objet professionnel non identifié)**
      Appareil multifonction indispensable à la survie du Marlowe Vine-Yard.  
      Fonctions :  
      • Gestion des quotas et livraisons express  
      • Conception d’idées absurdes mais brillantes  
      • Réactivation du moral des troupes à chaque rush.  
      Compatibilité : 100 % avec Max Strobeni, 0 % avec la paresse.`,

        `> 💼 **James Liwis (Rang hiérarchique)**
      Titre officiel : Co-Patron du Marlowe Vine-Yard.  
      Mission : seconder Max Strobeni dans la gestion, les relations commerciales et la création de l’aura Marlowienne.  
      Particularité : souvent repéré avec un verre à la main et un sourire en coin disant : “On va faire mieux que l’an dernier.”`,

        `> 🧥 **James Liwis (Tenue d’exception)**
      Scientifiquement prouvé : 90 % de sa classe provient de son existence.  
      Il peut plier une veste sans faire un pli.  
      Même les cintres se battent pour le porter.`,

        `> 🎵 **James Liwis (Vibration Marlowe)**
      Rythme interne du domaine.  
      On dit que chaque bouteille possède sa propre fréquence “Liwisienne” : un léger groove qui fait bouger le client avant même qu’il goûte.  
      Symptômes : hausse de bonne humeur et envie soudaine de chanter “Marlowe forever”.`,

        `> ⚜️ **James Liwis (Légende interne du domaine)**
      On raconte qu’il aurait vendu du jus d’orange comme s’il s’agissait d’un grand cru.  
      Depuis, chaque employé de Marlowe Vine-Yard prononce son nom avant d’ouvrir un carton :  
      > _“Par Max Strobeni et James Liwis, que la vigne nous bénisse !”_`
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

/***********************
 * Marlowe Vine-Yard BOT
 * Gestion des quotas & ventes
 ***********************/

const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder 
} = require("discord.js");
const express = require("express");
const fs = require("fs");
require("dotenv").config();

/***********************
 * CONFIGURATION
 ***********************/
const PREFIX = "!";
const CHANNEL_ID = "1405903521383055503"; // 🍷 quota-vin
const GLOBAL_MESSAGE_FILE = "global_message.json";
const EMPLOYEE_MSG_FILE = "employee_messages.json";

// Exemple de données (remplaçables plus tard par un export Sheets)
const EMPLOYEES = [
  { name: "Liam Dupont", contract: "CDI", vin: 900, quota: "Petit quota" },
  { name: "Emma Leroy", contract: "CDD", vin: 1600, quota: "Grand quota" },
  { name: "Lucas Martin", contract: "CDI", vin: 500, quota: "Petit quota" }
];

/***********************
 * CLIENT DISCORD
 ***********************/
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

/***********************
 * READY EVENT
 ***********************/
client.once("ready", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

/***********************
 * MESSAGE COMMANDS
 ***********************/
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Debug message dans les logs (utile sur Koyeb)
  console.log(`[DEBUG] Message reçu : ${message.content}`);

  if (!message.content.startsWith(PREFIX)) return;
  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === "sync") {
    const channel = message.guild.channels.cache.get(CHANNEL_ID);
    if (!channel) {
      await message.reply("❌ Salon quota-vin introuvable !");
      return;
    }

    await message.react("🔄");
    console.log("🔄 Lancement de la synchronisation...");

    await syncGlobalMessage(channel);
    await syncEmployeeMessages(channel);

    // Message de confirmation visuel
    const embed = new EmbedBuilder()
      .setTitle("✅ Synchronisation réussie")
      .setDescription("Les quotas et ventes ont été mis à jour avec succès dans le salon **🍷quota-vin**.")
      .setColor("#b48c59")
      .setFooter({ text: "Marlowe Vine-Yard — Gestion des quotas" })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
    console.log("✅ Synchronisation terminée avec succès !");
  }
});

/***********************
 * SYNCHRONISATION
 ***********************/
async function syncGlobalMessage(channel) {
  console.log("🔁 Synchronisation du message global...");

  const content = formatGlobalMessage();
  let msgId = loadJson(GLOBAL_MESSAGE_FILE)?.id;

  try {
    if (msgId) {
      const msg = await channel.messages.fetch(msgId);
      await msg.edit(content);
      console.log("✏️ Message global mis à jour !");
    } else {
      const newMsg = await channel.send(content);
      saveJson(GLOBAL_MESSAGE_FILE, { id: newMsg.id });
      console.log("🆕 Message global créé !");
    }
  } catch (err) {
    console.error("⚠️ Erreur message global :", err.message);
    const newMsg = await channel.send(content);
    saveJson(GLOBAL_MESSAGE_FILE, { id: newMsg.id });
  }
}

function formatGlobalMessage() {
  return `
# 📦 **Quotas & Ventes — Marlowe Vine-Yard**

🧺 Le quota doit impérativement être rendu avant **vendredi entre 19h et 20h.**
💼 Chaque vente rapporte **5 $/u** + une **prime versée chaque vendredi soir.**

⚠️ **Rachat grossiste Marlowe Vine-Yard**  
> 🍷 En passant par un **Patron**, **Co-Patron** ou **Responsable**,  
> 💵 votre vin est racheté au tarif préférentiel de **53 $ l’unité**.  
> 🧾 Ces membres, disposant de **100 % d’expérience grossiste**,  
> permettent aux employés de **bénéficier d’un meilleur revenu** sur leurs ventes.

🕓 **Dernière mise à jour :** ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
`;
}

async function syncEmployeeMessages(channel) {
  console.log("🔁 Synchronisation des employés...");

  const msgMap = loadJson(EMPLOYEE_MSG_FILE) || {};
  const messages = await channel.messages.fetch({ limit: 100 });
  const existing = new Map();

  for (const [id, msg] of messages) {
    const match = msg.content.match(/# \*\*(.+?)\*\*/);
    if (match) existing.set(match[1].toLowerCase(), msg);
  }

  const now = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  for (const p of EMPLOYEES) {
    const content = formatEmployeeMessage(p, now);
    const key = p.name.toLowerCase();
    const existingMsg = existing.get(key);

    if (existingMsg) {
      if (existingMsg.content !== content) {
        await existingMsg.edit(content);
        console.log(`✏️ Mis à jour : ${p.name}`);
      }
      msgMap[key] = existingMsg.id;
      existing.delete(key);
    } else {
      const newMsg = await channel.send(content);
      msgMap[key] = newMsg.id;
      console.log(`🆕 Créé : ${p.name}`);
    }
  }

  for (const [key, msg] of existing) {
    await msg.delete();
    delete msgMap[key];
    console.log(`🗑️ Supprimé : ${key}`);
  }

  saveJson(EMPLOYEE_MSG_FILE, msgMap);
}

function formatEmployeeMessage(p, now) {
  const eM = "🍇";
  return (
    `> # **${p.name}** | *${p.contract || "Contrat ?"}* ${eM}\n` +
    `> **Type de quota :** *${p.quota || "Non renseigné"}*\n` +
    `> **Vin vendu :** *${p.vin || 0}*\n` +
    `\n*(Mise à jour : ${now})*`
  );
}

/***********************
 * OUTILS JSON
 ***********************/
function saveJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}
function loadJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/***********************
 * SERVEUR KEEP-ALIVE
 ***********************/
const app = express();
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(8000, () => console.log("✅ Fake web server for Koyeb started on port 8000"));

/***********************
 * CONNEXION DISCORD
 ***********************/
client.login(process.env.TOKEN);

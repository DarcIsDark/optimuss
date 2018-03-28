const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDI4NDI3ODY3NDgzOTMwNjM1.DZy8Nw.mukdKyQdDpAacx7XXE51s3nekHg";
const PREFIX = ">"

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var bot = new Discord.Client();

var fortunes = [
    "It is certain. :slight_smile:",
    "It is decidedly so. :thinking:",
    "Without a doubt! :grinning:",
    "Yes definitely. :smile:",
    "You may rely on it. :innocent:",
    "As I see it, yes. :eyes:",
    "Most likely. :smirk:",
    "Outlook good! :upside_down:",
    "Yes. :slight_smile:",
    "Signs point to yes. :smile:",
    "Reply hazy try again.. :grimacing:",
    "Ask again later.. :grimacing:",
    "Better not tell you now.. :grimacing:",
    "Cannot predict now.. :grimacing:",
    "Concentrate and ask again.. :grimacing:",
    "Don't count on it. :disappointed:",
    "My reply is no. :worried:",
    "My sources say no. :pensive:",
    "Outlook not so good. :confused:",
    "Very doubtful. :scream:"
];

var servers = {};

bot.on("ready", function() {
    console.log("Ready.");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
            case "ping":
                message.channel.send("Pong!")
                break;
            case "pong":
                message.channel.send("Ping!")
                break;
            case "info":
                message.channel.send("A bot that can do many things, and also be a meme boy. Created by Darc.");
                break;
            case "8ball":
                if (args[1]) message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]); 
                else message.channel.send("Can't read that.");
                break;
            case "help":
                var embed = new Discord.RichEmbed()
                    .addBlankField()
                    .addField("Ping", "Pong!", true)
                    .addField("Pong", "Ping!", true)
                    .addField("Info", "Info about the bot.", true)
                    .addField("8ball", "Ask it anything!", true)
                    .addField("Avatar", "Get your avatar!", true)
                    .addField("Notice", "Get noticed..", true)
                    .addField("Play", "Play music!", true)
                    .addField("Skip", "Skip current song.", true)
                    .addField("Stop", "Stop current song.", true)
                    .addField("Grill", "Cook someone!", true)
                    .addBlankField()
                    .setDescription("These are all the commands.")
                    .setColor(0x45764c)
                    .setThumbnail(message.author.avatarURL)
                    .setTimestamp()
                message.author.send(embed);
                break;
            case "avatar":
                message.reply(message.author.avatarURL)
                break;
            case "notice":
                message.channel.send(message.author.toString() + " You got noticed!");
                break;
            case "play":
                if (!args[1]) {
                    message.channel.send("Please provide a link.");
                    return;
                }

                if (!message.member.voiceChannel) {
                    message.channel.send("You must be in a voice channel.");
                    return;
                }

                if(!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                };

                var server = servers[message.guild.id];

                server.queue.push(args[1]);

                if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                    play(connection, message);
                });
                break;
            case "skip":
                var server = servers[message.guild.id];

                if (server.dispatcher) server.dispatcher.end();
                break;
            case "stop":
                var server = servers[message.guild.id];

                if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                break;
            case "grill":
                if (args[1]) message.channel.send("Mmhh.. nice and tender..", {
                file: "https://cdn.discordapp.com/attachments/397128045065928716/428461919201001483/chicken-leg-grill-rack-xl.png"
                });
                else message.channel.send("Can't cook that.");
                break;
            case "say":
                const sayMessage = args.slice(1).join(' ');
                message.delete();
                message.channel.send(sayMessage);
                break;
            default:
                message.channel.send("Invalid command.");
    }
}); 

bot.login(TOKEN);
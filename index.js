const WebSocket = require("ws");
const matrix = require("@matrix-io/matrix-lite");
const https = require("http");
const player = require('play-sound')();  

const ws = new WebSocket("ws://localhost:12101/api/events/intent");
console.log("**Started Web Socket Client**");

ws.on("open", function open() {
  console.log("\n**Connected**\n");
});

ws.on("close", function close() {
  console.log("\n**Disconnected**\n");
});

ws.on("message", function incoming(data) {
  data = JSON.parse(data);

  console.log("**Captured New Intent**");
  console.log(data);

  if ("Allumer" === data.intent.name) {
    if (data.slots["couleur"] === "rouge") matrix.led.set('red');
    if (data.slots["couleur"] === "vert") matrix.led.set('green');
    if (data.slots["couleur"] === "bleu") matrix.led.set('blue');
    if (data.slots["couleur"] === "noir") matrix.led.set('black');
    say("Lumière allumée en : " + data.slots["couleur"]);
  }
  if ("Eteindre" === data.intent.name) {
    matrix.led.set('black');
    say("Lumière éteinte");
  }
  if ("LedOn" === data.intent.name) {
    matrix.gpio.setFunction(1, 'DIGITAL');
    matrix.gpio.setMode(1, 'output');
    matrix.gpio.setDigital(1, 'ON');
  }
  if ("LedOff" === data.intent.name) {
    matrix.gpio.setFunction(1, 'DIGITAL');
    matrix.gpio.setMode(1, 'output');
    matrix.gpio.setDigital(1, 'OFF');
  }

  if ("Arrete" === data.intent.name) {
    robotStop();
    say("Robot arrêté");
  }

  if ("Avance" === data.intent.name) {
    robotMoveForward();
    say("Robot en avant");
  }

  if ("Droit" === data.intent.name) {
    robotTurnRight();
    say("Robot tourne à droite");
  }

  if ("Gauche" === data.intent.name) {
    robotTurnLeft();
    say("Robot tourne à gauche");
  }

  if ("Plusvite" === data.intent.name) {
    robotIncreaseSpeed();
    say("Vitesse augmentée");
  }

  if ("Moinsvite" === data.intent.name) {
    robotDecreaseSpeed();
    say("Vitesse réduite");
  }

  if ("Cava" === data.intent.name) {
    robotTurnRight();
    say("Ca va bien, merci");
  }

  if ("Couleurprefere" === data.intent.name) {
    robotTurnRight();
    say("J'adore la couleur jaune");
  }

  if ("blague" === data.intent.name) {
    robotTurnRight();
    say("Pourquoi les programmeurs n'aiment-ils pas la nature ? — Parce qu'il y a trop de bugs !");
    playSound('./fin.wav');
  }
});

function say(text) {
  const options = {
    hostname: "localhost",
    port: 12101,
    path: "/api/text-to-speech",
    method: "POST"
  };

  const req = https.request(options);

  req.on("error", error => {
    console.error(error);
  });

  req.write(text);
  req.end();
}

function robotStop() {
  console.log("Robot is stopping...");
}

function robotMoveForward() {
  console.log("Robot is moving forward...");
}

function robotTurnRight() {
  console.log("Robot is turning right...");
}

function robotTurnLeft() {
  console.log("Robot is turning left...");
}

function robotIncreaseSpeed() {
  console.log("Robot speed is increasing...");
}

function robotDecreaseSpeed() {
  console.log("Robot speed is decreasing...");
}

function playSound(filePath) {
  player.play(filePath, function(err) {
    if (err) {
      console.log("Error playing sound:", err);
    }
  });
}

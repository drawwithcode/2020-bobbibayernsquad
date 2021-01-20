console.log("node server is running");

// load express library
let express = require("express");
// create the app
let app = express();
// define the port where client files will be provided
let port = process.env.PORT || 3000;
// start to listen to that port
let server = app.listen(port);
// provide static access to the files
// in the "public" folder
app.use(express.static("public"));
// load socket library
let socket = require("socket.io");
// create a socket connection
let io = socket(server);


let labyrinth_preLobby = [];
let labyrinth = [];



// define which function should be called when a new connection is opened from client
io.on("connection", newConnection);

// callback function: the paramenter (in this case socket) will contain all the information on the new connection
function newConnection(socket) {

  socket.on("welcome", function (dataReceived){
    switch (dataReceived.room) {
      case "labyrinth":
        let matched = false;
        let index=NaN;
        //blind side
        if (dataReceived.side == "blind") {
          console.log("labyrinth blind socket:", socket.id);
          // If there is someone waiting then I pair them
          for (let i = 0; i < labyrinth.length; i++) {
            if (labyrinth[i].blind == undefined) {
              labyrinth[i].blind = socket.id;
              matched = true;
              index = i;
              break;
            }
          }
          // Otherwise i create a new lobby
          if (!matched) {
            let el = { blind: socket.id}
            labyrinth.push(el);
          }
        }
        //sighted side
        if (dataReceived.side == "sighted") {
          console.log("labyrinth sighted socket:", socket.id);
          // If there is someone waiting then I pair them
          for (let i = 0; i < labyrinth.length; i++) {
            if (labyrinth[i].sighted == undefined) {
              labyrinth[i].sighted = socket.id;
              matched = true;
              index = i;
              break;
            }
          }
          // Otherwise i create a new lobby
          if (!matched) {
            let el = { sighted: socket.id}
            labyrinth.push(el);
          }
        }
        //If matched, start the experience
        if (matched) {
          io.to(labyrinth[index].blind).emit("start", labyrinth[index].sighted);
          io.to(labyrinth[index].sighted).emit("start", labyrinth[index].blind);
        }
        break;
    }

  });

  //disconnection
  socket.on('disconnect', function () {
    console.log("disconnection: "+ socket.id);
  });
}

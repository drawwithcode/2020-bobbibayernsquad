
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

let labyrinth = [];
let labyrinthMain = [];

let street = [];
let streetMain = [];

// define which function should be called when a new connection is opened from client
io.on("connection", newConnection);

// callback function: the paramenter (in this case socket) will contain all the information on the new connection
function newConnection(socket) {

  let room;
  let side;

  socket.on("welcome", function (dataReceived){

    // #############
    if (dataReceived.room == "labyrinth") {
        room="labyrinth";
        let matched = false;
        let index=NaN;
        //blind side
        if (dataReceived.side == "blind") {
          console.log("labyrinth blind socket:", socket.id);
          side="blind";
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
          side="sighted";
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
          labyrinthMain.push(labyrinth[index]); //add pair to the main lobby
          labyrinth.splice(index,1); //delete pair from the queue
        }
      }

      // #############
      if (dataReceived.room == "street") {
        room = "street";
        let matched = false;
        let index=NaN;

        //blind side
        if (dataReceived.side == "blind") {
          console.log("street blind socket:", socket.id);
          side="blind";

          // If there is someone waiting then I pair them
          for (let i = 0; i < street.length; i++) {
            if (street[i].blind == undefined) {
              street[i].blind = socket.id;
              matched = true;
              index = i;
              break;
            }
          }
          // Otherwise i create a new lobby
          if (!matched) {
            let el = { blind: socket.id }
            street.push(el);
          }
        }

        //sighted side
        if (dataReceived.side == "sighted") {
          console.log("street sighted socket:", socket.id);
          side="sighted";
          // If there is someone waiting then I pair them
          for (let i = 0; i < street.length; i++) {
            if (street[i].sighted == undefined) {
              street[i].sighted = socket.id;
              matched = true;
              index = i;
              break;
            }
          }
          // Otherwise i create a new lobby
          if (!matched) {
            let el = { sighted: socket.id }
            street.push(el);
          }
        }

        //If matched, start the experience
        if (matched) {
          io.to(street[index].blind).emit("start", street[index].sighted);
          io.to(street[index].sighted).emit("start", street[index].blind);
          streetMain.push(street[index]); //add pair to the main lobby
          street.splice(index,1); //delete pair from the queue
        }
      }

  });

  socket.on("forwardSpriteMsg", function (message){
    let info = {
      i : message.i,
      j : message.j,
      imgMsg : message.imgMsg,
      sound : message.sound
    };
    io.to(message.recipient).emit("spriteInfo", info);
  });

  socket.on("forwardRand", function (message){
    io.to(message.recipient).emit("rand", message.rand);
  });

  socket.on("forwardEntityMsg", function (message){
    let info = {
      gridPos : message.gridPos,
      pos : message.pos,
      name: message.name
    };
    io.to(message.recipient).emit("entityInfo", info);
  });

  socket.on("forwardFrameCount", function (message){
    let info = {
      count: message.count,
      accidentCount: message.accidentCount,
      successCount: message.successCount
    };
    io.to(message.recipient).emit("frameCountInfo", info);
  });

  socket.on("forwardPingMsg", function (message){
    let info = {
      x: message.x,
      y: message.y,
      showPin: message.showPin
    };
    io.to(message.recipient).emit("pingInfo", info);
  });

  let experienceEnded = false;
  socket.on("finished", function (){
    experienceEnded=true;
    //Remove pair from the main lobby
    find_main(false);
  });


  socket.on('disconnect', function () {
    console.log("disconnection: "+ socket.id);

    //Unexpected disconnection
    if (!experienceEnded) {
      let found_in_queue = find_queue();
      if (!found_in_queue) {
        find_main(true);
      }
    }

    console.log(labyrinth);
    console.log(labyrinthMain);
    console.log(street);
    console.log(streetMain);
  });


  function find_main (sendWarning) {
    if (room == "labyrinth") {
        if (side == "blind") {
          for (let i = 0; i < labyrinthMain.length; i++) {
            if (labyrinthMain[i].blind == socket.id) {
              if (sendWarning) {
                io.to(labyrinthMain[i].sighted).emit("warning");
              }
              labyrinthMain.splice(i, 1);
            }
            return 1;
          }
        }
        if (side == "sighted") {
          for (let i = 0; i < labyrinthMain.length; i++) {
            if (labyrinthMain[i].sighted == socket.id) {
              if (sendWarning) {
                io.to(labyrinthMain[i].blind).emit("warning");
              }
              labyrinthMain.splice(i, 1);
            }
            return 1;
          }
        }
      }
      if (room == "street") {
        if (side == "blind") {
          for (let i = 0; i < streetMain.length; i++) {
            if (streetMain[i].blind == socket.id) {
              if (sendWarning) {
                io.to(streetMain[i].sighted).emit("warning");
              }
              streetMain.splice(i, 1);
            }
            return 1;
          }
        }
        if (side == "sighted") {
          for (let i = 0; i < streetMain.length; i++) {
            if (streetMain[i].sighted == socket.id) {
              if (sendWarning) {
                io.to(streetMain[i].blind).emit("warning");
              }
              streetMain.splice(i, 1);
            }
            return 1;
          }
        }
      }
      return 0;
    }

  function find_queue () {
    if(room =="labyrinth") {
        if (side == "blind") {
          for (let i = 0; i < labyrinth.length; i++) {
            if (labyrinth[i].blind == socket.id) {
              labyrinth.splice(i, 1);
            }
            found_in_queue = true;
            return 1;
          }
        }
        if (side == "sighted") {
          for (let i = 0; i < labyrinth.length; i++) {
            if (labyrinth[i].sighted == socket.id) {
              labyrinth.splice(i, 1);
            }
            found_in_queue = true;
            return 1;
          }
        }
    }
    if (room == "street") {
        if (side == "blind") {
          for (let i = 0; i < street.length; i++) {
            if (street[i].blind == socket.id) {
              street.splice(i, 1);
            }
            found_in_queue = true;
            return 1;
          }
        }
        if (side == "sighted") {
          for (let i = 0; i < street.length; i++) {
            if (street[i].sighted == socket.id) {
              street.splice(i, 1);
            }
            found_in_queue = true;
            return 1;
          }
        }
      }
      return 0;
    }
}

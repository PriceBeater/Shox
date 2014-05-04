var io= require('socket.io-client'), socket= io.connect("http://localhost:4011/v1/message");  

socket.on('connect', function (data) { 
  console.log("connected..");
  socket.on('MESSAGE',function(message){
    console.log("received:")
    console.log(message)
  });
});


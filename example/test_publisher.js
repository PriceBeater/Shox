var io= require('socket.io-client'), socket= io.connect("http://localhost:4011/v1/publish");  

socket.on('connect', function (data) { 
  socket.emit("DATA",{key:"7a7b40b176737f3930fd7d8a04f39582",param:10.0});

});



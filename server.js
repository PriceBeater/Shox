var config = require('./config')
var http = require('http');
var m6 = require('m6');
var md5 = require('MD5');
var io = require('socket.io').listen(config.messageport);
io.set('log level', config.loglevel); 

var serverlib = require('./serverlib');

function getpostcontent(req,callback) {                                                                                                                                                                        
  if (req.readable) {
      var content = '';
      req.on('data', function(data) {
          if (content.length > 1e6) {
              res.json({ error: 'Request entity too large.' }, 413);
              callback("");
          }

          content += data;
      });

      req.on('end', function () {
          callback(content);
      });
  } else {
      callback(content);
  }
}


function v1_publish(data) {
    try{
      if(data){
        if(data.key && data.param){
          serverlib.Publish(data.key,{param:data.param},function(publish_list){
            if(messageStream){
              if(publish_list.length>0){
                var object={};
                if(data.object)
                  object=data.object;
                messageStream.emit("MESSAGE",{object:object, message:publish_list});
              }
            }
            //send to socket
          });
        }
      }

    }catch(err){
      console.log(err);

    }

}

function v1_unreg(req, res) {
  var meta = { code:200, error:''};
  var api_output = {};
  var responseobj={};
  res.writeHead(200, {"content-type" : "application/json"                                                                                                                                                    
  ,"Access-Control-Allow-Origin": "*"
  ,'Access-Control-Allow-Headers':'Content-Type'
  ,"Access-Control-Allow-Credentials": true});

  getpostcontent(req,function(content){
    try{
      var reqobj = JSON.parse(content);   
      if(reqobj.key && reqobj.subscriber_id ){
        serverlib.Unreg(reqobj.key,reqobj.subscriber_id,function(err,result){
          if(err){
            meta.code=500;
            meta.err=err.message;
          }else{
            if(result==1){
              responseobj["key"]=reqobj.key;
              responseobj["subscriber_id"]=reqobj.subscriber_id;
            }
          }
          api_output["meta"]=meta;
          api_output["response"]=responseobj;
          res.end(JSON.stringify(api_output));

        }); 
      }else{
        meta.code=500;
        meta.err="bad request params.";
        api_output["meta"]=meta;
        api_output["response"]=responseobj;
        res.end(JSON.stringify(api_output));
      }

    }catch(err){
      meta.code=500;
      meta.err=err.message;
      res.end(JSON.stringify(api_output));
    }
  });
}


function v1_reg(req, res) {
  var meta = { code:200, error:''};
  var api_output = {};
  var responseobj={};
  res.writeHead(200, {"content-type" : "application/json"                                                                                                                                                    
  ,"Access-Control-Allow-Origin": "*"
  ,'Access-Control-Allow-Headers':'Content-Type'
  ,"Access-Control-Allow-Credentials": true});

  getpostcontent(req,function(content){
    try{
      var reqobj = JSON.parse(content);   
      if(reqobj.key && reqobj.subscriber_id && reqobj.testing && reqobj.param){
        serverlib.Reg(reqobj.key,reqobj,function(err,result){
          if(err){
            meta.code=500;
            meta.err=err.message;
          }else{
            if(result==1){
              responseobj["key"]=reqobj.key;
              responseobj["subscriber_id"]=reqobj.subscriber_id;
            }
          }
          api_output["meta"]=meta;
          api_output["response"]=responseobj;
          res.end(JSON.stringify(api_output));

        }); 
      }else{
        meta.code=500;
        meta.err="bad request params.";
        api_output["meta"]=meta;
        api_output["response"]=responseobj;
        res.end(JSON.stringify(api_output));
      }

    }catch(err){
      meta.code=500;
      meta.err=err.message;
      res.end(JSON.stringify(api_output));
    }
  });
}

//service publish message api
m6.AddPostRoute('/v1/reg', v1_reg);
m6.AddPostRoute('/v1/unreg', v1_unreg);


var messageStream= io.of('/v1/message').on('connection', function (socket){
});

var pubsubStream= io.of('/v1/publish').on('connection', function (socket){
  console.log("clienht connect");
    socket.on('DATA',function(message){
      v1_publish(message);
    });

});


var server = http.createServer(function(req, res) {
  if(m6.Process(req, res) === false) {
      res.writeHead(404, {"content-type" : "text/plain"});
      res.end('Not found\n');
  }
}

).listen(config.regport);


var config = require('./config');
var storage=require("./storage/"+config.storage.name+".js");

var serverlib= function() {
  var extension=config.extension;
  var extension_dir="./extension/";
  var extensionobj={};
  for(var i in extension){
    var module=require(extension_dir+extension[i]+".js");
    extensionobj[extension[i]]=module;
  }

  var _reg=function(key,obj,callback){
    storage.Save(key,obj,function(err,result){
      callback(err,result);
    });
  }
  var _unreg=function(key,subscriber_id,callback){
    storage.Remove(key,subscriber_id,function(err,result){
      callback(err,result);
    });
  }

  var _publish=function(key,obj,callback){
    storage.Find(key,obj,function(err,docs){
      var obj_list_publish=[];
      for (var i in docs){
        if(docs[i].testing){
          var testingfunc=docs[i].testing;
          var threshold=docs[i].param;
          var _funcname=testingfunc.split(".");
          var c=_funcname[0];
          var f=_funcname[1];
          var funcobj=extensionobj[c];
          if(funcobj){
            var function_name = funcobj[f];
            var input=obj.param;
            if(threshold && input){
              var result=function_name(threshold,input);
              if(result===true){
                obj_list_publish.push({message:obj,subscriber:docs[i]});
              }
            }
          }
        }
      }
      callback(obj_list_publish);
      //push to client.
    });
    
  }

	return {
		Reg: _reg,
		Unreg: _unreg,
    Publish:_publish,
	};

}();
module.exports = serverlib;



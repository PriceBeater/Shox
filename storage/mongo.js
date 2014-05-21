var config= require('../config');
var MongoClient = require('mongodb').MongoClient;
var dbconnect;

var storage= function() {
  var _connect=function(callback) {
    if (dbconnect === undefined) {
      var connect_str='mongodb://'+config.storage.env.Host+":"+config.storage.env.Port+"/"+config.storage.env.DBNAME;
  
      MongoClient.connect(connect_str, function(err, db) {
        if(err) {
           return callback(err,null);
        }else {
          if(config.storage.env.User){
            db.authenticate(config.storage.env.User, config.storage.env.Password, function(err, res) {
              if(err) { 
               return callback(err,null);
              }else{
                    dbconnect = db;
                    callback(null, db);
              }
            });
          }else{
            dbconnect = db;
            callback(null, db);
          }
        }
      });  
    } else {
      callback(null, dbconnect);
    }
  };


  var _save=function(key,obj,callback){
    _connect(function(err,db){ 
      if(err){
        callback(err,0);
      }
      else{
        var collection = db.collection('pubsub');
        collection.find({hashkey:key,subscriber_id:obj.subscriber_id}).toArray(function(err, docs) {
          obj.hashkey=key;
          if(err)
            callback(err,0);
          else{
            if(docs.length>0){
              var docid=docs[0]._id;
              collection.update({_id:docid},obj,function(err, docs) {
                callback(err,docs);
              });
            }else{
              collection.save(obj, function(err, docs) {   
                var result=0;
                if(docs && docs._id)
                  result=1;
                callback(err,result);
              });
            }
          }
        });
      }

    });
  }

  var _remove=function(key,subscriber_id,callback){
    _connect(function(err,db){ 
      if(err){
        callback(err,0);
      }
      else{
        var collection = db.collection('pubsub');
        collection.remove({hashkey:key,subscriber_id:subscriber_id},function(err, docs) {
          callback(err,docs);
        });
      }
    });
  }

  var _find=function(key,obj,callback){
    _connect(function(err,db){ 
      if(err){
        callback(err,[]);
      }
      else{
        var collection = db.collection('pubsub');
        collection.find({hashkey:key}).toArray(function(err, docs) {
          callback(err,docs);
        });
      }
    });

  }

	return {
		Save: _save,
		Remove: _remove,
		Find: _find,
	};

}();
module.exports = storage;



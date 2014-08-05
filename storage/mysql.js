var config= require('../config');
var _mysql = require('mysql');
var dbconnect;

var storage= function() {
  var _connect=function(callback) {
    if (dbconnect === undefined) {
      dbconnect = _mysql.createConnection({
            host: config.storage.env.Host,
            port: config.storage.env.Port,
            user: config.storage.env.User,
            password: config.storage.env.Password,
      });
      
      dbconnect.connect();
      dbconnect.query('use ' + config.storage.env.DBNAME);

      callback(null,dbconnect);
    } else {
      callback(null, dbconnect);
    }
  };




  var _find=function(key,obj,callback){
    _connect(function(err,db){ 
      if(err){
        callback(err,[]);
      }
      else{
        var select_sql = "select * from "+config.storage.env.TABLENAME+" where urlhash='"+key+"'";
        dbconnect.query(select_sql, function(err,results,fields){ 
          var docs=[];
          for(var i in results){
            var r=results[i];
            var doc={};
            //object mapping
            doc.key=r.urlhash;
            doc.hashkey=r.urlhash;
            doc.url=r.url;
            doc.subscriber_id=r.account_id;
            doc.testing=r.testing;
            doc.param=r.target_price;
            docs.push(doc);
          }
          callback(err,docs);
        });
      }
    });

  }

	return {
		Find: _find,
	};

}();
module.exports = storage;


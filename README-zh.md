Shox: Yet another pub/sub lightwight messaging service
======================================================

Shox是一个灵活的，可扩展的pub/sub messaging service，它可以灵活的定义subscribe逻辑。

Configuration
-------------

### Config.js

```
config.extension=["basic"];
``` 
载入extensions，见` extension/basic.js `

```
config.storage.name="mongo";
```
存储模块，见` storage/mongo.js `

```
config.storage.env.Host="127.0.0.1";
config.storage.env.Port=27017;
config.storage.env.DBNAME="shox";
config.storage.env.User="";
config.storage.env.Password="";
```
存储环境配置

```
config.regport=4010;
config.messageport=4011;
```
服务端口设置


Extension
---------

Extension 包含了消息订阅时使用的过滤方法，当过滤方法为true的时候，subscriber就会收到消息。

比如默认的basic.js中LT(threshold,input)方法，是用来检测publisher输入的input是否小于subscriber指定的threshold，如果小于，则emit消息给subscriber.

你可以自定义任何Extension和Method，并用于你的Pub/Sub协议。

Useage
------

### Subscriber register 

Post raw json to service reg endpoint: http://localhost:4011/v1/reg

``` json
{
  "key":"234d02ffd1e8d2648763798a75ce37bf", 
  "url":"http://www.amazon.com/dp/B000GUZC2A",
  "subscriber_id":"user0002",
  "testing":"basic.LT", 
  "param":5.5
}

```
key: 订阅的key，和publisher发布的消息key相同，就是subscriber有可能收到的消息。（除了key，还要依据testing的结果决定）
subscriber_id: subscriber id，和key配合使用，用来确认subscriber。
testing: 测试方法，具体方法在服务器的Extension中定义。
param: testing方法所需要的input参数，可以是任何object。 
url: 自定义字段，供调试用。

### Subscriber unregister

Post raw json to service unreg endpoint: http://localhost:4011/v1/unreg

``` json
{
  "key":"url_03", 
  "subscriber_id":"user0002"
}
```

### Subscriber receive message

Subscriber 客户端用socket.io链接到message api，等待MESSAGE消息。

``` javascript
var io= require('socket.io-client'), socket= io.connect("http://localhost:4011/v1/message");                                                                                                                   
socket.on('connect', function (data) {
  socket.on('MESSAGE',function(message){
    console.log("received:")
    console.log(message)
  });
});

```

### Publisher sent message

用socket.io链接到publish api，emit DATA message，其中param和订阅者约定的param保持一致，object可以存放任何对象。

``` javascript
var io= require('socket.io-client'), socket= io.connect("http://localhost:4011/v1/publish");  

socket.on('connect', function (data) {                                                                                                                                                             
  socket.emit("DATA",{key:"7a7b40b176737f3930fd7d8a04f39582",param:10.0, object:{}});
});
```

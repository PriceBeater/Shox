Shox: Yet another lightwight pub/sub messaging service
======================================================

Shox is a flexible extensible pub/sub messageing service that can be defined subscription logic by extensions.

Configuration
-------------

### Config.js

```
config.extension=["basic"];
``` 
Loading extensions, see ` extension/basic.js `

```
config.storage.name="mongo";
```
Storage module name, see ` storage/mongo.js `

```
config.storage.env.Host="127.0.0.1";
config.storage.env.Port=27017;
config.storage.env.DBNAME="shox";
config.storage.env.User="";
config.storage.env.Password="";
```
Storage environment configuration.

```
config.regport=4010;
config.messageport=4011;
```
Service port configuration

Extension
---------

Extension includes filter testing methods for subscribers who could receive message when the testing method return ```true```.


For example: 

In the `basic.js`, method: ``` LT(threshold,input) ``` will test the input value less than the threshold and emit message to the subscriber if the method return ```true```.

You can add your Extension and Method, then build your Pub/Sub protocol.

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
key: Subscription key. Subscribers may receive the message when the publisher publish message with this key. ( Depending on the testing method result.)
subscriber_id: subscriber id, combine with the key for identifying a unique subscriber.
testing: Testing method name, defined in the server extensions. 
param: the input param for the testing method, which can be any object.
url: Custom field. you can add any fields in the reg object.

### Subscriber unregister

Post raw json to service unreg endpoint: http://localhost:4011/v1/unreg

``` json
{
  "key":"url_03", 
  "subscriber_id":"user0002"
}
```

### Subscriber receive message

The subscriber client connects to the message api with socket.io, waiting for the ```MESSAGE``` message.

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

The publisher client connects to the publish api, then emits DATA message. The ```param``` should conform to the subscriber definition and the ```object``` can be any objects.

``` javascript
var io= require('socket.io-client'), socket= io.connect("http://localhost:4011/v1/publish");  

socket.on('connect', function (data) {                                                                                                                                                             
  socket.emit("DATA",{key:"7a7b40b176737f3930fd7d8a04f39582",param:10.0, object:{}});
});
```

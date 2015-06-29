var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var cookieParser = require('cookie-parser');
var md5 = require('MD5');
var uuid = require('node-uuid');
//var rest = require("./REST.js");
var app  = express();


var errorHandler = new (function() {
  this.mysql = function(res, err) {
    res.status(500).send("Issue with MySQL \n" + err);
  }
})();

var db;
var database_name = 'northwind';

var databaseMiddleware = function() {
  var connectMysql = function() {
      var self = this;
      var pool = mysql.createPool({
          connectionLimit : 100,
          host     : 'localhost',
          user     : 'root',
          password : '',
          database : database_name,
          debug    : false
      });
      
      return pool;
  };  
  
  var dbLink = connectMysql();

  dbLink.getConnection(function(err,connection){
    if(err) {
      errorHandler.mysql(res, err);
    } else {
      db = connection;
      //next();
    };
  });

};

var users = [
  {username: "admin",
   email: "admin@localhost",
   password: "admin"},
   {username: "michal",
   email: "michal@localhost",
   password: "michal"},
];

var tokens = {};

databaseMiddleware();

// Express configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(cookieParser());
//app.use(databaseMiddleware);

//Auth middleware
/*
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  console.log(req.headers);
  console.log(tokens);
  
  if(req.path === '/api/login' && req.method === 'POST') {
    console.log('Login attempt');
    next();
  }
  else {
    var authToken = req.headers.authorization;
  
    if(typeof authToken === 'string') {
//    console.log(typeof authToken);
//    console.log(typeof tokens[authToken]);
      if(typeof tokens[authToken] !== 'undefined') {
        next();
      }
      else {
        res.status(401).send('Unauthorized, invalid token');
      }
    }
    else {
      res.status(401).send('Unauthorized, no token provided');
    }
  }
});
*/


// Routing
var router = express.Router();
app.use('/api', router);

router.get("/",function(req,res){
  res.json({"Message" : "Undefined action"});    
});

router.get("/login", function(req, res) {
  res.sendStatus(200);
});

router.get("/logoff", function(req, res) {
  delete tokens[req.headers.authorization];
  res.json({
    "message": "logoff"
    });
});

router.post("/login", function(req, res) {
 
  var proveCredentials = function(username, passwd) {
    for(var i in users) {
      if(users[i].username.toLowerCase() === username.toLowerCase() 
         || users[i].email.toLowerCase() === username.toLowerCase()) {
        if(users[i].password === passwd) {
          return true;
        }
      }
    }
    
    return false;
  }
 
  var user = req.body.username;
  var pass = req.body.password;
  
  if(proveCredentials(user, pass)) {
    var token = uuid.v1();
   
    tokens[token] = {username: user};
   
    res.json({username: user, token: token});    
  }
  else {
    res.sendStatus(401);
  }
});

var dbResultHandler = function(err, rows){
    if(err) {
        return {"error" : true, "message" : "Error executing MySQL query" + err};
    } else {
        return {"error" : false, "message" : "success", data: rows };
    }
};
    
router.get("/tables",function(req,res){
  var query = "SHOW TABLES";

  db.query(query,function(err,rows){
    var dbResult = dbResultHandler(err, rows);
    var result = [];
    
    for(var i in dbResult.data) {
      result.push(dbResult.data[i][Object.keys(dbResult.data[i])]);
    }
    
    res.json(result);
  });
});

router.get("/table/:name",function(req,res){
  var query = "DESCRIBE ??";
  var table = [req.params.name];
  query = mysql.format(query,table);
  
  db.query(query,function(err,rows){
    res.json(dbResultHandler(err, rows));
  });
});

router.get("/table/:name/:fields",function(req,res){
  var query = "SELECT ?? FROM ?? LIMIT 100";
  var table = [req.params.fields.split(','), req.params.name];
  query = mysql.format(query,table);

  db.query(query,function(err,rows){
    res.json(dbResultHandler(err, rows));
  });
});

router.put("/table/:name",function(req,res){

  var inputData = req.body;
  var keys = [];
  var values = [];

  if(typeof inputData === 'object') {
    for(var i in inputData) {
      keys.push(i);
      values.push(inputData[i]);
    }
  }

  var query = "INSERT INTO ?? (??) VALUES(??)";
  var table = [req.params.name, keys, values];
  query = mysql.format(query,table);


  //res.json({keys:keys, values:values, query:query});

  db.query(query,function(err,rows){
    res.json(dbResultHandler(err, rows));
  });
});

router.post("/table/:name/:key/:id",function(req,res){

  var inputData = req.body;
  var keys = [];
  var values = [];

  if(typeof inputData === 'object') {
    for(var i in inputData) {
      keys.push(i);
      values.push(inputData[i]);
    }
  }

  var query = "UPDATE ?? SET (??) VALUES(??) WHERE ?? = ??";
  var table = [req.params.name, keys, values, req.params.key, req.params.id];
  query = mysql.format(query,table);

  //res.json({keys:keys, values:values, query:query});

  db.query(query,function(err,rows){
    res.json(dbResultHandler(err, rows));
  });
});

router.get("/reports",function(req,res){
  var query = "SHOW FULL TABLES IN ?? WHERE TABLE_TYPE LIKE 'VIEW';";
  var table = [database_name];
  query = mysql.format(query,table);
  
  db.query(query,function(err,rows){
    var dbResult = dbResultHandler(err, rows);
    var result = [];
    
    for(var i in dbResult.data) {
      result.push(dbResult.data[i][Object.keys(dbResult.data[i])[0]]);
    }
    
    res.json(result);
  });
});


router.post("/users",function(req,res){
    /*
    var query = "INSERT INTO ??(??,??) VALUES (?,?)";
    var table = ["user_login","user_email","user_password",req.body.email,md5(req.body.password)];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "User Added !"});
        }
    });
    */
});


// Start application
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
      



const express = require('express');
const path = require('path');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const { sign } = require('crypto');
const { name } = require('pug/lib');
const { argv0 } = require('process');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//users db connection info

var id = '';

  //getting actual date
function getDate(){
    var date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var date = day + "-" + month + "-" + year;
    return date;
}


//creating unique id and returning it
function makeid(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


function addToExercisesTable(data, callback){
    var connection_table = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: id
      });
      //console.log("cwiczenie: " + name);
      //var query_check = "SELECT * FROM exercises";
      var query_insert = "INSERT INTO exercises VALUES ('";
      //console.log(query_check, query_insert);
      for (var element in data){
        query_insert += data[element] + "'), ('";
      }
      query_insert = query_insert.slice(0, -4);
      connection_table.connect(function(err){
          if (err) throw err;
        connection_table.query(query_insert, function(err, result){
            if (err) throw err;
        });
      });
      
}

function getExercisesTable(callback){
    var connection_table = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: id
      });
      //console.log("cwiczenie: " + name);
      var query_check = "SELECT * FROM exercises";
      //console.log(query_check, query_insert);
      connection_table.connect(function(err){
          if (err) throw err;
        connection_table.query(query_check, function(err, result){
            if (err) throw err;
            var data = new Array();
            for (var element in result){
                data.push(result[element].exercise_name);
            }
            data = [...new Set(data)];
            return callback(data);
        });
      });
}



//login user
function login(login, password, callback){
    var connection_users = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "silownia"
      });
    //check is there such user
    var query = "SELECT id, login FROM users WHERE login='" + login + "' AND password='" + password + "'";
    //setting variable for user's id
    var id;
    //connecting to db (OTHER DB!!!!)
    connection_users.connect(function(err) {
        if (err) throw err;
        //sending query
        connection_users.query(query, function (err, result, fields) {
            if (err) throw err;
            result=JSON.parse(JSON.stringify(result));
            //if no user return false 
            if (Object.keys(result).length === 0){            
                return callback(false);
            }//otherwise return id with callback!!
            else{
                id = result[0].id;
                return callback(result[0]);
            }
          });
      });
}

function signUp(login, password, callback){
    var connection_users = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "silownia"
      });

    var connection_mysql = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    });

    var id = makeid(9);

      var query = `INSERT INTO users VALUES ('${id}', '${login}','${password}')`;
      var query_make_database = 'CREATE DATABASE ' + id;
      var query_all_tables = 'CREATE TABLE all_tables (name TEXT, date text, ID text)';
      var query_ex = 'CREATE TABLE exercises (exercise_name TEXT)';

      connection_users.connect(function(err){
        if(err) throw err;
        connection_users.query(query, function(err){
            if (err) throw err;
        });
      });
      connection_mysql.connect(function(err){
        if (err) throw err;
        connection_mysql.query(query_make_database, function(err){
            if (err) throw err;
            var connection_table = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: id
            });
        
              connection_table.connect(function(err){
                  if (err) throw err;
                  connection_table.query(query_all_tables, function(err){
                        if(err) throw err;
                  });
                  connection_table.query(query_ex, function(err){
                    if(err) throw err;
              });
              });
        });
      });

      return callback('true');
    
}

function getExerciseData(name, callback){
    var connection_table = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: id
      });
      

  getTreningTables(id, function(result){ 
        var query = "SELECT * FROM ";
        for(var element in result){
            query += result[element].id + ", ";
        }
        query = query.slice(0, -2);
            //console.log(query);
            //for(var element in queries){
        connection_table.query(query, function(err, result1, fields){
            if (err) throw err;
            return callback([result1, fields]);
        });
    });
}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

function sendExerciseData(name, callback){
    getExerciseData(name, function(result){
        //console.log(result);
        var data = new Array();
        for(var i = 0; i < result.length; i+=2){
            //console.log(result[0][i]);
            for(var ex in result[0][i]){  
                //console.log(ex);                    
                if (ex.split(":")[0] + ":" + ex.split(":")[1] == name){   
                    //!!
                    data.push([result[0][i][ex], result[1][i].table]);
                    //console.log(result[1][i+1]);
                    }
            }
        }
        data = removeItemAll(data, new Array());
        return callback(data);
    });
}

function idToDate(data, callback){
    getTreningTables(id, function(result){
        for(var table in result){
            for(var ex in data){
                if(data[ex][1] == result[table].id){
                    data[ex][1] = result[table].date;
                }
            }
        }
        return callback(data);
    });
}



//getting all client's tables' names
function getTreningTables(id, callback){
    //query to "shortcut" table
    var query = "SELECT * FROM `all_tables`";
    //setting connection info
    var connection_table = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: id
      });
      //connecting to db
      connection_table.connect(function(err){
        if (err) throw err;
        //getting whole "shortcut" table
        connection_table.query(query, function(err, result){
            if (err) throw err;
            //callback !!
            //reversing to make it order by newest
            result = result.reverse();
            return callback(result);
        });
      });
    
}

//get traning table by user's id and table name
function getTreningTable(table_id, id, callback){
    //mian query - getting data from specific table
    var query = "SELECT * FROM " + table_id;
    //setting connection info
    var connection_table = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: id
      });
      //connecting to db
    connection_table.connect(function(err){
        if (err) throw err;
        //getting data
        connection_table.query(query, function(err, result, fields){
            if (err) throw err;
            result=JSON.parse(JSON.stringify(result));
            //return callback!!
            return callback(result);
        });
    });
    
}


function createTreningTable(name, id, data){
    //main query - create table
    var table_id = makeid(7);
    var query = "CREATE TABLE `" + table_id + "` ( ";
    // inserting into THIS table
    var query_insert = "INSERT INTO `" + table_id + "` VALUES ('";
    //inserting into "shortcuts" table query
    var query_insert_all = "INSERT INTO `all_tables` VALUES ('" + name + "', '" + getDate() + "', '" + table_id + "')";
    //looping through exercises' elements 
    var exercies_name = new Array();
    for(var exercise in data){
        var exercise_data = new Array();
        //checkExercisesTable(data[exercise][0]);
        query += "`" + data[exercise][0] + ":" + table_id + "` TEXT, ";
        exercies_name.push(data[exercise][0]);
        for(var packet in data[exercise]){
            if(data[exercise][packet].length == 2){
                if (packet != 0){
                    exercise_data.push([data[exercise][packet][0], data[exercise][packet][1]]);
                }
            }
            else{
                if (packet != 0){
                    exercise_data.push([data[exercise][packet][0], data[exercise][packet][1], data[exercise][packet][2]]);
                }
            }
        }
        //var exercise_data = new Array(data[exercise][1], data[exercise][2], data[exercise][3]); <- old way
        query_insert += exercise_data + "', '";
    }
    // ---------------------- finalizing sql's queries ----------------
    query = query.slice(0, -2);
    query_insert = query_insert.slice(0, -3);
    if(query_insert[query_insert.length-1] == ','){
        query_insert = query_insert.slice(0, -1);
    }
    query += " )";
    query_insert += " )";
    addToExercisesTable(exercies_name);

    // ----------------------------------------------------------------
    //setting connection info
    var connection_table = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: id
      });
      //connecting to db
      connection_table.connect(function(err){
        if (err) throw err;
        //making main table
        connection_table.query(query, function(err, result, fields){
            if (err) throw err;
        });
        // inserting inot this table
        connection_table.query(query_insert, function(err, result, fields){
            if (err) throw err;
        });
        //adding record to "shortcuts" table
        connection_table.query(query_insert_all, function(err){
            if (err) throw err;
        });
    });
}




// ----------------------------------------- EXPRESS REQUESTS ---------------------------------------

app.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname, '/index.html'));
});


app.get('/createtrainingtable', function(req, res, next){
    createTreningTable(req.query.name, id, JSON.parse(req.query.data));
});

app.post('/createtrainingtable', function(req,res){
    createTreningTable(req.body[1], id, JSON.parse(req.body[0]));
    //console.log(JSON.parse(req.body[0]));
});



app.get('/gettraningtable', function(req, res, next){
    var data = '';
    getTreningTable(req.query.id, id, function(result){
        data = result;
        res.send(data);
    });
});

app.get('/getalltrainingtables', function(req, res, next){
    var data = '';
    getTreningTables(id, function(result){
        data = result;
        res.send(data);
    });
});



app.get('/login', function(req, res, next){
    var data = '';
    var login1 = req.query.login;
    var password = req.query.password;
    login(login1, password, function(result){
        data = result;
        res.send(data);
        if(data != false)
        {
            id = data['id'];
        }
        //console.log(id);
        // ----------------------------------------------------------------------ADD THIS FUNC----------------------------------------------------------------------vvvv
    });
});


app.get('/getexercise', function(req, res){
    //console.log(req.query.name);
    sendExerciseData(req.query.name, function(result){
        idToDate(result, function(result1){
            res.send(JSON.stringify(result1));
            //res.end();
        });
    });
});

app.get('/getexercises', function(req, res){
    getExercisesTable(function(result){
        res.send(result);
    });
});

app.get('/signup', function(req, res){
    var data = '';
    var login = req.query.login;
    var password = req.query.password;
    signUp(login, password, function(result){
        data = result;
        if (data = true){
            res.send(true);
        }

    });
});



app.listen(8080, function(){
    console.log("Listening");
});


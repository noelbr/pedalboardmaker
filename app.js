var express = require('express'); 
var http = require('http');
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var app = express();
var dbPath = 'mongodb://usr_pedalboard:fox123@ds053597.mongolab.com:53597/heroku_app26768863';
var fs = require('fs');

var mongoose = require('mongoose');
var config = {
	mail: require('./config/mail')
};

var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer),
  Marca: require('./models/Marca')( mongoose),
  Categoria: require('./models/Categoria')( mongoose),
  Equipamento: require('./models/Equipamento')( mongoose),
  Pedalboard: require('./models/Pedalboard')( mongoose)
};

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "Pedalboard secret key",
    store: new MemoryStore()
  }));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)(app, models);
});

app.get('/', function(req, res){
  res.render('index.html');
});
 
app.post('/api/photos', function(req, res) {

    var serverPath = 'img/' + req.files.userPhoto.name;

    require('fs').rename(
        req.files.userPhoto.path,
        '/Users/noel/Documents/Projetos/PedalBoardMaker/dev/public/' + serverPath,
        function(error) {

            res.contentType('text/plain');

            if(error) {
                res.send(JSON.stringify({
                    error: 'Ah crap! Something bad happened'
                }));
                return;
            }
            
            res.send(JSON.stringify({
                path: serverPath
            }));
        }
    );
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
 	
let express = require("express");
let app = express();
// require('./routes.js')(app);

app.set("view engine", "ejs");
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/views'));

let server = app.listen(app.get('port'));

var socket = require('socket.io');

let data = require('./training_data/tData');
var Classifier = require('wink-naive-bayes-text-classifier');
var nbc = Classifier();
var nlp = require('wink-nlp-utils');
nbc.definePrepTasks([
  nlp.string.tokenize0,
  nlp.tokens.removeWords,
  nlp.tokens.stem
]);

nbc.defineConfig({
  considerOnlyPresence: true,
  smoothingFactor: 0.5
});

for (let i = 0; i < data.length; i++) {
  nbc.learn(data[i].input, data[i].output);
}

nbc.consolidate();
// console.log(nbc.computeOdds('I go to my sister today'));

app.get("/", function (req, res) {
  res.render("index", {
    content: "Hello world"
  });
});

var io = socket(server);
io.on('connection', function (socket) {
  console.log("connected");
  socket.on('text', function (data) {
    socket.emit("textStyle", {
      styleText: nbc.computeOdds(data.text)
    })
  });
});
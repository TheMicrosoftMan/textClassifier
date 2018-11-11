let express = require("express");
let app = express();
// require('./routes.js')(app);

app.set("view engine", "ejs");
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/views'));

let server = app.listen(app.get('port'));

var socket = require('socket.io');

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

let data = require('./training_data/tData').concat(require('./training_data/artistic_style'), require('./training_data/artistic_style'), require('./training_data/official_business_style'), require('./training_data/news_style'));

for (let i = 0; i < data.length; i++) {
  nbc.learn(data[i].input, data[i].output);
}

nbc.consolidate();

app.get("/", function (req, res) {
  res.render("index", {
    content: "Kurs work"
  });
});

var io = socket(server);
io.on('connection', function (socket) {
  console.log("connected");
  socket.on('text', function (data) {
    let style = nbc.computeOdds(data.text);
    console.log("Text:\n" + data.text + "\nStyle:\n" + style);
    socket.emit("textStyle", {
      styleText: style
    })
  });
});
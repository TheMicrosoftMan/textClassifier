let express = require("express");
let app = express();
// require('./routes.js')(app);

app.set("view engine", "ejs");
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/views'));

let server = app.listen(app.get('port'));

var socket = require('socket.io');

var Classifier = require('./wink-naive-bayes-text-classifier');
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

let data = require('./training_data/ukrData').concat(require('./training_data/urk_conversational_style')).concat(require('./training_data/ukr_artistic_style')).concat(require('./training_data/ukr_science_style')).concat(require('./training_data/urk_official_business_style')).concat(require('./training_data/ukr_journalistic_style'));

for (let i = 0; i < data.length; i++) {
  nbc.learn(data[i].input, data[i].output);
}

console.log("Ready");

nbc.consolidate();

app.get("/", function (req, res) {
  res.render("index", {
    content: "Класифікація текстів за стилем написання"
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
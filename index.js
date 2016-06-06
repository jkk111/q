var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var routes;

try {
  routes = JSON.parse(fs.readFileSync("routes.json", "utf8"));
} catch(e) {
  routes = {};
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/*", function(req, res) {
  var pieces = req.path.substring(1).split("/");
  var route = pieces.shift();
  if(!routes[route]) return res.redirect("/");
  res.redirect(routes[route]);
});

app.post("/exists", function(req, res) {
  res.send({exists: routes[req.body.key] !== undefined});
});

app.post("/add", function(req, res) {
  var url = req.body.url;
  var key = req.body.key;
  if(!key || !url || routes[key]) return res.send({success: false});
  routes[key] = url;
  fs.writeFileSync("routes.json", JSON.stringify(routes, null, "  "), "utf8");
  res.send({success: true});
});

module.exports = app;

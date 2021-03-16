const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/nbaDB", {useNewUrlParser: true});

const teamSchema = {
  name: String,
  seasons: Number,
  championships: Number
}

const Team = mongoose.model("Team", teamSchema);

// ALL TEAMS
app.route("/teams")

.get(function(req, res){

  Team.find(function(err, results){

    if (err){
      res.send(err);
    }else{
      res.send(results);
    }
  });
})
.post(function(req, res){

  const teamName = req.body.name;
  const teamSeasons = req.body.seasons;
  const teamChampionships = req.body.championships;

  const newTeam = new Team ({

    name: teamName,
    seasons: teamSeasons,
    championships: teamChampionships
  });
  newTeam.save(function(err){
    if (err){
      res.send(err);
    }else{
      res.send("Successful POST");
    }
  });
})
.delete(function(req, res){

  Team.deleteMany(function(err){
    if (err){
      res.send(err);
    }else{
      res.send("Successfully deleted all items");
    }
  });
});

//SPECIFIC TEAM
app.route("/teams/:teamName")

.get(function(req, res){
  Team.findOne({name: req.params.teamName}, function(err, result){
    if (result){
      res.send(result);
    }else{
      res.send("No team with that name!");
    }
  });
})

.put(function(req, res){

  Team.update(
    {name: req.params.teamName},
  {name: req.body.name, seasons: req.body.seasons, championships: req.body.championships},
  {overwrite: true},
  function(err){
    if (err){
      res.send(err);
    }else{
      res.send("Successful PUT");
    }
  });
})

.patch(function(req, res){

  Team.update(
    {name: req.params.teamName},
  {$set: req.body},
  function(err){
    if (err){
      res.send(err);
    }else{
      res.send("Successful PATCH");
    }
  });
})

.delete(function(req, res){

  Team.deleteOne({name: req.params.teamName}, function(err){
    if (err){
      res.send(err);
    }else{
      res.send("Successful DELETE");
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

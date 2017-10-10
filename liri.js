var keys = require("./keys.js");
var spotify = require("spotify");
var twitter = require("twitter");
// var tmdb = require("tmdb").init({apikey:"798d16e44bf2357493e013567298dcd5"});
// var TmdbApi = require("tmdb-api");
var request = require("request");
var fs = require("fs");


// console.log(twitterKeys);

var nodeArgs = process.argv;
var query = [];
// var action = process.argv.slice(2);

for (var i = 2; i < nodeArgs.length; i++){

  query.push(nodeArgs[i]);

}

var argOne = query.splice(0,1);
var argTwo = query.join(" ");
var action = String(argOne);
var value = String(argTwo);

console.log("Searching for " +  value);
console.log("What command? " + action);


switch (action){
  case "my-tweets":
  myTweets();
  logAction();
  break;

  case "spotify-this-song":
  spotifyThisSong();
  logAction();
  break;

  case "movie-this":
  movieThis();
  logAction();
  break;

  case "do-what-it-says":
  doThis();
  logAction();
  break;

}

//Functions

//Commands for Liri to take in...
// * `my-tweets`
function myTweets(){

var twitterKeys = keys.twitterKeys;

var client = new twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

var params = {screen_name: "jhockey195", count:20};

client.get("statuses/user_timeline", params, function(error, tweets, response) {
  if (error) {
    console.log(error);
  }

  for(var i = 0; i < tweets.length; i++){
    console.log("************");
    console.log(tweets[i].text);
    console.log("************");
  }

});
}

// * `spotify-this-song`
function spotifyThisSong (){

  spotify.search({
    type:"track",
    query: value}, function(err, data){

      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
  // * if no song is provided then your program will default to
  //   * "The Sign" by Ace of Base
  if(value === ""){
      console.log("************");
      console.log("Artist: Ace of Base");
      console.log("Song: The Sign");
      console.log("Song Link: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
      console.log("Album: The Sign");
      console.log("************");
  }
  else{

  for (i = 0; i < 5; i++){

      var results = data.tracks.items[i];

      var artist = results.artists[0].name;
      var songName = results.name;
      var songLink = results.external_urls.spotify;
      var album = results.album.name;

      //Need: artist(s), song's name, preview link of song, album//
      console.log("************");
      console.log("Artist: " + artist);
      console.log("Song: " + songName);
      console.log("Song Link: " + songLink);
      console.log("Album: " + album);
      console.log("************");
    }
}

});

}

// * `movie-this`
function movieThis(){

  var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=798d16e44bf2357493e013567298dcd5&query=" + value;

request(queryURL, function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (error) {
    console.log("Error occurred: " + error);
    return;
  }

  if(value === ""){

    console.log("************");
    console.log("Movie Name: Mr.Nobody");
    console.log("Release Date: 2009-09-11");
    console.log("Synopsis: Nemo Nobody leads an ordinary existence with his wife and 3 children; one day, he wakes up as a mortal centenarian in the year 2092.");
    console.log("Average Vote: 7.9");
    console.log("Language: en");
    console.log("************");

  }

  else{
    console.log("************");
    console.log("Movie Name: " + JSON.parse(body).results[0].title);
    console.log("Release Date: " + JSON.parse(body).results[0].release_date);
    console.log("Synopsis: " + JSON.parse(body).results[0].overview);
    console.log("Average Vote: " + JSON.parse(body).results[0].vote_average);
    console.log("Language: " + JSON.parse(body).results[0].original_language);
    console.log("************");
}
});

}

// * `do-what-it-says`
function doThis(){

// Feel free to change the text in that document to test out the feature for other commands.
fs.readFile("random.txt", "utf8", function(error,data){

  var content = data.split(",");

  // var array = data.toString().split("\n");
  // console.log(array);

  action = content[0];
  value = content[1];

  switch (action){
  case "my-tweets":
  myTweets();
  break;

  case "spotify-this-song":
  spotifyThisSong();
  break;

  case "movie-this":
  movieThis();
  break;

  case "do-what-it-says":
  doThis();
  break;

}

});

}

function logAction (){

  var logItem = "\nSearch String:" + action + "," + value;
  console.log(logItem);

  fs.appendFile("log.txt",logItem, function(err){

    if (err) {
    console.log(err);
  }

  else {
    console.log("Content Added!");
  }

});
}
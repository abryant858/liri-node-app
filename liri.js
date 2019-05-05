require("dotenv").config();
// Load the fs package to read and write
var fs = require('fs');
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// Grab search command line argument
var search = process.argv[2];

var ArtistInfo = function() {

    this.artistSearch = function(artist) {
        var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        axios.get(URL).then(function(response) {
            var jsonData = response.data;
            //console.log(jsonData)

            for (var i = 0; i < jsonData.length; i++) {
                var artistData = [
                    "Name of the venue: " + jsonData[i].venue.name,
                    "Venue location: " + jsonData[i].venue.city,
                    //"Date of the Event: " + jsonData[i].venue.datetime
                ].join("\n\n");
                console.log(artistData)
            }
        })
    }
}

var artistInfo =  new ArtistInfo();

// Joining the remaining arguments since an artist name may contain spaces
var artist = process.argv.slice(3).join(" ");

var MovieInfo = function() {

    this.movieSearch = function(movieName) {
        var URL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        axios.get(URL).then(function(response) {
            var jsonData = response.data;
            //console.log(jsonData)

            var movieData = [
                "Name of Movie: " + jsonData.Title,
                "Year the movie came out: " + jsonData.Year,
                "IMDB Rating of the movie: " + jsonData.imdbRating,
                "Rotten Tomatoes Rating of the movie" + jsonData.Ratings[1].Value,
                "Country where the movie was produced" + jsonData.Country,
                "Language of the movie" + jsonData.Language,
                "Plot of the movie" + jsonData.Plot,
                "Actors in the movie" + jsonData.Actors
            ].join("\n\n");
            console.log(movieData)
        })
    }
}

var movieInfo = new MovieInfo();
var movieName = process.argv.slice(3).join(" ");

var Spotifys = function() {

    this.songSearch = function(songName) {
        if(!songName){
            spotify.search({ type: 'track', query: 'The Sign'}).then(function(response) {
                var spotifyData = response.tracks.items[9]
                //console.log(response); 
    
                var songData = [
                    "Artist(s): " + spotifyData.album.artists[0].name,
                    "The song's name: " + spotifyData.name,
                    "A preview link of the song from Spotify: " + spotifyData.preview_url,
                    "The album that the song is from:" + spotifyData.album.name
                ].join("\n\n");
                console.log(songData)
    
            })
        } else {
            spotify.search({ type: 'track', query: songName}).then(function(response) {
                var spotifyData = response.tracks.items[0]
                //console.log(response); 

                var songData = [
                    "Artist(s): " + spotifyData.album.artists[0].name,
                    "The song's name: " + spotifyData.name,
                    "A preview link of the song from Spotify: " + spotifyData.preview_url,
                    "The album that the song is from:" + spotifyData.album.name
                ].join("\n\n");
                console.log(songData)

            })
        }
    }
}
var spotifys = new Spotifys();
var songName = process.argv.slice(3).join(" ");

function total() {

    // We will read the existing random file
    fs.readFile("random.txt", "utf8", function(error, data) {
        
        if (error) {
            return console.log(error);
          }
        var dataArr = data.split(",");
        console.log(dataArr);
        var search = dataArr[0]
        var songName = dataArr[1]
        console.log(search)
        console.log(songName)   
        
        if (search === "spotify-this-song") {
            console.log("Searching for Song");
            spotifys.songSearch(songName);
        } 
    });
}

// By default, if no search type is provided, try again
if (!search) {
    console.log("Try Again")
}

if (search === "concert-this") {
    console.log("Searching for Concert");
    artistInfo.artistSearch(artist);
} 
if (search === "movie-this" && !movieName) {
    console.log("Searching for Movie");
    movieInfo.movieSearch('Mr. Nobody');
    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/")
    console.log('Its on Netflix!')
} else if (search === "movie-this") {
    console.log("Searching for Movie");
    movieInfo.movieSearch(movieName);
} 
if (search === "spotify-this-song") {
    console.log("Searching for Song");
    spotifys.songSearch(songName);
} 
if (search === "do-what-it-says") {
    console.log("Just do it")
    total()
}



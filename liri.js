/*LIRI is like iPhone's SIRI. 
However, while SIRI is a Speech Interpretation and Recognition Interface, 
LIRI is a Language Interpretation and Recognition Interface. 
LIRI will be a command line node app that takes in parameters and gives you back data.
*/

//get the request package
var request = require("request");

//get the file system package
var fs = require("fs");

//get the twitter package
var Twitter = require("twitter");
//inport the keys.js file
var keys = require("./keys.js");

//get the spotify package
var spotify = require("spotify");


//----------------------------------//
//Command Line Inputs
//get the choice from the command line
var choice = process.argv[2];

//get the input value
var inputValue = [];
	for(var i=3; i<process.argv.length; i++){
		inputValue.push(process.argv[i]);
	}
	// console.log(inputValue);
//----------------------------------//



//----------------------------------//
//use switch case for the options entered
switch(choice){
	case "my-tweets": 
			myTweets();
		break;

	case "spotify-this-song": 
		var trackName = inputValue;
		// console.log(movieName);

		if(trackName === undefined || trackName.length === 0){
			console.log("----------------------------");
			console.log("You did not enter any artist name");
			console.log("So giving you the result of The Sign by Ace of Base")
			console.log("----------------------------");
			trackName = "The Sign";
			spotifyThisSong(trackName);
		}
		else{
			trackName = trackName;
			spotifyThisSong(trackName);
		}
		break;

	case "movie-this": 		
		var movieName = inputValue;
		// console.log(movieName);

		if(movieName === undefined || movieName.length === 0){
			console.log("----------------------------");
			console.log("You did not enter any movie name");
			console.log("So giving you the output for Mr Nobody movie");
			console.log("----------------------------");

			movieName = "Mr Nobody";
			movieThis(movieName);
		}
		else{
			movieName = movieName;
			movieThis(movieName);

		}
		break;

	case "do-what-it-says": 
			doWhatItSays();
		break;
}
//----------------------------------//


//----------------------------------//
//function for the tweets
function myTweets(){
	var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
  		consumer_secret: keys.twitterKeys.consumer_secret,
 		access_token_key: keys.twitterKeys.access_token_key,
 		access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = { screen_name: "AparnaTS", count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		//Log the Tweets into log.txt
		log(tweets);
		if(!error){
			// console.log(tweets);
			for(var i =0; i< params.count; i++){
	    		console.log("----------------------------");
				console.log(i+1 + ") You Tweeted - "+ tweets[i].text);
				console.log("Date:" + tweets[i].created_at);
	    		console.log("----------------------------");
			}
		}
		else{
			console.log("Error cant display the tweets" + error);
			return;
		}
	});

}
//----------------------------------//


//----------------------------------//
//function for the spotify api 
function spotifyThisSong(trackName){
	spotify.search({ type: "track", query: trackName}, function(error, data){
		//Log the spotify data into log.txt
		log(data);
		if(!error){
			// console.log(data);
	    	console.log("----------------------------");
	    	console.log("The Artist of the Track: " + data.tracks.items[0].artists[0].name);
	    	console.log("The Name of the Track:" + data.tracks.items[0].name);
	    	console.log("The Link of the Track:" + data.tracks.items[0].preview_url);
	    	console.log("The Album that the track is from:" + data.tracks.items[0].album.name);
	    	console.log("----------------------------");
		}
		else{
			console.log("Error occured:" + error);
			return;
		}

	});

}
//----------------------------------//


//----------------------------------//
//function for the omdb api
function movieThis(movieName){
	// Then run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=" +movieName+  "&y=&plot=short&r=json", function(error, response, body) {

  	// If the request is successful (i.e. if the response status code is 200)
  	if (!error && response.statusCode === 200) {
    	// console.log(body);
    	var data = JSON.parse(body);
		//Log the Movie data into log.txt
    	log(data);
    	//Check if the movie is found in the Database. If found display the result
    	if(data.Response == "True"){
	    	console.log("----------------------------");
	    	console.log("The Title of the Movie: " + data.Title);
	    	console.log("The Year released: " + data.Released);
	    	console.log("The Movie's IMDB rating: " + data.imdbRating);
	    	console.log("The Country where the Movie was produce: " + data.Country);
	    	console.log("The Language of the Movie: " + data.Language);
	    	console.log("The Plot of the Movie is: " + data.Plot);
	    	console.log("The Actors are: " + data.Actors);

	    	//check if the particular movie has a rotten tomato rating
	    	var ratings = [];
	    	ratings = data.Ratings;
	    	if(ratings!== undefined && ratings.length !== 0){
	    		console.log("The Rotten Tomatoes Rating: " + data.Ratings[1].Value);
	    	}
	    	else{
	    		console.log("The Rotten Tomatoes Rating cant be found");
	    	}

	    	//check if the movie has an URL associated with it
	    	var websiteURL = data.Website;
	    	if(websiteURL !== undefined){
	    		console.log("The Movie URL: " + data.Website);
	    	}
	    	else{
	    		console.log("The Movie URL cant be found");

	    	}

	    	console.log("-----------------------------");
	    }
	    //else print that the movie cant be found in the Database
	    else{
	    	console.log("----------------------------");
	    	console.log("Movie cant be found in OMDB Database");
	    	console.log("----------------------------");	
	    	return;
	    }
  	}

  	//If the request results in Error
  	else{
  		console.log("Error cannot display the result" + error);
  		return;
  	}
  	
	});
}
//----------------------------------//


//----------------------------------//
//function for the do what it says
function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data){
		//Log the Tweets into log.txt
		log(data);

		var dataArr = data.split(",");
		var functionName = dataArr[0];
		var argName = dataArr[1];

		choice = functionName;
	

	});
}
//----------------------------------//

function log(logData){
	fs.appendFile("log.txt", JSON.stringify(logData, null, 2), function(error){
		if(error){
			console.log(error);
		}
		else{
			console.log("Data logged in log file");
		}
	});
}


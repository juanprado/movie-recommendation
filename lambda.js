'use strict';

var http = require('http');

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
 
// --------------- SAMPLE MOVIE VAR -----------------------

var unsortedMovies =  [
    {
      "adult": false,
      "backdrop_path": "/o29BFNqgXOUT1yHNYusnITsH7P9.jpg",
      "genre_ids": [
        35,
        16,
        12,
        10751,
        878
      ],
      "id": 278154,
      "original_language": "en",
      "original_title": "Ice Age: Collision Course",
      "overview": "Set after the events of Continental Drift, Scrat's epic pursuit of his elusive acorn catapults him outside of Earth, where he accidentally sets off a series of cosmic events that transform and threaten the planet. To save themselves from peril, Manny, Sid, Diego, and the rest of the herd leave their home and embark on a quest full of thrills and spills, highs and lows, laughter and adventure while traveling to exotic new lands and encountering a host of colorful new characters.",
      "release_date": "2016-06-23",
      "poster_path": "/dN3KkgXcDkP1QkOZPz5EGXzS8B7.jpg",
      "popularity": 12.18325,
      "title": "Ice Age: Collision Course",
      "video": false,
      "vote_average": 5.2,
      "vote_count": 375
    },
    {
      "adult": false,
      "backdrop_path": "/nX64YARJo4OugPTSVuvFwZzcqM4.jpg",
      "genre_ids": [
        28,
        35
      ],
      "id": 302699,
      "original_language": "en",
      "original_title": "Central Intelligence",
      "overview": "After he reunites with an old pal through Facebook, a mild-mannered accountant is lured into the world of international espionage.",
      "release_date": "2016-06-15",
      "poster_path": "/9M5ibpQUjoVFjjnP2AdLcof4hAk.jpg",
      "popularity": 12.111041,
      "title": "Central Intelligence",
      "video": false,
      "vote_average": 6.1,
      "vote_count": 651
    },
    {
      "adult": false,
      "backdrop_path": "/lbtG9MTb8i13KhXuyl3bmnqt7Lt.jpg",
      "genre_ids": [
        28,
        35,
        14
      ],
      "id": 43074,
      "original_language": "en",
      "original_title": "Ghostbusters",
      "overview": "Following a ghost invasion of Manhattan, paranormal enthusiasts Erin Gilbert and Abby Yates, nuclear engineer Jillian Holtzmann, and subway worker Patty Tolan band together to stop the otherworldly threat.",
      "release_date": "2016-07-14",
      "poster_path": "/4qnJ1hsMADxzwnOmnwjZTNp0rKT.jpg",
      "popularity": 11.864884,
      "title": "Ghostbusters",
      "video": false,
      "vote_average": 5.3,
      "vote_count": 695
    },
    {
      "adult": false,
      "backdrop_path": "/nbIrDhOtUpdD9HKDBRy02a8VhpV.jpg",
      "genre_ids": [
        28,
        12,
        35,
        10749
      ],
      "id": 293660,
      "original_language": "en",
      "original_title": "Deadpool",
      "overview": "Based upon Marvel Comics’ most unconventional anti-hero, DEADPOOL tells the origin story of former Special Forces operative turned mercenary Wade Wilson, who after being subjected to a rogue experiment that leaves him with accelerated healing powers, adopts the alter ego Deadpool. Armed with his new abilities and a dark, twisted sense of humor, Deadpool hunts down the man who nearly destroyed his life.",
      "release_date": "2016-02-09",
      "poster_path": "/inVq3FRqcYIRl2la8iZikYYxFNR.jpg",
      "popularity": 10.188853,
      "title": "Deadpool",
      "video": false,
      "vote_average": 7.2,
      "vote_count": 5211
    },
    {
      "adult": false,
      "backdrop_path": "/OqCXGt5nl1cHPeotxCDvXLLe6p.jpg",
      "genre_ids": [
        878,
        28,
        12,
        14,
        35
      ],
      "id": 98566,
      "original_language": "en",
      "original_title": "Teenage Mutant Ninja Turtles",
      "overview": "The city needs heroes. Darkness has settled over New York City as Shredder and his evil Foot Clan have an iron grip on everything from the police to the politicians. The future is grim until four unlikely outcast brothers rise from the sewers and discover their destiny as Teenage Mutant Ninja Turtles. The Turtles must work with fearless reporter April and her wise-cracking cameraman Vern Fenwick to save the city and unravel Shredder's diabolical plan.",
      "release_date": "2014-08-07",
      "poster_path": "/oDL2ryJ0sV2bmjgshVgJb3qzvwp.jpg",
      "popularity": 9.972096,
      "title": "Teenage Mutant Ninja Turtles",
      "video": false,
      "vote_average": 5.8,
      "vote_count": 1705
    },
    {
      "adult": false,
      "backdrop_path": "/uX7LXnsC7bZJZjn048UCOwkPXWJ.jpg",
      "genre_ids": [
        10751,
        16,
        12,
        35
      ],
      "id": 211672,
      "original_language": "en",
      "original_title": "Minions",
      "overview": "Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill, a super-villain who, alongside her inventor husband Herb, hatches a plot to take over the world.",
      "release_date": "2015-06-17",
      "poster_path": "/q0R4crx2SehcEEQEkYObktdeFy.jpg",
      "popularity": 8.898883,
      "title": "Minions",
      "video": false,
      "vote_average": 6.5,
      "vote_count": 2720
    },
    {
      "adult": false,
      "backdrop_path": "/2BXd0t9JdVqCp9sKf6kzMkr7QjB.jpg",
      "genre_ids": [
        12,
        10751,
        16,
        28,
        35
      ],
      "id": 177572,
      "original_language": "en",
      "original_title": "Big Hero 6",
      "overview": "The special bond that develops between plus-sized inflatable robot Baymax, and prodigy Hiro Hamada, who team up with a group of friends to form a band of high-tech heroes.",
      "release_date": "2014-10-22",
      "poster_path": "/hGRfWcy1HRGbsjK6jF7NILmqmFT.jpg",
      "popularity": 8.690327,
      "title": "Big Hero 6",
      "video": false,
      "vote_average": 7.8,
      "vote_count": 3869
    },
    {
      "adult": false,
      "backdrop_path": "/mhdeE1yShHTaDbJVdWyTlzFvNkr.jpg",
      "genre_ids": [
        16,
        12,
        10751,
        35
      ],
      "id": 269149,
      "original_language": "en",
      "original_title": "Zootopia",
      "overview": "Determined to prove herself, Officer Judy Hopps, the first bunny on Zootopia's police force, jumps at the chance to crack her first case - even if it means partnering with scam-artist fox Nick Wilde to solve the mystery.",
      "release_date": "2016-02-11",
      "poster_path": "/sM33SANp9z6rXW8Itn7NnG1GOEs.jpg",
      "popularity": 8.306808,
      "title": "Zootopia",
      "video": false,
      "vote_average": 7.4,
      "vote_count": 1974
    },
    {
      "adult": false,
      "backdrop_path": "/999RuhZvog8ocyvcccVV9yGmMjL.jpg",
      "genre_ids": [
        28,
        12,
        35,
        878
      ],
      "id": 308531,
      "original_language": "en",
      "original_title": "Teenage Mutant Ninja Turtles: Out of the Shadows",
      "overview": "After supervillain Shredder escapes custody, he joins forces with mad scientist Baxter Stockman and two dimwitted henchmen, Bebop and Rocksteady, to unleash a diabolical plan to take over the world. As the Turtles prepare to take on Shredder and his new crew, they find themselves facing an even greater evil with similar intentions: the notorious Krang.",
      "release_date": "2016-06-01",
      "poster_path": "/5BCpxPLyp4wGcTribpZ6WtNkVJ5.jpg",
      "popularity": 7.931325,
      "title": "Teenage Mutant Ninja Turtles: Out of the Shadows",
      "video": false,
      "vote_average": 5.6,
      "vote_count": 392
    },
    {
      "adult": false,
      "backdrop_path": "/a7eSkK4bkLwKCXYDdYIqLxrqT2n.jpg",
      "genre_ids": [
        28,
        35,
        80,
        9648,
        53
      ],
      "id": 290250,
      "original_language": "en",
      "original_title": "The Nice Guys",
      "overview": "A private eye investigates the apparent suicide of a fading porn star in 1970s Los Angeles and uncovers a conspiracy.",
      "release_date": "2016-05-15",
      "poster_path": "/pbJ1vNwK9X6ZQm2vxarxcLJ0aGn.jpg",
      "popularity": 7.579003,
      "title": "The Nice Guys",
      "video": false,
      "vote_average": 6.8,
      "vote_count": 744
    },
    {
      "adult": false,
      "backdrop_path": "/zrAO2OOa6s6dQMQ7zsUbDyIBrAP.jpg",
      "genre_ids": [
        28,
        12,
        35,
        80,
        9648,
        53
      ],
      "id": 291805,
      "original_language": "en",
      "original_title": "Now You See Me 2",
      "overview": "One year after outwitting the FBI and winning the public’s adulation with their mind-bending spectacles, the Four Horsemen resurface only to find themselves face to face with a new enemy who enlists them to pull off their most dangerous heist yet.",
      "release_date": "2016-06-02",
      "poster_path": "/hU0E130tsGdsYa4K9lc3Xrn5Wyt.jpg",
      "popularity": 7.318157,
      "title": "Now You See Me 2",
      "video": false,
      "vote_average": 6.6,
      "vote_count": 1073
    },
    {
      "adult": false,
      "backdrop_path": "/hUDEHvhNJLNcb83Pp7xnFn0Wj09.jpg",
      "genre_ids": [
        18,
        35
      ],
      "id": 194662,
      "original_language": "en",
      "original_title": "Birdman",
      "overview": "A fading actor best known for his portrayal of a popular superhero attempts to mount a comeback by appearing in a Broadway play. As opening night approaches, his attempts to become more altruistic, rebuild his career, and reconnect with friends and family prove more difficult than expected.",
      "release_date": "2014-10-17",
      "poster_path": "/rSZs93P0LLxqlVEbI001UKoeCQC.jpg",
      "popularity": 6.903124,
      "title": "Birdman",
      "video": false,
      "vote_average": 7.3,
      "vote_count": 2581
    },
    {
      "adult": false,
      "backdrop_path": "/pDuD96Fz0ZZXf9buEvRu1UQsmFT.jpg",
      "genre_ids": [
        12,
        16,
        35,
        10751,
        14
      ],
      "id": 105864,
      "original_language": "en",
      "original_title": "The Good Dinosaur",
      "overview": "An epic journey into the world of dinosaurs where an Apatosaurus named Arlo makes an unlikely human friend.",
      "release_date": "2015-11-14",
      "poster_path": "/2ZckiMTfSkCep2JTtZbr73tnQbN.jpg",
      "popularity": 6.662948,
      "title": "The Good Dinosaur",
      "video": false,
      "vote_average": 6.5,
      "vote_count": 949
    },
    {
      "adult": false,
      "backdrop_path": "/eHWmEUP4fa7h1Fe7TXfTL7ncDl8.jpg",
      "genre_ids": [
        28,
        12,
        16,
        35,
        10751
      ],
      "id": 140300,
      "original_language": "en",
      "original_title": "Kung Fu Panda 3",
      "overview": "Continuing his \"legendary adventures of awesomeness\", Po must face two hugely epic, but different threats: one supernatural and the other a little closer to his home.",
      "release_date": "2016-01-23",
      "poster_path": "/MZFPacfKzgisnPoJIPEFZUXBBT.jpg",
      "popularity": 6.660527,
      "title": "Kung Fu Panda 3",
      "video": false,
      "vote_average": 6.5,
      "vote_count": 843
    },
    {
      "adult": false,
      "backdrop_path": "/up1Fn4u0EvgeWbQuRDVzOrIy2oP.jpg",
      "genre_ids": [
        12,
        16,
        35,
        10751
      ],
      "id": 328111,
      "original_language": "en",
      "original_title": "The Secret Life of Pets",
      "overview": "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes.",
      "release_date": "2016-06-24",
      "poster_path": "/WLQN5aiQG8wc9SeKwixW7pAR8K.jpg",
      "popularity": 6.436691,
      "title": "The Secret Life of Pets",
      "video": false,
      "vote_average": 5.9,
      "vote_count": 877
    },
    {
      "adult": false,
      "backdrop_path": "/u81y11sFzOIHdduSrrajeHOaCbU.jpg",
      "genre_ids": [
        35,
        10749
      ],
      "id": 95610,
      "original_language": "en",
      "original_title": "Bridget Jones's Baby",
      "overview": "Breaking up with Mark Darcy leaves Bridget Jones over 40 and single again. Feeling that she has everything under control, Jones decides to focus on her career as a top news producer. Suddenly, her love life comes back from the dead when she meets a dashing and handsome American named Jack. Things couldn't be better, until Bridget discovers that she is pregnant. Now, the befuddled mom-to-be must figure out if the proud papa is Mark or Jack.",
      "release_date": "2016-09-15",
      "poster_path": "/j8di6S3mUuFe5Yz8etRG8yG5EeE.jpg",
      "popularity": 6.423265,
      "title": "Bridget Jones's Baby",
      "video": false,
      "vote_average": 6.3,
      "vote_count": 148
    },
    {
      "adult": false,
      "backdrop_path": "/ctOEhQiFIHWkiaYp7b0ibSTe5IL.jpg",
      "genre_ids": [
        35,
        18,
        10749
      ],
      "id": 13,
      "original_language": "en",
      "original_title": "Forrest Gump",
      "overview": "A man with a low IQ has accomplished great things in his life and been present during significant historic events - in each case, far exceeding what anyone imagined he could do. Yet, despite all the things he has attained, his one true love eludes him. 'Forrest Gump' is the story of a man who rose above his challenges, and who proved that determination, courage, and love are more important than ability.",
      "release_date": "1994-07-06",
      "poster_path": "/z4ROnCrL77ZMzT0MsNXY5j25wS2.jpg",
      "popularity": 6.272995,
      "title": "Forrest Gump",
      "video": false,
      "vote_average": 8,
      "vote_count": 4436
    },
    {
      "adult": false,
      "backdrop_path": "/hzp6irYITiJc5JUA1GZhmbE10pD.jpg",
      "genre_ids": [
        18,
        35
      ],
      "id": 334533,
      "original_language": "en",
      "original_title": "Captain Fantastic",
      "overview": "A father living in the forests of the Pacific Northwest with his six young kids tries to assimilate back into society.",
      "release_date": "2016-07-02",
      "poster_path": "/fnaGmGCWgGOQjCpM0TqKPZJ5x85.jpg",
      "popularity": 6.225064,
      "title": "Captain Fantastic",
      "video": false,
      "vote_average": 7.3,
      "vote_count": 69
    },
    {
      "adult": false,
      "backdrop_path": "/iWRKYHTFlsrxQtfQqFOQyceL83P.jpg",
      "genre_ids": [
        12,
        16,
        35
      ],
      "id": 127380,
      "original_language": "en",
      "original_title": "Finding Dory",
      "overview": "\"Finding Dory\" reunites Dory with friends Nemo and Marlin on a search for answers about her past. What can she remember? Who are her parents? And where did she learn to speak Whale?",
      "release_date": "2016-06-16",
      "poster_path": "/z09QAf8WbZncbitewNk6lKYMZsh.jpg",
      "popularity": 6.16522,
      "title": "Finding Dory",
      "video": false,
      "vote_average": 6.7,
      "vote_count": 1042
    },
    {
      "adult": false,
      "backdrop_path": "/rP36Rx5RQh0rmH2ynEIaG8DxbV2.jpg",
      "genre_ids": [
        80,
        18,
        35
      ],
      "id": 106646,
      "original_language": "en",
      "original_title": "The Wolf of Wall Street",
      "overview": "A New York stockbroker refuses to cooperate in a large securities fraud case involving corruption on Wall Street, corporate banking world and mob infiltration. Based on Jordan Belfort's autobiography.",
      "release_date": "2013-12-25",
      "poster_path": "/vK1o5rZGqxyovfIhZyMELhk03wO.jpg",
      "popularity": 6.15476,
      "title": "The Wolf of Wall Street",
      "video": false,
      "vote_average": 7.9,
      "vote_count": 3697
    }
  ];

var noList = [];

var maybeList = [];

var API_URL = 'http://api.themoviedb.org/3/';

var API_KEY = '6bb87fb98375ab63c66f861383a89cb3';


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to movie recommender. ' +
        'What genre of movie would you like to watch';
    
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me what genre would you like to watch, ' +
        'I would like to watch a comedy';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Movie Recommender. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the genre
 */
function setGenreInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const genreSlot = intent.slots.Genre;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
    
    if (genreSlot) {
        const genre = genreSlot.value;
        const selectedMovie = unsortedMovies[0];
        // let selectedMovie;
        // unsortedMovies = getGenreMovies(genre)[0];
        // selectedMovie = unsortedMovies[0];
        
        sessionAttributes.genre = genre;
        speechOutput = "The first recommendation is " + selectedMovie.title + '. would you like to watch this movie. Yes or No?';
        repromptText = speechOutput;

        callback(sessionAttributes,
          buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function getGenreMovies(genre) {
    var list;
    genre = genre.toLowerCase().split(' ') .map(i => i[0].toUpperCase() + i.substring(1)).join(' ');

    http.get(API_URL + '/genre/movie/list?api_key=' + API_KEY, function (response) {
      console.log(response.body)
      var genre_id = response.genres.filter(function(obj) { return obj.name == genre; });
      genre_id = genre_id[0];

      http.get(API_URL + '/discover/movie?sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_genres=' + genre_id + '&api_key' + API_KEY, function(response){
          list = response.results;
        //   context.done(null);
      }).on('error', function(err) {
          list = null;
        //   context.done("Failed");
      })

    //   context.done(null);
    }).on('error', function (err) {
      console.log('Error, with: ' + err.message);
    //   context.done("Failed");
    });

    return list;
}

/**
 * Get the new recommendation
 */
function getNewRecommendation(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
    let selectedMovie;
    
    noList.push(unsortedMovies[0].id);
    unsortedMovies.shift();
    selectedMovie = unsortedMovies[0];
    speechOutput = "Ok, we won't show you that again, the next recommendation is " + selectedMovie.title + '. would you like to watch this movie. Yes or No?';
    repromptText = speechOutput;
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Save for Later
 */
function saveForLater(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
    let selectedMovie;
    
    maybeList.push(unsortedMovies[0].id);
    unsortedMovies.splice(5, 0, unsortedMovies[0]);
    unsortedMovies.shift();
    selectedMovie = unsortedMovies[0];
    speechOutput = "Saving that one for later, the next recommendation is " + selectedMovie.title + '. would you like to watch this movie. Yes or No?';
    repromptText = speechOutput;
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getMovieRecommendations(intent, session, callback){
    const movie = intent.slots.Movie;
    if(movie){
        http.get("the url?query="+movie, function(res){
            
        })
    }
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    //console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    //console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    //console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    
    console.log('INTENT NAME:', intentName);
    
    // if (session.attributes && session.attributes.genre) {   
    //     if (intentName === 'AMAZON.NoIntent') {
    //         getNewRecommendation(intent, session, callback);
    //     } else if (intentName === 'SaveForLater') {
    //         saveForLater(intent, session, callback);
    //     }
    // }

    // Dispatch to your skill's intent handlers
    if (intentName === 'GetMovieGenre') {
        setGenreInSession(intent, session, callback);
    } else if (intentName === 'AMAZON.NoIntent') {
        getNewRecommendation(intent, session, callback);
    } else if (intentName === 'SaveForLater') {
        saveForLater(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
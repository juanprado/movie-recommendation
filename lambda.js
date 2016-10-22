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

var unsortedMovies =  [];

var noList = [];

var maybeList = [];

var API_URL = 'api.themoviedb.org';

var API_KEY = '6bb87fb98375ab63c66f861383a89cb3';

var WEB_URL = '69f7f269.ngrok.io';

var WEB_PATH = '/movie';


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
function setGenre(intent, session, callback) {
    const cardTitle = intent.name;
    const genreSlot = intent.slots.Genre;
    const shouldEndSession = false;
    let sessionAttributes = {};
    let speechOutput = '';
    
    if (genreSlot) {
        const genre = genreSlot.value;
        const selectedMovie = unsortedMovies[0];
        
        sessionAttributes.genre = genre;
        speechOutput = "The first recommendation is " + selectedMovie.title + '. would you like to watch this movie?';

        setNewRecommendation(callback, speechOutput, selectedMovie, cardTitle, sessionAttributes);
    }
}

function setGenreInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const genre = intent.slots.Genre.value;
    
    // Api requires genre to be capitalized
    let capGenre = genre.toLowerCase().split(' ') .map(i => i[0].toUpperCase() + i.substring(1)).join(' ');
    
    // the get options
    var options = {
        host: API_URL,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    var discoverCallback = function(response) {
        var str = ''
        
        response.on('data', function(chunk) {
            str += chunk
        });
        
        response.on('end', function() {
           let response = JSON.parse(str);
           
           console.log(response);
           
           // We now add movies to our unsorted movies list
           unsortedMovies = response.results;
           setGenre(intent, session, callback);
        });
        
        response.on('error', function() {
            console.log('error');
        })
    }

    
    var genreCallback = function(response) {
        var str = '';
        response.on('data', function(chunk){
            str += chunk
        });

        response.on('end', function(){
            let response = JSON.parse(str);
            let selected_genre = response.genres.filter(function(obj) { return obj.name == capGenre; });
            let genre_id = selected_genre[0].id;
            
            options.path = `/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_genres=${genre_id}`
            http.request(options, discoverCallback).end();
        })
        
        response.on('error', function() {
            console.log('error');
        })
    }
    
    options.path = '/3/genre/movie/list?api_key=' + API_KEY;
    http.request(options, genreCallback).end();
}


/**
 * Get the new recommendation
 */
function getNewRecommendation(intent, session, callback) {
    const cardTitle = intent.name;
    let speechOutput = '';
    let selectedMovie;
    let sessionAttributes = {};
    
    noList.push(unsortedMovies[0].id);
    unsortedMovies.shift();
    selectedMovie = unsortedMovies[0];
    speechOutput = "Ok, we won't show you that again, the next recommendation is " + selectedMovie.title + '. would you like to watch this movie?';

    setNewRecommendation(callback, speechOutput, selectedMovie, cardTitle, sessionAttributes);
}

/**
 * Send recommendation to web app, on success - alexa will recommend new film
 */
function setNewRecommendation(callback, speechOutput, selectedMovie, cardTitle, sessionAttributes) {
    let repromptText = speechOutput;
    let shouldEndSession = false;
    
    let body = {
        selectedMovie: selectedMovie,
        maybeList: maybeList
    }
    
    body = JSON.stringify(body);
    
    var prevSelected = maybeList.filter(function(obj) { return selectedMovie.id === obj.id });
    
    if (prevSelected.length > 0) {
        speechOutput = 'You saved ' + selectedMovie.title + ' before. Would you like to watch it now? Yes or No?'
    }

    // the post options
    var options = {
        host: WEB_URL,
        path: WEB_PATH,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    var httpCallback = function(response) {
        var str = ''
        response.on('data', function(chunk){
            str += chunk
        })

        response.on('end', function(){
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        })
        
        response.on('error', function() {
            speechOutput = 'An error occurred, please try again later';
            repromptText = speechOutput;

            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));            
        })
    }

    http.request(options, httpCallback).end(body);
}

function acceptRecommendation(intent, session, callback) {
    let speechOutput = 'Awesome choice, you\'re really killing it today. Enjoy this cinematic gem'
    const cardTitle = intent.name;
    let repromptText = speechOutput;
    let shouldEndSession = true;
    let sessionAttributes = {};
    let body = {accept: 'recommendation'};
    
    body = JSON.stringify(body);
    

    // the post options
    var options = {
        host: WEB_URL,
        path: '/accept',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    var httpCallback = function(response) {
        var str = ''
        response.on('data', function(chunk){
            str += chunk
        })

        response.on('end', function(){
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        })
        
        response.on('error', function() {
            speechOutput = 'An error occurred, please try again later';
            repromptText = speechOutput;

            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));            
        })
    }

    http.request(options, httpCallback).end(body);
}

function showMaybe(intent, session, callback) {
    let speechOutput = 'Here are movies you have saved for later'
    const cardTitle = intent.name;
    let repromptText = speechOutput;
    let sessionAttributes = {};
    let shouldEndSession = true;
    let body = {maybe: 'true'}

    body = JSON.stringify(body);

    // the post options
    var options = {
        host: WEB_URL,
        path: '/maybe',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    var httpCallback = function(response) {
        var str = ''
        response.on('data', function(chunk){
            str += chunk
        })

        response.on('end', function(){
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        })
        
        response.on('error', function() {
            speechOutput = 'An error occurred, please try again later';
            repromptText = speechOutput;

            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));            
        })
    }

    http.request(options, httpCallback).end(body);
}



/**
 * Save for Later
 */
function saveForLater(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = {};
    let selectedMovie = {};
    let speechOutput = '';
    
    maybeList.push(unsortedMovies[0]);
    unsortedMovies.splice(5, 0, unsortedMovies[0]);
    unsortedMovies.shift();
    selectedMovie = unsortedMovies[0];
    speechOutput = "Saving that one for later, the next recommendation is " + selectedMovie.title + '. would you like to watch this movie?';
    
    setNewRecommendation(callback, speechOutput, selectedMovie, cardTitle, sessionAttributes);
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

    // Dispatch to your skill's intent handlers
    if (intentName === 'GetMovieGenre') {
        setGenreInSession(intent, session, callback);
    } else if (intentName === 'AMAZON.NoIntent' || intentName === 'AMAZON.NextIntent') {
        getNewRecommendation(intent, session, callback);
    } else if (intentName === 'AMAZON.YesIntent') {
        acceptRecommendation(intent, session, callback);
    } else if (intentName === 'SaveForLater') {
        saveForLater(intent, session, callback);
    } else if (intentName === 'SaveMaybes') {
        showMaybe(intent, session, callback);
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
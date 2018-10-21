// Pull in required dependencies
var path = require('path');

// Export HTML routes
module.exports = function (app) {
	// Home page
	// Home page
	app.get('/', function (req, res) {
		res.sendFile(path.join(__dirname, '../public/home.html'));
	});

	var firebase = require('firebase').initializeApp({
		"serviceAccount": "forkOff-b754102139e3.json",
		"databaseURL": "https://forkoff-b5d5b.firebaseio.com"
	});

	//
	var messageWatson;
	var fs = require('fs');

	var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

	var visualRecognition = new VisualRecognitionV3({
		url: 'https://gateway.watsonplatform.net/visual-recognition/api',
		version: '2018-03-19',
		iam_apikey: '2Hv41AInWvCdvRJUhg_04W46-Go8ZpYAMe8f-LcMZ5Ko',
	});

	var ref = firebase.database().ref().child('node-client');
	var logsRef = ref.child('images');
	var messagesRef = ref.child('messages');

	logsRef.orderByKey().limitToLast(1).on('child_added', function (snap) {
		console.log('added', snap.val());
	});

	logsRef.on('child_removed', function (snap) {
		console.log('removed', snap.val());
	});

	logsRef.child('TestingImage').on('value', function (snap) {
		imageToUse = snap.val();
		watsoncheck(imageToUse);
		console.log(imageToUse);
		console.log('changed', imageToUse);
	});


	function watsoncheck(images) {
		console.log("sent to watson" + images)
		var params = {
			'url': images
		};

		visualRecognition.classify(params, function (err, res) {
			if (err) {
				console.log('ERROR FOUND HERE HERE');
				console.log(err.code);
				console.log(err);
			}
			else {
				console.log(JSON.stringify(res));
				messageWatson = res;
			}
			console.log(messageWatson);
			var message = { images: messageWatson }; //, timestamp: new Date().toString()
			var ref = firebase.database().ref().child('node-client');
			setMessages(message);
			message = 0
		});

	}


	function setMessages(message) {
		console.log(JSON.stringify(message));
		ref.child('messages').update(message);
	}
};

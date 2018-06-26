
var firebase = require('firebase').initializeApp({
	"serviceAccount": "forkOff-b754102139e3.json",
	"databaseURL": "https://forkoff-b5d5b.firebaseio.com"
});

//
var messageWatson;
var fs = require('fs');

// var visual_recognition = watson.visual_recognition({
//     api_key: '3511cb92faf71512889a8004b4e0eea17618cdf8', //alex
//     // api_key: '6de8f853781dde067ae4c1ebde94f4579a4e8a6c', //Charlie
//     version: 'v3',
//     version_date: '2016-05-20'
// });

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
	version: 'v3',
	api_key: '3511cb92faf71512889a8004b4e0eea17618cdf8',
	version_date: '2016-05-20'
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
	console.log('changed', snap.val());
});
logsRef.on('value', function (snap) {
	console.log('value', snap.val());
});
//});


function watsoncheck(images) {
	var watson = require('watson-developer-cloud');
	var fs = require('fs');

	var params = {
		parameters: { 'url': images, 'classifier_ids': ["Buddhaxshand_1013586818", "default"] }
	};


	//THE LINES BELOW WILL CONSOLE.LOG THE LIST OF CUSTOM CLASSIFIERS 
	visualRecognition.listClassifiers({},
		function (err, response) {
			if (err)
				console.log(err);
			else
				console.log(JSON.stringify(response, null, 2));
		}
	);
	visualRecognition.classify(params, function (err, res) {
		if (err)
			console.log(err);
		else
			messageWatson = res;
		console.log(messageWatson);
		var message = { images: messageWatson }; //, timestamp: new Date().toString()
		var ref = firebase.database().ref().child('node-client');
		setMessages(message);
		message = 0
	});

}



function setMessages(message) {
	ref.child('messages').update(message);
}

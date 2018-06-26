//======================Global Variables============================//
//==================================================================//
var numOfIngredients = 0;
var ingredientList;
var finalIngredientList = [];
var counter = 0;
var counteroutside = 0;
var counterinside = 0;
var counterToAddData = 0; // this counter will prevent a duplicate value to fill the yummly database due the on("value") duplicate scans on database
var buttonColors = ["primary", "secondary", "success", "danger", "warning", "info", "light"]; // button colors from bootstrap layout
var color = 0;
var ingredientList = [];
var imageToUse;
var globalReference; // global firebase yummly database used in addYummly() addToDataBase(lastLayer.class, globalReference);

// Initialize tooltip component
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Initialize popover component
$(function () {
  $('[data-toggle="popover"]').popover()
})
//======================Initialize Firebase=========================//
//==================================================================//
var config = {
  apiKey: "AIzaSyDjsbjIcD3GTuLS_1okzz-OGxDdJ3QNpcM",
  authDomain: "forkoff-b5d5b.firebaseapp.com",
  databaseURL: "https://forkoff-b5d5b.firebaseio.com",
  projectId: "forkoff-b5d5b",
  storageBucket: "forkoff-b5d5b.appspot.com",
  messagingSenderId: "182993753568"
};
firebase.initializeApp(config);

//======================Global DOM Variables to be handled in main process=========================//
//=================================================================================================//
var holder = document.getElementById('holder')
var blah = document.getElementById('player'),
  tests =
    {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest
    },
  support =
    {
      filereader: document.getElementById('filereader'),
      formdata: document.getElementById('formdata'),
      progress: document.getElementById('progress')
    },
  acceptedTypes =
    {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    },
  progress = document.getElementById('uploadprogress'),
  fileupload = document.getElementById('upload');


//====================================================FUNCTIONS============================================================//
//=========================================================================================================================//


//==================addYummmly Function will retrieve the responses from Watson and pass it to an array to later be used for mainYummly function to retrieve recipes =========//
//============================================================================================================================================================================//
function addYummly() {
  var y = 0;
  console.log("checking how many times inside" + counterinside);
  var ref = firebase.database().ref().child('node-client');
  var logsRef1 = ref.child('messages');
  var lastLayer;
  logsRef1.once('value', function (snap) {
    ++counterToAddData;
    console.log(Object.values(snap.val()));
    console.log(snap.val().images);
    //============================ below lines are a fix to the updates done by watson that prevent What the fork to work correctly =================
    y = snap.val().images; //object images 
    yyy1 = Object.values(y)[01]; // access to array inside object images
    yyy2 = Object.values(yyy1[0]); // access array inside object yyy1
    yyy3 = Object.values(yyy2[0]);
    yyy4 = Object.values(yyy3[0]);
    console.log(yyy4[0]);// deep layer inside object
    y = Object.values(yyy4[0]);
    var recognizedResults = []
    for (var i = 0; i < Object.keys(yyy4).length; i++) {
      recognizedResults[i] = y[i].class;
      console.log(recognizedResults);
    }
    //============================ Above lines are a fix to the updates done by watson that prevent What the fork to work correctly =================
    lastLayer = y[0];
    createListResponses(y);
    console.log("Watson information : " + lastLayer + " " + y.length);
    var valueDataBase;
    ref.child('images').child('TestingImage').once("value", function (snapData) {
      valueDataBase = snapData.val();
      console.log(valueDataBase)
      console.log("compared to " + imageToUse);
      if (valueDataBase === imageToUse) {
        console.log("inside if");
        globalReference = ref;
        // addToDataBase(lastLayer.class, ref);
        counterToAddData = 0;
      }
    });
  })
}

//==================This function will show all the possible watson responses in a list where the user will later pick=========//
//==================================================================================================================//
function createListResponses(listData) {
  $("<div class='col-md-6'><table class='table table-hover'><thead><tr><th scope='col'>#</th><th scope='col'>Possible Matches</th><th scope='col'>Add Ingredient</th></tr></thead><tbody class='ingTable'>").insertBefore($(".wikipedia"));
  var addImageIcon = '<img class="addIcon" src="assets/img/addToList.png" data-toggle="tooltip" data-placement="top" title="Click to add this ingredient">';
  var getInfoIcon = '<img class="getInfo" src="assets/img/infoIcon.png" data-toggle="tooltip" data-placement="top" title="Click for more information">';
  for (var i = 0; i < listData.length; i++) {
    $(".ingTable").append("<tr class='" + listData[i].class + "'><th scope='row'>" + (i + 1) + "</th><td>" + listData[i].class + "</td><td class='optionImages'>" + addImageIcon + getInfoIcon + "</td></tr>");
  }
  $("#possibleResults").show();
}


//===================THIS FUNCTION WILL BE TAKEN OUT OF THE CODE WITH THE NEW APP FUNCTIONALITY ====================//
//==================This function will add the watson responses to a local Array and pass it to  addButton =========//
//==================================================================================================================//
function addToDataBase(goodData1, ref1) {
  counter++;
  console.log("passed " + counter + " times in " + goodData1);
  console.log("here is the good date" + goodData1);
  ref1.child('yummly').once('value').then(function (snapshot) {
    console.log("inside firebase" + snapshot.numChildren());
    numOfIngredients = snapshot.numChildren();
    ingredientList[numOfIngredients] = goodData1; // this line will add the ingredient to the array in the same position as in the database
    console.log("counter" + numOfIngredients);
    console.log(ingredientList);
    //firebase.database().ref('node-client/yummly/' + "ingredient" + numOfIngredients).set(goodData1);
    addButton(goodData1);
  });
}

//==================Function addButton will create a button from the watson responses and pass that response to wikipedia function to retrieve its definition or information =========//
//====================================================================================================================================================================================//
function addButton(goodData2) {
  var buttonName = goodData2;

  finalIngredientList.push(goodData2); // thia line is pushing the last scanned image keyword, the spaces will be replaced with a '_'

  console.log(" list of ingredients" + finalIngredientList);
  // line below will create  button
  // $("#ingredientList").append('<button'+ ' id="' + buttonName + '"' +' class="btn btn-' + buttonColors[color]+ ' m-3">' + buttonName +'</button>')
  // color++;
  // if (color === 7)
  // {
  //   color=0;
  // }

  // line below will create a list of items instead of buttons
  //$("#ingredientList").append('<a href="" class="list-group-item list-group-item-action" id="' +buttonName +'">'+ buttonName +'</a>');
  $('<a class="list-group-item list-group-item-action" id="' + buttonName + '">' + buttonName + '</a>').insertBefore($(".searchRecipeButton"));

  wikipedia(goodData2); // this will send the search word to wikipedia API and display the information Properly
  $("#ingredientList").show();
}



//===================Upload to Imgur from Local file starts here ==============//
//=============================================================================//
function imgurUpload($files) {
  console.log("$files is " + JSON.stringify($files));
  if ($files.length) {
    // Reject big files
    if ($files[0].size > $(this).data("max-size") * 1024) {
      console.log("Please select a smaller file");
      return false;
    }

    // Begin file upload
    console.log("Uploading file to Imgur..");

    // Replace ctrlq with your own API key
    var apiUrl = 'https://api.imgur.com/3/image';
    var apiKey = 'cd2b7a5d18eaa23'; // free api key
    //var apiKey = 'c70f5706c082422';
    //var apiKey = 'e32a56a55d15639';

    var settings = {
      async: false,
      crossDomain: true,
      processData: false,
      contentType: false,
      type: 'POST',
      url: apiUrl,
      headers: {
        Authorization: 'Client-ID ' + apiKey,
        Accept: 'application/json'
      },
      mimeType: 'multipart/form-data'
    };

    var formData = new FormData();
    formData.append("image", $files[0]);
    settings.data = formData;

    // Response contains stringified JSON
    // Image URL available at response.data.link
    $.ajax(settings).done(function (response) {
      var str = JSON.parse(response).data.link;
      //str = JSON.stringify(str); 
      // imageToUse = str.split("\/").pop();
      imageToUse = str;
      console.log(imageToUse);
      firebase.database().ref().child('node-client').child('images').child('TestingImage').set(imageToUse);
      console.log(JSON.parse(response).data.link);
      //document.getElementById("imgur").reset();// reset input thumbnail in mobile devices
    });
  }
}

//===============Upload to Imgur Picture from Camera starts here ==============//
//=============================================================================//

function imgurUploadCamera($files) {
  console.log("$files is " + JSON.stringify($files));
  // Begin file upload
  console.log("Uploading file to Imgur..");
  // Replace ctrlq with your own API key
  var apiUrl = 'https://api.imgur.com/3/image';
  var apiKey = 'cd2b7a5d18eaa23';  // free api key
  //var apiKey = 'c70f5706c082422';
  //var apiKey = 'e32a56a55d15639';

  var settings = {
    async: false,
    crossDomain: true,
    processData: false,
    contentType: false,
    type: 'POST',
    url: apiUrl,
    headers: {
      Authorization: 'Client-ID ' + apiKey,
      Accept: 'application/json'
    },
    mimeType: 'multipart/form-data'
  };

  var formData = new FormData();
  formData.append("image", $files);
  settings.data = formData;

  // Response contains stringified JSON
  // Image URL available at response.data.link
  $.ajax(settings).done(function (response) {
    var str = JSON.parse(response).data.link;
    //str = JSON.stringify(str); 
    // imageToUse = str.split("\/").pop();
    imageToUse = str;
    console.log(imageToUse);
    firebase.database().ref().child('node-client').child('images').child('TestingImage').set(imageToUse);
    console.log(JSON.parse(response).data.link);
  });
}



//========================== Camera Capture starts here =======================//
//=============================================================================//
function takeAPicture() {
  var counterTakePicture = 0; // this counter will prevent the addEventListener for captureButton to trigger more than once
  var player = document.getElementById('player');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var captureButton = document.getElementById('capture');
  var constraints = {
    video: {
      mandatory: {
        maxWidth: 1280,
        maxHeight: 720

      }
    },
  };

  captureButton.addEventListener('click', () => {
    if (counterTakePicture === 0) // prevents eventlistener to be  triggered more than once
    {
      $("#loadingImage").show();
      counterTakePicture++;
      // Draw the video frame to the canvas.
      context.canvas.width = 1280;
      context.canvas.height = 720;
      context.drawImage(player, 0, 0, canvas.width, canvas.height); // remove line to prevent duplicate images
      console.log(context);
      var dataURL = canvas.toDataURL();
      dataURL = dataURL.replace(/data:image\/png;base64,/i, ''); // Use this line because imgur doesn't accet base64 and we need for watson to work
      console.log(dataURL);
      console.log("passing in");
      imgurUploadCamera(dataURL);
      //$("#blah").attr('src','data:image/png;base64,'+dataURL); this label was used for presentation purposes before 12/28/2017
      player.srcObject.getVideoTracks().forEach(track => track.stop());
      console.log(player.srcObject);
      $("#dragLabel").remove();
      $("#player").remove();
      $("#holder").prepend('<p id="dragLabel">Drag & Drop Your Image Here or Click on the camera to take a picture</p><video id="player" poster="data:image/png;base64,' + dataURL + '" autoplay width=40% height=40% ></video>');
    }
  });

  // Attach the video stream to the video element and autoplay.
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
      player.srcObject.active = false;

    });
}

//========================== Wikipedia API starts here ========================//
//=============================================================================//
function wikipedia(keyword) {
  $.ajax({
    type: "GET",
    url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + keyword + "&callback=?",
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data, textStatus, jqXHR) {

      console.log(data);
      var markup = data.parse.text["*"];
      str = markup.replace(/\/\/upload/g, 'upload'); // ADDED THIS LINE TO REMOVE THE UPLOAD IMAGE ERROR
      str = str.replace(/http/g, 'https'); // ADDED THIS LINE TO HAVE THE CONTENT DISPLAYED SECURELY OVER HTTPS
      var blurb = $('<div></div>').html(str);

      // remove links
      blurb.find('a').each(function () { $(this).replaceWith($(this).html()); });
      // remove any references
      blurb.find('sup').remove();

      // remove cite error
      blurb.find('.mw-ext-cite-error').remove();
      $('#ingredientInfo').html($(blurb).find('p'));
      $(".wikipediaYummly").show();
      counterToAddData = 0; // reset button counter
    },
    error: function (errorMessage) {
      $(".wikipediaYummly").hide(); // hide wikipedia when no data is found for clicked item
    }
  });
}

//====================== Yummly Recipe API starts here ========================//
//=============================================================================//

function mainYummly(foodImageItem) {
  console.log("here inside");
  //clear the last recipes created 

  var finalQuery = [];
  for (var i = 0; i < foodImageItem.length; i++) {
    var queryImageSearch = "&allowedIngredient[]=" + foodImageItem[i]; //search parameter + variable will be set by Watson API
    finalQuery += queryImageSearch;
  }
  console.log(finalQuery);
  //*************************** 3 different searches ***************************
  var queryRecipe = "recipes?";
  // var queryIngredient = "metadata/ingredient?"; // Allowed ingredient and meta ingredient might not work together
  // var queryCuisine = "metadata/cuisine?";  // use Cuisine if we want to limit user query to specific  cuisine
  // *************************** important: need to hide in gitignore file ***************************
  var monkeyPaw = "_app_id=12dafe86&_app_key=ba62bbc8677a60fac1bc16abe00dbf86";
  //*************************** URL concatenation ***************************
  var queryURL = "https://api.yummly.com/v1/api/" + queryRecipe + monkeyPaw + finalQuery;
  // function imageSearchInfo(){} <<<<<<<<<< may need to put inside another function? <<<<<<<<<<
  //http://api.yummly.com/v1/api/recipe/Pink-Dragon-Fruit-Soda-574237?_app_id=12dafe86&_app_key=12dafe86&_app_key=ba62bbc8677a60fac1bc16abe00dbf86

  $.ajax({ url: queryURL, method: "GET" }).done(function (response) {
    var results = response;
    console.log(results);
    console.log(results.matches[0].ingredients);
    var ingLength = results.matches;
    for (var i = 0; i < ingLength.length; i++) {
      ajaxWaitResponse(results, i, monkeyPaw);
    }
  });
}

//====================== Function will wait for Ajax Response to start creating recipe list ===================//
//=============================================================================//
function ajaxWaitResponse(results, i, monkeyPaw) {
  var ingredients = results.matches[i].ingredients; // zero for first recipe only
  var title = results.matches[i].recipeName;
  var id = results.matches[i].id;
  var queryRecipeDetail = 'https://api.yummly.com/v1/api/recipe/' + id + '?' + monkeyPaw;
  $.ajax({ url: queryRecipeDetail, method: "GET" }).done(function (response) {
    console.log(response.ingredientLines);

    createRecipeList(response.ingredientLines, response.images[0].hostedLargeUrl, title, response.source.sourceRecipeUrl, i);
  });
}

//====================== Create Recipe Divs Function Starts here ===================//
//=============================================================================//
function createRecipeList(ingredients, recipePicture, title, steps, counterForRecipe) {
  //holder-recipe
  console.log("inside the method!!");
  // var divToCreate = $("#yummlyIngredientList").append( "<div class='col-md-6 dup holderRecipe' id='recipe"+counterForRecipe+"'>"+
  // "</div>"+
  // "</div>"+
  // "</div>");


  var recipeImage = '<div col-md-12><img class="card-img-top col-sm-8" src="' + recipePicture + '" alt="Card image cap"></div>'
  var recipeTitle = '<div class="card-header"><h2>' + title + '</h2></div>';
  var recipeIngredients = '<p class="card-text" id="recipe' + counterForRecipe + '">';
  var recipeSteps = '<div class="card-footer"><a href="' + steps + '" class="btn btn-primary" target="_blank">Click for your recipe Steps</a></div>'
  var divToCreate = $("#yummlyIngredientList").append('<div class="card col-md-12 text-white bg-dark mb-3 p-0 text-center">' + recipeTitle + recipeImage + '<div class="card-body">' + recipeIngredients + '</div>' + recipeSteps);


  // console.log(divToCreate);
  // $("#recipe"+counterForRecipe).append("<H4>"+ title +"</H4>");
  // $("#recipe"+counterForRecipe).append("<p>https://www.yummly.com/#recipe/"+ id +"</p>");
  // $("#recipe"+counterForRecipe).append("<img src='"+recipePicture + "''>");
  for (var i = 0; i < ingredients.length; i++) {
    $("#recipe" + counterForRecipe).append("<span><h3>" + ingredients[i] + "<h3></span> </br>");
  }
  // $("#yummlyIngredientList").append( "<div class='col-md-6 dup holderRecipe' >"+ '<iframe src="'+ 'https:\/\/www.yummly.com\/#recipe\/'+ id +'"></iframe>'+
  // "</div>"+
  // "</div>"+
  // "</div>");
}

//===================drop_handler will send dropped image information into imgurUpload function ===  ==============//
//=================================================================================================================//
function drop_handler(ev) {
  console.log("Drop");
  ev.preventDefault();
  console.log(ev.dataTransfer.files);
  // If dropped items aren't files, reject them
  var dt = ev.dataTransfer.files;
  if (dt.length) {
    // Use DataTransferItemList interface to access the file(s)
    console.log("imgur function");
    $("#loadingImage").show();
    imgurUpload(dt);
  }
}

//===================dragover_handler for drag and drop functionality  ==============//
//=============================================================================//
function dragover_handler(ev) {
  console.log("dragOver");
  // Prevent default select and drag behavior
  ev.preventDefault();
}

//===================dragend_handler will remove temporal drag data for drag and drop functionality  ==============//
//=================================================================================================================//
function dragend_handler(ev) {
  console.log("dragEnd");
  // Remove all of the drag data
  var dt = ev.dataTransfer;
  if (dt.items) {
    // Use DataTransferItemList interface to remove the drag data
    for (var i = 0; i < dt.items.length; i++) {
      dt.items.remove(i);
    }
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}

//===========================Function to handle or Drag n Drop events============================//
//===============================================================================================//


function mainDragnDrop() {
  "filereader formdata progress".split(' ').forEach(function (api) {
    if (tests[api] === false) {
      support[api].className = 'fail';
    } else {
      support[api].className = 'hidden';
    }
  });

  if (tests.dnd) {
    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = 'hideOnMobileDiv'; return false; };
    holder.ondragleave = function () { this.className = 'hideOnMobileDiv'; return false; };
    holder.ondrop = function (e) {
      this.className = 'hideOnMobileDiv';
      e.preventDefault();
      readfiles(e.dataTransfer.files);
    }
  } else {
    fileupload.className = 'hidden';
    fileupload.querySelector('input').onchange = function () {
      $("#loadingImage").show();
      readfiles(this.files);
    };
  }
}

//=============This function will check if any file has been drag and droppped and if the file type is an image=====//
//==================================================================================================================//
function previewfile(file) {
  if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      var blah = document.getElementById('player')
      blah.poster = event.target.result;
      //blah.width = 250; // a fake resize
    }; reader.readAsDataURL(file);
  } else {
    //holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
    console.log(file);
  }
}

//==================This function will update the image data for the file that was drag and dropped======= =========//
//==================================================================================================================//
function readfiles(files) {
  // debugger; //no need for debugger now
  var formData = tests.formdata ? new FormData() : null;
  for (var i = 0; i < files.length; i++) {
    if (tests.formdata) formData.append('file', files[i]);
    previewfile(files[i]);
  }

  // now post a new XHR request
  if (tests.formdata) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/devnull.php');
    xhr.onload = function () {
      progress.value = progress.innerHTML = 100;
    };

    if (tests.progress) {
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          var complete = (event.loaded / event.total * 100 | 0);
          progress.value = progress.innerHTML = complete;
        }
      }
    }
    xhr.send(formData);
  }
}

//==================This function will update the #player image source to properly display the uploaded image =========//
//==================================================================================================================//
function readURL(input) {
  if (input.files && input.files[0]) {
    $("#loadingImage").show();
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#player').attr('poster', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  };
}

//====================== Main Program Starts Here ===================//
//===================================================================//
mainDragnDrop();
$("document").ready(function () {
  $("#possibleResults").on('click', ".getInfo", function () {
    var clickedResponse = $(this).parent().parent().attr('class');
    if (clickedResponse != undefined) {
      console.log("you clicked row" + clickedResponse); // get the class which is the keyword
      wikipedia(clickedResponse);
      // addToDataBase(clickedResponse, globalReference);

    }
  });
  $("#possibleResults").on('click', ".addIcon", function () {
    var clickedResponse = $(this).parent().parent().attr('class');
    if (clickedResponse != undefined) {
      console.log("you clicked img" + clickedResponse); // get the class which is the keyword
      //wikipedia(clickedResponse);
      addToDataBase(clickedResponse, globalReference);
    }
  });
  //event.preventDefault();
  $("#possibleResults").hide();
  $("#ingredientList").hide();
  $(".wikipediaYummly").hide();
  $("canvas").hide();
  $("#loadingImage").hide();
  $("#hiddeableCamera").hide();
  //$("#player").hide();
  $('input[type=file]').on("change", function () {
    $('.table').parent().remove();
    $("#possibleResults").hide();
    $("#loadingImage").show();
    //event.preventDefault();
    var files = $(this).get(0).files;
    console.log(files);
    imgurUpload(files);
    //document.getElementById("imgur").reset();// reset input thumbnail in mobile devices
    var files = 0;
  });

  $("#refreshbutton").on('click', function () {
    window.location.reload(true);
  });

  $(document.body).on('click', '#openCamera', function () {
    //event.preventDefault(); 
    takeAPicture();
  });

  firebase.database().ref().child('node-client').child('messages').on('child_changed', function () {
    $("#loadingImage").hide();
    addYummly();
  });

  $("#searchRecipe").on('click', function () {
    $('#yummlyIngredientList').html("");
    mainYummly(finalIngredientList);
  });

});
//====================== Main Program Ends Here ====================//
//==================================================================//


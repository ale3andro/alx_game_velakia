//  level=='1' -> Μόνο δεξί και αριστερό βελάκι
//  level=='2' -> Μόνο πάνω και κάτω βελάκι
//  level=='3' -> Όλα τα βελάκια, και τα 4

var supported_levels = ['1' ,'2', '3'];

var level = getJsonFromUrl()['level'];
if (level==undefined) { level=1; }
if ($.inArray(level, supported_levels)==-1) { level=1; }
level=3;
$('#alxlevel').text(level);

var score = 0;
var mytimer=30; // δευτερόλεπτα 
var gameStarted=0; // 0 όταν το παιχνίδι δεν έχει αρχίσει, 1 όταν έχει αρχίσει
var currentImage=0;
var newcurrentImage=0;
var values = [];
var seed = 0;
var countdownimage=3;

$('#alxstartbuttoncontainer').html('<input type="button" id="alxstartbutton" class="btn btn-primary" value="Εκκίνηση">');
$("#alximage").attr("src", "img/X.png");
$("#alxscore").html(score);
$("#alxdance").attr("src", "img/pressing_arrows.gif");
$("#alxtime").html(mytimer);

var clock = $('#alxtime').FlipClock(mytimer, {
    autostart: false,
    clockFace: 'Counter',
    countdown: true,
  });
 

$("#alxstartbutton").click(function() {
  imageChangeTimer();  
});

function startGame() {
  gameStarted=1;
  clock.start();
  currentImage=getNextImage(level);
  $("#alximage").attr("src", "img/" + currentImage + ".png");
  $('#alxstartbuttoncontainer').html('');
  setTimeout(timer, 1000);
}

function imageChangeTimer(){
  if (countdownimage>0) {
    $("#alximage").show().attr('src', "img/finger_" + countdownimage + ".png").delay(200).fadeOut(700).delay(100);
    countdownimage-=1;
    setTimeout(imageChangeTimer, 1000);
  }
  else {
    $("#alximage").show().attr('src', "img/go-start-game.png").delay(200).effect("pulsate");
    countdownimage=3;
    setTimeout(startGame, 1000);
  }
}

function timer() {
  mytimer-=1;
  clock.decrement();
  if (mytimer<0) {
    $('#alxstartbuttoncontainer').html('<input type="button" id="alxsretartbutton" class="btn btn-primary" value="Ξανά!" onclick="location.reload();">');
    $("#alximage").attr("src", "img/game_over.png");
    $("#alxdance").attr("src", "img/dance.gif");
    gameStarted=0;
    $('#alx_hiddenscoreform').html('<form id="alx_invisible_form" action="score.php" method="post"><input name="score" type="hidden" value="' + score + '"><input name="gameid" type="hidden" value="0"></form>');
    $('#alx_invisible_form').submit();
  }
  else {
    setTimeout(timer, 1000);
  }
}

$("body").on("keydown", function (e) {
  if (gameStarted==1) {
    if ((currentImage+37)==e.which) {
      score+=1;
      do {
        newcurrentImage=getNextImage(level);
      }
      while (newcurrentImage==currentImage);
      currentImage=newcurrentImage;
      $("#alximage").attr("src", "img/" + currentImage + ".png");
      $("#alxscore").html(score);
    }
    else {
      if (score>0) {
        score-=1;
        $("#alxscore").html(score);
      }
    }
  }

  switch(e.which) {
        case 37: // left
        break;

        case 38: // up
        break;

        case 39: // right
        break;

        case 40: // down
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function getNextImage(theLevel) {
  if (theLevel=='1') {
    // Πάνω και κάτω βελάκι
    // Πρέπει να επιστρέψω είτε 1 (για το πάνω βελάκι) είτε 3 (για το κάτω βελάκι)
    values=[1,3];
    seed = Math.round(Math.random());
    return values[seed];
  }
  else if (theLevel=='2') {
    // Πάνω και κάτω βελάκι
    // Πρέπει να επιστρέψω είτε 0 (για το αριστερό βελάκι) είτε 2 (για το δεξί βελάκι)
    values=[0,2];
    seed = Math.round(Math.random());
    return values[seed];
  }
  else if (level=='3') {
    return Math.floor(Math.random() * 4);
  }

}
var sentence = 'Τα Γιαννιτσα ειναι η μεγαλυτερη πολη του νομου Πελλας';
var words = sentence.split(' ');

var accuracy = 100;
var mytimer=0; // δευτερόλεπτα 
var gameStarted=0; // 0 όταν το παιχνίδι δεν έχει αρχίσει, 1 όταν έχει αρχίσει
var countdownimage=3;

var wordCounter=0;
var currentWord;
var currentLetter=0;
var gameEnded=false;

$('#alxstartbuttoncontainer').html('<input type="button" id="alxstartbutton" class="btn btn-primary" value="Εκκίνηση">');
$("#alxscore").html(accuracy);
$("#alxdance").attr("src", "img/pressing_arrows.gif");
$("#alxtime").html(mytimer);

var clock = $('#alxtime').FlipClock(mytimer, {
    autostart: false,
    clockFace: 'Counter',
    countdown: false,
  });
 

$("#alxstartbutton").click(function() {
  imageChangeTimer();  
});

function startGame() {
  gameStarted=1;
  clock.start();
  timer();
  $("#alximage").remove();
  nextWord();
}

function nextWord() {
    if ((wordCounter)==words.length) {
        console.log('end of the game');
        gameEnded=true;
    } else {
        currentWord = words[wordCounter++];
        currentLetter=0;
        $('#alxword').empty();
        for (var i=0; i<currentWord.length; i++)
            $('#alxword').append("<span id='letter" + i + "'>" + currentWord[i] + "</span>");
        $("#letter0").css("font-size", "400%").css("color", "red");  
    }
}


function getNextLetter() {
    $("#letter" + currentLetter).css("font-size", "50%").css("color", "black");
    $("#letter" + ++currentLetter).css("font-size", "400%").css("color", "red");
    if (currentLetter==currentWord.length) {    
        nextWord();
    }
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
  if (!gameEnded) {
    mytimer+=1;
    clock.increment();
    setTimeout(timer, 1000);
  } else {
    console.log('game over!');
    if (mytimer<20)
        $('#alxword').html('Τα δάχτυλα σου πετάνε φωτιές!!');
    else if (mytimer<40)
        $('#alxword').html('Είσαι σε πολύ καλό δρόμο!');
    else 
        $('#alxword').html('Χρειάζεσαι εξάσκηση...');

  }
  
}

$("body").on("keydown", function (e) {
  if (gameStarted==1) {      
    if (e.key==currentWord[currentLetter]) {
        accuracy++;
      $("#alxscore").html(accuracy);
      getNextLetter();
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }
});

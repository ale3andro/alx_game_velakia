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
var mytimer=30; // δευτερόλεπτα  TODO κάντο 30
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
$("alx_message").html('Πάτα στο πληκτρολόγιο σου τα βελάκια που είναι κόκκινα στην οθόνη ');

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
    gameStarted=0;
    console.log('game over!' + score);

    $.ajax({
      url: 'http://192.168.1.2:3000/checkScore/0/'+score,
      contentType: "application/json",
      dataType: "json",
      success: function(result){
          data = $.parseJSON(result);
          var message = '<div class="alert alert-danger" role="alert">Με σκορ ' + score + ' δεν μπορείς να μπεις στο hall of fame!</div>';
          if (data.num_scores_before<10) {
            message = '<div class="alert alert-success" role="alert">Συγχαρητήρια, μπαίνεις στο high score!</div>';
            var form = `<form class="form-horizontal">
                          <fieldset>
                            <legend>Καταχώρηση σκορ</legend>
                            <input hidden id="frm_score" name="frm_score" value="${score}" class="form-control input-md" required="" type="text">
                            
                            <div class="form-group">
                              <label class="col-md-4 control-label" for="frm_name">Όνομα:</label>  
                              <div class="col-md-4">
                                <input id="frm_name" name="frm_name" placeholder="Εδώ γράψε το όνομα σου" class="form-control input-md" required="" type="text" oninvalid="this.setCustomValidity(\'Το όνομα είναι υποχρεωτικό\')" oninput="setCustomValidity(\'\')">
                              </div>
                            </div>
            
                            <div class="form-group">
                              <label class="col-md-4 control-label" for="frm_class">Τάξη</label>
                              <div class="col-md-4">
                                <select id="frm_class" name="frm_class" class="form-control">
                                  <option value="0">Α τάξη</option>
                                  <option value="1">Β τάξη</option>
                                  <option value="2">Γ τάξη</option>
                                  <option value="3">Δ τάξη</option>
                                  <option value="4">Ε τάξη</option>
                                  <option value="5">ΣΤ τάξη</option>
                                </select>
                              </div>
                            </div>
            
                          <!-- Select Basic -->
                          <div class="form-group">
                            <label class="col-md-4 control-label" for="frm_school">Σχολείο:</label>
                            <div class="col-md-4">
                              <select id="frm_school" name="frm_school" class="form-control">
                                <option value="0">1ο Δημοτικό Γιαννιτσών</option>
                                <option value="1">11ο Δημοτικό Γιαννιτσών</option>
                                <option value="2">Άλλο</option>
                              </select>
                            </div>
                          </div>
            
                          <!-- Button -->
                          <div class="form-group">
                            <label class="col-md-4 control-label" for="frm_submit"></label>
                            <div class="col-md-4">
                              <button id="frm_submit" name="frm_submit" onclick="sendScore(); return false;" class="btn btn-primary">Αποθήκευση</button>
                            </div>
                          </div>
                        </fieldset>
                      </form>`;
            $('#alx_message').html(message+form); 
          } else {
            $('#alx_message').html(message);          
            $('#alxstartbuttoncontainer').html('<input type="button" id="alxsretartbutton" class="btn btn-primary" value="Ξανά!" onclick="location.reload();">');
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          var line = '<div class="alert alert-danger" role="alert">Αδυναμία φόρτωσης hall of fame</div>';
          $('#alx_message').html(line);
      }
    });
    
    $("#alximage").attr("src", "img/game_over.png");
    $("#alxdance").attr("src", "img/dance.gif");
    /*
    
    gameStarted=0;
    $('#alx_hiddenscoreform').html('<form id="alx_invisible_form" action="score.php" method="post"><input name="score" type="hidden" value="' + score + '"><input name="gameid" type="hidden" value="0"></form>');
    $('#alx_invisible_form').submit();
    */
  }
  else {
    setTimeout(timer, 1000);
  }
}

function sendScore() {
  $.ajax({
    url: 'http://192.168.1.2:3000/setScore/0/' + score + '/' + $('#frm_name').val() + '/' + $('#frm_class option:selected').text() + '/' + $('#frm_school option:selected').text(),
    contentType: "application/json",
    dataType: "json",
    success: function(result){
        data = $.parseJSON(result);
        if (data.status=='ok') {
          $('#alx_message').html('<div class="alert alert-success" role="alert">Το σκορ σου αποθηκεύτηκε!</div>');          
        }
        $('#alxstartbuttoncontainer').html('<input type="button" id="alxsretartbutton" class="btn btn-primary" value="Ξανά!" onclick="location.reload();">'); 
    },
    error: function(jqXHR, textStatus, errorThrown) {
        $('#alx_message').html('<div class="alert alert-danger" role="alert">Αδυναμία αποθήκευσης στο hall of fame</div>');
        $('#alxstartbuttoncontainer').html('<input type="button" id="alxsretartbutton" class="btn btn-primary" value="Ξανά!" onclick="location.reload();">');
    }
  });
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
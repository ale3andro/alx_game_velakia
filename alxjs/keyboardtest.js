var sentence = 'Τα Γιαννιτσα ειναι η μεγαλυτερη πολη του νομου Πελλας';
var words = sentence.split(' ');

var score = 100;
var mytimer=0; // δευτερόλεπτα 
var gameStarted=0; // 0 όταν το παιχνίδι δεν έχει αρχίσει, 1 όταν έχει αρχίσει
var countdownimage=3;

var wordCounter=0;
var currentWord;
var currentLetter=0;
var gameEnded=false;

$('#alxstartbuttoncontainer').html('<input type="button" id="alxstartbutton" class="btn btn-primary" value="Εκκίνηση">');
$("#alxscore").html(score);
$("#alxtime").html(mytimer);

var clock = $('#alxtime').FlipClock(mytimer, {
    autostart: false,
    clockFace: 'Counter'
  });
 

$("#alxstartbutton").click(function() {
  $("#alxstartbutton").hide();
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
        //console.log('end of the game');
        gameEnded=true;
    } else {
        //console.log('Next word');
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
  

    
}

function timer() {
  if (!gameEnded) {
    mytimer+=1;
    clock.increment();
    setTimeout(timer, 1000);
    score = 100-mytimer;
    $("#alxscore").html(score);

  } else {
    if (mytimer<20)
        $('#alxword').html('Τα δάχτυλα σου πετάνε φωτιές!!');
    else if (mytimer<40)
        $('#alxword').html('Είσαι σε πολύ καλό δρόμο!');
    else 
        $('#alxword').html('Χρειάζεσαι εξάσκηση...');

        $.ajax({
          url: 'http://192.168.1.2:3000/checkScore/1/'+(100-mytimer),
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
                                <input hidden id="frm_score" name="frm_score" value="${score}">
                                
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
  }
  
}

function sendScore() {
  var user_name = ($('#frm_name').val()==''?'Ανώνυμος':$('#frm_name').val());
  $.ajax({
    url: 'http://192.168.1.2:3000/setScore/1/' + score + '/' + user_name + '/' + $('#frm_class option:selected').text() + '/' + $('#frm_school option:selected').text(),
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
  if (gameStarted==1 && (!gameEnded)) { 
    if (e.key==currentWord[currentLetter]) {
      getNextLetter();
    } 
  }
  if (!gameEnded)
    e.preventDefault();
});

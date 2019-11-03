<?php
    function get_form($score) {
        return '<form class="form-horizontal" method="post" action="score.php">
        <fieldset>
        
        <!-- Form Name -->
        <legend>Καταχώρηση σκορ</legend>
        
        <!-- Text input-->
        <input hidden id="frm_score" name="frm_score" value="' . $score . '" class="form-control input-md" required="" type="text">
                
        <!-- Text input-->
        <div class="form-group">
          <label class="col-md-4 control-label" for="frm_name">Όνομα:</label>  
          <div class="col-md-4">
          <input id="frm_name" name="frm_name" placeholder="Εδώ γράψε το όνομα σου" class="form-control input-md" required="" type="text" oninvalid="this.setCustomValidity(\'Το όνομα είναι υποχρεωτικό\')" oninput="setCustomValidity(\'\')">
            
          </div>
        </div>
        
        <!-- Select Basic -->
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
            <button id="frm_submit" name="frm_submit" class="btn btn-primary">Αποθήκευση</button>
          </div>
        </div>
        
        </fieldset>
        </form>
        ';
    }

    function get_table_line($score, $date, $name, $class, $school, $year) {
      return '<div class="row">
                  <div class="col-sm-1">' . $score . '</div>
                  <div class="col-sm-1 col-lg-2">' . $date. '</div>
                  <div class="col-sm-1 col-lg-2">' . $name . '</div>
                  <div class="col-sm-1 col-lg-2">' . $class . '</div>
                  <div class="col-sm-1 col-lg-2">' . $school . '</div>
                  <div class="col-sm-1 col-lg-2">' . $year . '</div>
              </div><hr />';
    }

    $db_filename = "high_scores/high_scores.db";

    $gameid=0;
    if (isset($_REQUEST['gameid'])) {
      $gameid=intval($_REQUEST['gameid']);
    }
    $db = new SQLite3($db_filename);
    $game = $db->query('SELECT * FROM game_ids WHERE id=' . $gameid)->fetchArray()[1];
    if ($game=='')
      die('<h1>Δεν υπάρχει παιχνίδι με αυτό το id</h1>');
?>

<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?php echo $game; ?></title>

    <!-- Bootstrap core CSS -->
    <link href="../bower_components/bootstrap4/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/blog-post.css" rel="stylesheet">
    <!-- timer flipclock css -->
    <link rel="stylesheet" href="css/flipclock.css">

  </head>

  <body>



    <a href="https://github.com/ale3andro/keyboard_arrows_game"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>

    <!-- Page Content -->
    <div class="container">

      <div class="row">

        <!-- Post Content Column -->
        <div class="col-lg-8">

          <!-- Title -->
          <h1 class="mt-4"><?php echo $game; ?></h1>

          <?php 
                if (isset($_POST['score'])) {
                  $db = new SQLite3($db_filename);
                  $current_year = $db->query('SELECT * FROM current_year')->fetchArray()[0];
                  $results = $db->query('SELECT (SELECT count() FROM scores where year="' . $current_year . '" and score>' . $_POST['score'] . ') as count, * from scores');
                  if ($results->fetchArray()[0]>=10) {
                    echo '<div class="container"><div class="row">';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Αποτέλεσμα</h5><div class="card-body"><div class="row"><div class="col-lg-12"><img src="img/sad_face.png" />
                            </div></div></div></div></div>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Το Σκορ σου</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <div id="alxscore">' . $_POST['score'] . '</div></div></div></div></div></div>';
                    echo '<h2><span class="badge badge-warning">Δυστυχώς, με σκορ ' . $_POST['score'] . ', δεν μπαίνεις στο Hall of Fame...</span></h2>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Hall of Fame</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <a href="score.php"><img src="img/hall-of-fame.png" /></a></div></div></div></div></div>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Παίξε πάλι!</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <a href="index.html"><img src="img/play_again.png" /></a></div></div></div></div></div>';
                    echo "</div></div>";
                  }
                  else { 
                    echo '<div class="container"><div class="row">';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Αποτέλεσμα</h5><div class="card-body"><div class="row"><div class="col-lg-12"><img src="img/happy_face.png" />
                            </div></div></div></div></div>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Το Σκορ σου</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <div id="alxscore">' . $_POST['score'] . '</div></div></div></div></div></div>';  
                    echo "</div></div>";              
                    echo get_form($_POST['score']);
                  }
                } elseif (isset($_POST['frm_name'])) {
                    switch ($_POST['frm_class']) {
                      case 0:
                        $s_class = "Α τάξη";
                        break;
                      case 1:
                        $s_class = "Β τάξη";
                        break;
                      case 2:
                        $s_class = "Γ τάξη";
                        break;
                      case 3:
                        $s_class = "Δ τάξη";
                        break;
                      case 4:
                        $s_class = "Ε τάξη";
                        break;
                      case 5:
                        $s_class = "ΣΤ τάξη";
                        break;
                    }
                    switch ($_POST['frm_school']) {
                      case 0:
                        $s_school = "1ο Δημοτικό Γιαννιτσών";
                        break;
                      case 1:
                        $s_school = "11ο Δημοτικό Γιαννιτσών";
                        break;
                      case 2:
                        $s_school = "Άλλο";
                        break;
                    }
                    $s_date = date("Y-m-d");
                    shell_exec('sudo chgrp -R www-data high_scores && sudo chmod -R 775 high_scores');
                    $db = new SQLite3($db_filename);
                    $current_year = $db->query('SELECT * FROM current_year')->fetchArray()[0];
                    echo $current_year;

                    $db->exec('BEGIN');
                    $command = 'insert into scores values (' . $_POST['frm_score'] . ', "' . $s_date . '", "' . $_POST['frm_name'] . '", "' . $s_class . '", "' . $s_school . '", "' .  $current_year . '")';
                    if (!$db->exec($command))
	                    die("unable to save");
                    $db->exec('COMMIT');
                    echo '<div class="container"><div class="row">';
                    echo '<h2><span class="badge badge-success">Το σκορ σου αποθηκεύτηκε με επιτυχία!</span></h2>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Hall of Fame</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <a href="score.php"><img src="img/hall-of-fame.png" /></a></div></div></div></div></div>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Παίξε πάλι!</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <a href="index.html"><img src="img/play_again.png" /></a></div></div></div></div></div>';
                    echo "</div></div>";
                } else {
                    echo '<!-- Author -->
                            <p><h3 class="bg-success">Hall of Fame - Οι 10 καλύτεροι χρόνοι - Φέτος</h3></p>
                            <hr>
                            <div class="container">
                                <div class="row">
                                    <div class="col-sm-1">Σκορ</div>
                                    <div class="col-sm-1 col-lg-2">Ημερομηνία</div>
                                    <div class="col-sm-1 col-lg-2">Όνομα</div>
                                    <div class="col-sm-1 col-lg-2">Τμήμα</div>
                                    <div class="col-sm-1 col-lg-2">Σχολείο</div>
                                    <div class="col-sm-1 col-lg-2">Χρονιά</div>
                                </div>';
                    $db = new SQLite3($db_filename);
                    $current_year = $db->query('SELECT * FROM current_year')->fetchArray()[0];
                    $results = $db->query('SELECT * FROM scores where year="' . $current_year . '" order by score DESC, date ASC limit 10');
                    while ($row = $results->fetchArray()) {
                        echo get_table_line($row[0], $row[1], $row[2], $row[3], $row[4], $row[5]);
                    }
                    echo '</div>';

                    echo '<!-- Author -->
                            <p><h3 class="bg-success">Hall of Fame - Οι 10 καλύτεροι χρόνοι όλων των εποχών</h3></p>
                            <hr>
                            <div class="container">
                                <div class="row">
                                    <div class="col-sm-1">Σκορ</div>
                                    <div class="col-sm-1 col-lg-2">Ημερομηνία</div>
                                    <div class="col-sm-1 col-lg-2">Όνομα</div>
                                    <div class="col-sm-1 col-lg-2">Τμήμα</div>
                                    <div class="col-sm-1 col-lg-2">Σχολείο</div>
                                    <div class="col-sm-1 col-lg-2">Χρονιά</div>
                                </div>';
                    $db = new SQLite3($db_filename);
                    $results = $db->query('SELECT * FROM scores order by score DESC, date ASC limit 10');
                    while ($row = $results->fetchArray()) {
                        echo get_table_line($row[0], $row[1], $row[2], $row[3], $row[4], $row[5]);
                    }
                    echo '</div>';
                    echo '<div class="col-sm-5"><div class="card my-4"><h5 class="card-header">Παίξε πάλι!</h5><div class="card-body"><div class="row"><div class="col-lg-12">
                            <a href="index.html"><img src="img/play_again.png" /></a></div></div></div></div></div>';
                }

        ?>
          
        </div>

    </div>
    <!-- /.container -->

    <!-- Footer -->
    <footer class="py-5 bg-dark">
      <div class="container">
        <p class="m-0 text-center text-white">Copyleft - <a href="http://ale3andro.gr" target="_blank">ale3andro.gr</a></p>
      </div>
      <!-- /.container -->
    </footer>

    <!-- Bootstrap core JavaScript -->
    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../bower_components/jquery-ui/jquery-ui.js"></script>
    <script src="../bower_components/bootstrap4/dist/js/bootstrap.bundle.min.js"></script>
    <script src="alxjs/flipclock.min.js"></script>

  </body>

</html>

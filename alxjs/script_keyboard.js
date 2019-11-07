$.ajax({
    url: 'http://192.168.1.2:3000/getScores/1/2019-2020',
    contentType: "application/json",
    dataType: "json",
    success: function(result){
        data = $.parseJSON(result);
        $('.alx_title').html(data.description );
        $.each(data.table, function(i, item) {
            if (i<10) {
                var line = `<div class="row">
                                <div class="col-sm-1">${item.score}</div>
                                <div class="col-sm-1 col-lg-2">${item.date}</div>
                                <div class="col-sm-1 col-lg-2">${item.name}</div>
                                <div class="col-sm-1 col-lg-2">${item.class}</div>
                                <div class="col-sm-1 col-lg-2">${item.school}</div>
                                <div class="col-sm-1 col-lg-2">${item.year}</div>
                            </div>`;
                $('#alx_container_parent').append(line);
            } 
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        var line = '<div class="alert alert-danger" role="alert">Αδυναμία φόρτωσης hall of fame</div>';
        $('#alx_container_parent').append(line);
    }
});

$.ajax({
    url: 'http://192.168.1.2:3000/getScores/1/all',
    contentType: "application/json",
    dataType: "json",
    success: function(result){
        data = $.parseJSON(result);
        $.each(data.table, function(i, item) {
            if (i<10) {
                var line = `<div class="row">
                                <div class="col-sm-1">${item.score}</div>
                                <div class="col-sm-1 col-lg-2">${item.date}</div>
                                <div class="col-sm-1 col-lg-2">${item.name}</div>
                                <div class="col-sm-1 col-lg-2">${item.class}</div>
                                <div class="col-sm-1 col-lg-2">${item.school}</div>
                                <div class="col-sm-1 col-lg-2">${item.year}</div>
                            </div>`;
                $('#alx_container_all_time_parent').append(line);
            }
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        var line = '<div class="alert alert-danger" role="alert">Αδυναμία φόρτωσης hall of fame</div>';
        $('#alx_container_all_time_parent').append(line);
    }
});
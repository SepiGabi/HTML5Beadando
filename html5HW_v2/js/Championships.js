var championshipsData = [];



$(document).ready(function () {
    $.ajax({
        url: "http://94.177.230.203:8080/sport/rest/championship/entity/all",
    })
   .done(function (rslt) {
       championshipsData = rslt;
       makeTableHtml(rslt);
       $('table').bootstrapTable();
   });

    function makeTableHtml(data) {
        var html = "";
        $.each(data, function (i, val) {
            var events = [];
            events.push('<div class="eventsdiv" style="display: none;">');
            $.each(val.event, function (i, event) {
                var sport = event.sport;
                var sportName = sport === null ? "" : sport.name;
                var specialization = event.specialization;
                var specializationName = specialization === null ? "" : specialization.name;
                var rounds = event.round;
                var conditions = event.condition;
                var users = event.user;
                events.push('<div class="eventdiv">');
                events.push('<br /><p><strong>Sport: </strong>' + sportName + '<strong>   Specialization: </strong>' + specializationName + '</p><div class="row">');

                events.push('<div class="col-md-4"><p><strong>Rounds: </strong></p>');
                events.push('<table id="roundtable' + i + '" data-toggle="table" data-pagination="true" data-page-size="5" data-page-list="[5,10,25]"><thead><tr><th data-sortable="true" data-field="name">Name</th><th data-field="description">Description</th><th data-field="race">Races</th></tr></thead><tbody>');
                $.each(rounds, function (i, round) {
                    var races = round.race;
                    var namesOfRaces = "";
                    $.each(races, function (i, race) {
                        namesOfRaces = namesOfRaces + race.name + ", ";
                    });
                    namesOfRaces = namesOfRaces.substring(0, namesOfRaces.length - 2);
                    namesOfRaces = namesOfRaces === "" ? "No races yet." : namesOfRaces;
                    events.push('<tr><td>' + round.name + '</td><td>' + round.description + '</td><td><a data-toggle="popover" data-trigger="hover" title="Races:" data-content="' + namesOfRaces + '">Races</a></td></tr>');
                })
                events.push('</tbody></table></div>');

                events.push('<div class="col-md-4"><p><strong>Conditions: </strong></p>');
                events.push('<table id="conditiontable' + i + '" data-toggle="table" data-pagination="true" data-page-size="5" data-page-list="[5,10,25]"><thead><tr><th data-sortable="true" data-field="name">Name</th><th data-field="description">Description</th></tr></thead><tbody>');
                $.each(conditions, function (i, condition) {
                    events.push('<tr><td>' + condition.name + '</td><td>' + condition.description + '</td></tr>')
                })
                events.push('</tbody></table></div>');

                events.push('<div class="col-md-3"><p><strong>Users: </strong></p>');
                events.push('<table id="usertable' + i + '" data-toggle="table" data-pagination="true" data-page-size="5" data-page-list="[5,10,25]"><thead><tr><th data-sortable="true" data-field="name">Name</th></tr></thead><tbody>');
                $.each(users, function (i, user) {
                    events.push('<tr><td>' + user.name + '</td></tr>')
                })
                events.push('</tbody></table></div>');

                events.push('</div></div>');
            })
            events.push('</div>');

            var serianame;
            var seasonname;
            if (val.seria === null) {
                serianame = "";
            }
            else {
                var seria = val.seria;
                serianame = seria.name;
            }
            if (val.season === null) {
                seasonname = "";
            }
            else {
                var season = val.season;
                seasonname = season.name;
            }
            var htmlNode = [
            '<div class="col-md-11 championshipcontainer">',
                '<h2>' + val.name + '</h2>',
                '<p>' + val.startDate + ' - ' + val.endDate + '</p>',
                '<p><button type="button" class="btn btn-default" data-toggle="modal" data-championshipid="' + val.id + '" data-target="#championshipsModal" data-whatever="@sport">Add sport</button><button type="button" class="btn btn-default" data-toggle="modal" data-championshipId="' + val.id + '" data-target="#championshipsModal" data-whatever="@round">Add round</button></p>',
                '<strong>Description:</strong>',
                    '<p>' + val.description + '</p>',
                '<strong>Seria: </strong>' + serianame,
                '<strong> Season: </strong>' + seasonname,
                '<p></p>',
                '<strong>Events:</strong><span class="glyphicon glyphicon-collapse-down"></span>',
            '</div>'
            ];
            for (var i = 0; i < events.length; i++) {
                htmlNode.splice(i + 10, 0, events[i]);
            }
            html += htmlNode.join("\n");
        });
        $('#championsdiv').append(html);
    };

    $('#championshipsModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var type = button.data('whatever')
        var championshipId = button.data('championshipid')
        var modal = $(this)
        if (type === "@round") {
            modal.find('.modal-title').text('Add a round');
            modal.find('#sportmodal').hide();
            modal.find('#championshipmodal').hide();
            modal.find('#applymodal').hide();
            modal.find('#roundmodal').show();

            //event combobox feltöltése:
            $.ajax({
                url: "http://94.177.230.203:8080/sport/rest/championship/events/idname/" + championshipId,
            })
            .done(function (rslt) {
                var html = [];
                $.each(rslt, function (i, val) {
                    htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
                    html.push(htmlNode);
                })
                $('#round-event').html(html.join("\n"));
            });
        }
        else if (type === "@sport") {
            modal.find('.modal-title').text('Add a sport');
            modal.find('#roundmodal').hide();
            modal.find('#championshipmodal').hide();
            modal.find('#applymodal').hide();
            modal.find('#sportmodal').show();
            modal.find('#championshipid').val(championshipId);

            //sport combobox feltöltése
            $.ajax({
                url: "http://94.177.230.203:8080/sport/rest/sport/idname/all"
            })
           .done(function (rslt) {
               var html = [];
               $.each(rslt, function (i, val) {
                   htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
                   html.push(htmlNode);
               })
               $('#sport-name').html(html.join("\n"));
           });

            //conditiontype combobox feltöltése
            $.ajax({
                url: "http://94.177.230.203:8080/sport/rest/conditiontype/idname/all"
            })
           .done(function (rslt) {
               var html = [];
               $.each(rslt, function (i, val) {
                   htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
                   html.push(htmlNode);
               })
               $('#sport-conditiontype').html(html.join("\n"));
           });

            //specialization combobox feltöltése
            fillSpecializationComboBox();

            //condition combobox feltöltése
            fillConditionComboBox();
        }
        else if (type === "@championship") {
            modal.find('.modal-title').text('Add a championship');
            modal.find('#roundmodal').hide();
            modal.find('#sportmodal').hide();
            modal.find('#applymodal').hide();
            modal.find('#championshipmodal').show();

            //season combobox feltöltése
            $.ajax({
                url: "http://94.177.230.203:8080/sport/rest/season/idname/all"
            })
           .done(function (rslt) {
               var html = [];
               $.each(rslt, function (i, val) {
                   htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
                   html.push(htmlNode);
               })
               $('#championship-season').html(html.join("\n"));
           });

            //seria combobox feltöltése
            $.ajax({
                url: "http://94.177.230.203:8080/sport/rest/seria/idname/all"
            })
           .done(function (rslt) {
               var html = [];
               $.each(rslt, function (i, val) {
                   htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
                   html.push(htmlNode);
               })
               $('#championship-seria').html(html.join("\n"));
           });
            //conditiontype combobox feltöltése
            $.ajax({
                url: "http://94.177.230.203:8080/sport/rest/conditiontype/idname/all"
            })
           .done(function (rslt) {
               var html = [];
               $.each(rslt, function (i, val) {
                   htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
                   html.push(htmlNode);
               })
               $('#championship-conditiontype').html(html.join("\n"));
           });

            //condition combobox feltöltése
            fillConditionComboBox2();
        }
        else if (type === "@apply") {
            modal.find('.modal-title').text('Apply');
            modal.find('#roundmodal').hide();
            modal.find('#sportmodal').hide();
            modal.find('#championshipmodal').hide();
            modal.find('#applymodal').show();
        }
    });

    $('#sport-name').on('change', function () {
        fillSpecializationComboBox();
    });

    $('#sport-conditiontype').on('change', function () {
        fillConditionComboBox();
    });

    $('#championship-conditiontype').on('change', function () {
        fillConditionComboBox2();
    });

    $('#sportformsubmit').on('click', function () {
        var championshipid = $('#championshipid').val();
        var sportid = $('#sport-name').val();
        var specializationid = [];
        var conditionid = [];
        $('#sport-specialization option').each(function () {
            if ($(this).is(':selected')) {
                specializationid.push(parseInt($(this).val()));
            }
        });
        $('#sport-condition option').each(function (i, val) {
            if ($(this).is(':selected')) {
                conditionid.push(parseInt($(this).val()));
            }
        });
        $.ajax({
            url: "http://94.177.230.203:8080/sport/rest/championship/addsport",
            method: "POST",
            contentType: "application/json",
            data: {
                championshipid: championshipid,
                sportid: sportid,
                specializationid: specializationid,
                conditionid: conditionid
            }
        }).done(function (message) {
            $('#messageModal #messageModalMesage').html(message);
            $('#messageModal').modal('show');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#messageModal #messageModalMesage').html(textStatus + ': ' + jqXHR.status + ' ' + errorThrown);
            $('#messageModal').modal('show');
        });
    });

    $('#championshipformsubmit').on('click', function () {
        var name = $('#championship-name').val();
        var description = $('#championship-description').val();
        var startdate = $('#championship-startdate').val();
        var enddate = $('#championship-enddate').val();
        var seasonid = parseInt($('#championship-season').val());
        var seriaid = parseInt($('#championship-seria').val());
        var conditionid = [];

        $('#championship-condition option').each(function (i, val) {
            if ($(this).is(':selected')) {
                conditionid.push(parseInt($(this).val()));
            }
        });
        $.ajax({
            url: "http://94.177.230.203:8080/sport/rest/championship/save",
            method: "POST",
            contentType: "application/json",
            username: "username",
            password: "password",
            data: {
                name: name,
                description: description,
                startdate: startdate,
                enddate: enddate,
                seasonid: seasonid,
                seriaid: seriaid,
                conditionid: conditionid
            }
        }).done(function (message) {
            $('#messageModal #messageModalMesage').html(message);
            $('#messageModal').modal('show');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#messageModal #messageModalMesage').html(textStatus + ': ' + jqXHR.status + ' ' + errorThrown);
            $('#messageModal').modal('show');
        });
    });

    $('#championsdiv').on('click', '.glyphicon-collapse-down', function () {
        $(this).closest('.championshipcontainer').find('.eventsdiv').toggle();
    });

});

document.addEventListener("DOMContentLoaded", function (event) {
    setTimeout(function () { $('[data-toggle="popover"]').popover(); }, 1000);
});

var fillSpecializationComboBox = function () {
    var sportid = $('#sport-name').val();
    $.ajax({
        url: "http://94.177.230.203:8080/sport/rest/sportspecialization/idname/" + sportid
    })
    .done(function (rslt) {
        var html = [];
        $.each(rslt, function (i, val) {
            htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
            html.push(htmlNode);
        })
        $('#sport-specialization').html(html.join("\n"));
    });
}

var fillConditionComboBox = function () {
    var conditiontypeid = $('#sport-conditiontype').val();
    $.ajax({
        url: "http://94.177.230.203:8080/sport/rest/condition/idname/all/" + conditiontypeid
    })
    .done(function (rslt) {
        var html = [];
        $.each(rslt, function (i, val) {
            htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
            html.push(htmlNode);
        })
        $('#sport-condition').html(html.join("\n"));
    });
}

var fillConditionComboBox2 = function () {
    var conditiontypeid = $('#championship-conditiontype').val();
    $.ajax({
        url: "http://94.177.230.203:8080/sport/rest/condition/idname/all/" + conditiontypeid
    })
    .done(function (rslt) {
        var html = [];
        $.each(rslt, function (i, val) {
            htmlNode = '<option value="' + val.id + '">' + val.name + ' </option>'
            html.push(htmlNode);
        })
        $('#championship-condition').html(html.join("\n"));
    });
}





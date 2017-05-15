var conditionTable;

$(document).ready(function () {
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
       $('#condition-type').html(html.join("\n"));
       $('#condition-type-filter').html(html.join("\n"));
       fillTable();
   });

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
       $('#condition-sport').html(html.join("\n"));
   });

    $('#condition-type-filter').on('change', function () {
        fillTable();
    });

    $('#conditiontable').on('refresh.bs.table', function (params) {
        fillTable();
    });
});

var fillTable = function () {
    var typeid = $('#condition-type-filter').val();
    $.ajax({
        url: "http://94.177.230.203:8080/sport/rest/condition/entity/all/" + typeid
    })
  .done(function (rslt) {
      var html = [];
      $.each(rslt, function (i, val) {
          var sportname;
          if (val.sport === null) {
              sportname = "";
          }
          else {
              var sport = val.sport;
              sportname = sport.name;
          }
          html.push({
              "name": val.name,
              "description": val.description,
              "sport": sportname,
              "minimum": val.minimum,
              "maximum": val.maximum,
              "equal": val.equal
          });
      })
      $('#conditiontable').bootstrapTable('load', html);
  });
}



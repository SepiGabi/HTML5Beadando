$(document).ready(function () {

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
       $('#specialization-sport').html(html.join("\n"));
       $('#specialization-sport-filter').html(html.join("\n"));
       fillTable();
   });

    $('#specialization-sport-filter').on('change', function () {
        fillTable();
    });

    $('#specializationtable').on('refresh.bs.table', function (params) {
        fillTable();
    });
});

var fillTable = function () {
    var sportid = $('#specialization-sport-filter').val();
    $.ajax({
        url: "http://94.177.230.203:8080/sport/rest/sportspecialization/entity/" + sportid
    })
  .done(function (rslt) {
      var html = [];
      $.each(rslt, function (i, val) {
          html.push({
              "name": val.name,
              "description": val.description
          });
      })
      $('#specializationtable').bootstrapTable('load', html);
  });
}

/*jslint node: true */
/*jslint browser: true */




function request(json, successCallback, errorCallback) {
    $.ajax({
        url: "http://localhost:8080/rest",
        type: "POST",
        data: JSON.stringify(json),
        async: true,
        success: successCallback,
        error: errorCallback
    })
}



$("#button").on('click', function() {
    var reqData = {event : "getdays", start : $("#year").val() + $("#month").val() + $("#day").val(), end : $("#year").val() + $("#month").val() + "20"};
    console.log(JSON.stringify(reqData));
    request(reqData,
        function (data) {
            var json = JSON.parse(data);
            var dayhtml = "";
            console.log(json);

            var periods = "";
            $.each(json, function(key, value) {
                $.each(value, function(key2, value2) {
                    dayhtml += ("<li>" + key2 + " : " + value2 + "</li>");
                });
                for (var ss = 0; ss < value.schedules.length; ss++) {
                    var pps = value.schedules[ss].periods;
                    for (var pp = 0; pp < pps.length; pp++) {
                        periods += "<li>" + pps[pp].name + "</li>";
                    }
                }
            });

            $("#periods").html(periods);
            $("#response").html(dayhtml);
            $("#response").addClass("updated");
        },
        function (err) {
            console.log(err);
        }
    );
});



function signinChanged() {

}

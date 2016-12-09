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

$("#groupinput").on("click", function() {                   //callback for input box click
    $("#confirmbtn").val($(this).val());                    //update confirmbutton to reflect content
    $("#groupselection").find("*").removeClass("selected"); //deselect everything
    $(this).addClass("selected");                           //select the input box
});

$("#confirmbtn").on("click", function() {
    if($("#groupinput").hasClass("selected"))   //update content again for that pesky input box
    {
        $("#confirmbtn").val($("#groupinput").val());
    }
    var json = {event: "joingroup", token : $.cookie("id_token"), groupID: $("#confirmbtn").val()}; //json request creation

    request(json, function(data) {          //make request to server and recieve data
        var dataJSON = JSON.parse(data);    //parse data string to jso
        console.log(dataJSON);
        if(dataJSON.success) {
            $.cookie("groupID", dataJSON.groupID);
            $("#message").html("Successfully joined group " + dataJSON.groupID + "!!!");
            window.location.replace("http://localhost:8080/search.html");
        } else {
            $("#message").html("Group not found!");
        }
    }, function(err) {
        $("#message").html("Error joining group!");
    })
});

function onSignIn(googleUser) {
    var auth2 = gapi.auth2.getAuthInstance();
    if(auth2.isSignedIn.get()) {
        var id_token = googleUser.getAuthResponse().id_token;
        var tokenJson = {event : "gapiverify", token : id_token};

        $("#message").html("Verifying account with server...");
        request(tokenJson, function(data) {
            console.log("DTATA :" + data);
            var dataJSON = JSON.parse(data);
            if(dataJSON.verified) {
                $.cookie("id_token", id_token);
                var groupID = $.cookie("groupID");
                if(groupID) {
                    $("#confirmbtn").val(groupID);
                    $("#confirmbtn").trigger("click");
                } else {
                    $("#groupselection").removeClass("hidden");
                    if(dataJSON.groups.length) {
                        var groupHTML = "";
                        for(group in dataJSON.groups) {
                            groupHTML += "<li>" + dataJSON.groups[group] + "</li>";
                        }
                        $("#groups").html(groupHTML);
                        $("#groups li").on("click", function() {
                            $("#confirmbtn").val($(this).html());
                            $("#groupselection").find("*").removeClass("selected");
                            $(this).addClass("selected");
                        });
                    }
                }
            }
        }, function(err) {
            console.log(err);
        })
    }
    auth2.isSignedIn.listen(signinChanged);
    auth2.currentUser.listen(userChange);
}

function userChange() {

}
function signinChanged() {

}

$(document).ready(function() {


});

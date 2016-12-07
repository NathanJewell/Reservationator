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

function serializeToJSON(domref) {
    var fragged = $(domref).serializeArray();
    fragged = fragged.concat(
    $(domref + " input[type=checkbox]").map(
        function() {
            return {"name": this.name, "value": this.value}
        }).get()
    );
    var ret = {};
    for (var  input in fragged)   //cycle through JSON keys (representing stuff that will be added to form)
    {
        ret[fragged[input].name] = fragged[input].value;
    }
    return ret;
}

var getTypeJSON = { event : "getgrouptypes", group : $.cookie("groupID"), token : $.cookie("id_token")}
request(getTypeJSON, (data) => {
	var dataJSON = JSON.parse(data);
	var typeoption = "";
	for(type in dataJSON.types) {
		typeoptions += "<option>" + dataJSON.types[type] + "</option>";
	}
	$("#typeoptions").append(typeoptions);
}, (err) => {
	console.log("ERROR GETTING TYPES!!!")
})

var getPeriodsJSON = { event : "getgroupperiods", group : $.cookie("groupID"), token : $.cookie("id_token")}


$("#searchbutton").on("click", () => {
	var req = serializeToJSON("#searchform");
	req.event = "getavaliability";
	req.token = $.cookie("id_token");
	req.group = $.cookie("groupID");
	request(req, (data) => {
		var dataJSON = JSON.parse(data);
		//magic stuff to make calendar happen
	}, (err) => {

	})
});

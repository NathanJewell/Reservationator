function FormMaker()
{
    this.formStr = ""
    this.createForm = function(formJSON, id)
    {
        this.formStr = "";
        this.formStr += "<form id=" + id + ">"
        for (var key in formJSON)   //cycle through JSON keys (representing stuff that will be added to form)
        {
            if (formJSON.hasOwnProperty(key))
            {
                if (formJSON[key].length === 2)
                {
                    this.addInput(key, formJSON[key][0], formJSON[key][1])
                }
                else if (formJSON[key].length === 1)
                {
                    this.addInput(key, formJSON[key][0])
                }
            }
        }
        this.formStr += "</form>";
        return this.formStr;
    }
    this.addName = function(name, lineBreaks)
    {
        this.formStr += name;
        this.formStr += ": \t";
        this.addLineBreak(lineBreaks);
    }
    this.addInput = function(name, type, xdef)
    {
        if(type != "event" && type != "button" && type != "submit") {
            this.addName(name);
        }
        if (type === "text")
        {
            if (!xdef)
            {
                this.addEmptyText(name);
            }
            else
            {
                this.addFilledText(name, xdef[0]);
            }
        }
        else if (type === "radio")
        {
            this.addRadioButton(name, xdef[0], xdef[1]);
        }
        else if ((type === "select") || (type === "drop"))
        {
            this.addSelect(name, xdef);
        }
        else if (type === "button")
        {
            this.addButton(name, xdef);
        }
        else if (type === "checkbox")
        {
            this.addCheckbox(name, xdef);
        }
        else if (type === "submit")
        {
            this.addSubmit(name);
        }
    }

    this.addEmptyText = function(name)
    {
        this.formStr += "<input type=text"
        this.formStr += " name="
        this.formStr += name
        this.formStr += "><br>"
    }

    this.addFilledText = function(name, value)
    {

        this.formStr += "<input type=text"
        this.formStr += " name="
        this.formStr += name
        this.formStr += " value="
        this.formStr += value
        this.formStr += "><br>"
    }

    this.addRadioButton = function(name, value, checked)
    {
        this.formStr += "<input type=radio"
        this.formStr += " name="
        this.formStr += name
        this.formStr += " value="
        this.formStr += value
        if (checked === true)
        {
            this.formStr += " checked"
        }
        this.formStr += ">" + value + "<br>"
    }

    this.addSubmit = function(text)
    {
        this.formStr += "<input type=submit"
        this.formStr += " class=submit form=formgen value="
        this.formStr += text
        this.formStr += "><br>"
    }

    this.addSelect = function(name, value_names)
    {
        this.formStr += "<select name="
        this.formStr += name + ">"
        for (var i = 0 ; i < value_names.length; i++)
        {
            this.addOption(value_names[i][0], value_names[i][1], value_names[i][2])
        }
        this.formStr += "</select>"
        this.formStr += "<br>"
    }

    this.addOption = function(value, name, selected)
    {
        this.formStr += "<option value="
        this.formStr += value
        if (selected == true)
        {
            this.formStr += " selected"
        }
        this.formStr += ">"
        this.formStr += name + "</option>"
    }

    this.addButton = function(name, id)
    {

        this.formStr += "<button type=button id="
        this.formStr += id
        this.formStr += ">"
        this.formStr += name
        this.formStr += "</button>"
        this.formStr += "<br>"
    }

    this.addCheckbox = function(name, value)
    {
        this.formStr += "<input type=checkbox value="
        this.formStr += value
        this.formStr += " name="
        this.formStr += name
        this.formStr += ">"
        this.formStr += "</input><br>"
    }
    this.clearForm = function()
    {
        this.formStr = ""
    }
    this.addLineBreak = function(num)
    {
        for (var i = 0; i < num; i++)
        {
            this.formStr += "<br>"
        }
    }

}

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
});

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

var getPeriodsJSON = { event : "getgroupperiods", group : $.cookie("groupID"), token : $.cookie("id_token")}

function appendToken(json) {
    json.token = $.cookie("id_token");
    return json
}

$("#admintoggle").on("click", () => {
    $("#adminpane").toggleClass("hidden");
});


function setupForms() {
    //really should choose action here but for now.....
    var former = new FormMaker();
    var formJSON =  //form for making a new group
    {
        "event" : "creategroup",
        "name" : ["text", ["Room_113"]],
        "description" : ["text"],
        "restrictive" : ["checkbox", [1]],
        "Create Group" : ["button", ["makegroupbtn"]]
    }
    var formJSON2 = //form for making a new resource type
    {
        "event" : "createresourcetype",
        "name" : ["text", ["name"]],
        "properties" : ["text"],
        "Create Resource Type" : ["button", ["maketypebtn"]]
    }
    var formJSON3 = //form for making a resource instance
    {
        "event" : "createresourceinstance",
        "typename" : ["text", ["type"]],
        "Create Resource" : ["button", ["makeresourcebtn"]]
    }

    var formString = former.createForm(formJSON, "makegroup");
    var formString2 = former.createForm(formJSON2, "maketype");
    var formString3 = former.createForm(formJSON3, "makeresource")
    $("#adminpane").append(formString + formString2 + formString3);

    function reqForm(jqobj, json, message, err) {
        var req = serializeToJSON(jqobj);
        req.event = json.event;
        appendToken(req);
        req.group = $.cookie("group_id");
        console.dir(req);

        request(req, (data)=> {
            var dataJSON = JSON.parse(data);
            if(dataJSON.success) {
                $("#message").html(message);
            }
        }, (err) => {
            $("#message").html("ERROR: " + err);
        });
    }
    $("#makegroupbtn").on("click", ()=> {
        reqForm("#makegroup", formJSON, "created new group", "group not created");
    });
    $("#maketypebtn").on("click", ()=> {
        reqForm("#maketype", formJSON2, "created new resource type", "resource type not created");
    });
    $("makeresourcebtn").on("click", ()=> {
        reqForm("makeresource", formJSON3, "created new resource instance", "resource instance creation failed");
    });
}

setupForms();

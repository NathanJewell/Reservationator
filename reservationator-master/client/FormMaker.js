function FormMaker()
{
    var this.formStr = ""
    var this.createForm = function(formJSON)
    {
        this.formStr += "<form id=formgen>"
        for (var key in formJSON)   //cycle through JSON keys (representing stuff that will be added to form)
        {
            if (formJSON.hasOwnProperty(key))
            {
                this.addName(key)
                if (jsonOBJ[key].length === 2)
                {
                    this.addInput(key, jsonOBJ[key][0], jsonOBJ[key][1])
                }
                else if (jsonOBJ[key].length === 1)
                {
                    this.addInput(key, jsonOBJ[key][0])
                }
            }
        }
        this.formStr += "</form>";
        return this.formStr;
    }
    this.addName = function(name, lineBreaks)
    {
        formStr += name;
        formStr += ": \t";
        addLineBreak(lineBreaks);
    }
    this.addInput = function(name, type, xdef)
    {
        if (type === "text")
        {
            if (!xdef)
            {
                addEmptyText(name);
            }
            else
            {
                addFilledText(name, xdef[0]);
            }
        }
        else if (type === "radio")
        {
            addRadioButton(name, xdef[0], xdef[1]);
        }
        else if ((type === "select") || (type === "drop"))
        {
            addSelect(name, xdef);
        }
        else if (type === "button")
        {
            addButton(name, xdef);
        }
        else if (type === "checkbox")
        {
            addCheckbox(name, xdef);
        }
        else if (type === "submit")
        {
            addSubmit(name);
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
            addOption(value_names[i][0], value_names[i][1], value_names[i][2])

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

    this.addButton = function(name, onclick)
    {

        this.formStr += "<button type=button onclick="
        this.formStr += onclick
        this.formStr += ">"
        this.formStr += name
        this.formStr += "</button>"
        this.formStr += "<br>"
    }

    this.addCheckbox = function(name, value)
    {
        this.formStr += "<input type=checkbox checked=value>"
        this.formStr += name
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

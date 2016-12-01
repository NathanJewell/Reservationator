function getFirstDate(){
    var date = today;
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
}

function getLastDate(){
    var date = today;
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
}

function back(){
    today.setMonth(today.getMonth()-1);
    populate()
}

function forward(){
    today.setMonth(today.getMonth()+1);
    populate()
}


var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
var today = new Date(); 
var realToday = new Date();//<---------------------------------------------------------------------------------------------------------------------------Insert Date Here <--Leave blank for today

function populate(){

    var calDates = [];
    var y = 0;

    for(i=0; i<7; i++){
        for(j=2; j<8; j++){
            document.getElementById("calander").rows[j].cells[i].innerHTML = '';
            document.getElementById("calander").rows[j].cells[i].style.backgroundColor='#FFFFFF';
            console.log("cleared: " + j + " , " + i);
        }
    }

    document.getElementById("calander").rows[0].cells[0].innerHTML = monthNames[today.getMonth()] + " " + today.getFullYear();

    for(i = 0; i<7; i++){
        calDates[i] = [];
        for(j = 0; j<6; j++){
            calDates[i][j] = 0;
        }
    }


    for(i = 0; i<Number(getLastDate().getDate()); i++){
        x = Number(new Date(today.getFullYear(),today.getMonth(),i+1).getDay());
        calDates[x][y] = i+1;
        document.getElementById("calander").rows[y+2].cells[x].innerHTML = calDates[x][y];
        document.getElementById("calander").rows[y+2].cells[x].setAttribute("class", "daybutton");

        document.getElementById("calander").rows[y+2].cells[x].setAttribute("date", today.getFullYear() + " " +  today.getMonth() + " " + calDates[x][y]);
        if(x==6){y++;}
        if(i+1 == Number(realToday.getDate()) && today.getMonth() == realToday.getMonth()){
            document.getElementById("calander").rows[y+2].cells[x].style.backgroundColor='#008CBA';        
        }
    }
}

populate();



var modal = document.getElementById("schedule");
var table = document.getElementById("calander");
var closeBtn = document.getElementById("close");


$("#calander .daybutton").on("click", ()=>{
    $("#schedule").addClass("show");
    var selectedday = $(this).attr("date");
    console.log(selectedday);
    var requestJSON = {

    }
    var contentJSON = 0;
    //$("#schedule")
})


$("#close").on("click", ()=>{
    $("#schedule").removeClass("show");
})

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        }
}

function dropBtn1(){
    document.getElementById("dropdown1").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.addResource')) {
        var dropdowns = document.getElementsByClassName("dropdown1-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

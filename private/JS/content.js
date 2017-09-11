//GLOBAL VARIABLES FOR TASKS AND LISTS.
var counterList = 0;
var listName = [];
var listTasks = [];
var taskCounter = [];

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
var pending_tasks = 0;
var done_tasks = 0;
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
$(function () {
     //RETRIEVING DATA FOR LOCAL VARIABLES
      retrieveData();
    // MATERIALIZE INITIALIZER FUNCTION STARTS.
    $('.button-collapse').sideNav({
        menuWidth: 250,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        onOpen: function(el) {  },
      onClose: function(el) {  },
    });
    $('.button3-collapse').sideNav({
        menuWidth: 300,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        onOpen: function(el) {  },
        onClose: function(el) { },
    });
    $('.collapsible').collapsible();
    $('.dropdown-button').dropdown({
            constrainWidth: false,
            hover: true,
            gutter: 3,
            belowOrigin: true,
            alignment: 'right',
            stopPropagation: false
        }
    );
    //MATERIALIZE INITIALIZER FUNCTION ENDS.

    //******************************************************LOHITAKSH*************************************************************************//  //GOOGLE CHART APIs BEGIN

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    //google.charts.load('current', {'packages':['bar']});
    google.charts.load('current', {'packages':['table']});
    // Set a callback to run when the Google Visualization API is loaded.

    google.charts.setOnLoadCallback(drawChart1);
    google.charts.setOnLoadCallback(drawChart2);
    //google.charts.setOnLoadCallback(drawStuff);
    google.charts.setOnLoadCallback(drawTable);

    //Google chart call ends

    //Number counting begins
    $("#statistic_num1").html($(`<div><p id="statistic_num">999</p></div>`));  //HERE REPLACE 999 BY ${i} i.e. a variable to assign
    $("#statistic_num1").css("font-size", "60px");
    $('#statistic_num1').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 2100,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $("#statistic_num2").html($(`<div><p id="statistic_num">999</p></div>`));  //HERE REPLACE 999 BY ${i} i.e. a variable to assign
    $("#statistic_num2").css("font-size", "60px");
    $('#statistic_num2').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 2100,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    //Number counter ends

    //collapsible data
    $('.collapsible').collapsible();
    //------------------------
//******************************************************LOHITAKSH******************************************************************



    //DISPLAYS DATA OF HOME PAGE ON CLICKING LOGO.
    $('.homeImg').click(function(){
        $('.listHeadingContent').css("display","none");
        $('.contentHomePage').css("display","block");
    })

    //HIDES DATA ON listHeadingContent CLASS.
    $('.listHeadingContent').css("display","none");

    //PERFORMS DIFFERENT FUNCTIONS ON INDIVUAL LISTS AND THEIR TASKS.
    $('.addListBtn').click(function() {
        var listValue = $('.addList').val();
        listName[counterList] = listValue;
        taskCounter[counterList] = 0;
        listTasks[counterList] = [];
        counterList++;
        if(counterList == 1)
            storeData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
        else
          updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
    });

    //EXTRACTING DATABASE TO GET INFORMATION ABOUT USER LOGGED IN.
    $.get('/datainfo',function (data) {
        console.log(data);
      $('.usernameSideNav').html(`${data[0].firstname} ${data[0].lastname}`);
      $('.emailSideNav').html(`${data[0].email}`)
    })
});

//INITIALISER FOR MODAL CLASS.
$(document).ready(function(){
    $('.modal').modal();
    $('.modalDemo').click(function() {
        $('#modal1').modal('open');
    });
});

// Kind Of initializer for task Object.
function Task(a,b,c)
{
    this.task = a;
    this.date = b;
    this.time = c;
    this.sent = false;
}

//Validation of different fields
function validateFields(a,b,c) {
    if(a.length==0) {
        alert("Task Field Empty");
        return 0;
    }
    else {
        return validateTimeandDate(b,c);
    };
}
function validateTimeandDate(date,time){
      if(date.length != 8)
      {
          alert("Date is not in Valid Form")
          return 0;
      }
      var year = date.substring(6,8);
      date = date.substring(0,6);
      date += "20" + year;
      console.log(date);
      if(!checkTime(time))
          return 0;
      else {
          date = new Date(date);
          date = moment(date);
          if(!date.isValid())
          {
              alert("Date not in valid Form");
              return 0;
          }
          else
         return checkForNegativeResidual(date,time);
      }
}
function checkForNegativeResidual(givenDate,givenTime){
    var currentTime = Date.now();
    //console.log(currentTime);
    currentTime  = new Date(currentTime);
    currentTime = moment(currentTime);
    currentTime = currentTime.tz("Asia/Kolkata")._d;
  //  console.log(currentTime);
    currentTime = Date.parse(currentTime);

    givenDate = new Date(givenDate);
    givenDate = moment(givenDate);
    //console.log(givenDate)
    givenDate = moment(givenDate).add(1,'days')._d;
    givenDate.setUTCHours(0,0,0);
    console.log(givenDate);
    givenDate = Date.parse(givenDate);

    var givenArray = givenTime.split(':');
    givenTime = givenArray[0]*60*60*1000 + givenArray[1]*60*1000;

    var residualTime = givenDate - currentTime + givenTime;
    //console.log(residualTime);
    if(residualTime > 0)
        return 1;
    else
    {
        alert("Current Time cannot be greater than GivenDateTime")
        return 0;
    }
}
function checkTime(time){
    var arrayTime = time.split(':');
    console.log(arrayTime);
    arrayTime[0] = parseInt(arrayTime[0]);
    arrayTime[1] = parseInt(arrayTime[1]);
    //console.log(arrayTime);
    if(arrayTime.length != 2)
    {
        alert("Time is not in Proper Format1");
        return 0;
    }
    if(!(0<=arrayTime[0]&&arrayTime[0]<=23))
    {
        alert("Time is not in Proper Format2");
        return 0;
    }
    if(!(0<=arrayTime[1]&&arrayTime[1]<=59))
    {
        alert("Time is not in Proper Format3");
        return 0;
    }
    return 1;
}

// Validating time and date ends And Front End UI Work for Task Added Starts.
//Sourabh Code 1.
function showContentTask(a) {
    if (taskCounter[a - 1] == 0)
        $('.contentTask').css("display", "none");
    else {
        $('.contentTask').empty();
        for (let j in listTasks[a - 1]) {
            $('.contentTask').css("display","block");
            $('.contentTask').append(`    <li id="list${parseInt(a-1)+1}Task${parseInt(j)+1}">
             <div class="collapsible-header" style="background-color: #a1887f"><img class="brand-logo responsive-img" src="logo.png" height="30" width="30">&nbsp; &nbsp; ${listTasks[a-1][j].task}
             <div style="position: absolute; right: 10px; cursor: pointer" id="deleteList${parseInt(a-1)+1}Task${parseInt(j)+1}"><i class="fa fa-times"></i></div></div>
             <div class="collapsible-body" style="background-color: white"><span><b>Date</b> : ${listTasks[a-1][j].date}</span><span style="float: right"><b>Time:</b> ${listTasks[a-1][j].time}</span></div>
            </li>
            `);
           // linkTimeTask(listTasks[a-1][j],a-1,j);

            $(`#deleteList${parseInt(a-1)+1}Task${parseInt(j)+1}`).click(function(){
                var workingId = jQuery(this).attr("id");
                 let ListId = '';

                 for (var j = 10; j < workingId.length; j++)
                 {
                     if(isNaN(Number(workingId[j])))
                         break;
                     ListId += workingId[j];
                 }
                 let taskId = '';
                 let k = workingId.length - 1;
                 while(!isNaN(workingId[k])){
                     taskId += workingId[k];
                     k--;
                 }
                 taskId = reverseString(taskId);
                 ListId = parseInt(ListId);
                 taskId = parseInt(taskId);

                 listTasks[ListId - 1].splice(taskId - 1,1);
                 taskCounter[ListId - 1]--;

                updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
                pending_tasks--
                update_piechart(done_tasks,pending_tasks)
                retrieveData();
                drawTable()
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////

              //  deleteLinkTimeTask(listTasks[a-1][j])
            })
        }
    }
}
//reversing String
function reverseString(a){
    var splitString = a.split("");
    var reverseArray = splitString.reverse();
    var joinString = reverseArray.join("");

    return joinString;
}
//Sourabh Code 1.

//Storing/Updating Data in Database.
function storeData(a,b,c,d){
    $.post('/storeDatabase',{name : a,counter : b, Tasks : c, counterList: d},function(data){
        if(data.success == true)
        {
            console.log("true success");
            refreshSystem();

        }
        else if(data.success == false)
        {
            console.log("succeess22");
            updateData(a,b,c,d);
        }
    });
}
function updateData(a,b,c,d){
    $.post('/updateDatabase',{name : a,counter : b, Tasks : c, counterList: d},function(data){
        if(data.success == true)
            console.log("success");
    });
    refreshSystem();
}

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
function update_piechart(a,b){
    $.post('/updatePieChart',{ done_tasks: a,pending_tasks : b},function(data){
        if(data.success == true) {
            console.log("success");

            //**************SHOULD USE CALLBACK/PROMISE HERE

            retrieveData();
            drawChart1();
            drawChart2();
        }
    });
}
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////


//Sourabh Code 2

function linkTimeTask(a,ListId,taskId){
    var correctFormatDate =  correctFormat(a.date);
   // console.log(correctFormatDate);
    var R_Time = createResidualTime(correctFormatDate,a.time);
    $.post('/send',{taskName: a.task,residualTime : R_Time},function(data){
        if(data.success == true) {
            listTasks[ListId].splice(taskId - 1,1);
            taskCounter[ListId]--;
            updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
            console.log("successfully send the email");
        }
    })
}

function correctFormat(d){
    var splitArray = d.split('/');
    splitArray[2] = "20" + splitArray[2];
    return splitArray.join('/');
}
function createResidualTime(d,t){
    var currentTime = Date.now();

    currentTime  = new Date(currentTime);
    currentTime = moment(currentTime);
    currentTime = currentTime.tz("Asia/Kolkata")._d;
    currentTime = Date.parse(currentTime);

    var givenDate = String(d);
    givenDate = new Date(givenDate);
    givenDate = moment(givenDate);
    givenDate = moment(givenDate).add(1,'days')._d;
    givenDate.setUTCHours(0,0,0);
    givenDate = Date.parse(givenDate);
//    console.log("given Date :" + givenDate);

    var givenTime = String(t);
    var givenArray = givenTime.split(':');
    givenTime = givenArray[0]*60*60*1000 + givenArray[1]*60*1000;
//    console.log("given Time: " + givenTime);

    var residualTime = givenDate - currentTime + givenTime;
    console.log(residualTime);

     return residualTime;
}
//Sourabh Code 2
//For refreshing System After any Kind of Change in database.
function refreshSystem(){
    $('.allLists').empty();

    for(var i in listName)
    {

            $('.allLists').append(`
                        <li id= "list${parseInt(i)+1}"><a id = "listDelete${parseInt(i)+1}" style="float: right; cursor: pointer"><i class="fa fa-times"></i></a><a href="#!"><i class="fa fa-list"  aria-hidden="true"></i>
                            ${listName[i]}</a></li>`);

        showContentTask(parseInt(i)+1);

        $(`#list${parseInt(i)+1}`).click(function (event) {
            $('.contentHomePage').css("display", "none");
            var currentListId = jQuery(this).attr("id");
            $('.listHeadingContent').css("display", "block");

            let sequenceListId = '';
            for (var j = 4; j < currentListId.length; j++)
                sequenceListId += currentListId[j];

            sequenceListId = parseInt(sequenceListId);
            $('.listHeadingContent').children()[0].children[0].innerText = listName[sequenceListId - 1];
            $('.addTaskBtn').attr("id", "click" + sequenceListId);

            showContentTask(sequenceListId);

            var clickObject = document.getElementsByClassName('addTaskBtn');
            console.log(clickObject)
            clickObject[0].onclick = function (event) {
                var currentClickId = event.target.parentElement.id;
                // console.log(event.target.parent);
                let sequenceClickId = '';
                for (var j = 5; j < currentClickId.length; j++)
                    sequenceClickId += currentClickId[j];
                sequenceClickId = parseInt(sequenceClickId);
                console.log(sequenceClickId);
                if (validateFields(($('#taskAdder').val()), $('#DateAdder').val(), $('#TimeAdder').val())) {
                    console.log("2");
                    listTasks[sequenceClickId - 1][taskCounter[sequenceClickId - 1]] = new Task($('#taskAdder').val(), $('#DateAdder').val(), $('#TimeAdder').val());
                    console.log(listTasks);
                    taskCounter[sequenceClickId - 1]++;
                    showContentTask(sequenceClickId);
                    updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
                    pending_tasks++
                    update_piechart(done_tasks,pending_tasks)
                    drawTable();
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
                }
                //console.log(listTasks);

            };
        })

        $(`#listDelete${parseInt(i)+1}`).click(function(event){
            var currentListId = jQuery(this).attr("id");
            let sequenceListId = '';
            for (var j = 10; j < currentListId.length; j++)
                sequenceListId += currentListId[j];
            sequenceListId = parseInt(sequenceListId);
            console.log(sequenceListId);
            for(var i in listName){
                if(i == sequenceListId - 1)
                {
                    listName.splice(i,1);
                    counterList--;
                    listTasks.splice(i,1);
                    taskCounter.splice(i,1);
                    break;
                }
            }
          //  console.log(listName);
            updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
            retrieveData();
            drawTable();
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////

        })
    }
}

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////
// For retrieving Data from Database. Only executed at Start of Webpage.
function retrieveData() {
    $.get('/retrieveData',function(data){
        if(data != null) {
            counterList = data.userListCounter;
            listName = JSON.parse(data.userListName)
            listTasks = JSON.parse(data.userListData);
            taskCounter = JSON.parse(data.userListTaskCounter);
            refreshSystem();
        }
    })
    $.get('/retrievePieChart',function (data) {
        if(data != null)                                                      //**************SHOULD USE CALLBACK/PROMISE HERE
        {
            done_tasks=data.TaskDoneCounter;
            pending_tasks=data.TaskNotDoneCounter;
            refreshSystem()
        }
    })
   // refreshSystem();
}

//BELOW FUNCTIONS DRAW CHARTS
function drawChart1() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task Type');
    data.addColumn('number', 'Count');
    data.addRows([
        ['Pending Tasks', pending_tasks],
        ['Completed Tasks', done_tasks],
    ]);

    // Set chart options
    var options = {'title':'YOUR TASK STATISTICS',
        'is3D':true,
        'width':500,
        'height':250,
        'backgroundColor': { fill:'transparent' },
        'sliceVisibilityThreshold': .0001
    };

    // Instantiate and draw our chart, passing in some options.
    var chart1 = new google.visualization.PieChart(document.getElementById('chart_div1'));
    chart1.draw(data, options);
}
function drawChart2() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task Type');
    data.addColumn('number', 'Count');
    data.addRows([
        ['Pending Tasks', pending_tasks],
        ['Completed Tasks', done_tasks],
    ]);

    // Set chart options
    var options = {'title':'YOUR TASK STATISTICS',
        'is3D':true,
        'width':310,
        'height':250,
        'backgroundColor': { fill:'transparent' },
        'sliceVisibilityThreshold': .0001
    };

    // Instantiate and draw our chart, passing in some options.
    var chart2 = new google.visualization.PieChart(document.getElementById('chart_div2'));
    chart2.draw(data, options);
}

function cal_table_stats(name_of_list,task_in_lists) {
    e=[];
    for ( var i=0;i<name_of_list.length;i++) { e[i] = [name_of_list[i],task_in_lists[i]] }
    e.sort(function descc(a,b){return (b[1]-a[1])});
    f=[]
    for(var i=0; i<5 && i<e.length;i++){f[i]=e[i]}
    return f;
}
function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'LIST NAMES WITH MOST TASKS');
    data.addColumn('number', 'COUNT IN DESC ORDER');
    data.addRows(cal_table_stats(listName,taskCounter));

    var table1 = new google.visualization.Table(document.getElementById('table_div1'));
    var table2 = new google.visualization.Table(document.getElementById('table_div2'));

    table1.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    table2.draw(data, {showRowNumber: true, width: '100%', height: '50%'});
}

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////

//Sourabh//

$(document).ready(function() {
    function setHeight() {
        windowHeight = $(window).innerHeight();
        $('.contentHomePage').css('min-height', windowHeight);
    };
    setHeight();

    $(window).resize(function() {
        setHeight();
    });
});

//Sourabh//
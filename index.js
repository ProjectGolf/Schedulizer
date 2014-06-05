function buildSchedule(){

	//builds actual schedule
	var userInput = getUserInput();
      var start = userInput.startTime.concatTime;
      var end = userInput.endTime.concatTime;
	var validated = validateForm(userInput);
	if (validated = true){
		var courseArrays = queryCourseData(start, end, userInput.optionalCourses, userInput.requiredCourses, userInput.numOptCourses, userInput.numReqCourses);
		console.log(courseArrays);
    var optCourses = courseArrays[0];
    var reqCourses = courseArrays[1];
    console.log("optCourses: "+optCourses);
    console.log("reqCourses: "+reqCourses);
    //algorithm(userInput.numOfCoursesToSchedule, optCourses, reqCourses);
	}
}

function getUserInput(){
	//obtains user input from form
	var courseInputs = document.getElementById('Courses').getElementsByTagName('input');
	var checkboxCount=0;
	for (var i=0; i<courseInputs.length; i++) {
		if (courseInputs[i].type === "checkbox") { checkboxCount++;}
	}
	var numCourses = (courseInputs.length-checkboxCount)/2;
	var numOfCoursesToSchedule = Number(document.getElementById('numOfCourses').value);

	var h1 = document.getElementById("startHour");
	var m1 = document.getElementById("startMinute");
	var tod1 = document.getElementById("startTimeOfDay");
	var h2 = document.getElementById("endHour");
	var m2 = document.getElementById("endMinute");
	var tod2 = document.getElementById("endTimeOfDay");

    var startHr = Number(h1.options[h1.selectedIndex].value);
    var startMin= Number(m1.options[m1.selectedIndex].value);
    var startTod= tod1.options[tod1.selectedIndex].value;
    var endHr = Number(h2.options[h2.selectedIndex].value);
    var endMin= Number(m2.options[m2.selectedIndex].value);
    var endTod= tod2.options[tod2.selectedIndex].value;
    if(startTod =="PM") startHr = startHr+12;
    if(endTod=="PM") endHr = endHr+12;

    var H1="";
    var H2="";
    var M1="";
    var M2="";
    if (startHr<10){H1 = "0"+startHr;}
    else{H1= startHr;}
    if (startMin<10){M1 = "0"+startMin;}
    else{M1=startMin;}
    if (endHr<10){H2 = "0"+endHr;}
    else{H2= endHr;}
    if (endMin<10){M2 = "0"+endMin;}
    else{M2=endMin;}

    var startTime={
        hour: startHr,
        minute: startMin,
        concatTime: H1+":"+M1+":00"
    };
    var endTime={
        hour: endHr,
        minute: endMin,
        concatTime: H2+":"+M2+":00"
    };


	var reqCourses = [];
	var optCourses = [];
	var numReq = 0;
	var numOpt = 0;
	var subj = "";
	var courseNum = "";


	for (var i=1; i<=numCourses; i++){
		subj = document.forms["Course"+i]["Subj"+i].value;
		courseNum = document.forms["Course"+i]["CourseNum"+i].value;

		if (document.getElementById("required"+i).checked==true){
			if((subj!=null && subj!="")||(courseNum!=null && courseNum!="")){
				reqCourses.push({ subject: subj, courseNumber: courseNum});
				numReq++;
			}
		}
		else{
			if((subj!=null && subj!="")||(courseNum!=null && courseNum!="")){
				optCourses.push({subject: subj, courseNumber: courseNum});
				numOpt++;
			}
		}
	}

	var UserInput = {
		startTime: startTime,
		endTime: endTime,
		numOfCoursesToSchedule: numOfCoursesToSchedule,
		numReqCourses: numReq,
		numOptCourses: numOpt,
		requiredCourses: reqCourses,
		optionalCourses: optCourses
	};
	return UserInput;
}

function validateForm(userInput){

	//if there are more courses to schedule than the number of courses entered, report an error
	var totalCourses = userInput.numReqCourses + userInput.numOptCourses;
	if (userInput.numOfCoursesToSchedule>totalCourses){
		alert("Error! The total number of courses you want to put in schedule is greater than total number of courses you entered information for."); 
		return false;
	}

	//If start time is later than end time, report an error
	if (userInput.startTime.hour>userInput.endTime.hour){
		alert("Error! The start time is later than the end time.");
		return false;
	}
	if(userInput.startTime.hour==userInput.endTime.hour){
		if (userInput.startTime.minute>=userInput.endTime.minute) { 
			alert("Error! The start time is later than or equal to the end time.");
			return false;
		}
	}

	//If both course inputs aren't entered for a course, report an error
	for (var i = 0; i<userInput.numReqCourses; i++){
		var subject = userInput.requiredCourses[i].subject;
		var courseNumber = userInput.requiredCourses[i].courseNumber;
		if((subject==null || subject=="")|| (courseNumber==null|| courseNumber=="")){
			alert("Error! For all courses entered, both course subject and course number must be provided.");
			return false;
		}
	}
	for (var i = 0; i<userInput.numOptCourses; i++){
		var subject = userInput.optionalCourses[i].subject;
		var courseNumber = userInput.optionalCourses[i].courseNumber;
		if((subject==null || subject=="")||(courseNumber==null|| courseNumber=="")){
			alert("Error! For all courses entered, both course subject and course number must be provided.");
			return false;
		}
	}
	return true;
}

function queryCourseData(startTime, endTime, optCourses, reqCourses, numOptCourses, numReqCourses){
	
	var numClasses = optCourses.length;
	var OptclassList = [];
  var OptcourseArray = [];
	var i = 0;
  for(var m = 0; m < numClasses; m++){
    $.ajax({
      async: false,
      url: "http://vazzak2.ci.northwestern.edu/courses/?term=4540&subject="+optCourses[m].subject,
      success: function(result) {
        $(result).each(function (index, item) {
          if (item.start_time > startTime) {
            if (item.end_time < endTime){
              if (item.catalog_num == optCourses[m].courseNumber){
                var coursject = {
                  title: item.title,
                  professor: item.instructor.name,
                  catalog_num: item.catalog_num,
                  section: item.section,
                  subject: item.subject,
                  meeting_days: item.meeting_days,
                  start_time: item.start_time,
                  end_time: item.start_time
                };
               OptclassList[i] = coursject;
               
               i++;
              }
            }
          }        
          });
      }
    });
    }
  	
   	for(var j = 0; j < numOptCourses; j++){
   		var catNum = optCourses[j].courseNumber;
      var subj = optCourses[j].subject;
      var myArray = [];
   		for(var h = 0; h<OptclassList.length; h++){
   				if ((OptclassList[h].catalog_num == catNum)&&(OptclassList[h].subject==subj)){
   					myArray.push(OptclassList[h]);
            console.log("match found. index = " +h)
            console.log(myArray);
   				}
  	 	}	
   	  OptcourseArray.push(myArray);
   	}
        
    var ReqclassList = [];
    var ReqcourseArray = [];
    var g =0;
    for(var n = 0; n < reqCourses.length; n++){
      $.ajax({
      async: false,
      url: "http://vazzak2.ci.northwestern.edu/courses/?term=4540&subject="+reqCourses[n].subject,
      success: function(result) {
        $(result).each(function (index, item) {
          if (item.start_time > startTime) {
            if (item.end_time < endTime){
              if (item.catalog_num == reqCourses[n].courseNumber){
                var coursject = {
                  title: item.title,
                  professor: item.instructor.name,
                  catalog_num: item.catalog_num,
                  section: item.section,
                  subject: item.subject,
                  meeting_days: item.meeting_days,
                  start_time: item.start_time,
                  end_time: item.start_time
                };
                ReqclassList[g] = coursject;
                g++;
              }
            }
          }
        });
      }
    });
    }
       	
   	for(var j = 0; j < numReqCourses; j++){
      var catNum = reqCourses[j].courseNumber;
      var subj = reqCourses[j].subject;
      var myArray = [];
   		for(var h = 0; h<ReqclassList.length; h++){
   				if ((ReqclassList[h].catalog_num == catNum)&&(ReqclassList[h].subject == subj)){
            console.log("match found. index = " +h);
   					myArray.push(ReqclassList[h]);
   				}
  	 	}	
   	ReqcourseArray.push(myArray);
   	}
        
    return [OptcourseArray, ReqcourseArray];          
}


	//Global variable tracking which schedule is currently being looked at
    var scheduleNum = -1;
    //Global array tracking the schedules
    var arraySchedules = [];

    function algorithm(numCourses, optCourses, reqCourses){
    	//optCourses = array of optional courses
    	//reqCourses = array of required courses

  		var reqCo1Se1 = new course("10:00","11:00","MoWeFr");
  		var reqCo1Se2 = new course("9:00","10:00","MoWeFr");
  		var reqCo2Se1 = new course("10:30","12:00","MoWe");
  		var reqCo2Se2 = new course("13:00","14:00","TuTh");
  		var reqCo2Se3 = new course("14:30","15:30","TuTh");

  		var optCo1Se1 = new course("15:00","16:00","MoWeFr");
  		var optCo1Se2 = new course("14:00","15:30","WeFr");
  		var optCo2Se1 = new course("11:00","12:00","TuTh");
  		var optCo3Se1 = new course("14:00","16:00","MoWe");
  		var optCo3Se2 = new course("11:00","12:00","MoWeFr");

  		var SCHEDULELENGTH = numCourses;

  		var reqArray1 = [reqCo1Se1];
  		var reqArray2 = [reqCo2Se1, reqCo2Se2, reqCo2Se3];
  		var reqCourses = [ reqArray1, reqArray2];

  		var optArray1 = [optCo1Se1,optCo1Se2];
  		var optArray2 = [optCo2Se1];
  		var optArray3 = [optCo3Se1, optCo3Se2];
  		var optCourses = [optArray1, optArray2, optArray3];

  		arraySchedules = [];

  		for (var q = 0; q <30; q++){
  			var schedule = [];
   			reqArray1 = shuffleArray(reqArray1);
   			reqArray2 = shuffleArray(reqArray2);
   			reqCourses = shuffleArray(reqCourses);

  			optArray1 = shuffleArray(optArray1);
   			optArray2 = shuffleArray(optArray2);
   			optCourses = shuffleArray(optCourses);

  			for (var i = 0 ; (i < reqCourses.length) && (schedule.length < SCHEDULELENGTH); i++){
  				tempReq = reqCourses[i];
     				for(var j = 0 ; (j < tempReq.length) && (schedule.length < SCHEDULELENGTH); j++)
         				compareTo(schedule,tempReq[j]);
  			}

  			for (var i = 0 ; (i < optCourses.length) && (schedule.length < SCHEDULELENGTH); i++){
  				tempOpt = optCourses[i]
     				for(var j = 0 ; (j < tempOpt.length) && (schedule.length < SCHEDULELENGTH); j++)
         				compareTo(schedule,tempOpt[j]);
  			}
  			arraySchedules.push(schedule);
		  }
		  arraySchedules = convertSchedule(arraySchedules);
		  //console.log(arraySchedules);
		  updateEvents();
	  }

	function convertSchedule(arrSched)
	{
		for (var i = 0; i < arrSched.length; i++){
			var tempSch = arrSched[i];
			for (var j = 0; j < tempSch.length; j++){
				var daysSep = [];
				for (var a = 0; a < tempSch[j].days.length; a=a+2){
					daysSep.push(tempSch[j].days.slice(a,a+2));
				}
				for (var k = 0; k < daysSep.length; k++)
        {
					switch(daysSep[k])
          {
					case "Mo":
            if (!inArray(5,tempSch[j].daysArray))
						  tempSch[j].daysArray.push(5);
					break;
					case "Tu":
            if (!inArray(6,tempSch[j].daysArray))
						  tempSch[j].daysArray.push(6);
						break;
					case "We":
            if (!inArray(7,tempSch[j].daysArray))
						  tempSch[j].daysArray.push(7);
						break;
					case "Th":
            if (!inArray(8,tempSch[j].daysArray))
						  tempSch[j].daysArray.push(8);
						break;
					case "Fr":
            if (!inArray(9,tempSch[j].daysArray))
						  tempSch[j].daysArray.push(9);
						break;
					}
        }
				tempSch[j].startHour = (tempSch[j].start.toString()).slice(0,2);
				tempSch[j].startMin = (tempSch[j].start.toString()).slice(3,5);
				tempSch[j].endHour = (tempSch[j].end.toString()).slice(0,2);
				tempSch[j].endMin = (tempSch[j].end.toString()).slice(3,5);
			}
      arrSched[i] = tempSch;
		}
    return arrSched;
	}

  function inArray(searchVal,array){
    var lengthofarray = array.length;
    for(var i = 0; i < lengthofarray; i++)
    {
      if (array[i] == searchVal)
        return true;
    }
    return false;
  }
		
	function course(start, end, days){
		this.start =start;
		this.end = end;
		this.days = days;
		this.daysArray = [];
		this.startHour = [];
		this.endHour = [];
		this.startMin = [];
		this.endMin = [];
	}

	function compareTo(schedule, course){
		var intOverlap = 1;
   		if (schedule.length == 0)
       		schedule.push(course);
   		else{
       		for(i = 0 ; i < schedule.length; i++){
           		if(overlap(schedule[i],course)){
           			intOverlap=0;
           		}
			}
			if (intOverlap ==1)
				schedule.push(course);
		}				
	}

	function overlap(course1,course2){
   		if((course1.days.indexOf(course2.days) != -1) || (course2.days.indexOf(course1.days) != -1)){
    		if ((course1.start >= course2.start && course1.start <= course2.end) ||
       		(course1.end >= course2.start && course1.start <= course2.end))
           		return true;
    		else
    			return false;   
    	}
   		else
       		return false;
	}

	/**
 	* Randomize array element order in-place.
 	* Using Fisher-Yates shuffle algorithm.
 	*/
	function shuffleArray(array) {
    	for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
        	var temp = array[i];
        	array[i] = array[j];
        	array[j] = temp;
    	}
    	return array;
	}

	function updateEvents() {
    	//Iterate to the next schedule
    	scheduleNum = scheduleNum + 1;

      //If the scheudle is greater than the total number of schedules, loop to the beginning
      if (scheduleNum >= arraySchedules.length) {
          scheduleNum = 0;
      }

    	//Create a variable tracking the number of events in the current schedule
    	var numberofevents = arraySchedules[scheduleNum].length;

    	//Clear all events on the calendar
    	$('#calendar').fullCalendar('removeEvents').fullCalendar('removeEventSources');
    	//Create an array of events to render
    	var events = new Array();

	    //Add each course in the schedule to the calendars eventSource
	    for(var i=0; i<numberofevents; i++)
    	{
      		//Day: 'days'
		      //Start: 'startHour', 'startMin'
      		//End: 'endHour', 'endMin'
          var thisSched = arraySchedules[scheduleNum];
          for(var j=0; j < thisSched[i].daysArray.length; j++)
      		{
        		//Set the start and end times for the event
        		var start_date = new Date(2014,4,thisSched[i].daysArray[j], thisSched[i].startHour, thisSched[i].startMin);
        		var end_date = new Date(2014,4,thisSched[i].daysArray[j], thisSched[i].endHour, thisSched[i].endMin);

        		//Set the events name
        		var event_name = "Test";

        		//Create an event object and set the previously defined information to its variables
        		event = new Object();
        		event.title = event_name;
        		event.start = start_date;
        		event.end = end_date;
        		//Set the basic information of the event
        		event.color = "blue";
        		event.allDay = false;
		      
		        //Add the event to the calendar's eventSource
		        events.push(event);
      		}
    	}
    	//Update the calendar
    	$('#calendar').fullCalendar('addEventSource', events);
  	}

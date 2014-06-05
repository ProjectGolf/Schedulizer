function buildSchedule(){
	//builds actual schedule
	var userInput = getUserInput();
	var validated = validateForm(userInput);
	console.log("validated = "+validated);
	/*if (validated = true){
		queryCourseData();
	}*/
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

    var startTime={
        hour: startHr,
        minute: startMin
    };
    var endTime={
        hour: endHr,
        minute: endMin
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
	console.log("UserInput Object:");
	console.log(UserInput);
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

	//Check for duplicates

	return true;
}

function queryCourseData(startTime, endTime, optCourses, reqCourses, numOptCourses, numReqCourses){
	
	var numClasses = optCourses.length;
	var OptclassList = [];
	var i = 0;
for(var m = 0; m < numClasses; m++){
	$.getJSON("http://vazzak2.ci.northwestern.edu/courses/?term=4540&subject="+optCourses[m].subject, function(result) {
        $(result).each(function (index, item) {
        if (item.start_time > startTime) {
            if (item.end_time === endTime){
        	if (item.catalog_num === optCourses[m].courseNumber){
            
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
            	console.log(OptclassList[i]);
            	i++;
                                                                    }
                                            }
                                            }        
                                            });
                                            
                                });
                                }
   	var OptcourseArray = [];   	
   	for(var j = 0; j < numOptCourses; j++){
   		var catNum = optCouses[j].courseNumber;
   		for(var h = 0; h<OptclassList.length; h++){
   				var myArray = [];
   				if (OptclassList[h].catalog_num === catNum){
   					myArray.push(OptclassList[h]);
   				}
  	 	}	
   	OptcourseArray.push(myArray);
   	}
        
        var ReqclassList = [];
        var g =0;
        for(var n = 0; n < reqCourses.length; n++){
	$.getJSON("http://vazzak2.ci.northwestern.edu/courses/?term=4540&subject="+reqCourses[n].subject, function(result) {
    $(result).each(function (index, item) {
        if (item.start_time > startTime) {
            if (item.end_time === endTime){
        	if (item.catalog_num === reqCourses[n].courseNumber){
            
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
   
                                    
                                    });
                                }
        var ReqcourseArray = [];   	
   	for(var j = 0; j < numReqCourses; j++){
   		var catNum = reqCourses[j].courseNumber;
   		for(var h = 0; h<ReqclassList.length; h++){
   				var myArray = [];
   				if (ReqclassList[h].catalog_num === catNum){
   					myArray.push(ReqclassList[h]);
   				}
  	 	}	
   	ReqcourseArray.push(myArray);
   	}
        
        return [
            OptcourseArray, 
            ReqcourseArray
        ];
            
}


/*
When user submits required courses:

buildSchedule{
1) Get user inputs [DONE]
2) Validate user inputs 
3) Query database
4) Schedule Required
5) Schedule Optional
6) Filter by Timing
7) Output onto schedule
}
*/

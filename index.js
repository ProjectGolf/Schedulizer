function buildSchedule(){
	//builds actual schedule
	//calls getUserInput
	getUserInput();

}
function getCourseData(){
	//gets user inputs from form
	//checks for match in database
	//if there's a match, jump to a scheduler algorithm
	//if there's no match, alert user and give them the option to continue without class or to enter a new requirement
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
			reqCourses.push({ subject: subj, courseNumber: courseNum});
			numReq++;
		}
		else{
			optCourses.push({subject: subj, courseNumber: courseNum});
			numOpt++;
		}
	}
	console.log("Required Courses");
	for(var j=0; j<numReq; j++){
		console.log(reqCourses[j])
	}
	console.log("Optional Courses");
	for(var k=0; k<numReq; k++){
		console.log(reqCourses[k])
	}

	var UserInput = {
		startTime: startTime,
		endTime: endTime,
		numOfCourses: numOfCoursesToSchedule,
		requiredCourses: reqCourses,
		optionalCourses: optCourses
	};

	console.log(UserInput);
}

function validateForm(){
	/*var validated = false;
	while (validated==false){*/
	
}



/*
When user submits required courses:

buildSchedule{
1) [NOT DONE]Validate form
	- check input fields by pairs. If one is empty, alert user and allow him to resubmit or empty field. If both are empty, 
	do nothing with the info. If both are filled, getUserInput.
	- make user repeat until form is valid
2) [DONE - for course inputs, need to do for start and end times] getUserInput 
	-store user input in course object and push into required and optional course arrays.
3) Query Database
4) Schedule Required
5) Schedule Optional
6) Filter by Timing
}
*/
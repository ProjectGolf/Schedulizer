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
	var numCourses = (document.getElementById('Courses').getElementsByTagName('input').length)/2 -2;//temporary fix. Need to figure out how to exclude checkboxes
	console.log(numCourses);
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
2) [DONE - for course inputs] getUserInput 
	-store user input in course object and push into required and optional course arrays.
3) Query Database
4) Schedule Required
5) Schedule Optional
6) Filter by Timing
}
*/
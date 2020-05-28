function point(x,y) {this.x=x||0; this.y=y||0;}
point.prototype.toString = function(){return "("+this.x+","+this.y+")";}
var rows = 3;
var cols = 3;
var goal = 3;
var area = rows*cols;
var solutions = [];
var speed = 10;
var shouldStop = 0;
var drawPoints = [];

function drawSolution(){
	solution = document.getElementById("solutions").value;
	if(solution){
		lightupJSON(solution, "#0F0");
	}
}

function lightupPoints(points, color){
	lightupJSON(JSON.stringify(points), color);
}

function lightupJSON(solution, color){
	var solution = JSON.parse(solution);
	
	drawPoints = [];
	
	for(var i=0;i<area;i++){
		var x = i%cols;
		var y = Math.floor(i/cols);
		var id = "c"+x+"_"+y;
		
		document.getElementById(id).style.backgroundColor = "#333";
	}
	
	for(var i=0;i<solution.length;i++){
		var x = solution[i].x;
		var y = solution[i].y;
		var id = "c"+x+"_"+y;
		
		drawPoints.push(new point(x,y));
		document.getElementById(id).style.backgroundColor = color;
	}
	
}

function foundSolution(points){
	var pointsJSON = JSON.stringify(points);
	
	var o = document.createElement("option");
	o.text = pointsJSON;
	document.getElementById("solutions").add(o);
	
	solutions.push(pointsJSON);
}

function isValid(points){
	var distances = [];
	
	for(var i=0;i<points.length-1;i++){
		for(var j=i+1;j<points.length;j++){
			var dx = (points[i].x - points[j].x)**2;
			var dy = (points[i].y - points[j].y)**2;
			var dSquared = dx+dy;
			
			if(distances.includes(dSquared)){
				return false;
			}
			distances.push(dSquared);
		}
	}
	return true;
}

function addPoint(points, input){
	var x = input%cols;
	var y = Math.floor(input/cols);
	
	points.push(new point(x,y));
}

function getValueFromPoint(input){
	return (input.y*cols)+input.x
}

function findValidPoints(points, init){
	setTimeout(function(){
		if(init >= area || shouldStop){ 
			let p = new point();
			var next = area;
			var missingPoints = area;
			
			while(next + missingPoints >= area){
				p = points.pop();
				
				if(p == null || shouldStop){
					var end = new Date();
					console.log("Duration:",end-start);
					drawSolution();
					enable();
					return;
				}
				
				next = getValueFromPoint(p);
				missingPoints = goal - points.length;
			}
			init = next + 1;
		}
		
		addPoint(points, init);
		
		if(!isValid(points)){
			if(speed>0){lightupPoints(points, "#F00");}
			points.pop();
		}
		else if(points.length >= goal){
			lightupPoints(points, "#0F0");
			foundSolution(points);
			points.pop();
		}
		else{
			if(speed>0){lightupPoints(points, "#00F");}
		}
		
		findValidPoints(points, init+1);
	}, speed);
}

function togglePoint(input){
	var p = new point(input.getAttribute("col")*1, input.getAttribute("row")*1);

	var exists = drawPoints.find(e => e.x == p.x && e.y == p.y);
	console.log(input, p, drawPoints, exists);
	if(!exists){
		if(drawPoints.length >= goal){return;}
		drawPoints.push(p);
	}
	else{
		var index = drawPoints.indexOf(exists);
		drawPoints.splice(index, 1);
	}

	if(!isValid(drawPoints)){
		lightupPoints(drawPoints, "#F00");
	}
	else if(drawPoints.length >= goal){
		lightupPoints(drawPoints, "#0F0");
	}
	else{
		lightupPoints(drawPoints, "#00F");
	}
	
}



function generateBoard(){
	rows = document.getElementById("rows").value*1;
	cols = document.getElementById("cols").value*1;
	area = rows*cols;
	goal = document.getElementById("goal").value*1;

	buildBoard(rows, cols);

}
function buildBoard(rows, cols){
	
	var b = document.getElementById("board");
	while(b.firstChild){b.firstChild.remove();}
	
	for(var i=0;i<cols;i++){
		var col = document.createElement("div");
		col.classList.add("col");
		b.appendChild(col);
		
		for(var j=0;j<rows;j++){
			
			var c = document.createElement("div");
			c.classList.add("cell");
			c.id = "c" + i + "_" + j;
			c.onclick = function(){ togglePoint(this); };
			c.setAttribute("col", i);
			c.setAttribute("row", j);
			col.appendChild(c);
		}
	}
}

function disable(){
	document.getElementById("btn").disabled = true;
	document.getElementById("solutions").disabled = true;
	document.getElementById("rows").disabled = true;
	document.getElementById("cols").disabled = true;
	document.getElementById("speed").disabled = true
	document.getElementById("goal").disabled = true;
	document.getElementById("gen").disabled = true;
	document.getElementById("stop").disabled = false;
}

function enable(){
	document.getElementById("btn").disabled = false;
	document.getElementById("solutions").disabled = false;
	document.getElementById("rows").disabled = false;
	document.getElementById("cols").disabled = false;
	document.getElementById("speed").disabled = false
	document.getElementById("goal").disabled = false;
	document.getElementById("gen").disabled = false;
	document.getElementById("stop").disabled = true;
}

function removeOptions() {
	var selectElement = document.getElementById("solutions");
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

var start = new Date();
function GO(){
	speed = (document.getElementById("speed").value**2)*10;
	start = new Date();
	console.log(start);
	removeOptions();

	generateBoard();

	disable();
	shouldStop = 0;
	findValidPoints([], 0);
}

function stop(){shouldStop = 1;}



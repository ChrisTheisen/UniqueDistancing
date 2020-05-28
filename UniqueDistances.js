function point(x,y) {this.x=x||0; this.y=y||0;}
point.prototype.toString = function(){return "("+this.x+","+this.y+")";}
var size = 3;
var area = size**2;
var solutions = [];
var speed = 10;

function drawSolution(){
	solution = document.getElementById("solutions").value;
	lightupJSON(solution, "#0F0");
}

function lightupPoints(points, color){
	lightupJSON(JSON.stringify(points), color);
}

function lightupJSON(solution, color){
	var solution = JSON.parse(solution);
	
	for(var i=0;i<area;i++){
		var x = i%size;
		var y = Math.floor(i/size);
		var id = "c"+x+"_"+y;
		
		document.getElementById(id).style.backgroundColor = "#333";
	}
	
	for(var i=0;i<solution.length;i++){
		var x = solution[i].x;
		var y = solution[i].y;
		var id = "c"+x+"_"+y;
		
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
	var x = input%size;
	var y = Math.floor(input/size);
	
	points.push(new point(x,y));
}

function getValueFromPoint(input){
	return (input.y*size)+input.x
}

function findValidPoints(points, init){
	setTimeout(function(){
		if(init >= area){ 
			let p = new point();
			var next = area;
			var missingPoints = area;
			
			while(next + missingPoints >= area){
				p = points.pop();
				
				if(p == null){
					var end = new Date();
					console.log("Duration:",end-start);
					drawSolution();
					document.getElementById("btn").style.display=null;
					document.getElementById("solutions").disabled = false;
					return;
				}
				
				next = getValueFromPoint(p);
				missingPoints = size - points.length;
			}
			init = next + 1;
		}
		
		addPoint(points, init);
		
		if(!isValid(points)){
			if(speed>0){lightupPoints(points, "#F00");}
			points.pop();
		}
		else if(points.length == size){
			lightupPoints(points, "#0F0");
			foundSolution(points);
			points.pop();
		}
		else{
			if(speed>0){lightupPoints(points, "#0F0");}
		}
		
		findValidPoints(points, init+1);
	}, speed);
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
			col.appendChild(c);
		}
	}
}

function removeOptions() {
	var selectElement = document.getElementById("solutions");
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

var start = new Date();
function main(){
	speed = (document.getElementById("speed").value**2)*10;
	start = new Date();
	console.log(start);
	removeOptions();
	document.getElementById("btn").style.display= "none";
	document.getElementById("solutions").disabled = true;

	size = document.getElementById("size").value;
	area = size**2;

	buildBoard(size, size);
	findValidPoints([], 0);
}





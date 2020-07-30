/*
ants.js
NatureJS
Oliver Cass (c) 2020
All Rights Reserved

https://en.wikipedia.org/wiki/Trail_pheromone
*/

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var graph = null;
var ants = [];
var collectedFood = 0;
var food = [];
var pheromones = [];

var param = {
	minNodes: 80,
	maxNodes: 150,
	minRadius: 20,
	margin: 10,
	numClosedLoops: 15,
	minAngle: 15,
	nodeRadius: 5,
	numAnts: 200,
	antOffset: 5,
	antRadius: 1.5,
	antSpeed: 1,
	gameSpeed: 1
}

function init(){
	graph = null;
	ants = [];
	collectedFood = 0;
	food = [];
	pheromones = [];
	
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	graph = new Graph();
	graph.generate(canvas.clientWidth, canvas.clientHeight, param.minNodes, param.maxNodes, param.minRadius, param.margin, param.numClosedLoops, param.minAngle);
	for(var i = 0; i < graph.nodes.length; i++){
		if(graph.getDirectConnectedNodes(i).length < 2) food.push(new Food(i));
	}
	for(var i = 0; i < graph.edges.length; i++) pheromones[i] = 0;
	for(var i = 0; i < param.numAnts; i++){
		ants.push(new Ant());
	}
	
	requestAnimationFrame(tick);
}

function tick(){
	requestAnimationFrame(tick);
	for(var i = 0; i < param.gameSpeed; i++) for(var a of ants) a.tick();
	render();
	document.getElementById('foodCollected').innerHTML = collectedFood;
}

function render(){
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	
	//draw paths
	for(var i = 0; i < graph.edges.length; i++){
		if(pheromones[i] == 0) continue;
		ctx.strokeStyle = `rgb(255, 0, ${pheromones[i]})`;
		ctx.beginPath();
		ctx.moveTo(graph.nodes[graph.edges[i][0]].x, graph.nodes[graph.edges[i][0]].y);
		ctx.lineTo(graph.nodes[graph.edges[i][1]].x, graph.nodes[graph.edges[i][1]].y);
		ctx.stroke();
		ctx.closePath();		
	}
	
	//draw base
	ctx.fillStyle = "#0000ff";
	ctx.fillRect(graph.nodes[0].x - param.nodeRadius, graph.nodes[0].y - param.nodeRadius, param.nodeRadius*2, param.nodeRadius*2);
	
	//draw food sources
	for(var f of food){
		ctx.fillStyle = f.color();
		ctx.fillRect(graph.nodes[f.node].x - param.nodeRadius, graph.nodes[f.node].y - param.nodeRadius, param.nodeRadius*2, param.nodeRadius*2);
	}
	
	//draw ants
	for(var a of ants){
		ctx.fillStyle = a.color();
		ctx.beginPath();
		ctx.moveTo(a.x + a.offset.x, a.y + a.offset.y);
		ctx.arc(a.x + a.offset.x, a.y + a.offset.y, param.antRadius, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}
}

const Food = function(node){
	this.node = node;
	this.amount = 1000;
	this.color = function(){
		return `rgb(${100 - 50*(this.amount/1000)}, ${255*(this.amount/1000)}, ${100 - 100*(this.amount/1000)})`;
	}
}

canvas.addEventListener('click', function(e){
	for(var i = 0; i < graph.nodes.length; i++){
		if(e.x > graph.nodes[i].x - param.nodeRadius &&
		   e.x < graph.nodes[i].x + param.nodeRadius &&
		   e.y > graph.nodes[i].y - param.nodeRadius &&
		   e.y < graph.nodes[i].y + param.nodeRadius){
			   console.log(i);
			   return;
		}
	}
}, false);
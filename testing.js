let run = false;
let ping;
let yay;
let bass;
let confetti;
let confettiType;
let imageArr=[];

function Channel(audio_uri) {
	this.audio_uri = audio_uri;
	this.resource = new Audio(audio_uri);
}
Channel.prototype.play = function() {
	// Try refreshing the resource altogether
	this.resource.play();
}
function Switcher(audio_uri, num) {
	this.channels = [];
	this.num = num;
	this.index = 0;

	for (var i = 0; i < num; i++) {
		this.channels.push(new Channel(audio_uri));
	}
}
Switcher.prototype.play = function() {
	this.channels[this.index++].play();
	this.index = this.index < this.num ? this.index : 0;
}
ping= new Switcher('/sounds/ping.mp3', 10);

function preload(){
	for(let i = 0; i < images.length; i++){
		imageArr.push(loadImage(`/images/${images[i]}`));
	}
}

function setup(rand) {
    if(run){
	var canvas = createCanvas(300, 530);
	confetti = imageArr[Math.floor(Math.random()*imageArr.length)];
	canvas.parent("con");
	confettiType = confettiTypesList[rand][0];
    }else{
        createCanvas(0,0);
    }
}
let t = 0;
let ar = [];
let fire = [];
let color = [[255,0,0],[0,255,0],[0,0,255],[255,255,255],[255,255,0],[0,255,255],[255,0,255]];

let par = function(xp,yp,xv,yv,life,color,size,maxSize,type){
	this.xp = xp;
	this.yp = yp;
	this.xv = xv;
	this.yv = yv;
	this.r = color[0];
	this.g = color[1];
	this.b = color[2];
	this.life = life;
	this.size = size;
	this.maxSize= maxSize;
	this.type = type;
	this.afterLife = 10;
}
par.prototype.move = function(){
	this.xp = this.xv + this.xp;
	this.yp = this.yv + this.yp;
	this.life--;
	if(this.type == "fire"){
			this.yv+=this.afterLife*this.maxSize*0.0025;
		}
	if(this.life <= 0 && this.type == "core" && sound){ping.play();}
	if(this.life<=0){
		this.xv = 0;
		this.yv = 0;
		if(this.size<this.maxSize){
			this.size++;
		}
		if(this.type == "core" && this.afterLife>0){
			for(let numFire = 0; numFire<20; numFire++){
				let xp = Math.random()*this.maxSize*2-this.maxSize;
				let yp = Math.random()*Math.sqrt((this.maxSize*this.maxSize-xp*xp))*2-Math.sqrt((this.maxSize*this.maxSize-xp*xp));
				fire.push(new par(this.xp,this.yp,xp,yp,10, [this.r,this.g,this.b],3,Math.random()*10+10, "fire"));
			}
			this.afterLife--;
		}
		
		if(this.type == "fire" && this.life<0){
			fire.splice(0,1);
		}
	}
}

par.prototype.draw = function(){
	fill(this.r,this.g,this.b,100);
	noStroke();
	ellipse(this.xp, this.yp,3,3);
	fill(255,255,255);
	ellipse(this.xp, this.yp,2,2);
};


function draw() {
    if(run){
		t++;
		if(confettiType!="nyan"){
			background(0,0,0,10);
			if(t%5==Math.floor(Math.random()*6)&&ar.length<3){
				ar.push(new par(Math.random()*300,500,0, -Math.random()*4-1, Math.random()*50+50, color[Math.floor(Math.random()*color.length)],3,Math.random()*8+5,"core"));
			}
			for(var i = 0; i < ar.length; i++){
				ar[i].draw();
				ar[i].move();
				if(ar[i].size>=ar[i].maxSize){
					ar.splice(i,1);
				}
			}
			for(var f = 0; f < fire.length; f++){
				fire[f].draw();
				fire[f].move();
			}
		}
    }
    else{
        t = 0;
        ar = [];
        fire = [];
	}
	if(confettiType == "holy"){
		imageMode(CENTER);
		translate(150, 500-t*1.5);
		angleMode(RADIANS);
		rotate(12*radians((t<120)?t:120));
		noStroke();
		image(confetti,0, 0, 150,150);
	}
	if(confettiType == "spin"){
		noStroke();
		translate(150, 250);
		angleMode(DEGREES);
		let xdis=(200-t*1.2);
		let reps=5;
		let loops = 3;
		
		push();
		rotate(15*t);
		for(let l = 0; l < 3; l++){
			for(let i = 0; i < 360/reps; i++){
				rotate(360/reps);
				image(confetti,xdis+50*l, 0, 50,50);
			}
		}
		pop();
		rotate(t*2);
		imageMode(CENTER);
		image(confetti,0, 0, 100,100);
		imageMode(CORNER);
	}
	if(confettiType == "nyan"){
		background(0,51,102);
		translate(0,0);
		imageMode(CENTER)
		angleMode(DEGREES);
		colors=[[255,0,0],[252,166,5],[254,254,3],[63,253,1],[16,170,254],[120,68,244]]
		let xdis = 0+t;
		let ydis = 116.6+sin(t*5)*8;
		for(let i = 0; i < 3; i++){
			for(let a = 0; a < 6; a++){	
				stroke(colors[a]);
				strokeWeight(7);
				noFill();
				beginShape();
				curveVertex(0,116.6);
				for(let b = 0; b < t; b+=5){
					curveVertex(-7+b,100+a*7+sin(b*6)*5+136.6*i);
				}
				endShape();
			}
			image(confetti,-7+xdis, ydis+i*136.6, 100,100);
		}
	}
}
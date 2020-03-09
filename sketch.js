
function particleFormShow(){

	inputX.show();
	inputY.show();
	inputC.show();
	inputM.show();
	inputVx.show();
	inputVy.show();
	confirmB.show();

}

function particleFormHide(){
	inputX.hide();
	inputY.hide();
	inputC.hide();
	inputM.hide();
	inputVx.hide();
	inputVy.hide();
	confirmB.hide();
}

function createParticle(){
	return new Particle({position:{ x: parseFloat(inputX.value()), 
																	y: parseFloat(inputY.value()) },
																	charge: parseInt(inputC.value()),
																	mass: parseFloat(inputM.value()),
																	velocity:{x: parseFloat(inputVx.value()), y: parseFloat(inputVy.value())}});
}

var sliderC, sliderTT, sliderTc,sliderD, sliderFr, buttonL, forceLines = true;
var inputX,inputY,inputC,inputM,inputVx,inputVy,confirmB;
var q = [];

function setup(){

		createCanvas(innerWidth, innerHeight);
		
    sliderC = createSlider(0,5000,500,5);
    sliderC.position(10, 10);
    sliderTT = createSlider(0.01,10,0.01,0.1);
    sliderTT.position(10, 40);
    sliderTc = createSlider(0,255,100,1);
    sliderTc.position(10, 70);
    sliderD = createSlider(100,innerWidth/2,490,1);
		sliderD.position(10, 100);
		sliderFr = createSlider(0,60,60,1);
		sliderFr.position(10,130);
		sliderFr.mousePressed(function(){
			
			frameRate(sliderFr.value());
		});

    buttonL = createButton('Force Lines');
    buttonL.position(15, 160);
    buttonL.mousePressed(function(){
        forceLines = !forceLines;
		});

		let offX = innerWidth/2,offY = innerHeight/2;
		inputX = createInput().attribute('placeholder', 'X:');
		inputX.size(30,10);
		inputX.position(offX,offY);
		inputY = createInput().attribute('placeholder', 'Y:');
		inputY.size(30,10);
		inputY.position(offX + 35, offY);

		inputC = createInput().attribute('placeholder', 'C:');
		inputC.size(30,10);
		inputC.position(offX, offY + 20);
		inputM = createInput().attribute('placeholder', 'M:');
		inputM.size(30,10);
		inputM.position(offX + 35,offY + 20);
		
		inputVx = createInput().attribute('placeholder', 'Vx:');
		inputVx.size(30,10);
		inputVx.position(offX,offY+40);
		inputVy = createInput().attribute('placeholder', 'Vy:');
		inputVy.size(30,10);
		inputVy.position(offX + 35, offY + 40);
		
		confirmB = createButton('CREATE');
		confirmB.position(offX, offY+60);
		confirmB.size(70,20);
		confirmB.mousePressed(function(){
			q.push(createParticle());
			particleFormHide();
		});

		particleFormHide();
		

		

    q = [
    
    //  new Particle({position : {x:100, y:0},radius:5, charge:1,velocity:{x:0,y:-sqrt(C*5/1000)}, mass:10} )
    // ,new Particle({position : {x:0, y:0}, radius:5,charge:-5,velocity:{x:0,y:0}, mass:10000000} )
     new Particle({position : {x:0, y:-100}, charge:5,velocity:{x:0,y:0}, mass:100} )
    ,new Particle({position : {x:0, y:100}, charge:5,velocity:{x:0,y:0}, mass:100} )
    ,new Particle({position : {x:100, y:0}, charge:5,velocity:{x:0,y:0}, mass:100} )
    ,new Particle({position : {x:-100, y:0}, charge:5,velocity:{x:0,y:0}, mass:100} )
    ,new Particle({position : {x:0, y:0}, charge:5,velocity:{x:0,y:0}, mass:100} )
    // ,new Particle({position : {x:-200, y:0}, radius:5,charge:2,velocity:{x:0,y:-2}, mass:1} )
    // ,new Particle({position : {x:0, y:200}, radius:5,charge:-2,velocity:{x:-2,y:0}, mass:1} )
    
    // , new Particle({position : {x:-100, y:0},  radius:5,charge:1,velocity:{x:0,y:0}, mass:1000} )
    // , new Particle({position : {x:400,y:0}, charge:-1,velocity:{x:0,y:-1}, mass:1} )
    // , new Particle({position : {x:0,y:0}, charge:1,velocity:{x:0,y:0}, mass:100000000} )
    // , new Particle({position : {x:0,y:-400},charge:-1, velocity:{x:2.85,y:0}})
    // , new Particle({position : {x:-500,y:0},velocity:{x:0,y:-3}, charge:10} )
    ];
    // translate(width/2,height/2);
    // frameRate(15);
    background(0);
}


function draw(){
		C = sliderC.value();
    LIGHTSPEED = MAXDIST/(TRAVELTIME);
    TRAVELTIME = sliderTT.value();
    MAXDIST = sliderD.value();
    background(0,sliderTc.value());
    noFill();
    stroke(255);
    ellipse(width/2,height/2,MAXDIST*2);
    
    

    
    q.forEach((p)=>{
        p.applyForce(q,forceLines);
        
    });
    q.forEach((p)=>{p.run(100,0,0,0)});
    
 
   
}

function mouseClicked(){
    if((mouseX-width/2)**2+(mouseY-height/2)**2 <= MAXDIST**2 && keyIsPressed){
			particleFormShow();
        // var p = new Particle({mass: random(1,MAXMASS),position:{x:mouseX-width/2,y:mouseY-height/2}});
        // // p.p = createVector(mouseX-width/2,mouseY-height/2);
        // p.v = p5.Vector.random2D()  ;
        // // p.m = random(1,MAXMASS);
        // p.c = random(-MAXCHARGE,MAXCHARGE);
      // q.push(createParticle());
    }
}

function keyTyped(){
    if(key  == 'p'){
        frameRate(0);
    }
    else if(key  == 'o'){
        frameRate(60);
		}
		else if(key == 'c'){
			particleFormHide();
		}
    else{
        draw();

    }
}
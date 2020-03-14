var TRAVELTIME = 1;
var MAXDIST = innerHeight/2;//px
var LIGHTSPEED = MAXDIST/(TRAVELTIME*60);// px/frame
var MAXMASS = 10000;
var C =  500;
var MAXCHARGE = 10;


function drawArrow(base, vec, myColor) {
	push();	
  stroke(myColor);
  strokeWeight(2);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 4;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
function drawLines(particle1, particle2, strokeW,lineColor){
	// var lineColor;
	// var lineWeight;
	// var dis = p5.Vector.dist(particle1.p,particle2.p)
	push();
	stroke(lineColor);
	strokeWeight(strokeW);
	line(particle1.p.x + width/2,particle1.p.y+ height/2,particle2.p.x+ width/2,particle2.p.y+ height/2)
	pop();
}

class Particle{
	constructor({id = -1, position = {x:0,y:0}, charge = 1, mass = 1, velocity = {x:0,y:0}, acceleration = {x:0,y:0}, force ={x:0,y:0} } ){
			this.p = createVector(position.x,position.y);
			this.prev = this.p.copy();
			this.v = createVector(velocity.x,velocity.y);
			this.a = createVector(acceleration.x,acceleration.y);
			this.f = createVector(force.x,force.y);
			this.m = mass;
			this.c = charge;
			this.r = round(log(mass)+1); 
			this.color = color(random(255),random(255),random(255));
			this.colided = {};
			Particle.count++;
			this.id = Particle.count;
	}

	render(force,velocity,acceleration,forceText){
		push();
		textSize(16)
		translate(width/2,height/2);
		
		noFill();
		stroke(this.color.levels[0],this.color.levels[1],this.color.levels[2],200);
		ellipse(this.p.x,this.p.y,(abs(this.c)+this.r)*4);
		
		if(this.v.mag()==LIGHTSPEED){
			fill(255,255,255);
		}
		else{
			fill(this.color.levels[0],this.color.levels[1],this.color.levels[2], 200);
		}
		noStroke();
		ellipse(this.p.x,this.p.y,this.r*2);

		if(force){
			drawArrow(this.p, p5.Vector.mult(this.f,force), 'red');
		}
		if(velocity){
			drawArrow(this.p, p5.Vector.mult(this.v,velocity), 'blue');
		}
		if(acceleration){
			drawArrow(this.p, p5.Vector.mult(this.a,acceleration), 'green');
		}
		if(forceText){
			textSize(forceText);
			fill('red');
			text(`F:${this.f.mag().toFixed(4)}@${(this.f.heading()*180/PI).toFixed(4)}°`,this.p.x ,this.p.y + forceText+this.r);
			fill('green');
			text(`A:${this.a.mag().toFixed(4)}@${(this.a.heading()*180/PI).toFixed(4)}°`,this.p.x ,this.p.y + 2*forceText+this.r);
			fill('blue');
			text(`V:${this.v.mag().toFixed(4)}@${(this.v.heading()*180/PI).toFixed(4)}°`,this.p.x ,this.p.y + 3*forceText+this.r);
			fill('red');
			text(`M:${this.m.toFixed(4)}`,this.p.x ,this.p.y + 4*forceText+this.r);
			fill(this.color);
			text(`P:(${this.p.x.toFixed(8)},${this.p.y.toFixed(8)})`,this.p.x ,this.p.y + 5*forceText+this.r);
		}
		
		textAlign(CENTER);
		textSize(this.r*2);
		fill(255);
		// text(`${this.c>=0 ? (this.c==0? 'o':'+'):'-'}`,this.p.x ,this.p.y+this.r*0.35);
	
		stroke(this.color.levels[0],this.color.levels[1],this.color.levels[2],120)
		line(this.p.x,this.p.y,this.prev.x,this.prev.y);
		pop();
	}
	
	reflectAt(point){
		// translate(width/2,height/2	)
		// drawArrow({x:0,y:0},point,'red')
		var perp = p5.Vector.fromAngle(atan2(-point.x,point.y),200);
		// drawArrow(point,perp,'blue')
		var theta = this.v.angleBetween(perp);
		perp.setMag(this.v.mag());
		this.v = perp.rotate(-theta)

	}
	isInside(point){
		return p5.Vector.sub(this.p,point).mag() <= this.r;
	}

	passThrough(particle){
		var path = p5.Vector.sub(this.prev,this.p);
		var center = particle.p;
		var path2center =  p5.Vector.sub(center,this.p);
		var dotProd = path2center.dot(path);
		var projection =  p5.Vector.fromAngle(path.heading(), dotProd/path.mag());
		var center2projetion =  p5.Vector.sub(projection,path2center);

		if(particle.isInside(this.p) || particle.isInside(this.prev) ){ return true; }

		if(center2projetion.mag() <= this.r && path.mag() >= projection.mag() &&  dotProd >= 0) { return true; }

		if(p5.Vector.dist(this.p, particle.p) <= (this.r+particle.r)){ return true; }
		
		return false;
	}

	update(){

		this.prev = this.p.copy();
		
		this.a = p5.Vector.mult(this.f,1/this.m);
		this.v.add(this.a);
		var maxspeed = MAXDIST/(TRAVELTIME*58);
		this.v.limit(maxspeed);
		
		this.p.add(this.v);
		this.p.limit(MAXDIST);

		if(this.p.mag() >= MAXDIST){
			this.reflectAt(this.p);
			this.v.mult(0.9)
		}
		
	}
	
	run(scaleF,scaleA,scaleV,scaleT){
		this.render(scaleF,scaleA,scaleV,scaleT);
		this.update();
	}

	mergeParticles(particle){
		var midPoint = p5.Vector.add(this.p,particle.p).mult(0.5);
		var merge = new Particle({});
		merge.p = midPoint;
		merge.c = this.c+particle.c;
		merge.m = this.m+particle.m;
		merge.v = p5.Vector.add( p5.Vector.mult(this.v,this.m), p5.Vector.mult(particle.v,particle.m) ).mult(1/this.m);
		return merge;
	}

	applyForce(particles, lines ){
		this.f.set(0,0);
		var	maxF;
		particles.forEach((particle)=>{

			if(particle !== this){  
				var c = particle.c*this.c;
				var f = p5.Vector.sub(this.p,particle.p);
				var d = f.mag();
				d = constrain(d,(particle.r+this.r),MAXDIST);
				var dsq = d**2;
				f.normalize().mult( abs(c*C) / (dsq) );
				f.mult( c < 0 ? -1 : 1 );
				
				maxF = Math.log(  C* ( MAXCHARGE/(this.r+particle.r) )**2 ) ;
				
				

				if(lines){ drawLines(this,particle,map(f.mag(),0,maxF,0,this.r),c > 0? 'red':'blue'); }

				// console.log(`${this.id} pass Though ${particle.id} : ${this.passThrough(particle)}`)
				// console.log(`${particle.id} pass Though ${this.id} : ${particle.passThrough(this)}`)
				// console.log(`${this.id} colided with ${particle.id} : ${this.colided[particle]}`)

				if( (this.passThrough(particle) || particle.passThrough(this)) && (!this.colided[particle.id] && !particle.colided[this.id])){
					var den = 1/(this.m + particle.m);
					var factor = (this.m - particle.m);
					var newv2;
					var newv1;
					// var oldv1 =  this.v.copy();
					// var oldv2 =  particle.v.copy();

					newv1 = p5.Vector.add( p5.Vector.mult(this.v, factor), p5.Vector.mult(particle.v, 2*particle.m) );
					newv1.mult(den);
					newv2 = p5.Vector.add( p5.Vector.mult(this.v, 2*this.m), p5.Vector.mult(particle.v, -1*factor) );
					newv2.mult(den);

					// console.log(this.m*this.v.x + particle.m*particle.v.x);
					// console.log(this.m*newv1.x + particle.m*newv2.x);


					this.v = newv1.copy();
					particle.v = newv2.copy();

					this.colided[particle.id] = true;
					particle.colided[this.id] = true;



					// console.log(`${this.v.mag()}(${this.m} - ${particle.m})/${den} + ${oldvj.mag()} * (2*${particle.m}/${den})`)
					// console.log(`V1: ${this.v.x}i + ${this.v.y}j`)
					// console.log(`V2: ${particle.v.x}i + ${particle.v.y}j`)
					// var aux1 = oldvj.mult(particle.m*2/den)
					// this.v.mult( (this.m - particle.m) / den );
					// this.v.add(aux1);

					// console.log(`V1: ${this.v.x}i + ${this.v.y}j`)
					// var aux2 = oldvi.mult( this.m*2/den );
					// particle.v.mult( (particle.m - this.m)/den )
					// particle.v.add( aux2 );
					// console.log(`V2: ${particle.v.x}i + ${particle.v.y}j`)

					// this.v.mult(0.9);
					// particle.v.mult(0.9);
					
					// postParticles.push(this.mergeParticles(particle));
					// console.log('Will colid');
					// frameRate(0);
				}
				else{
					delete this.colided[particle.id];
					delete particle.colided[this.id];
				}
				

				this.f.add(f);

			}
		});
		// if(!this.colided){
		// 	postParticles.push(this);
		// }
		// return postParticles;
}

	// static getResultForce(particles){
	// 	var rf, d, dis, rfMag,colidDist,lineColor;

	// 	for(var i = 0; i < particles.length; i++){
	// 		particles[i].f.set(0,0);
	// 		for(var j = 0; j < particles.length; j++){
	// 			if( i != j ){
	// 				d = p5.Vector.sub(particles[i].p,particles[j].p);
	// 				if(particles[i].c * particles[j].c < 0){
	// 					d.rotate(PI);
	// 				}
	// 				colidDist = particles[i].r+particles[j].r;

	// 				dis = d.mag();
	// 				if(dis <= colidDist+15 ){
	// 					dis = colidDist;
	// 				}
	// 				rfMag = Math.abs( C * particles[i].c * particles[j].c / (dis**2) );
	// 				rf = p5.Vector.fromAngle( d.heading() , rfMag );

	// 				lineColor = [0,0,255, map(Math.abs( particles[i].c * particles[j].c ), 1 , 400, 10, 255)]
	// 				if(particles[i].c * particles[j].c > 0){
	// 					lineColor = [255,0,0, map(Math.abs( particles[i].c * particles[j].c ), 1 , 400, 0, 255)]
	// 				}
	// 				push();
	// 				stroke(lineColor);
	// 				strokeWeight( map(Math.abs( particles[i].c * particles[j].c )/dis, 1/MAXDIST , 400/colidDist, 1, 100))
	// 				line(particles[i].p.x + width/2,particles[i].p.y+ height/2,particles[j].p.x+ width/2,particles[j].p.y+ height/2)
	// 				pop();
	// 				// console.log(`q${i} -- q${j} : ${ Math.abs(1000*particles[i].c * particles[j].c/dis)}@${rf.heading()}`,  )
	// 				particles[i].f.add(rf);
					
	// 			if(dis <= colidDist && !particles[i].colided && !particles[j].colided ){
					
	// 					var den = (particles[i].m + particles[j].m);

	// 					var oldvi =  particles[i].v.copy();
	// 					var oldvj =  particles[j].v.copy();
	// 					// console.log(`V${i} = ${particles[i].v.toString()}`);
	// 					// console.log(`V${j} = ${particles[j].v.toString()}`);

	// 					particles[i].v.mult( (particles[i].m - particles[j].m)/den ).add( oldvj.mult( particles[j].m*2/den ) ) ;
	// 					particles[j].v.mult( (particles[j].m - particles[i].m)/den ).add( oldvi.mult( particles[i].m*2/den ) );
						
	// 					// rf.mult(-1);
	// 					// particles[i].f.set(0,0);
	// 					// particles[j].f.set(0,0);
	// 					// particles[i].f.mult(-1);
	// 					// particles[i].p =  p5.Vector.fromAngle( particles[i].p.heading() , colidDist );;
	// 					// particles[j].p =  p5.Vector.fromAngle( particles[j].p.heading() , colidDist );;
	// 					// console.log(`V${i}' = ${particles[i].v.toString()}`);
	// 					// console.log(`V${j}' = ${particles[j].v.toString()}`);

	// 					particles[i].colided = true;
	// 					particles[j].colided = true;
	// 					console.log('colided:');
					
	// 			}
					
	// 			if(dis >  particles[i].r+particles[j].r ){
	// 					particles[j].colided = false;
	// 					particles[i].colided = false;
	// 			// 	console.log('turned:', particles[i].turned);
	// 			}
				
	// 			}
	// 		}
	// 	}
	// 	return rf;
	// }
}

Particle.count = 0;
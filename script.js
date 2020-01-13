class GameObject {
    self = this;
    newObj;
    points;
    frame = document.getElementById("main-frame");
    baseSpeed = 10;
    acceleration = 1;
    speed;
    top;
    left;
    death;
    maxLeft;
    maxTop;
    maxRight;
    maxBottom;
    constructor(Xpos, Ypos, height, width) {
        this.death = false;
        this.points = 0;
        this.speed  = this.baseSpeed;
        var position = this.frame.getBoundingClientRect();
        this.maxLeft = position.width;
        this.maxTop = position.top;
        this.maxRight = position.right;
        this.maxBottom = position.height;
        this.newObj = document.createElement("IMG");
        this.newObj.setAttribute("id","smooth-move");

        this.frame.appendChild(this.newObj);
        // this.newObj.style.backgroundColor = "blue";
        this.newObj.style.width = width + "px";
        this.newObj.style.height = height + "px";
        this.newObj.style.position = "relative";
        this.top = Ypos;
        this.left = Xpos;
        this.newObj.style.left = Xpos + 'px';
        this.newObj.style.top = Ypos + 'px';
    } 
     
    move(X) {
        
        this.left = this.left-X;
        this.newObj.style.left = this.left + "px";
    }
    

    

    
}
class Player extends GameObject {
    constructor(Xpos, Ypos) {
        super(Xpos, Ypos,100,60);
        this.newObj.setAttribute("src", "pose/dima.png");
        this.speed = 25;
    }
    move(Y) {
        var last = this.top;
        this.top = this.top + this.speed*Y;
        
        if(this.newObj.getBoundingClientRect().top <= this.frame.getBoundingClientRect().top || this.newObj.getBoundingClientRect().bottom >= this.frame.getBoundingClientRect().bottom) {
            if(this.newObj.getBoundingClientRect().top <= this.frame.getBoundingClientRect().top) {
                this.top = last + 20;
            }else {
                this.top = last - 20;
            }
        }
        this.newObj.style.top = this.top + "px";
    }


    
}

var Lista = ["pose/Untitled-2.png","pose/chitu.png","pose/delia.png","pose/chirieci.png","pose/oana.png","pose/andreea.png","pose/elena.png", "pose/razvan.png", "pose/stef.png", "pose/soare.png",];
class Enemy extends GameObject {
    dead;
    self  = this;
    constructor(Xpos,Ypos) {
        super(Xpos,Ypos,80,50);
        var choice = Math.floor(Math.random()*Lista.length);
        this.newObj.setAttribute("src", Lista[choice]);
        console.log(Lista.length);
        
        Lista.splice(choice,1);
        this.dead = false;
    }
    checkBounds(player) {
        if(this.newObj.getBoundingClientRect().left<=this.frame.getBoundingClientRect().left-10) {
            this.frame.removeChild(this.newObj);
            return false;
        }
      
            return true;
    }
    checkPlayer(player) {

        var p = player.getBoundingClientRect();
        var e = this.newObj.getBoundingClientRect();
        if((e.left < p.right && e.right > p.left) && (e.top < p.bottom && e.bottom > p.top)) {
            
            this.frame.removeChild(this.newObj);
            return false;
        }
            return true;
    }
    run(speed) {
        
        this.left = this.left - (speed - this.baseSpeed)*4;
        this.newObj.style.left = this.left + "px";
        return true;
    }

}
class GameFrame {
    points = 0;
    List = new Array();
    refference = new GameObject(0,0);
    player;
    X;
    nrEnemy = 1;
    Y;
    running;
    i;
    lastTime;
    constructor() {
        this.X = 0;
        this.Y = 0;
        this.points = 0;
        this.running = true;
        this.player = new Player(20,300);
    }
    generateEnemy() {
        if(this.nrEnemy <= 5) {
            this.List.push(new Enemy(this.refference.maxLeft-50  ,this.refference.maxBottom - 130 - Math.floor(Math.random() * 540)));
            this.nrEnemy +=1;
        }
    }
    removeEnemy() {
        for (let i = 0; i < this.List.length; i++) {
            if(!this.List[i].checkBounds(this.player.newObj)) {
                this.List.shift();
                this.nrEnemy -=1;
                return true;
            }
            if(!this.List[i].checkPlayer(this.player.newObj)) {
                this.points +=1;
                this.List.shift();
                this.nrEnemy -=1;
                return true;
            }

        }
    }
    stop() {
     var frame = document.getElementById("main-frame");
     frame.removeChild(this.player.newObj);
     frame.innerHTML = "Ai picat " + this.points + " studenti<br> Doar Topa a trecut<br>ctrl+R pentru a juca din nou";
        
    }
    start() {
        
        var time = 0;
        this.i = setInterval(() => {
            // if
            // this.player.speed += this.player.acceleration;
            if(time == 1000) {
                time = 0;
                
            }
            this.update(time);
            if(this.running==false||this.nrEnemy==1) {
                this.stop();
                clearInterval(this.i);
            }
            time+=100;
        }, 100);
        
    }
    caseInput() {
        
        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
                case 38 : this.Y = -1;
                break;
                case 40 : this.Y = 1;
                break;
                case 27 : this.running = false;
                break;
            }
        });
        document.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 38 : this.Y = 0;
                break;
                case 40 : this.Y = 0;
                break;
            }
        });
    }
    update(time) {
        this.caseInput();
        this.player.move(this.Y);
        if(time == 0) {
            if(Lista.length>0){
                console.log(this.nrEnemy);
                
                this.generateEnemy();
            }
        }
        for(var i = 0; i< this.List.length; i++){
            this.List[i].run(this.player.speed);
        }
        this.removeEnemy();
    }
}



window.onload = function() {
    let game = new GameFrame();
    game.start();
    
}
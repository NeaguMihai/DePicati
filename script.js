class GameObject {
    newObj;
    points;
    frame = document.getElementById("main-frame");
    baseSpeed = 15;
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
        this.newObj = document.createElement("div");
        this.newObj.setAttribute("id","smooth-move");
        this.frame.appendChild(this.newObj);
        this.newObj.style.backgroundColor = "blue";
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
    death() {
        console.log("not implemented");
        
    }

    

    
}
class Player extends GameObject {
    constructor(Xpos, Ypos) {
        super(Xpos, Ypos,40,80);
        this.speed = 30;
    }
    move(Y) {
        this.top = this.top + this.speed*Y;
        this.newObj.style.top = this.top + "px";
    }

}

class Enemy extends GameObject {
    dead;
    constructor(Xpos,Ypos) {
        super(Xpos,Ypos,80,40);
        this.dead = false;
    }
    run(speed) {
        this.left = this.left - (speed - this.baseSpeed);
        this.newObj.style.left = this.left + "px";
    }
    caught(positionX,positionY) {
        if(this.newObj.left == positionX && this.newObj.top == positionY) {
            this.death();
        }

    }
    death() {
        this.points ++;
        console.log(this.points);
        
        this.frame.removeChild(this.newObj);
        delete this.newObj;
    }
    
}
class GameFrame {
    points;
    refference = new GameObject(0,0);
    player;
    X;
    enemy;
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
        if(this.enemy == null) {
            this.enemy = new Enemy(this.refference.maxLeft-50,this.refference.maxBottom-130);
        }
    }
    stop() {
        console.log(this.player.maxBottom,this.player.maxLeft,this.player.maxRight,this.player.maxTop);
        
    }
    start() {
        
        var time = 0;
        this.i = setInterval(() => {
            this.update();
            if(this.running==false) {
                this.stop();
                clearInterval(this.i);
            }
            if(time == 1000) {
                this.player.speed += this.player.acceleration;
                console.log(this.player.speed);
                time = 0;
                
            }
            time+=100;
        }, 100);
        
    }
    caseInput() {
        console.log(this.X+" "+this.Y);
        
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
    update() {
        this.caseInput();
        this.player.move(this.Y);
        this.generateEnemy();
        this.enemy.run(this.player.speed);
        this.enemy.caught(this.player.left+80,this.player.top);
    }
}



window.onload = function() {
    let game = new GameFrame();
    game.start();
    
}
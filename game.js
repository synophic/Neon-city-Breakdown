const Game = function(){

	this.world = {

		background_color:"rgba(40, 48, 56, 0.25)",

		friction:0.6,
		gravity:2,

		player:new Game.Player(),
		enemy:new Game.Enemy(),

		height:96,
		width:256,

		collideObject:function(object){

			if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
      		else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
      		if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
      		else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

		},

		update:function(){

			this.player.velocity_y += this.gravity;
			this.player.update();

			this.player.velocity_y *= this.friction;

			this.collideObject(this.player);

			this.enemy.Detect(this.player.y);

		}

	};

	this.update = function(){

		this.world.update();

	};

};

Game.prototype = {
	
	constructor : Game

};

Game.Player = function(x, y){

	this.color       = "#ff0000";
  	this.height      = 28;
  	this.jumping     = true;
  	this.slashing    = false;
  	this.slashed     = false;
  	this.frame_slash = 0;
  	this.slash_delay = 60;
  	this.velocity_x  = 0;
  	this.velocity_y  = 0;
  	this.width       = 20;
  	this.x           = 30;
  	this.y           = 50;

};

Game.Player.prototype = {

	constructor : Game.Player,

	jump:function(){

		if(!this.jumping){

			this.jumping = true;
			this.velocity_y -= 30;

		}

	},

	slash:function(){

		if(this.frame_slash = 30){

			this.slashed = true;

		}

		if(this.frame_slash = this.slash_delay){

			this.slashing    = false;
			this.frame_slash = 0;

		}
		this.frame_slash++;
		
	},

	update:function(){

		this.y += this.velocity_y;

	}

};

Game.Enemy = function () {
	
	this.color       = "#0000ff";
	this.height      = 16;
	this.lunched     = false;
  	this.velocity_x  = 0;
  	this.velocity_y  = 0;
  	this.width       = 16;
  	this.x           = 200;
  	this.y           = 72;
  	this.frame_lunch = 100;
  	this.frame       = 0;


};

Game.Enemy.prototype = {
	
	constructor : Game.Enemy,

	Detect:function (play_y) {
		
		if(this.y > play_y + 5 && !this.lunched) {

			this.velocity_y = -1;

		}

		else if(this.y < play_y + 5 && !this.lunched) {

			this.velocity_y = 1;

		}

		else {this.velocity_y = 0;}

		if(this.frame == this.frame_lunch) {this.lunched = true;}

		if(this.lunched) {

			this.velocity_x = -5;

		}

		if(this.x < 0) {

			this.x           = 200;
  			this.y           = 72;
  			this.lunched     = false;
  			this.frame       = 0;
  			this.velocity_x = 0;

		}
		this.update();

	},

	update:function() {
		
		this.y     += this.velocity_y;
		this.x 	   += this.velocity_x;
		this.frame += 1;

	}

};
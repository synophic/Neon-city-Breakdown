const Game = function() {

  	this.world    = new Game.World();

  	this.update   = function() {

    	this.world.update();

  	};

};

Game.prototype = {

  	constructor : Game,

};

Game.World = function(friction = 0.8, gravity = 2) {

  	this.collider = new Game.World.Collider();

  	this.friction = friction;
  	this.gravity  = gravity;

  	this.columns   = 9;
  	this.rows      = 4;

  
  	this.tile_set = new Game.World.TileSet(5, 32);
  	this.player   = new Game.World.Object.Player(30, 50);

	this.map           = [00,00,00,00,00,00,00,00,00,
					              13,10,11,12,13,10,11,12,13,
					              05,06,07,08,09,05,06,07,08,
					              01,02,03,00,04,02,01,02,01];

	this.collision_map = [0,0,0,0,0,0,0,0,0,
						  0,0,0,0,0,0,0,0,0,
						  0,0,0,0,0,0,0,0,0,
						  1,1,1,1,1,1,1,1,1];

  	this.height   = 128;
  	this.width    = 288;

};

Game.World.prototype = {

  	constructor: Game.World,

  	collideObject:function(object) {

    	if      (object.getLeft()   < 0          ) { object.setLeft(0);             object.velocity_x = 0; }
    	else if (object.getRight()  > this.width ) { object.setRight(this.width);   object.velocity_x = 0; }
    	if      (object.getTop()    < 0          ) { object.setTop(0);              object.velocity_y = 0; }
    	else if (object.getBottom() > this.height) { object.setBottom(this.height); object.velocity_y = 0; object.jumping = false; }

    	var bottom, left, right, top, value;

    	top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    	left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    	value  = this.collision_map[top * this.columns + left];
    	this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

    	top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    	right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    	value  = this.collision_map[top * this.columns + right];
    	this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

    	bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    	left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    	value  = this.collision_map[bottom * this.columns + left];
    	this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

    	bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    	right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    	value  = this.collision_map[bottom * this.columns + right];
    	this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

  	},

  	update:function() {

    	this.player.updatePosition(this.gravity, this.friction);

    	this.collideObject(this.player);

    	this.player.updateAnimation();

  	}

};

Game.World.Collider = function() {

  	this.collide = function(value, object, tile_x, tile_y, tile_size) {

    	switch(value) {

      		case  1: this.collidePlatformTop      (object, tile_y            ); break;
      		case  2: this.collidePlatformRight    (object, tile_x + tile_size); break;
      		case  3: if (this.collidePlatformTop  (object, tile_y            )) return;// If there's a collision, we don't need to check for anything else.
               		 this.collidePlatformRight    (object, tile_x + tile_size); break;
      		case  4: this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case  5: if (this.collidePlatformTop  (object, tile_y            )) return;
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case  6: if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case  7: if (this.collidePlatformTop  (object, tile_y            )) return;
               		 if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case  8: this.collidePlatformLeft     (object, tile_x            ); break;
      		case  9: if (this.collidePlatformTop  (object, tile_y            )) return;
               		 this.collidePlatformLeft     (object, tile_x            ); break;
      		case 10: if (this.collidePlatformLeft (object, tile_x            )) return;
               		 this.collidePlatformRight    (object, tile_x + tile_size); break;
      		case 11: if (this.collidePlatformTop  (object, tile_y            )) return;
               		 if (this.collidePlatformLeft (object, tile_x            )) return;
               		 this.collidePlatformRight    (object, tile_x + tile_size); break;
      		case 12: if (this.collidePlatformLeft (object, tile_x            )) return;
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case 13: if (this.collidePlatformTop  (object, tile_y            )) return;
               		 if (this.collidePlatformLeft (object, tile_x            )) return;
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case 14: if (this.collidePlatformLeft (object, tile_x            )) return;
               		 if (this.collidePlatformRight(object, tile_x + tile_size)) return; // Had to change this since part 4. I forgot to add tile_size
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;
      		case 15: if (this.collidePlatformTop  (object, tile_y            )) return;
               		 if (this.collidePlatformLeft (object, tile_x            )) return;
               		 if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               		 this.collidePlatformBottom   (object, tile_y + tile_size); break;

    	}

  	}

};

Game.World.Collider.prototype = {

  	constructor: Game.World.Collider,

  	collidePlatformBottom:function(object, tile_bottom) {

    	if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

      		object.setTop(tile_bottom);
      		object.velocity_y = 0;
      		return true;

    	} return false;

  	},

  	collidePlatformLeft:function(object, tile_left) {

    	if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {

      	object.setRight(tile_left - 0.01);
      	object.velocity_x = 0;
      	return true;

    	} return false;

  	},

  	collidePlatformRight:function(object, tile_right) {

    	if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {

      	object.setLeft(tile_right);
      	object.velocity_x = 0;
      	return true;

    	} return false;

  	},

  	collidePlatformTop:function(object, tile_top) {

    	if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {

      	object.setBottom(tile_top - 0.01);
      	object.velocity_y = 0;
      	object.jumping    = false;
      	return true;

    	} return false;

  	}

};

Game.World.Object = function(x, y, width, height) {

 	this.height = height;
 	this.width  = width;
 	this.x      = x;
 	this.x_old  = x;
 	this.y      = y;
 	this.y_old  = y;

};

Game.World.Object.prototype = {

  	constructor:Game.World.Object,

  	getBottom:   function()  { return this.y     + this.height; },
  	getLeft:     function()  { return this.x;                   },
  	getRight:    function()  { return this.x     + this.width;  },
  	getTop:      function()  { return this.y;                   },
  	getOldBottom:function()  { return this.y_old + this.height; },
  	getOldLeft:  function()  { return this.x_old;               },
  	getOldRight: function()  { return this.x_old + this.width;  },
  	getOldTop:   function()  { return this.y_old                },
  	setBottom:   function(y) { this.y     = y    - this.height; },
  	setLeft:     function(x) { this.x     = x;                  },
  	setRight:    function(x) { this.x     = x    - this.width;  },
  	setTop:      function(y) { this.y     = y;                  },
  	setOldBottom:function(y) { this.y_old = y    - this.height; },
  	setOldLeft:  function(x) { this.x_old = x;                  },
  	setOldRight: function(x) { this.x_old = x    - this.width;  },
  	setOldTop:   function(y) { this.y_old = y;                  }

};

Game.World.Object.Animator = function(frame_set, delay) {

  	this.count       = 0;
  	this.delay       = (delay >= 1) ? delay : 1;
  	this.frame_set   = frame_set;
  	this.frame_index = 0;
  	this.frame_value = frame_set[0];
  	this.mode        = "pause";

};

Game.World.Object.Animator.prototype = {

  	constructor:Game.World.Object.Animator,

  	animate:function() {

    	switch(this.mode) {

      		case "loop" : this.loop(); break;
      		case "pause":              break;

    	}

  	},

  	changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {

    	if (this.frame_set === frame_set) { return; }

    	this.count       = 0;
    	this.delay       = delay;
    	this.frame_set   = frame_set;
    	this.frame_index = frame_index;
    	this.frame_value = frame_set[frame_index];
    	this.mode        = mode;

  	},

  	loop:function() {

    	this.count ++;

    	while(this.count > this.delay) {

      	this.count -= this.delay;
      	this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
      	this.frame_value = this.frame_set[this.frame_index];

   		}

  	}

};

Game.World.Object.Player = function(x, y) {

  	Game.World.Object.call(this, 30, 50, 32, 32);
  	Game.World.Object.Animator.call(this, Game.World.Object.Player.prototype.frame_sets["idle"], 10);

  	this.jumping     = false;
  	this.slashing    = false;
  	this.slash_hit   = false;
  	this.velocity_x  = 0;
  	this.velocity_y  = 0;
  	this.frame       = 0;

};

Game.World.Object.Player.prototype = {

  	constructor:Game.World.Object.Player,

  	frame_sets: {

    	"idle"      : [0],
  		"run"       : [1, 2, 3, 4],
  		"slash"     : [5, 6, 7, 8, 9, 5],
  		"jump-slash": [10, 11, 12, 13, 14],
  		"jump"      : [15, 16],
  		"dead"      : [17, 18, 19]

  	},

  	jump: function() {

    	if (!this.jumping) {
          if(this.slashing) return;
      		this.jumping     = true;
      		this.velocity_y -= 30;

    	}

  	},

  	slash:function(){

  		if(!this.slashing && !this.jumping) {

  			this.slashing = true;

  		}
			
	},

  	updateAnimation:function() {

		if(this.slashing && !this.jumping)	  this.changeFrameSet(this.frame_sets["slash"], "loop", 3);

		else if(this.jumping) this.changeFrameSet(this.frame_sets["jump"], "pause");

		else				  this.changeFrameSet(this.frame_sets["run"], "loop", 5);

		this.animate();

	},


  	updatePosition:function(gravity, friction) {// Changed from the update function

    	this.x_old       = this.x;
    	this.y_old       = this.y;
    	this.velocity_y += gravity;
    	this.x          += this.velocity_x;
    	this.y          += this.velocity_y;

    	this.velocity_x *= friction;
    	this.velocity_y *= friction;

    	if(this.slashing && !this.jumping) {

    		if(this.frame == 15) { this.slashing = false; this.frame = 0; }
    		this.frame++;

    	}

  	}

};

Object.assign(Game.World.Object.Player.prototype, Game.World.Object.prototype);
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.Animator.prototype);
Game.World.Object.Player.prototype.constructor = Game.World.Object.Player;

Game.World.TileSet = function(columns, tile_size) {

  	this.columns    = columns;
  	this.tile_size  = tile_size;

  	let f = Game.World.TileSet.Frame;

	this.frames = [new f( 0,  0, 32, 32, 0, 0), //idle
				   new f(32,  0, 32, 32, 0, 0), new f(64,  0, 32, 32, 0, 0), new f( 96,  0, 32, 32, 0, 0), new f(128,  0, 32, 32, 0, 0), //run
				   new f( 0, 32, 32, 32, 0, 0), new f(32, 32, 32, 32, 0, 0), new f( 64, 32, 32, 32, 0, 0), new f( 96, 32, 32, 32, 0, 0), new f(128, 32, 32, 32, 0, 0), //slash
				   new f( 0, 64, 32, 32, 0, 0), new f(32, 64, 32, 32, 0, 0), new f( 64, 64, 32, 32, 0, 0), new f( 96, 64, 32, 32, 0, 0), new f(128, 64, 32, 32, 0, 0), //jump-slash
				   new f( 0, 96, 32, 32, 0, 0), new f(32, 96, 32, 32, 0, 0), //jump
				   new f(64, 96, 32, 32, 0, 0), new f(96, 96, 32, 32, 0, 0), new f(128, 96, 32, 32, 0, 0), // dead
				   ];

};

Game.World.TileSet.prototype = { constructor: Game.World.TileSet };

Game.World.TileSet.Frame = function(x, y, width, height, offset_x, offset_y) {

  	this.x        = x;
  	this.y        = y;
  	this.width    = width;
  	this.height   = height;
  	this.offset_x = offset_x;
  	this.offset_y = offset_y;

};

Game.World.TileSet.Frame.prototype = { constructor: Game.World.TileSet.Frame };
window.addEventListener("load", function(event){

	"use strict";

	var keyDownUp = function(event){

		controller.keyDownUp(event.type, event.keyCode);

	};

	var resize = function(event){

		display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
		display.render();

	};

	var render = function(){

		display.fill(game.world.background_color);
		display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
		
		if(game.world.player.slashing) {

			game.world.player.slash();

			if(game.world.player.frame_slash) {
				display.drawRectangle(game.world.player.x + 20, game.world.player.y, 16, game.world.player.height, "#00ff00");}
			}

		display.drawRectangle(game.world.enemy.x, game.world.enemy.y, game.world.enemy.width, game.world.enemy.height, game.world.enemy.color);

		display.render();

	};

	var update = function(){
		/*jumpu*/
		if(controller.jump.active) {game.world.player.jump(); controller.jump.active = false;}
		/*slashu*/
		if(controller.slash.active) {game.world.player.slashing = true; controller.slash.active = false;}

		game.update();

	};

	var controller = new Controller();
	var display    = new Display(document.querySelector("canvas"));
  	var game       = new Game();
  	var engine     = new Engine(1000/30, render, update);

  	display.buffer.canvas.height = game.world.height;
  	display.buffer.canvas.width = game.world.width;

  	window.addEventListener("keydown", keyDownUp);
  	window.addEventListener("keyup", keyDownUp);
  	window.addEventListener("resize", resize);

  	resize();

  	engine.start();
  	
});
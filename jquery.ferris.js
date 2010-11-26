/*
 * jquery.ferris.js - v.pre
 * by aef
 * requires jquery-1.4.3
 * 
 * unlicensed.
 */

  (function($) {
    var settings, global;
    $.fn.ferris = function(options) {
      var that = this;
      var auto_itvl; //interval for automatic rotation;

      // Settings
      settings = $.extend({
        navigation : '#Navigation',
        radius : 100,           //px
        center_x : 0,
        center_y : 0,
        automatic : false,      //continuously rotate
        automatic_stall : 100,  //stall for N ms between each rotation
        animation_speed : 1000, //ms
        clockwise : false       //bool
      }, options || {});

      // Globals
      global = {
        cars : new Array(), 
        in_motion : false
      };
      //  Rotate the positions of DOM elements in an array;
      Array.prototype.rotate = function() {    
        if(global.in_motion) return;
        global.in_motion = true;

	      var x,y,pos,car;
	      var num_cars = this.length;
	      var child = num_cars - 1; //This is to adjust the starting positions of each child
	                                // so that it reflects the order in the DOM. 
	      $.each(this, function() {
	        pos = $(this).position();
	        x = (settings.center_x + settings.radius * Math.cos(2*Math.PI*child/num_cars)); 
	        y = (settings.center_y + settings.radius * Math.sin(2*Math.PI*child/num_cars));
	        x -= pos.left;
	        y -= pos.top;
	        $(this).animate({
	          left : '+='+x,
	          top  : '+='+y
	        }, settings.animation_speed, function() {
	          global.in_motion = false; 
	        });
	        child += 1;
	      });
	      if(settings.clockwise) {
	        car = this.pop();
	        this.splice(0,0,car);
	      } else {    
	        car = this.shift();
	        this.push(car);
	      }
      }
      
      //Fill cars with child DOM elements. 
      $.each($(this).children(), function() {
        global.cars.push($(this).addClass('car'));
      });

      //Set up positions;
      global.cars.rotate();

      if(settings.automatic) {
        var auto_itvl = setInterval(function() {
          global.cars.rotate();
        }, settings.animation_speed+settings.automatic_stall);
      }
      // Events
      $(settings.navigation).mousedown( function() {
          global.cars.rotate();
      });
      
      return this;
    }
    // Utilities
  })(jQuery);

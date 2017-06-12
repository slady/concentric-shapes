/************************************************************
 * Concentric shapes, the web page animation.
 * Copyright (c) 2017 Petr Sladek (slady)
 * License: CC BY-NC-SA
 * http://slady.net/
 * http://petr.sladek.name/
 */

// the position function
function pos(r,a){
  return { x: r * Math.sin(a), y: r * Math.cos(a) };
}
// linear interpolation
function interp(v0, v1, t) {
  return v0 + t * (v1 - v0);
}

// the concentric object
concentric = {
  // concentric constants
  count: 13,
  size: 100,
  slowdown: 4,
  // concentric variables
  shapes: [],
  startTime: 0,
  // the concentric init method
  run: function() {
    // init variables in a loop
    for (var s = 3; s <= this.count; s++) {
      this.shapes[s] = { edges: [] };
      var a = Math.PI / s;
      var r = this.size / 2 /  Math.sin(a);
      var p = -a;
      var b = pos(r,p);
      a *= 2;
      for (var i = 0; i < s; i++) {
	p += a;
	var e = pos(r,p);
	this.shapes[s].edges[i] = { b: b, e: e };
	b = e;
      }
    }
    // get the starting time
    this.startTime = new Date().getTime();
    // start timer
    window.setInterval("concentric.actualMove()", 30);
  },
  // the concentric main method, started every 30 milliseconds
  actualMove: function() {
    // get the actual time
    var t = Math.round((new Date().getTime() - this.startTime) / this.slowdown);
    // prepare context
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var radius = c.height / 2;
    ctx.clearRect(0, 0, c.width, c.height);
    //ctx.font = "30px Arial";
    //ctx.fillText("time: " + t, 10, 50);
    ctx.translate(radius, radius);
    // draw the positions in a loop
    for (var s = 3; s <= this.count; s++) {
      var sh = this.shapes[s];
      ctx.beginPath();
      for (var i = 0; i < s; i++) {
	var e = sh.edges[i];
	ctx.moveTo(e.b.x, e.b.y);
	ctx.lineTo(e.e.x, e.e.y);
      }
      ctx.stroke();
      var v = (t % this.size) / this.size;
      var w = Math.floor(t / this.size) % sh.edges.length;
      var f = sh.edges[w];
      var x = interp(f.b.x, f.e.x, v);
      var y = interp(f.b.y, f.e.y, v);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2*Math.PI);
      ctx.stroke();
    }
    ctx.translate(-radius, -radius);
  }
}

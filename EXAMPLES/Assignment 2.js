
"use strict";

var canvas;
var gl;

var click = false;

var maxNumTriangles = 20000;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var R=0,G=0,B=0;
var colors = [];
var lines = 0;
var indices = [];
indices[0] = 0;
var start = [0];
var u_FragColor;
var cbufferId;
var vColor;
var prevt=0;

window.onload = function init() {


{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cbufferId = gl.createBuffer();
    vColor = gl.getAttribLocation( program, "vColor" );

        document.getElementById("red slider").onchange = function() {
        R = event.srcElement.value;
    };
        document.getElementById("green slider").onchange = function() {
        G = event.srcElement.value;
    };
        document.getElementById("blue slider").onchange = function() {
        B = event.srcElement.value;
    };
    gl.clear( gl.COLOR_BUFFER_BIT );


    canvas.addEventListener("mousedown", function(event){
      click = true;
    });
    canvas.addEventListener("mouseup", function(event){
      click = false;
      lines++;              //as new line is made everytime you unclick, lines gets incremented
      indices[lines] = 0;   //indices for that line is set to 0 here (when you unclick)
      start[lines] = index; //the start for that line is set to index which was incremented while the mouse was pressed
    });
    canvas.addEventListener("mousemove", function(event){
    if(click){
          var t = vec2(2*event.clientX/canvas.width-1,
               2*(canvas.height-event.clientY)/canvas.height-1);
          gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

          colors.push(R,G,B);
          indices[lines]++; //indices for that line is incremented (so that we can keep drawing)
          index++;          //index is incremented as well (so we can get the start if the next line)

        gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
        gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );
          render();
          prevt=t;
        }
    });

}
};

function render() {

        gl.clear( gl.COLOR_BUFFER_BIT );
    for(var i = 0; i < lines+1; i++){
      gl.drawArrays(gl.LINE_STRIP, start[i], indices[i]);
    }
}



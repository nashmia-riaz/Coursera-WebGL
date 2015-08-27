
"use strict";

var canvas;
var gl;

var click = false;

var maxNumTriangles = 20000;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var color =[0,0,0,1];

var lines = 0;
var indices = [];
indices[0] = 0;
var start = [0];
var u_FragColor;

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

    u_FragColor=gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor) {
    console.log('Failed to get u_FragColor variable');
    }
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);



        document.getElementById("red slider").onchange = function() {
        color[0] = event.srcElement.value;
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);

    };
        document.getElementById("green slider").onchange = function() {
        color[1] = event.srcElement.value;
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
    };
        document.getElementById("blue slider").onchange = function() {
        color[2] = event.srcElement.value;
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
    };
        document.getElementById("alpha slider").onchange = function() {
        color[3] = event.srcElement.value;
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
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

          indices[lines]++; //indices for that line is incremented (so that we can keep drawing)
          index++;          //index is incremented as well (so we can get the start if the next line)

          render();
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



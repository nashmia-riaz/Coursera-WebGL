"use strict";

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 0;
var polygonShape=1;
var cbufferId;
var vColor;
var bufferId;
var colors =[];
var vPosition;
var theta=0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    if(!initShaders(gl, "vertex-shader", "fragment-shader")){
        console.log('Error!');
        return;
    }
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0,0,0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    cbufferId = gl.createBuffer();

    vColor = gl.getAttribLocation( program, "vColor" );
    vPosition = gl.getAttribLocation( program, "vPosition" );



    // Associate out shader variables with our data buffer


    document.getElementById( "Triangle" ).onclick = function () {
        polygonShape=1;
        render();
    };
    document.getElementById( "Square" ).onclick = function () {
        polygonShape=2;
        render();
    };
    document.getElementById( "Pentagon" ).onclick = function () {
        polygonShape=3;
        render();
    };
    document.getElementById( "Hexagon" ).onclick = function () {
        polygonShape=4;
        render();
    };
        document.getElementById("division slider").onchange = function() {
        numTimesToSubdivide = event.srcElement.value;
        render();
        document.getElementById("divisions").innerHTML = numTimesToSubdivide;
    };

        document.getElementById("theta slider").onchange = function() {
        theta = event.srcElement.value;
        document.getElementById('theta').innerHTML = theta;
        theta=Math.PI*theta/180;
        render();
    };

    render();
};




function rotate(a)
{
    var d;

    d=Math.sqrt(a[0]*a[0] + a[1]*a[1]);

    var newaX=a[0]*Math.cos(d*theta)-a[1]*Math.sin(d*theta);
    var newaY=a[0]*Math.sin(d*theta)+a[1]*Math.cos(d*theta);

    return [newaX,newaY];
}
function triangle( a, b, c )
{
    colors.push(vec3(Math.random(),Math.random(),Math.random()),
        vec3(Math.random(),Math.random(),Math.random()),
        vec3(Math.random(),Math.random(),Math.random()));

    points.push( rotate(a),rotate(b),rotate(c) );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count <= 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ab, bc, ac, count );
    }
}


function render()
{

    var vertices = [];
    points = [];

switch (polygonShape)
{
    case 1:
        vertices.push(
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5 ),
        vec2(0.5,-0.5));
        forTriangle(vertices);
    break;

    case 2:
vertices.push(
        vec2( -0.5, -0.5 ),
        vec2(  -0.5,  0.5 ),
        vec2(0.5,0.5),
        vec2(0.5,-0.5));
        forRectangle(vertices);
    break;

    case 3:
vertices.push(
        vec2(0,0),
        vec2(0.0,0.5 ),
        vec2( -0.5,  0.25 ),
        vec2(-0.35,-0.35),
        vec2(0.35,-0.35),
        vec2(0.5,0.25));
        forPentagon(vertices);
    break;

    case 4:
    vertices.push(
        vec2(0,0),
        vec2( -0.25, 0.5 ),
        vec2( -0.5,  0.0 ),
        vec2(-0.25,-0.5),
        vec2(0.25,-0.5),
        vec2(0.5,0.0),
        vec2(0.25,0.5));
        forHexagon(vertices);
    break;
}


    gl.clearColor( 1, 1, 0.9, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
    //requestAnimFrame(render);
}

function forTriangle(ver)
{
    divideTriangle( ver[0], ver[1], ver[2],
                    numTimesToSubdivide);
}

function forRectangle(ver)
{
   divideTriangle( ver[0], ver[1], ver[2],
                    numTimesToSubdivide);
      divideTriangle( ver[0], ver[2], ver[3],
                    numTimesToSubdivide);
}

function forPentagon(ver)
{

   divideTriangle( ver[0], ver[1], ver[2],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[2], ver[3],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[3], ver[4],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[4], ver[5],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[5], ver[1],
                    numTimesToSubdivide);
}
function forHexagon(ver)
{

   divideTriangle( ver[0], ver[1], ver[2],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[2], ver[3],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[3], ver[4],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[4], ver[5],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[5], ver[6],
                    numTimesToSubdivide);
   divideTriangle( ver[0], ver[6], ver[1],
                    numTimesToSubdivide);

}

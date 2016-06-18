"use strict";

var canvas;
var gl;

var NumVertices  = 0;

var points = [];
var colors = [];
var col=[1.0,0.0,0.0];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis ;
var theta = [ 0, 0, 0 ];
var numTimesToSubdivide=3;
var thetaLoc;
var surface=[];
var height=0.5;
var radius=0.5;
var r,h;
var centre=[0.0,0.0,0.0];
var cx, cy, cz;
var solid=1;
var thetaX=0, thetaY=0, thetaZ=0;
var index=0;
var prevc=[];
var prevtx=thetaX,prevty=thetaY,prevtz=thetaZ;

var u_FragColor;
var vertices=[];

    var vColor;
    var cBuffer;
    var vPosition;
    var bufferId;
    function checkVertices()
    {
        if (solid == 1)
    {
        NumVertices =192;
    }
    else if (solid ==2)
    {
        NumVertices = 576;
    }
    else if (solid ==3)
    {
        NumVertices = 1350;
    }
    }
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // render();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    checkVertices();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // cBuffer = gl.createBuffer();
    bufferId = gl.createBuffer();

    // vColor = gl.getAttribLocation( program, "vColor" );
    vPosition = gl.getAttribLocation( program, "vPosition" );


    u_FragColor=gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor) {
    console.log('Failed to get u_FragColor variable');
    }

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    render();


    document.getElementById( "x-axis-rotation" ).onchange = function () {
        prevtx=thetaX;
        thetaX = +(event.srcElement.value) *Math.PI / 180;
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=translationX(points[i], centre, [0,0,0]);
        points[i]=rotationX(points[i]);
        points[i]=translationX(points[i], [-centre[0],-centre[1],-centre[2]], [0,0,0]);
    }
    render();
    };
    document.getElementById( "y-axis-rotation" ).onchange = function () {
        prevty=thetaY;
        thetaY = +(event.srcElement.value) *Math.PI / 180;
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=translationY(points[i], centre, [0,0,0]);
        points[i]=rotationY(points[i]);
        points[i]=translationY(points[i], [-centre[0],-centre[1],-centre[2]], [0,0,0]);
    }
    render();
    };
    document.getElementById( "z-axis-rotation" ).onchange = function () {
            prevtz=thetaZ;
        thetaZ = +(event.srcElement.value) *Math.PI / 180;
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=translationZ(points[i], centre, [0,0,0]);
        points[i]=rotationZ(points[i]);
        points[i]=translationZ(points[i], [-centre[0],-centre[1],-centre[2]], [0,0,0]);
    }
    render();
    };


    document.getElementById( "x-axis" ).onchange = function () {
    //cone 192
    //cylinder 576
    //sphere 3750

    prevc[0] = centre[0];
        cx=event.srcElement.value;
        centre[0]=(+cx);
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=translationX(points[i], centre, prevc);
    }
    render();
    };
    document.getElementById( "y-axis" ).onchange = function () {
    prevc[1] = centre[1];
        cy=event.srcElement.value;
        centre[1]=(+cy);
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=translationY(points[i], centre, prevc);
    }
    render();
    };
    document.getElementById( "z-axis" ).onchange = function () {
        prevc[2] = centre[2];
        cz=event.srcElement.value;
        centre[2]=(+cz);
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=translationZ(points[i], centre, prevc);
    }
    render();
    };

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    theta[axis] += 2.0;
    render();
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    theta[axis] += 2.0;
    render();
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    theta[axis] += 2.0;
    render();
    };

    document.getElementById( "Cone" ).onclick = function () {
        solid=1;
    };
    document.getElementById( "Cylinder" ).onclick = function () {
        solid=2;
    };
    document.getElementById( "Sphere" ).onclick = function () {
        solid=3;
    };

    document.getElementById( "Draw" ).onclick = function () {
        drawShape();
        render();
    };
    document.getElementById( "Clear" ).onclick = function () {
        points=[];
        render;
    };

        document.getElementById("height").onchange = function() {
        h = event.srcElement.value;
        height=(+h);
        checkVertices();

        for (var i =0 ; i <NumVertices; i++)
        {
            points.pop();
        }
        drawShape();
        for  (var i =points.length-1 ; i >=points.length-NumVertices; i--)
        {redrawShape(i);
        }
            render();
    };
        document.getElementById("radius").onchange = function() {
        r = event.srcElement.value;
        radius=(+r);
        checkVertices();

        for  (var i =0 ; i <NumVertices; i++)
        {
            points.pop();
        }
        drawShape();
        for  (var i =points.length-1 ; i >=points.length-NumVertices; i--)
        {redrawShape(i);
        }
            render();
            };
}
function redrawShape(i)
{
            points[i]=translationX(points[i], centre, [0,0,0]);
            points[i]=translationY(points[i], centre, [0,0,0]);
            points[i]=translationZ(points[i], centre, [0,0,0]);
            points[i]=rotationX(points[i]);
            points[i]=rotationY(points[i]);
            points[i]=rotationZ(points[i]);    alert(points[i]);
            points[i]=translationX(points[i], [-centre[0],-centre[1],-centre[2]], [0,0,0]);
            points[i]=translationY(points[i], [-centre[0],-centre[1],-centre[2]], [0,0,0]);
            points[i]=translationZ(points[i], [-centre[0],-centre[1],-centre[2]], [0,0,0]);
}

function drawSphere()
{
var indexdata=[];

    var latitudeBands = 15;
    var longitudeBands = 15;

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta1 = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta1);
      var cosTheta = Math.cos(theta1);
      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var x = centre[0]+(radius*cosPhi * sinTheta);
        var y = centre[1]+(radius*cosTheta);
        var z = centre[2]+(radius*sinPhi * sinTheta);
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        indexdata.push(vec4(x,y,z,1));
      }
    }




for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        points.push(indexdata[first]);
        points.push(indexdata[first + 1]);
        points.push(indexdata[second]);

        points.push(indexdata[second]);
        points.push(indexdata[second + 1]);
        points.push(indexdata[first + 1]);

        colors.push(col,col,col,col,col,col);
        index+=6;

              }
    }
}

function drawShape()
{

    vertices = [
        vec4(         centre[0],  centre[1], radius+centre[2], 1.0 ),
        vec4( -radius+centre[0],  centre[1],        centre[2], 1.0 ),
        vec4(         centre[0],  centre[1],-radius+centre[2], 1.0 ),
        vec4(  radius+centre[0],  centre[1],        centre[2], 1.0 ),

        vec4(         centre[0],  centre[1]+height, radius+centre[2], 1.0 ),
        vec4( -radius+centre[0],  centre[1]+height,        centre[2], 1.0 ),
        vec4(         centre[0],  centre[1]+height,-radius+centre[2], 1.0 ),
        vec4(  radius+centre[0],  centre[1]+height,        centre[2], 1.0 )
    ];
    if (solid==1)
    {
        quad( 0, 1, 2, 3 );
    }
    else if (solid==2)
    {
        quad(0,1,2,3);
        quad(4,5,6,7);
    }
    else if(solid==3)
    {
        drawSphere();
    }
    // quad( 2, 3, 7, 6 );
    // quad( 3, 0, 4, 7 );
    // quad( 6, 5, 1, 2 );
    // quad( 4, 5, 6, 7 );
    // quad( 5, 4, 0, 1 );
    // quad (0,1,2,3);
    // quad (4,5,6,7);
}

function quad(a, b, c, d)
{

    divideTriangle (vertices[a],vertices[b],numTimesToSubdivide);
    divideTriangle (vertices[b], vertices[c],numTimesToSubdivide);
    divideTriangle (vertices[c],vertices[d],numTimesToSubdivide);
    divideTriangle (vertices[d], vertices[a],numTimesToSubdivide);



    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    // var indices = [ a, b, c, c, d, a ];

    // for ( var i = 0; i < indices.length; ++i ) {
    //     // points.push( vertices[indices[i]] );
    //     //colors.push( vertexColors[indices[i]] );

    //     // for solid colored faces use
    //     //colors.push(vertexColors[c]);

    // }
}
function rotationX(a)
{
//     y' = y*cos q - z*sin q
//     z' = y*sin q + z*cos q
    var z, y;
    y= a[1] * Math.cos(prevtx-thetaX) - a[2] * Math.sin(prevtx-thetaX);
    z= a[1] * Math.sin(prevtx-thetaX) + a[2]*Math.cos(prevtx-thetaX);
        z = vec4(a[0], y, z, a[3]);
        a=z;
        return a;
}
function rotationY(a)
{
//     z' = z*cos q - x*sin q
//     x' = z*sin q + x*cos q
// alert(a);
    var z, x;
    z= a[2] * Math.cos(prevty-thetaY) - a[0] * Math.sin(prevty-thetaY);
    x= a[2] * Math.sin(prevty-thetaY) + a[0]*Math.cos(prevty-thetaY);
        z = vec4(x, a[1], z, 1);
        a=z;
// alert(a);
        return a;
}
function rotationZ(a){
//     x' = x*cos q - y*sin q
//     y' = x*sin q + y*cos q
    var x, y;
    x= a[0] * Math.cos(prevtz-thetaZ) - a[1] * Math.sin(prevtz-thetaZ);
    y= a[0] * Math.sin(prevtz-thetaZ) + a[1] * Math.cos(prevtz-thetaZ);
        x = vec4(x, y, a[2], 1);
        // alert(x);
        a=x;
        return a;
}
function translationX(a, b, c)
{
    var z;
        z = vec4(a[0]+(b[0]-c[0]), a[1], a[2], a[3]);
        a=z;
        return a;
}
function translationY(a, b, c)
{
    var z;
        z = vec4(a[0], a[1]+(b[1]-c[1]), a[2], a[3]);
        a=z;
        return a;
}
function translationZ(a, b, c)
{
    var z;
        z = vec4(a[0], a[1], a[2]+(b[2]-c[2]), a[3]);
        a=z;
        return a;
}
function triangle( a, b, c )
{
    // rotate();
    // var col = [1,0,0];
    points.push( (a), (b), (c) );
    index+=3;
    colors.push(col,col,col);
if(solid==1)
{
    points.push(a,b,vec4(centre[0],centre[1]+height,centre[2],1)); //for cone, also use one surface of cone
    index+=3;
    colors.push(col,col,col,col,col,col);
}

else if(solid==2)
{

if(a[1]>centre[1])
{

    var a1=vec4(a[0],a[1]-height,a[2],1);
    var b1=vec4(b[0],b[1]-height,b[2],1);
}
else{
    var a1=vec4(a[0],a[1]+height,a[2],1);
    var b1=vec4(b[0],b[1]+height,b[2],1);
}
points.push(a,b,b1,b1,a1,a);
colors.push(col,col,col,col,col,col);
index+=6
}
}

function divideTriangle( a, b, count )
{
    // check for end of recursion

    if ( count <= 0 ) {
        if(a[1]==centre[1]){
        triangle( a, b, vec4(centre[0],centre[1],centre[2],1 ));}
        else{
            triangle( a, b, vec4(centre[0],a[1],centre[2],1 ));
        }

    }
    else {
        //bisect the sides
        var midab=vec2((a[0]+b[0])/2,(a[2]+b[2])/2);

        var theta2 = Math.atan( (midab[1]-centre[2])  /  (midab[0]-centre[0]) );
        if (midab[0]<centre[0] )
        {
            theta2+=Math.PI;
            }
        var s = Math.sin( theta2 );
        var c = Math.cos( theta2 );

        var a2=vec4(radius*c+centre[0],a[1],radius*s+centre[2],1);
        --count;

        // three new triangles

        divideTriangle( a, a2, count );
        divideTriangle( a2, b, count );
    }
}

const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);

function render()
{
    // alert(index);

    gl.uniform3fv(thetaLoc, theta);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    gl.uniform4f(u_FragColor,1,0,0,1);
    gl.drawArrays( gl.LINES, 0, points.length );
    gl.uniform4f(u_FragColor,1,1,0,1);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    var x_axis = [vec4(-5,0,0,1),vec4(5,0,0,1)];
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(x_axis), gl.STATIC_DRAW );
    gl.uniform4f(u_FragColor,0,0,1,1);
    colors.push(1,0,0,1,0,0);
    gl.drawArrays( gl.LINES, 0, x_axis.length );


    var y_axis = [vec4(0,-5,0,1),vec4(0,5,0,1)];
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(y_axis), gl.STATIC_DRAW );
    gl.uniform4f(u_FragColor,1,0,0,1);
    colors.push(0,1,0,0,1,0);
    gl.drawArrays( gl.LINES, 0, x_axis.length );


    var z_axis = [vec4(0,0,-5,1),vec4(0,0,5,1)];
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(z_axis), gl.STATIC_DRAW );
    gl.uniform4f(u_FragColor,0,1,0,1);
    colors.push(0,0,1,0,0,1);
    gl.drawArrays( gl.LINES, 0, x_axis.length );


    // requestAnimFrame( render );
}

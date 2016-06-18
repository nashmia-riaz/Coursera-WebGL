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
// var theta = [ 0, 0, 0 ];
var numTimesToSubdivide=5;
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

var near = -10;
var far = 10;
var radiuse = 1.5;
var thetae  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;


// var u_FragColor;
var vertices=[];

var normalsArray = [];

var lightPosition = vec4( 3.5, 3.5, 3.5, 0.0 );
var lightAmbient  = vec4( 0.5, 0.5, 0.5, 1.0 );
var lightDiffuse  = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


var lightPosition2 = vec4(-3.5,-3.5,-3.5, 0.0 );
var lightAmbient2  = vec4(  1.0, 1.0, 1.0, 1.0 );
var lightDiffuse2  = vec4(  1.0, 1.0, 1.0, 1.0 );
var lightSpecular2 = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0 );
var materialDiffuse = vec4( 0.8, 0.8, 1.0, 1.0);
var materialSpecular = vec4( 0.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var ambientProduct;
var diffuseProduct;
var specularProduct;

var ambientProduct2;
var diffuseProduct2;
var specularProduct2;

var source1toggle=true;
var source2toggle=true;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// var viewerPos;
var program;

// var flag = true;

    var vNormal;
    var nBuffer;
    var vPosition;
    var bufferId;
    function checkVertices()
    //cone 768
    //cylinder 1536
    //sphere 2400
    {
        if (solid == 1)
    {
        NumVertices =768;
    }
    else if (solid ==2)
    {
        NumVertices = 1536;
    }
    else if (solid ==3)
    {
        NumVertices = 2400;
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
    // gl.depthFunc(gl.LEQUAL);
    // gl.enable(gl.POLYGON_OFFSET_FILL);
    // gl.polygonOffset(1.0, 2.0);


    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    nBuffer = gl.createBuffer();
    vNormal = gl.getAttribLocation(program, "vNormal");
    // cBuffer = gl.createBuffer();
    bufferId = gl.createBuffer();

    // vColor = gl.getAttribLocation( program, "vColor" );
    vPosition = gl.getAttribLocation( program, "vPosition" );

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    ambientProduct2 = mult(lightAmbient2, materialAmbient);
    diffuseProduct2 = mult(lightDiffuse2, materialDiffuse);
    specularProduct2 = mult(lightSpecular2, materialSpecular);


    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    // thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("Button0").onclick = function(){radiuse *= 2.0;};
    document.getElementById("Button1").onclick = function(){radiuse *= 0.5;};
    document.getElementById("Button2").onclick = function(){thetae += dr;};
    document.getElementById("Button3").onclick = function(){thetae -= dr;};
    document.getElementById("Button4").onclick = function(){phi += dr;};
    document.getElementById("Button5").onclick = function(){phi -= dr;};
    document.getElementById("source1-motion").onclick = function(){source1toggle = !source1toggle;};
    document.getElementById("source2-motion").onclick = function(){source2toggle = !source2toggle;};

    // viewerPos = vec3(0.0, 0.0, -20.0 );

    // projection = ortho(-1, 1, -1, 1, -100, 100);

    //event listeners for buttons
    ////*******************************************************************
//                          LIGHT SOURCE 2
//*******************************************************************
//POSITION
    $(function() {
        $( "#source2-position-x" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightPosition2[0] = aX;
                    render();
                }
            });
    });

    $(function() {
        $( "#source2-position-y" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aY = +(ui.value);
                    lightPosition2[1] = aY;
                    render();
                }
            });
    });
    $(function() {
        $( "#source2-position-z" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aZ = +(ui.value);
                    lightPosition2[2] = aZ;
                    render();
                }
            });
    });


//AMBIENT
   $(function() {
        $( "#source2-ambient-x" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightAmbient2[0] = aX;
                    ambientProduct2 = mult(lightAmbient2, materialAmbient);
                    render();
                }
            });
    });

   $(function() {
        $( "#source2-ambient-y" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aY = +(ui.value);
                    lightAmbient2[1] = aY;
                    ambientProduct2 = mult(lightAmbient2, materialAmbient);
                    render();
                }
            });
    });


   $(function() {
        $( "#source2-ambient-z" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aZ = +(ui.value);
                    lightAmbient2[2] = aZ;
                    ambientProduct2 = mult(lightAmbient2, materialAmbient);
                    render();
                }
            });
    });



//DIFFUSE

   $(function() {
        $( "#source2-diffuse-x" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightDiffuse2[0] = aX;
                    diffuseProduct2 = mult(lightDiffuse2, materialDiffuse);
                    render();
                }
            });
    });

   $(function() {
        $( "#source2-diffuse-y" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightDiffuse2[1] = aX;
                    diffuseProduct2 = mult(lightDiffuse2, materialDiffuse);
                    render();
                }
            });
    });

   $(function() {
        $( "#source2-diffuse-z" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightDiffuse2[2] = aX;
                    diffuseProduct2 = mult(lightDiffuse2, materialDiffuse);
                    render();
                }
            });
    });

//SPECULAR

   $(function() {
        $( "#source2-specular-x" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightSpecular[0] = aX;
                    specularProduct2 = mult(lightSpecular2, materialSpecular);
                    render();
                }
            });
    });

   $(function() {
        $( "#source2-specular-y" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightSpecular[1] = aX;
                    specularProduct2 = mult(lightSpecular2, materialSpecular);
                    render();
                }
            });
    });

   $(function() {
        $( "#source2-specular-z" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightSpecular2[2] = aX;
                    specularProduct2 = mult(lightSpecular2, materialSpecular);
                    render();
                }
            });
    });


//STRENGTH
    $(function() {
        $( "#source2-strength" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightAmbient2 = vec4(aX,aX,aX,1);
                    lightDiffuse2 = vec4(aX,aX,aX,1);
                    lightSpecular2 = vec4(aX,aX,aX,1);
                    ambientProduct2 = mult(lightAmbient2, materialAmbient);
                    diffuseProduct2 = mult(lightDiffuse2, materialDiffuse);
                    specularProduct2 = mult(lightSpecular2, materialSpecular);
                    render();
                }
            });
    });


//*******************************************************************



//*******************************************************************
//                          LIGHT SOURCE 1
//*******************************************************************
//POSITION

    $(function() {
        $( "#source1-position-x" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightPosition[0] = aX;
                    render();
                }
            });
    });

    $(function() {
        $( "#source1-position-y" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aY = +(ui.value);
                    lightPosition[1] = aY;
                    render();
                }
            });
    });
    $(function() {
        $( "#source1-position-z" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aZ = +(ui.value);
                    lightPosition[2] = aZ;
                    render();
                }
            });
    });



//AMBIENT
   $(function() {
        $( "#source1-ambient-x" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightAmbient[0] = aX;
                    ambientProduct = mult(lightAmbient, materialAmbient);
                    render();
                }
            });
    });

   $(function() {
        $( "#source1-ambient-y" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aY = +(ui.value);
                    lightAmbient[1] = aY;
                    ambientProduct = mult(lightAmbient, materialAmbient);
                    render();
                }
            });
    });


   $(function() {
        $( "#source1-ambient-z" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aZ = +(ui.value);
                    lightAmbient[2] = aZ;
                    ambientProduct = mult(lightAmbient, materialAmbient);
                    render();
                }
            });
    });



//DIFFUSE

   $(function() {
        $( "#source1-diffuse-x" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightDiffuse[0] = aX;
                    diffuseProduct = mult(lightDiffuse, materialDiffuse);
                    render();
                }
            });
    });

   $(function() {
        $( "#source1-diffuse-y" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightDiffuse[1] = aX;
                    diffuseProduct = mult(lightDiffuse, materialDiffuse);
                    render();
                }
            });
    });

   $(function() {
        $( "#source1-diffuse-z" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightDiffuse[2] = aX;
                    diffuseProduct = mult(lightDiffuse, materialDiffuse);
                    render();
                }
            });
    });



//SPECULAR

   $(function() {
        $( "#source1-specular-x" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightSpecular[0] = aX;
                    specularProduct = mult(lightSpecular, materialSpecular);
                    render();
                }
            });
    });

   $(function() {
        $( "#source1-specular-y" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightSpecular[1] = aX;
                    specularProduct = mult(lightSpecular, materialSpecular);
                    render();
                }
            });
    });

   $(function() {
        $( "#source1-specular-z" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightSpecular[2] = aX;
                    specularProduct = mult(lightSpecular, materialSpecular);
                    render();
                }
            });
    });


//STRENGTH


    $(function() {
        $( "#source1-strength" ).slider(
            {
                max:1,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:1,
                change: function (event, ui)
                {
                    var aX = +(ui.value);
                    lightAmbient = vec4(aX,aX,aX,1);
                    lightDiffuse = vec4(aX,aX,aX,1);
                    lightSpecular = vec4(aX,aX,aX,1);
                    ambientProduct = mult(lightAmbient, materialAmbient);
                    diffuseProduct = mult(lightDiffuse, materialDiffuse);
                    specularProduct = mult(lightSpecular, materialSpecular);
                    render();
                }
            });
    });

//*******************************************************************
    document.getElementById( "x-axis-rotation" ).onchange = function () {
        prevtx=thetaX;
        thetaX = +(event.srcElement.value) *Math.PI / 180;
        checkVertices();
    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
    {
        points[i]=rotationX(points[i]);
    }
    render();
    };


    $(function() {
        $( "#x-axis-rotation" ).slider(
            {
                max:180,
                min:-180,
                step:1,
                orientation:"horizontal",
                animate:true,
                value:0,
                change: function (event, ui)
                {prevtx=thetaX;
                thetaX = +(ui.value) *Math.PI / 180;
                checkVertices();
                for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                {
                    points[i]=rotationX(points[i]);
                }
                render();
                }
            });
    });

    $(function() {
        $( "#y-axis-rotation" ).slider(
            {
                max:180,
                min:-180,
                step:1,
                orientation:"horizontal",
                animate:true,
                value:0,
                change: function (event, ui)
                {prevty=thetaY;
                thetaY = +(ui.value) *Math.PI / 180;
                checkVertices();
                for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                {
                    points[i]=rotationY(points[i]);
                }
                render();
                }
            });
    });

    $(function() {
        $( "#z-axis-rotation" ).slider(
            {
                max:180,
                min:-180,
                step:1,
                orientation:"horizontal",
                animate:true,
                value:0,
                change: function (event, ui)
                {prevtz=thetaZ;
                thetaZ = +(ui.value) *Math.PI / 180;
                checkVertices();
                for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                {
                    points[i]=rotationZ(points[i]);
                }
                render();
                }
            });
    });


    $(function() {
        $( "#Translation-x-axis" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0,
                change: function (event, ui)
                {
                    prevc[0] = centre[0];
                        cx=ui.value;
                        centre[0]=(+cx);
                        checkVertices();
                    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                    {
                        points[i]=translationX(points[i], centre, prevc);
                    }
                    render();
                }
            });
    });



    $(function() {
        $( "#Translation-y-axis" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0,
                change: function (event, ui)
                {
                    prevc[1] = centre[1];
                        cy=ui.value;
                        centre[1]=(+cy);
                        checkVertices();
                    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                    {
                        points[i]=translationY(points[i], centre, prevc);
                    }
                    render();
                }
            });
    });

    $(function() {
        $( "#Translation-z-axis" ).slider(
            {
                max:3,
                min:-3,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0,
                change: function (event, ui)
                {
                    prevc[2] = centre[2];
                    cz=ui.value;
                    centre[2]=(+cz);
                    checkVertices();
                    for (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                    {
                        points[i]=translationZ(points[i], centre, prevc);
                    }
                    render();
                }
            });
    });


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
        centre=[0,0,0];
        drawShape();
        render();
    };
    document.getElementById( "Clear" ).onclick = function () {
        points=[];
        normalsArray=[];
        render;
    };

    $(function() {
        $( "#height" ).slider(
            {
                max:5,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    h = ui.value;
                    height=(+h);
                    checkVertices();

                    for (var i =0 ; i <NumVertices; i++)
                    {
                        points.pop();
                        normalsArray.pop();
                    }
                    drawShape();
                    for  (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                    {
                        redrawShape(i);
                    }
                        render();
                }
            });

    });

    $(function() {
        $( "#radius" ).slider(
            {
                max:5,
                min:0,
                step:0.1,
                orientation:"horizontal",
                animate:true,
                value:0.5,
                change: function (event, ui)
                {
                    r = ui.value;
                    // document.getElementById("radius").innerHTML=r;
                    radius=(+r);
                    checkVertices();

                    for  (var i =0 ; i <NumVertices; i++)
                    {
                        points.pop();
                        normalsArray.pop();
                    }
                    drawShape();
                    for  (var i =points.length-1 ; i >=points.length-NumVertices; i--)
                    {
                        redrawShape(i);
                    }
                        render();
                }
            });

    });

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );


    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct2"),
       flatten(ambientProduct2));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct2"),
       flatten(diffuseProduct2) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct2"),
       flatten(specularProduct2) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"),
       flatten(lightPosition2) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);
    render();
}
function redrawShape(i)
{
            points[i]=rotationX(points[i]);
            points[i]=rotationY(points[i]);
            points[i]=rotationZ(points[i]);
}

function drawSphere()
{
var indexdata=[];

    var latitudeBands = 20;
    var longitudeBands = 20;

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta1 = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta1);
      var cosTheta = Math.cos(theta1);
      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi1 = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi1);
        var cosPhi = Math.cos(phi1);
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
        points.push(indexdata[second]);
        points.push(indexdata[first + 1]);
        var n = calculateNormal(indexdata[first],  indexdata[second],indexdata[first+1]);
        normalsArray.push(n,n,n);
        points.push(indexdata[second]);
        points.push(indexdata[second + 1]);
        points.push(indexdata[first + 1]);
        var n = calculateNormal(indexdata[second], indexdata[second+1], indexdata[first+1]);
        normalsArray.push(n,n,n);
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
    if (solid==3)
    {

        a=translationY( a, [0,0,0], [centre[0],(centre[1]),centre[2]]);
        a=translationZ( a, [0,0,0], [centre[0],(centre[1]),centre[2]]);

//     y' = y*cos q - z*sin q
//     z' = y*sin q + z*cos q
        var z, y;
        y= a[1] * Math.cos(prevtx-thetaX) - a[2] * Math.sin(prevtx-thetaX);
        z= a[1] * Math.sin(prevtx-thetaX) + a[2]*Math.cos(prevtx-thetaX);
        z = vec4(a[0], y, z, a[3]);

        z=translationY( z, [0,0,0], [-centre[0],-1*(centre[1]),-centre[2]]);
        z=translationZ( z, [0,0,0], [-centre[0],-1*(centre[1]),-centre[2]]);
        a=z;
        return a;
    }
    else
    {
        a=translationY( a, [0,0,0], [centre[0],(centre[1]+height/2),centre[2]]);
        a=translationZ( a, [0,0,0], [centre[0],(centre[1]+height/2),centre[2]]);

//     y' = y*cos q - z*sin q
//     z' = y*sin q + z*cos q
        var z, y;
        y= a[1] * Math.cos(prevtx-thetaX) - a[2] * Math.sin(prevtx-thetaX);
        z= a[1] * Math.sin(prevtx-thetaX) + a[2]*Math.cos(prevtx-thetaX);
        z = vec4(a[0], y, z, a[3]);

        z=translationY( z, [0,0,0], [-centre[0],-1*(centre[1]+height/2),-centre[2]]);
        z=translationZ( z, [0,0,0], [-centre[0],-1*(centre[1]+height/2),-centre[2]]);
        a=z;
        return a;
    }
}
function rotationY(a)
{
    if (solid ==3)
    {
        a=translationX( a, [0,0,0], [centre[0],(centre[1]),centre[2]]);
        a=translationZ( a, [0,0,0], [centre[0],(centre[1]),centre[2]]);

//     z' = z*cos q - x*sin q
//     x' = z*sin q + x*cos q
// alert(a);
        var z, x;
        z= a[2] * Math.cos(prevty-thetaY) - a[0] * Math.sin(prevty-thetaY);
        x= a[2] * Math.sin(prevty-thetaY) + a[0]*Math.cos(prevty-thetaY);
        z = vec4(x, a[1], z, 1);

        z=translationX( z, [0,0,0], [-centre[0],-1*(centre[1]),-centre[2]]);
        z=translationZ( z, [0,0,0], [-centre[0],-1*(centre[1]),-centre[2]]);
        a=z;
        return a;
    }
    else
    {
        a=translationX( a, [0,0,0], [centre[0],(centre[1]+height/2),centre[2]]);
        a=translationZ( a, [0,0,0], [centre[0],(centre[1]+height/2),centre[2]]);

//     z' = z*cos q - x*sin q
//     x' = z*sin q + x*cos q
// alert(a);
        var z, x;
        z= a[2] * Math.cos(prevty-thetaY) - a[0] * Math.sin(prevty-thetaY);
        x= a[2] * Math.sin(prevty-thetaY) + a[0]*Math.cos(prevty-thetaY);
        z = vec4(x, a[1], z, 1);

        z=translationX( z, [0,0,0], [-centre[0],-1*(centre[1]+height/2),-centre[2]]);
        z=translationZ( z, [0,0,0], [-centre[0],-1*(centre[1]+height/2),-centre[2]]);
        a=z;
        return a;
    }
}
function rotationZ(a){
    if (solid==3)
    {
//     x' = x*cos q - y*sin q
//     y' = x*sin q + y*cos q
//
        a=translationY( a, [0,0,0], [centre[0],(centre[1]),centre[2]]);
        a=translationX( a, [0,0,0], [centre[0],(centre[1]),centre[2]]);
        var x, y;
        x= a[0] * Math.cos(prevtz-thetaZ) - a[1] * Math.sin(prevtz-thetaZ);
        y= a[0] * Math.sin(prevtz-thetaZ) + a[1] * Math.cos(prevtz-thetaZ);
        x = vec4(x, y, a[2], 1);
        x=translationY( x, [0,0,0], [-centre[0],-1*(centre[1]),-centre[2]]);
        x=translationX( x, [0,0,0], [-centre[0],-1*(centre[1]),-centre[2]]);
        a=x;
        return a;
    }
    else
    {

//     x' = x*cos q - y*sin q
//     y' = x*sin q + y*cos q
//
        a=translationY( a, [0,0,0], [centre[0],(centre[1]+height/2),centre[2]]);
        a=translationX( a, [0,0,0], [centre[0],(centre[1]+height/2),centre[2]]);
        var x, y;
        x= a[0] * Math.cos(prevtz-thetaZ) - a[1] * Math.sin(prevtz-thetaZ);
        y= a[0] * Math.sin(prevtz-thetaZ) + a[1] * Math.cos(prevtz-thetaZ);
        x = vec4(x, y, a[2], 1);
        x=translationY( x, [0,0,0], [-centre[0],-1*(centre[1]+height/2),-centre[2]]);
        x=translationX( x, [0,0,0], [-centre[0],-1*(centre[1]+height/2),-centre[2]]);
        a=x;
        return a;
    }
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
function calculateNormal(a, b, c)
{

     var t1 = subtract(b, a);
     var t2 = subtract(c, b);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);
     return normal;
}
function triangle( a, b, c )
{
    // rotate();
    // var col = [1,0,0];
    var n = calculateNormal(a, b,c);
    points.push( (a), (b), (c) );
    normalsArray.push(n,n,n);
    index+=3;
    colors.push(col,col,col);

if(solid==1)
{
    var p = vec4(centre[0],centre[1]+height,centre[2],1);
    points.push(a,b,p); //for cone, also use one surface of cone
    var n = calculateNormal(a,b,p);
    normalsArray.push(n,n,n);
    index+=3;
    colors.push(col,col,col,col,col,col);
}

else if(solid==2)
{

if(a[1]>centre[1])
{

    var a1=vec4(a[0],a[1]-height,a[2],1);
    var b1=vec4(b[0],b[1]-height,b[2],1);
    var n = calculateNormal(b1,b,a1);
normalsArray.push(n,n,n);
n = calculateNormal(a1,b,a);
normalsArray.push(n,n,n);

points.push(a,b,a1,a1,b,b1);
colors.push(col,col,col,col,col,col);
index+=6
}
// else{
//     var a1=vec4(a[0],a[1]+height,a[2],1);
//     var b1=vec4(b[0],b[1]+height,b[2],1);
// }

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


        var s1theta=0;
        var s2theta=360;

function render()
{

    if (source1toggle==true)
    {
        s1theta+=1;
        var newX = 5 * Math.cos(s1theta*Math.PI/180);
        var newZ = 5 * Math.sin(s1theta*Math.PI/180);
        // lightPosition[0]=x;
        // lightPosition[2]=z;
        lightPosition=vec4(newX,5,newZ,1);

    }
        if(s1theta>=360) s1theta=0;

    if (source2toggle==true)
    {
        s2theta-=1;
        var newX = -5 * Math.cos(s2theta*Math.PI/180);
        var newZ = -5 * Math.sin(s2theta*Math.PI/180);
        // lightPosition[0]=x;
        // lightPosition[2]=z;
        lightPosition2=vec4(newX,-5,newZ,1);
    }
        if(s2theta<=0) s2theta=360;
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct2"),
       flatten(ambientProduct2));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct2"),
       flatten(diffuseProduct2) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct2"),
       flatten(specularProduct2) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"),
       flatten(lightPosition2) );

    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

    // alert(index);

    // gl.uniform3fv(thetaLoc, theta);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    // if(flag) theta[axis] += 2.0;

    eye = vec3(
        radiuse*Math.sin(thetae)*Math.cos(phi),
        radiuse*Math.sin(thetae)*Math.sin(phi),
        radiuse*Math.cos(phi));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );


    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    requestAnimFrame(render);


    // gl.uniform4f(u_FragColor,1,0,0,1);
    // gl.drawArrays( gl.LINES, 0, points.length );
    // gl.uniform4f(u_FragColor,1,1,0,1);
    // gl.drawArrays( gl.TRIANGLES, 0, points.length );

    // var x_axis = [vec4(-5,0,0,1),vec4(5,0,0,1)];
    // gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(x_axis), gl.STATIC_DRAW );
    // gl.uniform4f(u_FragColor,0,0,1,1);
    // colors.push(1,0,0,1,0,0);
    // gl.drawArrays( gl.LINES, 0, x_axis.length );


    // var y_axis = [vec4(0,-5,0,1),vec4(0,5,0,1)];
    // gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(y_axis), gl.STATIC_DRAW );
    // gl.uniform4f(u_FragColor,1,0,0,1);
    // colors.push(0,1,0,0,1,0);
    // gl.drawArrays( gl.LINES, 0, x_axis.length );


    // var z_axis = [vec4(0,0,-5,1),vec4(0,0,5,1)];
    // gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(z_axis), gl.STATIC_DRAW );
    // gl.uniform4f(u_FragColor,0,1,0,1);
    // colors.push(0,0,1,0,0,1);
    // gl.drawArrays( gl.LINES, 0, x_axis.length );


    // requestAnimFrame( render );
}

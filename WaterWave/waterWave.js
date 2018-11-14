// Code By David Bang
window.onload = function () {
    var windowHeight =  $(window).height();
    var windowWidth =  $(window).width();
    var restrictingDim = Math.min(windowWidth/2, (windowHeight-150)/1.2);
    var canvas = $("#canvas").get(0);
    var canvas2 = $("#canvas2").get(0);
    var context = canvas.getContext('2d');
    var context2 = canvas2.getContext('2d');
 
    // resize canvas, place buttons below it
    canvas.width = 2*restrictingDim;
    canvas.height = 1.25*restrictingDim;
    canvas2.width = 2*restrictingDim;
    canvas2.height = 1.25*restrictingDim;
    $("#buttondiv").get(0).style.top = 1.25*restrictingDim + "px";
    $("#explanation").css("top", 1.25*restrictingDim+"px");
 
    //Make begx, midx, endx
    var midx = canvas.width / 2;
    var midy = canvas.height / 2;
    var endx = midx + (canvas.width*.4);
    var begx = midx - (canvas.width*.4);

    var playBool = false;
    var traceBool = false;
    var fixed = false;
    var comp = false;
    var speed = 3;

    var amp = 70;
    var spread = 50;
    var deltax = .5;
    var stringPositionY = midy - (.1*canvas.width);
    var wavex = midx - canvas.width*.4;
    var wavex2 = midx - canvas.width*.4;
    var wavey = stringPositionY;
    var wavey1, wavey2, wavey3, wavey4;
    var center = .175 * canvas.width;
    var center2 = canvas.width - (.175*canvas.width);
    var endLine = new Line();
    endLine.lineWidth = 3;
    var ring = new Circle();
    ring.radius = 6;
    ring.x = midx;
    ring.y = wavey;
    var ltr = true;
    var reflector = endx;
    var angle = (90*Math.PI*180);
 
    $("#play-button").get(0).addEventListener("click", play, false);
    $("#reset").get(0).addEventListener("click", reset, false);
    $("#fixed").get(0).addEventListener("click", toggle, false);
    $("#comp").get(0).addEventListener("click", compare, false);
 
    drawFrame();
 
    function play () {
        if (playBool) {
            playBool = false;
        $("#play-button span").get(0).className = "glyphicon glyphicon-play";
    }
        else {
            playBool = true;
            $("#play-button span").get(0).className = "glyphicon glyphicon-pause";
            drawFrame();
    }
}
 
function reset () {
    playBool = false;
    $("#play-button span").get(0).className = "glyphicon glyphicon-play";
    wavex = midx - canvas.width*.4;
    wavex2 = midx - canvas.width*.4;
    center = .175 * canvas.width;
    center2 = canvas.width - (.175*canvas.width);
    ltr = true;
    drawFrame();
}
 
function toggle () {}
function compare () {}
 
// Functions for free end --------------------------------
//------
function waveCalc(A,k_1,wave_x,omega_1,delta_t) { // Math part
    return A * Math.sin(k_1 * wave_x - omega_1 * delta_t);
}
/*-------Test
wavex = midx - canvas.width*.4
center = .175 * canvas.width // where it starts
spread = 50 // how thicc it is

*///-------
// function forward () { // Single pulse
//     context.moveTo(0, stringPositionY);
//     context.lineWidth = 3;
//     context.beginPath();
//     for (x = begx; x < endx*2; x++) {
//         wavex = x*deltax;
//         wavey1 = -(amp * Math.exp(-(wavex-(center)) * (wavex - (center)) / 
//             (spread * spread))) + stringPositionY;
//         wavey2 = -(amp * Math.exp(-((wavex - (2 * endx - center)) * 
//             (wavex - (2 * endx - center)) / (spread * spread))));
//         wavey = wavey1 + wavey2;
//         ring.y = wavey;
//         context.lineTo(wavex, wavey);
//     }
//     context.moveTo(reflector, stringPositionY);
//     context.closePath();
//     context.stroke();
// }

function forward () { //Sine Wave
    context.moveTo(begx, stringPositionY);
    context.lineWidth = 3;
    context.strokeStyle = "#000000";
    context.beginPath();
    var x_front = (reflector+100);
    //ring.x = reflector;
    for (i = 0; i < x_front; i++) {
        wave_x = i * deltax; // multiply to stop at wall
        wave_y = waveCalc(60, .03, center, 0.5*wave_x, 0.05);
        context.lineTo(wave_x, stringPositionY + wave_y);
    }
    context.stroke();
}
//Deltax = 0.5

function flatline () { //Sine Wave
    //ring.x = begx;
    context.moveTo(endx, stringPositionY);
    context.lineWidth = 3;
    context.strokeStyle = "#000fff";
    context.beginPath();
    var x0 = midx*2;
	for (i = x0; i < (reflector / deltax); i++) {
        wave_x = i * deltax; // multiply to stop at wall
        context.lineTo(begx, endx);
    }
    context.stroke();
}

// function forward () { //Sine Wave
//     context.moveTo(0, stringPositionY);
//     context.lineWidth = 3;
//     context.strokeStyle = "#000000";
//     context.beginPath();
//  for (i = 0; i < (reflector / deltax); i++) {
//         wave_x = i * deltax; // multiply to stop at wall
//         wave_y = waveCalc(60, .03, center, 0.5*wave_x, 0.05);
//         context.lineTo(wave_x, stringPositionY + wave_y);
//     }
//     context.moveTo(reflector, stringPositionY);
//     context.closePath();
//     context.stroke();
// }

function combinedString() {
    context.strokeStyle = "#0000ff";
    context.lineWidth = 5;
    context.beginPath();
    for (i = 0; i < (reflector / deltax); i++) {
        wave_x = i * deltax;
        wave_y = waveCalc(60, .03, center, 0.5*wave_x, 0.05) 
            + waveCalc(60, .05, center, 0.5*wave_x, -0.05);
        context.lineTo(wave_x, stringPositionY + wave_y);
    }
    context.moveTo(reflector+200, stringPositionY+200);
    context.closePath();
    context.stroke();
}

function back () {
    context.moveTo(0, stringPositionY);
    context.lineWidth = 3;
    context.strokeStyle = "#ff0000";
    context.beginPath();
	for (i = 0; i < (reflector / deltax); i++) {
        wave_x = i * deltax; //stops the wave at the wall
        wave_y = waveCalc(60, .05, center, 0.5*wave_x, -0.05);
//        wave_y = waveCalc(0, 0, center, 0*wave_x, -0);
        context.lineTo(wave_x, stringPositionY + wave_y);
        ring.y = wave_x;
    }
    context.moveTo(reflector, stringPositionY);
    context.closePath();
    context.stroke();
}

// Animate --------------------------------------------
function drawFrame () {
    // Standalone --------------------------------------
    if (!comp) {
        angle += speed;
    if (playBool) {
      window.requestAnimationFrame(drawFrame, canvas);
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context2.clearRect(0, 0, canvas2.width, canvas2.height);

    context.lineWidth = 3;
    context.strokeStyle = "#ff0000";
    context.moveTo(0,200);//floor test
    context.beginPath();
    context.lineTo(200, 200);

        // endx = midx + (canvas.width*.4);
        // begx = midx - (canvas.width*.4);
        stringPositionY = midy;
        wavex = midx - canvas.width*.4;
        wavey = stringPositionY;
        //ring.x = endx + 2;
        reflector = endx;

        //Wall where the water stops
        endLine.x1 = endLine.x2 = begx;
        endLine.y1 = midy - (canvas.height*.35);
        endLine.y2 = midy + (canvas.height*.15);

        if (ltr) {
            if ( center < 10*endx) { // length of travelling
                if (playBool) {
                    center += speed;
                    center2 -= speed;
                }
            }
            else {
                ltr = false;
            }
            //forward();
            flatline();
            //combinedString();
            //back();
        }
        else {
            playBool = false;
            forward();
            //combinedString();
            //back();
        }
        endLine.color = "#000000";
        endLine.draw(context);
        ring.draw(context);

    }
}
}
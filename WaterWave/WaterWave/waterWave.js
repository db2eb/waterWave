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
    var fixed = false;
    var comp = false;
    var speed = 3;

    var amp = 70;
    var spread = 50;
    var stringPositionY = midy - (.1*canvas.width);
    var center = .175 * canvas.width;
    var center2 = canvas.width - (.175*canvas.width);
    var ltr = true;
    var reflector = endx;
    var angle = (90*Math.PI*180);
    //Wall=====
    var x_0 = midx;
    var wall = new Line();
    wall.lineWidth = 3;
    wall.x1 = wall.x2 = begx;
    wall.y1 = midy - (canvas.height*.35);
    wall.y2 = midy + (canvas.height*.15);
    wall.color = "#000000";
    //Ring=====
    var ring = new Circle();
    ring.radius = 6;
    //========
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
    center = .175 * canvas.width;
    center2 = canvas.width - (.175*canvas.width);
    ltr = true;
    drawFrame();
}
 
function toggle () {}
function compare () {}
 
function waveCalc(A,k_1,wave_x,omega_1,delta_t) { // Math part
    return A * Math.sin(k_1 * -wave_x - omega_1 * delta_t);
}

var x_f = midx;
function forward () { //Sine Wave
    context.lineWidth = 3;
    context.strokeStyle = "#000000";
    context.beginPath();
    var temp = 400;
    if(x_f>ring.x){
        x_f = x_f - 1;
    }
    for (i = x_f; i < endx; i++) { // length of the string
        wave_y = waveCalc(60, .03, center/4, .5*i, 0.05);
        context.lineTo(i, stringPositionY + wave_y);
    }
    context.stroke();
}

function moveRing(){
    ring.x = begx;
    ring.y = stringPositionY;
}

function flatline () { //Flat
    context.moveTo(endx, stringPositionY);
    context.lineWidth = 3;
    context.strokeStyle = "#000fff";
    context.beginPath();
    var x0 = midx*2;
	for (i = x0; i < (reflector * 2); i++) {
        wave_x = i / 2; // multiply to stop at wall
        context.lineTo(begx, endx);
    }
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
            stringPositionY = midy;
            reflector = endx;

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
                forward();
                moveRing();
                flatline();
            }
            else {
                playBool = false;
                forward();
            }
            wall.draw(context);
            ring.draw(context);
        }
    }
}
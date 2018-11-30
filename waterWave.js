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
    var stringPositionY = midy;
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
    ring.x = begx;
    ring.y = stringPositionY;
    //========
    var x_f = midx; // moving point
    var x_b = begx; // returning point

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

var hitWall = false;

// function forward () { //Sine Wave
//     context.strokeStyle = "#000fff";
//     context.beginPath();
//     //var temp = 400;
//     if(x_f > begx){ //move start of wave forward
//         x_f = x_f - 1;
//     }
//     else{
//         hitWall = true;
//     }
//     for (i = begx; i < endx; i++) { // length of the string
//         if(i < x_f){
//             wave_y = 0;
//         }
//         else{
//             wave_y = waveCalc(60, .014, center/2, .4*i, 0.05);
//         }
//         //height,speedofwave,speedmovingleft,
//         context.lineTo(i, stringPositionY + wave_y);
//     }
//     context.stroke();
// }

function forward () { //Sine Wave
    context.strokeStyle = "#000fff";
    context.beginPath();
    if(x_f > begx){ //move start of wave forward
        x_f = x_f - 1;
    }
    else{
        hitWall = true;
    }
    for (i = begx; i < endx; i++) { // length of the string
        if(i < x_f){
            wave_y = 0;
            context.lineTo(i, stringPositionY);
        }
        else{
            wave_y = waveCalc(60, .014, center/2, .4*i, 0.05);
            if(i==begx){
                ring.y = stringPositionY + wave_y;
            }
            context.lineTo(i, stringPositionY + wave_y);
        }
        //height,speedofwave,speedmovingleft,wavefreq,width of wave
    }
    context.stroke();
}

function backward () { //Sine Wave
    context.strokeStyle = "#ff0000";
    context.beginPath();
    var sum = 0; 
    var max = 3000;
    if(hitWall){
        if(x_b<endx)
            x_b = x_b + 1;
        for (i = begx; i < endx; i++) { // length of the string
            if(i<x_b){
                wave_y = waveCalc(60, .014, -center/2, .4*i, 0.05);
                sum = stringPositionY + wave_y;
                if (sum<max){
                    max = sum;
                }
                context.lineTo(i, max); 
                // TODO: add the blue wave to the outgoing wave
            }
        }
        context.stroke();
    }
}

// Animate --------------------------------------------
    function drawFrame () {
        if (!comp) {
            angle += speed;
            if (playBool) {
              window.requestAnimationFrame(drawFrame, canvas);
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context2.clearRect(0, 0, canvas2.width, canvas2.height);

            context.lineWidth = 3;
            reflector = endx;

            if (ltr) {
                if ( center < 10 * endx) { // length of travelling
                    if (playBool) {
                        center += speed;
                        center2 -= speed;
                    }
                }
                else {
                    ltr = false;
                }
                forward();
                backward();

            }
            else {
                playBool = false;
                forward();
            }
            wall.draw(context);
            ring.draw(context);//remove
        }
    }
}
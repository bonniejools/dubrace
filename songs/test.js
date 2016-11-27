// To enable flash fallback, specify the paths for the flashSWF and flashJS
Dancer.setOptions({
    flashJS  : '../../lib/soundmanager2.js',
    flashSWF : '../../lib/soundmanager2.swf'
});

var kickTime = [];

dancer = new Dancer();

var audio = new Audio();
// audio.src = '../../examples/songs/zircon_devils_spirit.mp3';
audio.src = './test.mp3';
dancer.load(audio);

var canKick = true;
kick = dancer.createKick({
    onKick: function ( mag ) {
        kick.threshold = 0.42;
        kick.decay = 0.02;
        if(canKick == true)
        {
            function goRed() {
                document.body.style.backgroundColor = "red";
            }
            console.log('Kick!');
            console.log(kick.currentThreshold);
            kickTime.push(dancer.getTime());
            console.log(kickTime);
            canKick = false;

            function goWhite() {
                document.body.style.backgroundColor = "white";
            }
            setTimeout(function(){canKick = true},200)
        }
    },

    // offKick: function ( mag ) {
    // console.log('no kick :(');
    // }
});

// Let's turn this kick on right away
kick.on();

dancer.play();

audio.onended = function(){
    var i = 1;                                                                                                                   
    var x = 0; //array position for transition                                                                                   

var transitionTimes = {};                                                                                                    

for(i; i < kickTime.length; i++) {                                                                                           
    if (kickTime[i]-kickTime[i-1] > 10)                                                                                      
    { 
        transitionTimes[x] = {startTime: kickTime[i-1], endTime: kickTime[i]};
        x++; 
    }                                                                                                                        
}                                                                                                                            
console.log(transitionTimes);                                                                                            

function getdropPoints(endTime) {
    if (getTime() == endTime) {
        console.log("drop begins at " + getTime());
    }
}
}

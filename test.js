var AUDIO_FILE = '../songs/zircon_devils_spirit';

dancer = new Dancer();
kick = dancer.createKick ({
    onKick: function () {
        console.log("bang");
    })


var BackgroundMusic;
var IsBackgroundMusicPlaying = false;


function InitSounds() {
    BackgroundMusic = new LoadSound("assets/sounds/backgroundmusic.mp3");
}

function LoadSound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

var BackgroundMusic;
var GunShotSound;
var IsBackgroundMusicPlaying = false;


function InitSounds() {
    BackgroundMusic = new LoadSound("assets/sounds/backgroundmusic.mp3");
    GunShotSound = new LoadSoundPool("assets/sounds/gunshot.wav", 5);
}

function LoadSoundPool(src, poolSize){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.poolSize = poolSize;
    this.sounds = [this.sound];
    this.c = 0;
    for(let i=1; i<this.poolSize; i++){
        this.sounds.push(this.sound.cloneNode());
    }

    this.play = function(){
        this.c = (this.c + 1) % this.poolSize;
        let instance = this.sounds[this.c];

        instance.currentTime = 0;
        instance.play();
    }
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
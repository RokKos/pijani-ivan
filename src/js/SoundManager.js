
var BackgroundMusic;
var GunShotSound;
var BearSound;

var IsBackgroundMusicPlaying = false;

function InitSounds() {
    BackgroundMusic = new LoadSound("assets/sounds/backgroundmusic.mp3");
    BearSound = new LoadSound("assets/sounds/bear.wav");
    GunShotSound = new LoadSoundPool("assets/sounds/gunshot.wav", 5);
}

function LoadSoundPool(src, poolSize){
    this.sound = new Audio(src);

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
    this.sound = new Audio(src);

    this.playLooped = function(){
        this.sound.addEventListener('ended', ()=>{
            this.sound.currentTime = 0;
            this.sound.play();
        }, false);
        this.sound.play();
    }

    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
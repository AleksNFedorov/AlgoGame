class Boot extends Phaser.State {
    
    init(): void {
        this.game.forceSingleUpdate = true;
        this.game.renderer.renderSession.roundPixels = true;
    }

    preload() {
        
        this.load.image('preloadbar', '/assets/images/preloader-bar.png');
    }

    create() {
        
        this.game.stage.backgroundColor = Constants.GAME_BACKGROUND;

        this.input.maxPointers = 1;

        // this.scale.setGameSize(window.innerWidth, window.innerHeight);
        // if(this.game.device.desktop) {
        //   var height = window.innerHeight - 70;
        //   var scale = height / Constants.GAME_HEIGHT;
        //   this.scale.setGameSize(Constants.GAME_WIDTH * scale, window.innerHeight - 70);
        // } else {
        //   this.scale.setGameSize(window.innerWidth, window.innerHeight);
        // }

        this.scale.minWidth = 800;
        this.scale.minHeight = 600;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 786;
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = true;
        // this.scale.setScreenSize(true);        
        
        // this.scale.pageAlignHorizontally = true;

        this.game.state.start("preload");
    }
}
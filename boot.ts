class Boot extends Phaser.State {
    
    preload() {
        
        this.load.image('preloadbar', '/assets/images/preloader-bar.png');
    };

    create() {
        
        this.game.stage.backgroundColor = Constants.GAME_BACKGROUND;

        this.input.maxPointers = 1;

        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 786;
        this.scale.pageAlignHorizontally = true;

        this.game.state.start(Constants.STATE_PRELOAD);
    };
}
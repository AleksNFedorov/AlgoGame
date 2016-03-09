class Boot extends Phaser.State {
    
    private _correctOrientation: boolean = true;
    
    init(): void {
        this.game.forceSingleUpdate = true;
    }

    preload() {
        
        this.load.image('preloadbar', '/assets/images/preloader-bar.png');
    }

    create() {
        
        this.game.stage.backgroundColor = Constants.GAME_BACKGROUND;

	    this.game.renderer.renderSession.roundPixels = false;		

        this.input.maxPointers = 1;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setMinMax(480, 260, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.game.scale.pageAlignHorizontally = true;
        
        this.game.scale.refresh();        

        this.game.state.start("preload");
    }
}
/// <reference path="common.ts" />

class Preload extends Phaser.State {
    
    private preloadBar:Phaser.Sprite;
    
    preload() {
        
        
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
        
        // Put actual assets load code here
        this.load.spritesheet(Constants.MENU_BUTTON_ATTLAS, '/assets/images/menuButtons.png', 136, 136);
        
        // Tmp images
        this.load.image('box', '/assets/images/box.png');


        this.load.onLoadComplete.add(this._onLoadComplete, this);
    };

    private _onLoadComplete() {
        console.log("Preload complete");
        this.game.state.start(Constants.STATE_MENU);
    };
};

class MenuState extends Phaser.State {
    
    private _menu: Common.Menu;
    private _controlPanel: Common.PractisePanel;
    private _gamePlay: BinarySearch.GamePlay;
    
    shutdown(): void {
      this._menu.destroy();  
      this._menu = null;
    };

    create(): void {
        
        var game:AlgoGame = <AlgoGame> this.game;
        
        this._menu = new Common.Menu(game);
        this._controlPanel = new Common.PractisePanel(game);
        this._gamePlay = new BinarySearch.GamePlay(game);
        
        game.eventBus.dispatch(Events.STAGE_INITIALIZED, this);
        
        
    };
    
};
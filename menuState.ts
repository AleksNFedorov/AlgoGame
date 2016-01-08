/// <reference path="common.ts" />
/// <reference path="stageinfo.ts" />

class Preload extends Phaser.State {
    
    private preloadBar:Phaser.Sprite;
    
    preload() {

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
        
        // Put actual assets load code here
        this.load.spritesheet(Constants.MENU_BUTTON_ATTLAS, '/assets/images/menuButtons.png', 136, 136);
        
        this.game.load.atlas(Constants.PROGRESS_BARS_ATTLAS,
        '/assets/images/bars.png',
        '/assets/images/bars.json',
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        
        // Tmp images
        this.load.image('box', '/assets/images/box.png');
        this.load.image('cursor', '/assets/images/cursor.png');


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
    private _progressPanel: Common.ProgressPanel;
    private _practiseManager: StageInfo.PractiseManager;
    
    shutdown(): void {
      this._menu.destroy();  
      this._controlPanel.destroy();
      this._gamePlay.destroy();
      this._practiseManager.destroy();
      this._menu = null;
    };

    create(): void {
        
        var game:AlgoGame = <AlgoGame> this.game;
        
        this._menu = new Common.Menu(game);
        this._controlPanel = new Common.PractisePanel(game);
        this._gamePlay = new BinarySearch.GamePlay(game);
        this._progressPanel = new Common.ProgressPanel(game);
        this._practiseManager = new StageInfo.PractiseManager(game);
        
        game.eventBus.dispatch(Events.STAGE_INITIALIZED, this);
        
        
    };
    
};
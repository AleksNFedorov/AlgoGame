/// <reference path="components/common.ts" />
/// <reference path="components/stageinfo.ts" />
/// <reference path="components/modalwindow.ts" />

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
        this.load.image('modalBg', '/assets/images/modalBG.png');

        this.load.onLoadComplete.add(this._onLoadComplete, this);
    }

    private _onLoadComplete() {
        console.log("Preload complete");
        this.game.state.start(Constants.STATE_SEARCH_BINARY_SEARCH_T);
    }
}

class BinarySearchPractise extends Common.AlgoGameState {
    
    private _menu: Common.Menu;
    private _controlPanel: Common.PractisePanel;
    private _gamePlay: BinarySearch.PractiseGamePlay;
    private _progressPanel: Common.ProgressPanel;
    private _practiseManager: StageInfo.PractiseManager;
    private _modalWindow: GameModal.ModalWindow;
    
    public shutdown(): void {
        super.shutdown();
        this._menu.destroy();  
        this._controlPanel.destroy();
        this._gamePlay.destroy();
        this._practiseManager.destroy();
        this._menu = null;
    }

    create(): void {
        
        this._modalWindow = new GameModal.ModalWindow(this.algoGame);
        
        this._menu = new Common.Menu(this.algoGame);
        this._controlPanel = new Common.PractisePanel(this.algoGame);
        this._gamePlay = new BinarySearch.PractiseGamePlay(this.algoGame);
        this._progressPanel = new Common.ProgressPanel(this.algoGame);
        this._practiseManager = new StageInfo.PractiseManager(this.algoGame);
        
        super.create();        
        
        this.algoGame.dispatch(Events.STAGE_INITIALIZED, this);
    }
    
    showModalWindow(): void {
        // this._modalWindow.show("cursor");
    }
    
}

class BinarySearchExam extends Common.AlgoGameState {

    private _menu: Common.Menu;
    private _controlPanel: Common.ExamPanel;
    private _gamePlay: BinarySearch.ExamGamePlay;
    private _progressPanel: Common.ProgressPanel;
    private _practiseManager: StageInfo.PractiseManager;
    private _modalWindow: GameModal.ModalWindow;

    public shutdown(): void {
        super.shutdown();
        this._menu.destroy();
        this._controlPanel.destroy();
        this._gamePlay.destroy();
        this._practiseManager.destroy();
        this._modalWindow.destroy();
        this._menu = null;
    }

    create(): void {

        this._modalWindow = new GameModal.ModalWindow(this.algoGame);
        this.initModalWindows();

        this._menu = new Common.Menu(this.algoGame);
        this._controlPanel = new Common.ExamPanel(this.algoGame);
        this._gamePlay = new BinarySearch.ExamGamePlay(this.algoGame);
        this._progressPanel = new Common.ProgressPanel(this.algoGame);
        this._practiseManager = new StageInfo.PractiseManager(this.algoGame);

        super.create();

        this.algoGame.dispatch(Events.STAGE_INITIALIZED, this);
    }
    
    showModalWindow(): void {
        // this._modalWindow.show("cursor");
    }
    
    private initModalWindows(): void {
        var configs: GameModal.ModalConfig[] = [
                new GameModal.ModalConfig(Common.ModalWindows.OBJECTIVES, "cursor"),
                new GameModal.ModalConfig(Common.ModalWindows.EXAM_DONE, "cursor")
            ];
            
        this._modalWindow.createWindows(configs)            ;
    }

}
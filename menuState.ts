/// <reference path="components/common.ts" />
/// <reference path="components/stageinfo.ts" />
/// <reference path="components/modalwindow.ts" />
/// <reference path="components/menustate.ts" />

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
        this.game.state.start("menu");
    }
}

class LevelMenuState extends Common.AlgoGameState {

    private _levelButtonsPanel: Common.LevelButtonsPanel;

    public shutdown(): void {
        super.shutdown();
        this._levelButtonsPanel.destroy();
    }

    create(): void {
        this._levelButtonsPanel = new Common.LevelButtonsPanel(this.algoGame);
        super.onCreate();
    }
}


class BinarySearchPractise extends Common.AlgoGameState {
    
    private _menu: Common.Menu;
    private _controlPanel: Common.PractisePanel;
    private _gamePlay: BinarySearch.BinarySearchPractiseGamePlay;
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
        
        this._menu = new Common.PractiseMenu(this.algoGame);
        this._controlPanel = new Common.PractisePanel(this.algoGame);
        this._gamePlay = new BinarySearch.BinarySearchPractiseGamePlay(this.algoGame);
        this._progressPanel = new Common.ProgressPanel(this.algoGame);
        this._practiseManager = new StageInfo.PractiseManager(this.algoGame);
        
        super.onCreate();        
    }
    
    private initModalWindows(): void {
        var configs: GameModal.ModalConfig[] = [
                new GameModal.ModalConfig(Common.ModalWindows.OBJECTIVES, "cursor"),
                new GameModal.ModalConfig(Common.ModalWindows.PRACTISE_DONE, "cursor")
            ];
            
        this._modalWindow.createWindows(configs)            ;
    }
    
}

class BinarySearchExam extends Common.AlgoGameState {

    private _menu: Common.Menu;
    private _controlPanel: Common.ExamPanel;
    private _gamePlay: BinarySearch.BinarySearchExamGamePlay;
    private _progressPanel: Common.ProgressPanel;
    private _modalWindow: GameModal.ModalWindow;

    public shutdown(): void {
        super.shutdown();
        this._menu.destroy();
        this._controlPanel.destroy();
        this._gamePlay.destroy();
        this._modalWindow.destroy();
        this._menu = null;
    }

    create(): void {

        this._modalWindow = new GameModal.ModalWindow(this.algoGame);
        this.initModalWindows();

        this._menu = new Common.ExamMenu(this.algoGame);
        this._controlPanel = new Common.ExamPanel(this.algoGame);
        this._gamePlay = new BinarySearch.BinarySearchExamGamePlay(this.algoGame);
        this._progressPanel = new Common.ProgressPanel(this.algoGame);

        super.onCreate();
    }
    
    private initModalWindows(): void {
        var configs: GameModal.ModalConfig[] = [
                new GameModal.ModalConfig(Common.ModalWindows.OBJECTIVES, "cursor"),
                new GameModal.ModalConfig(Common.ModalWindows.EXAM_DONE, "cursor")
            ];
            
        this._modalWindow.createWindows(configs)            ;
    }

}
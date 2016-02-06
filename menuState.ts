/// <reference path="components/common.ts" />
/// <reference path="components/stageinfo.ts" />
/// <reference path="components/modalwindow.ts" />
/// <reference path="components/levelstate.ts" />

class Preload extends Phaser.State {
    
    private preloadBar:Phaser.Sprite;
    
    preload() {

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
        
        // Put actual assets load code here
        this.load.spritesheet(Constants.MENU_BUTTON_ATTLAS, '/assets/images/menuButtons.png', 136, 136);
        
        //Main menu buttons
        this.game.load.atlas(Constants.MAIN_MENU_ATTLAS,
        '/assets/images/mainMenu.png',
        '/assets/images/mainMenu.json',
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        this.game.load.atlas(Constants.PROGRESS_BARS_ATTLAS,
        '/assets/images/progressBars.png',
        '/assets/images/progressBars.json',
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        this.game.load.atlas(Constants.BANNERS_ATTLAS,
        '/assets/images/banners.png',
        '/assets/images/banners.json',
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
    
    public shutdown(): void {
        this.load.onLoadComplete.remove(this._onLoadComplete, this);
    }
}

class BackgroundGraphics {
    
    private _graphics: Phaser.Graphics;
    
    constructor(game: Phaser.Game) {
        this._graphics = game.add.graphics(0,0);
    }
    
    public drawLine(xFrom: number, yFrom: number, xTo: number, yTo: number): void {
        this._graphics.moveTo(xFrom, yFrom);
        this._graphics.lineStyle(4, Constants.GAME_BACKGROUND_SEPARATOR);
        this._graphics.lineTo(xTo, yTo);                    
    }
    
    public drawRect(xFrom: number, yFrom: number, xTo: number, yTo: number): void {
        this._graphics.beginFill(Constants.GAME_BACKGROUND_SEPARATOR, 1);
        this._graphics.drawRect(xFrom, yFrom, xTo, yTo);
        this._graphics.endFill();
    }
    
    public destroy() {
        this._graphics.destroy();
    }
}

class LevelMenuState extends Common.State {

    private _levelButtonsPanel: Common.LevelButtonsPanel;
    private _background: BackgroundGraphics;

    public shutdown(): void {
        super.shutdown();
        this._background.destroy();
        this._levelButtonsPanel.destroy();
    }

    create(): void {
        this._background = new BackgroundGraphics(this.algoGame);
        this.drawBackground();
        this._levelButtonsPanel = new Common.LevelButtonsPanel(this.algoGame);
        super.onCreate();
    }
    
    private drawBackground(): void {
        var sectionInterval = this.algoGame.width/3;
        this._background.drawLine(0, 80, this.algoGame.width, 80);
        
        this._background.drawLine(sectionInterval, 0, sectionInterval, this.algoGame.height);
        this._background.drawLine(sectionInterval * 2, 0, sectionInterval * 2, this.algoGame.height);
        this._background.drawRect(0, 600, this.algoGame.width, this.algoGame.height);
        
        this.addHeader("Search", 170, 20);
        this.addHeader("Sort", 512, 20);
        this.addHeader("Graph", 850, 20);

    }
    
    private addHeader(type: string, x: number, y: number): void {
        var iconName = "icon" + type + ".png"; 
        var headerGroup = this.game.add.group();
        var icon = this.game.add.sprite(0,4, Constants.MAIN_MENU_ATTLAS, iconName, headerGroup);
        var text = this.game.add.text(45,0, type.toUpperCase(), Constants.MENU_HEADER_TEXT_STYLE, headerGroup);
        
        headerGroup.x = x - headerGroup.width / 2;
        headerGroup.y = y;
    }
    
    protected getStageType(): string {
        return "Menu";
    }
    
    protected getStateConfig(stage: string): GameConfig.StageConfig {
        return null;
    }
    
}

//
// Search algorithms
//

class BinarySearchPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new BinarySearch.BinarySearchPractiseGamePlay(this.algoGame);
    }
}

class BinarySearchExam extends Common.ExamState {

    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new BinarySearch.BinarySearchExamGamePlay(this.algoGame);
    }
}

//
// Sort algorithms
//

class InsertionSortPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.InsertionSortPractiseGamePlay(this.algoGame);
    }
}

class InsertionSortExam extends Common.ExamState {
    
    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.InsertionSortExamGamePlay(this.algoGame);
    }
}

class SelectionSortPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.SelectionSortPractiseGamePlay(this.algoGame);
    }
}

class SelectionSortExam extends Common.ExamState {
    
    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.SelectionSortExamGamePlay(this.algoGame);
    }
}

class MergeSortPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.MergeSortPractiseGamePlay(this.algoGame);
    }
}

class MergeSortExam extends Common.ExamState {
    
    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.MergeSortExamGamePlay(this.algoGame);
    }
}

class QuickSortPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.QuickSortPractiseGamePlay(this.algoGame);
    }
}

class QuickSortExam extends Common.ExamState {
    
    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.QuickSortExamGamePlay(this.algoGame);
    }
}
//
// Graph algorithms
//

class DebthFirstSearchPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Graph.DebthFirstSearchGamePlay(this.algoGame);
    }
}

class DebthFirstSearchExam extends Common.ExamState {

    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Graph.DebthFirstSearchExamGamePlay(this.algoGame);
    }
}

class DjikstraPractise extends Common.PractiseState {
    
    protected buildGamePlay(): Common.PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Graph.DjikstraGamePlay(this.algoGame);
    }
}

class DjikstraExam extends Common.ExamState {

    protected buildGamePlay(): Common.ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Graph.DjikstraExamGamePlay(this.algoGame);
    }
}



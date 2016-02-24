/// <reference path="components/common.ts" />
/// <reference path="components/stageinfo.ts" />
/// <reference path="components/modalwindow.ts" />
/// <reference path="components/levelstate.ts" />

class Preload extends Phaser.State {
    
    private preloadBar:Phaser.Sprite;
    
    preload(): void {

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
        
        //Game general atlas
        this.game.load.atlas(Constants.GAME_GENERAL_ATTLAS,
        Constants.GAME_ASSETS_PATH + "gameGeneral.png",
        Constants.GAME_ASSETS_PATH + "gameGeneral.json",
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        
        //Main menu buttons
        this.game.load.atlas(Constants.MAIN_MENU_ATTLAS,
        Constants.GAME_ASSETS_PATH + "mainMenu.png",
        Constants.GAME_ASSETS_PATH + "mainMenu.json",
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        this.game.load.atlas(Constants.BANNERS_ATTLAS,
        Constants.GAME_ASSETS_PATH + "banners.png",
        Constants.GAME_ASSETS_PATH + "banners.json",
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        this.game.load.atlas(Constants.GAME_EXAM_BANNERS_ATLAS,
        Constants.GAME_ASSETS_PATH + "examImages.png",
        Constants.GAME_ASSETS_PATH + "examImages.json",
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

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

class LevelMenuState extends Common.State {

    private _levelButtonsPanel: Common.LevelButtonsPanel;
    private _background: Common.BackgroundGraphics;

    public shutdown(): void {
        super.shutdown();
        this._background.destroy();
        this._levelButtonsPanel.destroy();
    }

    create(): void {
        this._background = new Common.BackgroundGraphics(this.algoGame);
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
        return <GameConfig.StageConfig> {
            level: "mainMenu"
        }
    }
    
    protected loadLevelSave(): Common.LevelSave {
        return new Common.LevelSave();
    }
}

//
// Search algorithms
//
class BinarySearchTutorial extends Common.TutorialState {
    
    protected buildGamePlay(): Common.TutorialGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new BinarySearch.BinarySearchTutorialGamePlay(this.algoGame);
    }
}

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

class InsertionSortTutorial extends Common.TutorialState {
    
    protected buildGamePlay(): Common.TutorialGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.InsertionSortTutorialGamePlay(this.algoGame);
    }
}

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

class SelectionSortTutorial extends Common.TutorialState {
    
    protected buildGamePlay(): Common.TutorialGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.SelectionSortTutorialGamePlay(this.algoGame);
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

class MergeSortTutorial extends Common.TutorialState {
    
    protected buildGamePlay(): Common.TutorialGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.MergeSortTutorialGamePlay(this.algoGame);
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

class QuickSortTutorial extends Common.TutorialState {
    
    protected buildGamePlay(): Common.TutorialGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Sort.QuickSortTutorialGamePlay(this.algoGame);
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

class DebthFirstSearchTutorial extends Common.TutorialState {
    
    protected buildGamePlay(): Common.TutorialGamePlay<Common.GamePlayAction, Common.Algorithm> {
        return new Graph.DebthFirstSearchTutorialGamePlay(this.algoGame);
    }
}

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



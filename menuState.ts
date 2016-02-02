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

class LevelMenuState extends Common.State {

    private _levelButtonsPanel: Common.LevelButtonsPanel;

    public shutdown(): void {
        super.shutdown();
        this._levelButtonsPanel.destroy();
    }

    create(): void {
        this._levelButtonsPanel = new Common.LevelButtonsPanel(this.algoGame);
        super.onCreate();
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



/// <reference path="./lib/phaser.d.ts" />
/// <reference path="./lib/eventbus.d.ts" />
/// <reference path="./lib/store.d.ts" />

class Game extends Common.AlgoGame {
    
    constructor() {
        
        super(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.CANVAS, 'game');

        this.state.add("boot", Boot);
        this.state.add("preload", Preload);
        this.state.add("menu", LevelMenuState);
        
        this.state.add("binarySearchPreload", Common.PractisePreloadState);
        this.state.add("binarySearchTutorial", BinarySearchTutorial);
        this.state.add("binarySearchPractise", BinarySearchPractise);
        this.state.add("binarySearchExam", BinarySearchExam);
        
        this.state.add("insertionSortPreload", Common.PractisePreloadState);
        this.state.add("insertionSortTutorial", InsertionSortTutorial);
        this.state.add("insertionSortPractise", InsertionSortPractise);
        this.state.add("insertionSortExam", InsertionSortExam);
        
        this.state.add("selectionSortPreload", Common.PractisePreloadState);
        this.state.add("selectionSortTutorial", SelectionSortTutorial);
        this.state.add("selectionSortPractise", SelectionSortPractise);
        this.state.add("selectionSortExam", SelectionSortExam);

        this.state.add("mergeSortPreload", Common.PractisePreloadState);
        this.state.add("mergeSortTutorial", MergeSortTutorial);
        this.state.add("mergeSortPractise", MergeSortPractise);
        this.state.add("mergeSortExam", MergeSortExam);

        this.state.add("quickSortPreload", Common.PractisePreloadState);
        this.state.add("quickSortTutorial", QuickSortTutorial);
        this.state.add("quickSortPractise", QuickSortPractise);
        this.state.add("quickSortExam", QuickSortExam);

        this.state.add("debthFirstPreload", Common.PractisePreloadState);
        this.state.add("debthFirstTutorial", DebthFirstSearchTutorial);
        this.state.add("debthFirstPractise", DebthFirstSearchPractise);
        this.state.add("debthFirstExam", DebthFirstSearchExam);

        this.state.add("djikstraPreload", Common.PractisePreloadState);
        this.state.add("djikstraPractise", DjikstraPractise);
        this.state.add("djikstraExam", DjikstraExam);


        this.state.start("boot");        
        
    }
}

window.onload = () => {

    var game = new Game();
}

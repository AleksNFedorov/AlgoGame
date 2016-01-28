/// <reference path="./lib/phaser.d.ts" />
/// <reference path="./lib/eventbus.d.ts" />
/// <reference path="./lib/store.d.ts" />

class Game extends Common.AlgoGame {
    
    constructor() {
        
        super(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO, 'game');

        this.state.add("boot", Boot);
        this.state.add("preload", Preload);
        this.state.add("menu", LevelMenuState);
        this.state.add("binarySearchPractise", BinarySearchPractise);
        this.state.add("binarySearchExam", BinarySearchExam);
        
        this.state.add("insertionSortPractise", InsertionSortPractise);
        this.state.add("insertionSortExam", InsertionSortExam);
        
        this.state.add("debthFirstSearchPractise", DebthFirstSearchPractise);
        this.state.add("debthFirstSearchExam", DebthFirstSearchExam);


        this.state.start("boot");        
        
    }
}

window.onload = () => {

    var game = new Game();

}

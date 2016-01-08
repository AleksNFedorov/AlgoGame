/// <reference path="./lib/phaser.d.ts" />
/// <reference path="./lib/eventbus.d.ts" />
/// <reference path="./lib/store.d.ts" />

class Game extends Common.AlgoGame {
    
    constructor() {
        
        super(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO, 'game');

        this.state.add(Constants.STATE_BOOT, Boot);
        this.state.add(Constants.STATE_PRELOAD, Preload);
        this.state.add(Constants.STATE_MENU, MenuState);
        this.state.start(Constants.STATE_BOOT);
    };
}

window.onload = () => {

    var game = new Game();

};

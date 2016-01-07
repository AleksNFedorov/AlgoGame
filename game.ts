/// <reference path="./lib/phaser.d.ts" />
/// <reference path="./lib/eventbus.d.ts" />
/// <reference path="./lib/store.d.ts" />

declare var store: Store;

class AlgoGame extends Phaser.Game {
    
    private _eventBus:EventBusClass;
    private _store: Store = store;
    
    constructor() {
        
        super(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO, 'game');
        
        this._eventBus = new EventBusClass();
        
        this.state.add(Constants.STATE_BOOT, Boot);
        this.state.add(Constants.STATE_PRELOAD, Preload);
        this.state.add(Constants.STATE_MENU, MenuState);
        this.state.start(Constants.STATE_BOOT);
    };
    
    get store() : Store {
        return this._store;   
    }
    
    get eventBus(): EventBusClass {
        return this._eventBus;
    }
}

window.onload = () => {

    var game = new AlgoGame();

};

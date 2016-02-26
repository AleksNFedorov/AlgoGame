/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/gameconfig.d.ts" />

declare var store: Store;
declare var CryptoJS: any;
declare var globalConfig: GameConfig.Config;

module Common {
    
    export enum LevelStageState {PAUSED = 0, RUNNING = 1, CREATED = 2, END = 3, UNKNOWN = 4}
    export enum MessageType {INFO, FAIL, SUCCESS};
    
    /*
        All game elements, element id should be here to show description info for it.
    */
    export enum GameElements {
        MenuButtonMenu,
        MenuButtonDescription,
        MenuButtonObjectives,
        MenuButtonTutorial,
        MenuButtonPractise,
        MenuButtonExam,
        ProgressBarStep,
        ProgressBarComplete,
        ControlPanelButtonPlay,
        ControlPanelButtonPause,
        ControlPanelButtonStop,
        ControlPanelButtonReplay,
        ControlPanelButtonAutoStart,
        ControlPanelText,
        GameArea,
        LevelButton,
    }
    
    export class Blinker {
        
        private _sprite: any;
        private _game: AlgoGame;
        private _currentTween: Phaser.Tween;
        private _callback: Function = function(){};
        
        constructor(game: AlgoGame, sprite: any) {
            this._sprite = sprite;
            this._game = game;
        }
        
        public blink(): void {
            if (this._currentTween != null) {
                this._currentTween.stop();
            }
            
            this._sprite.alpha = 1;
            this._currentTween = this._game.add.tween(this._sprite).to({alpha: 0.3}, 100, "Quart.easeOut", false, 0, 7, true);
            this._currentTween.onComplete.add(this._callback);
            this._currentTween.start();
        }
        
        public setEndCallback(callback: Function): void {
            this._callback = callback;
        }
        
        destroy(): void {
            if (this._currentTween != null) {
                this._currentTween.stop();
            }
        }
    }
    
    
    //Info baloon information
    export class ShowInfo {
        
        private _elementId: Common.GameElements;
        private _eventToHide: string;
        private _messageKey: string;
        private _hideCallback: Function;

        constructor(
            elementId: Common.GameElements, 
            eventToHide?: string,
            messageKey?: string,
            hideCallback: Function = function(){}
        ) {
            this._elementId = elementId;
            this._eventToHide = eventToHide;
            this._messageKey = messageKey;
            this._hideCallback = hideCallback;
        }
        
        public get hideCallback(): Function {
            return this._hideCallback;
        }
        
        public get messageKey(): string {
            return this._messageKey != null ? this._messageKey : Common.GameElements[this._elementId];
        }
        
        public get elementId(): Common.GameElements {
            return this._elementId;
        }
        
        public get eventToHide(): string {
            return this._eventToHide;
        }
    }
        
    //Key info stored on borwser local store
    export class LevelSave {
        public tutorialDone: number = 0;
        public tutorialPassed: boolean = false;
        public practiseDone: number = 0;
        public practisePassed: boolean = false;
        public examDone: number = 0;
        public examPassed: boolean = false;
        public autoStart: boolean = true;
        
        public init(): void {
            this.tutorialDone = this.tutorialDone || 0;
            this.tutorialPassed = this.tutorialPassed || false;
            this.practiseDone = this.practiseDone || 0;
            this.practisePassed = this.practisePassed || false;
            this.examDone = this.examDone || 0;
            this.examPassed = this.examPassed || false;
            this.autoStart = this.autoStart || true;
        }
    }
    
    class SecureSaver {
        
        public set(key: string, value: any): void {
            
            value.hash = this.hashLevelSave(value);
            store.set(key, value);
        }
        
        public get(key: string): any {
            var value: any  = store.get(key) || {};
            if (value.hash) {
                var saveHash = value.hash;
                var actualHash = this.hashLevelSave(value);
                if (JSON.stringify(saveHash) === 
                        JSON.stringify(actualHash)) {
                    console.log(`Save broken ${key}`);
                    return value;
                }
                
            } 
            return null;
        }
        
        private hashLevelSave(value: any): string {
            value.hash = null;
            return CryptoJS.MD5(JSON.stringify(value));
        }
    }
    
    //Info to distirbute across game components when level type (practise, exam) initialized.
    //Used to sync all parts with key game values like steps count, step wait interval.
    export class GamePlayInfo {
        
        private _stepWaitTime: number;
        private _totalItertions: number;
        private _doneIterations: number;
        
        constructor(stepWaitTime: number, totalIterations: number, doneIterations: number) {
            this._stepWaitTime = stepWaitTime;
            this._totalItertions = totalIterations;
            this._doneIterations = doneIterations;
        }
        
        public get stepWaitTime(): number {
            return this._stepWaitTime;
        }
        
        public get totalItertions(): number {
            return this._totalItertions;
        }
        
        public get doneIterations(): number {
            return this._doneIterations;
        }
        
    }
    
    //Shows element info widget near the target element, used to icon with I (info) symbol. 
    //Need to attract play attention to target element
    export interface InfoWidget {
        showFor(element: any): void;
        getElementId(): number;
    }
    
    //Event generated by some component and processed by another,
    //just a wrapper around key EventBus parameters
    export class GameEvent {
        constructor(
            public eventId: string, 
            public caller: any, 
            public param?: any) {}
    }
    
    //Used to save/restore element state without to repect to particular UI element type
    //Scenario: when modal window shown it is need to save state and disable element
    //after window hides - state should be restored to initial
    export interface GameUIObjectWithState {
        worldPosition: PIXI.Point;
        width: number;
        height: number;
        
        saveStateAndDisable(): void;
        restoreState(): void;
        destroy(): void;
    }
    
    export class GroupWrapper extends Phaser.Group implements GameUIObjectWithState {
        constructor(game: Phaser.Game, x: number, y:number) {
            super(game);
            this.x = x;
            this.y = y;
        }
        
        saveStateAndDisable(): void {};
        restoreState(): void {};
    }

    
    export class AlgoGame extends Phaser.Game {
    
        private _eventBus:EventBusClass;
        private _store: SecureSaver = new SecureSaver();
        private _config: GameConfig.Config = globalConfig;

        constructor(gameWidth: number, gameHeight: number, mode: number, tag: string) {
            super(gameWidth, gameHeight, mode, tag, null, false, false);
            this._eventBus = new EventBusClass();
        }
        
        public dispatch(eventId: string, caller: any, param?: any): void {
            var state: State = this.currentState;
            state.dispatch(eventId, caller, param);
        }
        
        get store() : Store {
            return this._store;   
        }
        
        get eventBus(): EventBusClass {
            return this._eventBus;
        }
        
        get config(): GameConfig.Config {
            return this._config;
        }
        
        public loadLevelSave(level: string): LevelSave {
            var save: LevelSave = this.store.get(level)
                            || new LevelSave();
            save.init = new LevelSave().init;
            save.init();
            return save;                            
        }
        
        public get levelStageState(): LevelStageState {
            var state: State = this.currentState;
            return state.levelStageState;
        }
        
        public get currentState(): State {
            return <State> this.state.states[this.state.current];
        }
    }

    //Core class for all componets who need listen to events and generate own.
    export class GameEventComponent {
        
        protected _game: AlgoGame;
        private _listeners: Phaser.ArraySet = new Phaser.ArraySet([]);

        constructor(game: AlgoGame) {
            this._game = game;
            this.initEventListners();
        }
        
        protected initEventListners(): void {}

        dispatchEvent(event: any, param1: any) {}

        addEventListener(eventId: string): void {
        
            if (!this._listeners.exists(eventId)) {
                this._game.eventBus.addEventListener(eventId, this.dispatchEvent, this);  
                this._listeners.add(eventId);
            } else {
                console.log("Event listener exists [" + eventId + "] ")
            }                
        }
        
        removeEventListener(eventId: string): void {
            this._game.eventBus.removeEventListener(eventId, this.dispatchEvent, this);  
        }
        
        destroy(): void {
            for(var eventId of this._listeners.list) {
                this.removeEventListener(eventId);
            }
        }

        getCallbackForEventId(eventId: string, param?: any) {
            
            return function() {
                console.log("Event created " + eventId);
                this._game.dispatch(eventId, this, param);
            }.bind(this);
        }
    }
    
    //Core class for composite elements - containers, 
    // dispatches enable, disable and show info game events
    export class GameComponentContainer extends GameEventComponent {
    
        private _componentElements: GameUIObjectWithState[] = [];

        constructor(game: AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            this.addEventListener(Events.STAGE_INFO_SHOW);
            this.addEventListener(Events.GAME_DISABLE_ALL);
            this.addEventListener(Events.GAME_ENABLE_ALL);
            this.addEventListener(Events.STAGE_INITIALIZED);
        }
        
        protected addGameElement(elementId: GameElements, element: GameUIObjectWithState): void {
            this._componentElements[elementId] = element;
        } 
        
        protected isCurrentState(state: LevelStageState): boolean {
            return this._game.levelStageState === state;
        }
        
        protected isNotCurrentState(state: LevelStageState): boolean {
            return this._game.levelStageState != state;
        }
        
        public get stateConfig(): GameConfig.StageConfig {
            return this._game.currentState.stateConfig;
        }
        
        protected get levelSave(): LevelSave {
            return this._game.currentState.levelSave;
        }
        
        protected saveState(): void  {
          this._game.currentState.saveState();
        }

        dispatchEvent(event: any, param1: any) {
            switch(event.type) {
                case Events.GAME_DISABLE_ALL:
                    for(var uiElementIndex in this._componentElements) {
                        var uiElement = this._componentElements[uiElementIndex];
                        uiElement.saveStateAndDisable();
                    }
                    break;
                case Events.GAME_ENABLE_ALL:
                    for(var uiElementIndex in this._componentElements) {
                        var uiElement = this._componentElements[uiElementIndex];
                        uiElement.restoreState();
                    }
                    break;
                case Events.STAGE_INFO_SHOW:
                    var infoWidget: InfoWidget = <InfoWidget> param1;
                    var element = this._componentElements[infoWidget.getElementId()];
                    if (element != null) {
                        infoWidget.showFor(element);
                    }                        
                    break;
            }
        }

        destroy(): void {
            super.destroy();         
            for (var key in this._componentElements) {
               var value = this._componentElements[key];
               value.destroy();
            }
        }
    }
   
    export class Text extends Phaser.Text implements GameUIObjectWithState {
        constructor(game: AlgoGame, x: number, y: number, text: string, fontSettings: any) {
            super(game, x, y, text, fontSettings);
        }
        
        saveStateAndDisable(): void {};
        restoreState(): void {};
        
    }
    
    export class Button extends Phaser.Button implements GameUIObjectWithState {
        
        private _activeFrames: any[];
        private _inactiveFrame: any;
        private _callback: Function;
        private _savedEnabled: boolean;
        
        constructor(game:AlgoGame, frames:any[], atlasName: string = Constants.GAME_GENERAL_ATTLAS) {
            super(game, 0,0, atlasName,
            this.onButtonDown, this, 
            frames[0],
            frames[1],
            frames[2],
            frames[3]
            );
            this._activeFrames = frames;
            this._inactiveFrame = frames[4];
        }
        
        activate(): void {
            this.input.enabled = true;
            this.setFrames(
                this._activeFrames[0], 
                this._activeFrames[1], 
                this._activeFrames[2],
                this._activeFrames[3]
                );
        }
        
        deactivate():void {
            this.input.enabled = false;
            this.setFrames(
                this._inactiveFrame, 
                this._inactiveFrame, 
                this._inactiveFrame, 
                this._inactiveFrame
            );
        }
        
        public saveStateAndDisable(): void {
            this._savedEnabled = this.input.enabled;
            this.deactivate();
        }
        
        public restoreState(): void {
            if (this._savedEnabled) {
                this.activate();
            } 
        }
        
        private onButtonDown(): void {
            this._callback();
        }
        
        set callback(callback: Function) {
            this._callback = callback;
        }
    }
}
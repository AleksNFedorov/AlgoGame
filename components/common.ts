/// <reference path="../lib/phaser.d.ts" />

declare var store: Store;

module Common {
    
    export enum LevelStageState {PAUSED = 0, RUNNING = 1, CREATED = 2, END = 3, UNKNOWN = 4};
    export enum LevelStageType {MENU = 0, PRACTISE = 1, EXAM = 2, UNKNOWN = 3};
    
    export enum GameElements {
        LEVEL_BUTTON = 0,
        LEVEL_PROGRESS = 1,
        MENU_BUTTON_BACK = 2,
        MENU_BUTTON_DESCRIPTION = 3,
        MENU_BUTTON_OBJECTIVES = 4,
        MENU_BUTTON_PRACTISE = 5,
        MENU_BUTTON_EXAM = 6,
        PRACTISE_PROGRESS_STEP = 7,
        PRACTISE_PROGRESS_COMPLETION = 8,
        PRACTISE_CONTROL_PANEL_BUTTON_PLAY = 9,
        PRACTISE_CONTROL_PANEL_BUTTON_PAUSE = 10,
        PRACTISE_CONTROL_PANEL_TEXT = 11,
        GAME_AREA = 12
    };
    
    export class StateSave {
        public practiseDone: number = 0;
        public testsDone: number = 0;
    };
    
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
        };
        
        public get totalItertions(): number {
            return this._totalItertions;
        };
        
        public get doneIterations(): number {
            return this._doneIterations;
        };
        
    }
    
    export class Step {
        private _isLast: boolean = false;
        private _stepNumber: number = -1;
        
        constructor(isLast: boolean, stepNumber: number) {
            this._isLast = isLast;
            this._stepNumber = stepNumber;
        }
        
        public get isLast(): boolean {
            return this._isLast;
        };
        
        public get stepNumber(): number {
            return this._stepNumber;
        };
    }
    
    export interface InfoWidget {
        showFor(element: any): void;
        getElementId(): number;
    }
    
    class GameEvent {
        constructor(
            public eventId: string, 
            public caller: any, 
            public param?: any) {}
    }
    
    export class AlgoGameState extends Phaser.State {
        
        private _game: AlgoGame;
        private _eventsToProcess: Phaser.LinkedList = new Phaser.LinkedList();
        private _levelStageState: LevelStageState = LevelStageState.UNKNOWN;

        
        public dispatch(eventId: string, caller: any, param?: any) {
            console.log("New event dispatched by state");
            var newEvent: GameEvent = new GameEvent(eventId, caller, param);
            this._eventsToProcess.add(newEvent);
        }
        
        public init(): void {
            this._game = <AlgoGame> this.game;
        }
        
        
        public create(): void {
            this.initEventListners();
        }
        
        private initEventListners(): void {
            this._game.eventBus.addEventListener(Events.GAME_CREATED, this.dispatchEvent, this);
            this._game.eventBus.addEventListener(Events.GAME_STARTED, this.dispatchEvent, this);
            this._game.eventBus.addEventListener(Events.GAME_END, this.dispatchEvent, this);
            this._game.eventBus.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY, this.dispatchEvent, this);
            this._game.eventBus.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE, this.dispatchEvent, this);
        }
        
        public update(): void {
            if (this._eventsToProcess.first != null) {
                var eventToProcess = this._eventsToProcess.first;
                this._eventsToProcess.remove(eventToProcess);
                this._game.eventBus.dispatch(
                    eventToProcess.eventId,
                    eventToProcess.caller,
                    eventToProcess.param
                );
            }
        }
        
        public shutdown(): void {
            this._game.eventBus.removeEventListener(Events.GAME_CREATED, this.dispatchEvent, this);
            this._game.eventBus.removeEventListener(Events.GAME_STARTED, this.dispatchEvent, this);
            this._game.eventBus.removeEventListener(Events.GAME_END, this.dispatchEvent, this);
            this._game.eventBus.removeEventListener(Events.CONTROL_PANEL_EVENT_PLAY, this.dispatchEvent, this);
            this._game.eventBus.removeEventListener(Events.CONTROL_PANEL_EVENT_PAUSE, this.dispatchEvent, this);
        }
        
        dispatchEvent(event: any, param1: any) {
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._levelStageState = LevelStageState.PAUSED;
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    if (this._levelStageState != LevelStageState.PAUSED)
                        return;
                    this._levelStageState = LevelStageState.RUNNING;
                    break;
                case Events.GAME_CREATED:
                    this._levelStageState = LevelStageState.CREATED;
                    break;
                case Events.GAME_STARTED:
                    this._levelStageState = LevelStageState.RUNNING;
                    break;
                case Events.GAME_END:
                    this._levelStageState = LevelStageState.END;
                    break;
            }
        }
        
        public get algoGame(): AlgoGame {
            return this._game;
        }
        
        public get levelStageState(): LevelStageState {
            return this._levelStageState;
        }
    }
    
    export class AlgoGame extends Phaser.Game {
    
        private _eventBus:EventBusClass;
        private _store: Store = store;
        
        constructor(gameWidth: number, gameHeight: number, mode: number, tag: string) {
            super(gameWidth, gameHeight, mode, tag);
            this._eventBus = new EventBusClass();
        }
        
        public dispatch(eventId: string, caller: any, param?: any): void {
            var state: AlgoGameState = <AlgoGameState> this.state.states[this.state.current];
            state.dispatch(eventId, caller, param);
        }
        
        get store() : Store {
            return this._store;   
        }
        
        get eventBus(): EventBusClass {
            return this._eventBus;
        }
        
        public get levelStageState(): LevelStageState {
            var state: AlgoGameState = <AlgoGameState> this.state.states[this.state.current];
            return state.levelStageState;
        }

    }

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
        
            for(var eventId in this._listeners) {
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
    
    export class GameComponentContainer extends GameEventComponent {
    
        private _componentElements: any[] = [];
        
        constructor(game: AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            this.addEventListener(Events.STAGE_INFO_SHOW);
        }
        
        protected addGameElement(elementId: GameElements, element: any): void {
            this._componentElements[elementId] = element;
        } 

        dispatchEvent(event: any, param1: any) {
            switch(event.type) {
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
    
    export class Button extends Phaser.Button {
        
        private _activeFrames: number[];
        private _inactiveFrame: number;
        private _callback: Function;
        
        constructor(game:AlgoGame, frames:number[]) {
            super(game, 0,0, Constants.MENU_BUTTON_ATTLAS,
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
        
        private onButtonDown(): void {
            this._callback();
        }
        
        set callback(callback: Function) {
            this._callback = callback;
        }
    }
}
/// <reference path="./common.ts" />

module Common {
    
    /*
        General state for all game states. Contains all core stuff and keeps game state updated.
    */
    export class State extends Phaser.State {
        
        private _game: AlgoGame;
        private _eventsToProcess: Phaser.LinkedList = new Phaser.LinkedList();
        private _levelStageState: LevelStageState = LevelStageState.UNKNOWN;
        private _pausedByModalWindow: boolean = false;
        private _stateConfig: GameConfig.StageConfig;

        public dispatch(eventId: string, caller: any, param?: any) {
            log.info(`New event received by state [${eventId}][${this.key}]`);
            
            var newEvent: GameEvent = new GameEvent(eventId, caller, param);
            this._eventsToProcess.add(newEvent);
        }
        
        public init(): void {
            this._game = <AlgoGame> this.game;
            this._stateConfig = this.getStateConfig(this.getStageType());
        }
        
        protected getStageType(): string {
            throw "No implementation for [getStageType]";
        }
        
        protected getStateConfig(stage: string): GameConfig.StageConfig {
            var level = this.key.replace(stage, "");
        
            var levelConfig: GameConfig.LevelConfig = globalConfig.levelConfigs[level];
            var stateConfig = levelConfig[stage.toLowerCase()];
            stateConfig.level = level;
            
            return stateConfig;
        }
        
        
        protected onCreate(): void {
            this.initEventListners();
            this._game.dispatch(Events.STAGE_INITIALIZED, this, this._stateConfig);
        }
        
        private initEventListners(): void {
            this.addEventListener(Events.GAME_CREATED);
            this.addEventListener(Events.GAME_STARTED);
            this.addEventListener(Events.GAME_END);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.addEventListener(Events.MODAL_WINDOW_DISPLAYING);
            this.addEventListener(Events.MODAL_WINDOW_HIDE);
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
            this.removeEventListener(Events.GAME_CREATED);
            this.removeEventListener(Events.GAME_STARTED);
            this.removeEventListener(Events.GAME_END);
            this.removeEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.removeEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.removeEventListener(Events.MODAL_WINDOW_DISPLAYING);
            this.removeEventListener(Events.MODAL_WINDOW_HIDE);
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
                case Events.MODAL_WINDOW_DISPLAYING:
                    this._game.dispatch(Events.GAME_DISABLE_ALL, this);
                    if (this._game.levelStageState == LevelStageState.RUNNING) {
                        this._pausedByModalWindow = true;
                        this._game.dispatch(Events.CONTROL_PANEL_EVENT_PAUSE, this);
                    }
                    break;
                case Events.MODAL_WINDOW_HIDE:
                    this._game.dispatch(Events.GAME_ENABLE_ALL, this);
                    if (this._pausedByModalWindow) {
                        this._game.dispatch(Events.CONTROL_PANEL_EVENT_PLAY, this);
                        this._pausedByModalWindow = false;
                    }
                    break;
            }
        }
        
        private addEventListener(eventId: string): void {
            this._game.eventBus.addEventListener(eventId, this.dispatchEvent, this);  
        }
        
        private removeEventListener(eventId: string): void {
            this._game.eventBus.removeEventListener(eventId, this.dispatchEvent, this);  
        }

        
        public get algoGame(): AlgoGame {
            return this._game;
        }
        
        public get levelStageState(): LevelStageState {
            return this._levelStageState;
        }
    }
    
    //State for Practise stages only
    export class PractiseState extends Common.State {
        
        protected _menu: Common.Menu;
        protected _controlPanel: Common.PractisePanel;
        protected _progressPanel: Common.ProgressPanel;
        protected _practiseManager: StageInfo.PractiseManager;
        protected _modalWindow: GameModal.ModalWindow;
        
        public shutdown(): void {
            super.shutdown();
            this._menu.destroy();  
            this._controlPanel.destroy();
            this._practiseManager.destroy();
            this._modalWindow.destroy();
            this._menu = null;
        }
    
        public create(): void {
            
            this._modalWindow = new GameModal.ModalWindow(this.algoGame);
            this.initModalWindows();
            
            this._menu = new Common.PractiseMenu(this.algoGame);
            this._controlPanel = new Common.PractisePanel(this.algoGame);
            this.initGamePlay();
            this._progressPanel = new Common.ProgressPanel(this.algoGame);
            this._practiseManager = new StageInfo.PractiseManager(this.algoGame);
            
            super.onCreate();        
        }
        
        protected initGamePlay():void {
            throw "Game play not initizliaed";
        }
        
        protected getStageType(): string {
            return "Practise";
        }

        protected initModalWindows(): void {
            var configs: GameModal.ModalConfig[] = [
                    new GameModal.ModalConfig(Common.ModalWindows.OBJECTIVES, "cursor"),
                    new GameModal.ModalConfig(Common.ModalWindows.PRACTISE_DONE, "cursor")
                ];
                
            this._modalWindow.createWindows(configs);
        }
    }
    
    //State for Exam stages only
    export class ExamState extends Common.State {
    
        private _menu: Common.Menu;
        private _controlPanel: Common.ExamPanel;
        private _progressPanel: Common.ProgressPanel;
        private _modalWindow: GameModal.ModalWindow;
    
        public shutdown(): void {
            super.shutdown();
            this._menu.destroy();
            this._controlPanel.destroy();
            this._modalWindow.destroy();
            this._menu = null;
        }
    
        create(): void {
    
            this._modalWindow = new GameModal.ModalWindow(this.algoGame);
            this.initModalWindows();
    
            this._menu = new Common.ExamMenu(this.algoGame);
            this._controlPanel = new Common.ExamPanel(this.algoGame);
            this.initGamePlay();
            this._progressPanel = new Common.ProgressPanel(this.algoGame);
    
            super.onCreate();
        }
        
        protected initGamePlay():void {
            throw "Game play not initizliaed";
        }
        
        protected getStageType(): string {
            return "Practise";
        }
        
        private initModalWindows(): void {
            var configs: GameModal.ModalConfig[] = [
                    new GameModal.ModalConfig(Common.ModalWindows.OBJECTIVES, "cursor"),
                    new GameModal.ModalConfig(Common.ModalWindows.EXAM_DONE, "cursor")
                ];
                
            this._modalWindow.createWindows(configs)            ;
        }
    
    }    
}
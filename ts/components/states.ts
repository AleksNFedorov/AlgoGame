/// <reference path="./common.ts" />
/// <reference path="./progresspanel.ts" />
/// <reference path="../lib/gameconfig.d.ts" />

declare var store: Store;
declare var log: any;

module Common {

    export class BackgroundGraphics {
        
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
    
    
    /*
        State to preload level assets and show banner with garantee display time
    */
    export class PractisePreloadState extends Phaser.State {
        
        private _loadProgress: ProgressBar; 
        private _banner: Phaser.Sprite;
        private _background: BackgroundGraphics;
        
        private _maxProgressValue: number;
        private _progressValue: number = 0;
        
        private _level: string;
        
        public init(level: string): void {
            this._level = level;
            this._progressValue = 0;
        }
        
        public create(): void {
            this._background = new Common.BackgroundGraphics(this.game);
            
            this.initScreen();
            this.initLoadCallbacks();
            this.loadLevelAssets();
        }
        
        private initScreen(): void {
            var bannerIndex = this.game.rnd.integerInRange(0, Constants.BANNERS_AMOUNT - 1);
            this._banner = this.game.add.sprite(
                    0, 0,
                    Constants.BANNERS_ATTLAS,
                    bannerIndex
                );
                
            this._banner.x = this.game.width/2 - this._banner.width/2;
            this._banner.y = 50;
            
            this._background.drawRect(0, 600, this.game.width, this.game.height);
            
            this._loadProgress = new ProgressBar(this.game, "progressBarBig", "", true);

            this._maxProgressValue = Constants.LEVEL_ASSETS_AMOUNT + this.game.rnd.integerInRange(8, 14);               
            this._loadProgress.setMaxValue(this._maxProgressValue);
            this._loadProgress.setValue(this._progressValue, "");
                
            this._loadProgress.x = this.game.width/2 - this._loadProgress.width/2;
            this._loadProgress.y = 620;
        }
        
        private initLoadCallbacks(): void {
            this.game.load.onFileComplete.add(this.onFileLoadComplete, this);
            this.game.load.onLoadComplete.add(this.onLoadComplete, this);
        }
        
        private onFileLoadComplete(): void {
            console.log("Level preloading [onFileLoadComplete]");
            this._progressValue++;
            this._loadProgress.setValue(this._progressValue, "");
        }
        
        private onLoadComplete(): void {
            console.log("Level preloading [onLoadComplete]");
            var timer = this.game.time.create(true);
            var timeLeft = this.game.rnd.integerInRange(1500, 2300);
            var updatesLeft = this._maxProgressValue - this._progressValue;
            var progressUpdateTime = timeLeft - 300;
            var progressUpdateInterval = progressUpdateTime/(updatesLeft + 1);
            
            timer.repeat(progressUpdateInterval, updatesLeft, this.onFileLoadComplete, this);
            timer.add(timeLeft - 300, this.onFinish, this);
            timer.start();
        }
        
        private onFinish(): void {
            console.log("Level preloading [onFinish]");
            this.game.state.start(this.getLevelStageToStart(this._level));
        }
        
        private getLevelStageToStart(level: string): string {
            var levelSave = (<AlgoGame>this.game).loadLevelSave(level);
            if (!levelSave.tutorialPassed) {
                return level + "Tutorial";
            } else if (!levelSave.examPassed || !levelSave.practisePassed) {
                return level + "Practise";
            } else if (levelSave.examPassed) {
                return level + "Exam";
            } 
            throw `Unable to identify stage to ${level}`;
        }

        public shutdown(): void {
            this._background.destroy();
            this.removeLoadCallbacks();
            this._loadProgress.destroy();
            this._banner.destroy();
        }
        
        private removeLoadCallbacks() {
            this.game.load.onFileComplete.remove(this.onFileLoadComplete, this);
            this.game.load.onLoadComplete.remove(this.onLoadComplete, this);
        }
        
        private loadLevelAssets(): void {
            
            var levelAttlasName = this._level;
            var levelAttlasPath = Constants.GAME_ASSETS_PATH + "levels/" + levelAttlasName + ".png";
            var levelAttlasJSONPath = Constants.GAME_ASSETS_PATH  + "levels/" +  levelAttlasName + ".json";
            
            this.game.load.atlas(levelAttlasName,
                levelAttlasPath,
                levelAttlasJSONPath,
                Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
              
            this.game.load.start();                
            console.log("Level preloading started");
        }
    }
    
    class EventLogger {
        
        private _state: State;
        
        constructor(state: State) {
            this._state = state;
        }
        
        public logEvent(event: GameEvent): void {
            var level = this._state._stateConfig.level;
            var stageName = this._state.key;
            var eventId = event.eventId;
            switch(eventId) {
                case Events.GAME_CORRECT_STEP_DONE:
                    if (event.param[1]) {
                        eventId = Events.GAME_CORRECT_STEP_DONE_BY_USER;
                    }
                    break;
                case Events.GAME_END:
                    if (event.param[1]) {
                        eventId = Events.GAME_END_BY_USER;
                    }
                    break;
            }
            log.info(`${level}|${stageName}|${eventId}`);
        }
    }
    
    /*
        General state for all game states. Contains all core stuff and keeps game state updated.
    */
    export class State extends Phaser.State {
        
        protected _game: AlgoGame;
        private _levelStageState: LevelStageState = LevelStageState.UNKNOWN;
        private _eventsToProcess: Phaser.LinkedList = new Phaser.LinkedList();
        private _pausedByModalWindow: boolean = false;
        private _eventLogger: EventLogger = new EventLogger(this);
        
        public _stateConfig: GameConfig.StageConfig;
        
        private _levelSave: LevelSave;
        private _lastInactivityCheckTime: number;

        public dispatch(eventId: string, caller: any, param?: any) {
            var newEvent: GameEvent = new GameEvent(eventId, caller, param);
            this._eventsToProcess.add(newEvent);
            this._eventLogger.logEvent(newEvent);
        }
        
        public init(): void {
            this._game = <AlgoGame> this.game;
            this._stateConfig = this.getStateConfig(this.getStageType());
            this._levelSave = this._game.loadLevelSave(this._stateConfig.level);
            this.flushInactivityTime();
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
        
        protected initEventListners(): void {
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
                this.flushInactivityTime();
            } else {
                if (this._game.time.elapsedSince(this._lastInactivityCheckTime) 
                    >= Constants.GAME_INACTIVITY_INTERVAL) {
                    this._game.eventBus.dispatch(
                        Events.GAME_INACTIVITY_NOTIFY,
                        this);
                    
                    this.flushInactivityTime();
                }
            }
        }
        
        private flushInactivityTime(): void {
            this._lastInactivityCheckTime = this._game.time.time;
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
        
        protected addEventListener(eventId: string): void {
            this._game.eventBus.addEventListener(eventId, this.dispatchEvent, this);  
        }
        
        protected removeEventListener(eventId: string): void {
            this._game.eventBus.removeEventListener(eventId, this.dispatchEvent, this);  
        }
        
        public get stateConfig(): GameConfig.StageConfig {
            return this._stateConfig;
        }
        
        public get levelSave(): LevelSave {
            return this._levelSave;
        }
        
        public saveState(): void  {
          this._game.store.set(this.stateConfig.level, this._levelSave);
        }
        
        public get algoGame(): AlgoGame {
            return this._game;
        }
        
        public get levelStageState(): LevelStageState {
            return this._levelStageState;
        }
    }
    
    //State for Practise stages only
    class CorePlayState extends State {
        
        private _background: BackgroundGraphics;
        protected _modalWindow: GameModal.ModalWindow;

        protected _menu: Menu;
        protected _controlPanel: GameComponentContainer;
        protected _progressPanel: GameComponentContainer;
        protected _gamePlay: CoreGamePlay<GamePlayAction, Algorithm>;
        protected _showHelperInfoManager: StageInfo.Manager;
        
        public shutdown(): void {
            super.shutdown();
            this._background.destroy();
            this._modalWindow.destroy();
            this._menu.destroy();  
            this._controlPanel.destroy();
            this._progressPanel.destroy();
            this._gamePlay.destroy();
            this._showHelperInfoManager.destroy();
            this._menu = null;
            this.removeEventListener(Events.STAGE_INFO_ALL_INFO_SHOWED);
        }
    
        public create(): void {
            this._background = new BackgroundGraphics(this.algoGame);
            this.drawBackground();
        
            this._modalWindow = new GameModal.ModalWindow(this.algoGame);
            this.initModalWindows();
            
            this._gamePlay = this.buildGamePlay();

            this.onCreate();
        }
        
        private drawBackground(): void {
            this._background.drawLine(0, 90, this.algoGame.width, 90);
            this._background.drawLine(0, 600, this.algoGame.width, 600);
            
            this._background.drawLine(350, 600, 350, this.algoGame.height);
        }
        
        protected buildGamePlay(): CoreGamePlay<Common.GamePlayAction, Common.Algorithm> {
            throw "Game play not initizliaed";
        }
        
        protected getStageType(): string {
            throw "Method not defined [getStageType]";
        }

        protected initModalWindows(): void {}
    }
    
    //State for Tutorial stages only
    export class TutorialState extends CorePlayState {
        
        
        protected onCreate(): void {
            this._menu = new Common.TutorialMenu(this.algoGame);
            this._controlPanel = new Common.TutorialPanel(this.algoGame);
            this._progressPanel = new Common.TutorialProgressPanel(this.algoGame);
            this._showHelperInfoManager = new StageInfo.TutorialManager(this.algoGame);

            super.onCreate();        
            
        }
        
        protected getStageType(): string {
            return "Tutorial";
        }
        
        protected initModalWindows(): void {
            this._modalWindow.registerWindow(
                new GameModal.ModalConfig(
                    Events.GAME_TUTORIAL_DONE, 
                    "tutorialPassed.png", 
                    Constants.GAME_EXAM_BANNERS_ATLAS, 
                    4000));
        }
        
    }
    
    //State for Practise stages only
    export class PractiseState extends CorePlayState {
        
        protected onCreate(): void {
            this._menu = new Common.PractiseMenu(this.algoGame);
            this._controlPanel = new Common.PractisePanel(this.algoGame);
            this._progressPanel = new Common.ProgressPanel(this.algoGame);
            this._showHelperInfoManager = new StageInfo.PractiseManager(this.algoGame);
            
            super.onCreate();        
        }
        
        protected initModalWindows(): void {
        
            this._modalWindow.registerWindow(
                new GameModal.ModalConfig(
                    Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, 
                    "objective.png", 
                    this.stateConfig.level));

            this._modalWindow.registerWindow(
                new GameModal.ModalConfig(
                    Events.GAME_PRACTISE_DONE, 
                    "examOpen.png", 
                    Constants.GAME_EXAM_BANNERS_ATLAS, 
                    4000));
        }
        
        protected getStageType(): string {
            return "Practise";
        }
        
    }
    
    //State for Exam stages only
    export class ExamState extends CorePlayState {
    
        protected onCreate(): void {
    
            this._menu = new Common.ExamMenu(this.algoGame);
            this._controlPanel = new Common.ExamPanel(this.algoGame);
            this._progressPanel = new Common.ProgressPanel(this.algoGame);
            this._showHelperInfoManager = new StageInfo.ExamManager(this.algoGame);
    
            super.onCreate();
        }
        
        protected getStageType(): string {
            return "Exam";
        }
        
        protected initModalWindows(): void {
        
            this._modalWindow.registerWindow(
                new GameModal.ModalConfig(
                    Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, 
                    "objective.png", 
                    this.stateConfig.level));
                    
            this._modalWindow.registerWindow(
                new GameModal.ModalConfig(
                    Events.GAME_EXAM_DONE, 
                    "examPassed.png", 
                    Constants.GAME_EXAM_BANNERS_ATLAS, 4000));
        }
    
    }    
}
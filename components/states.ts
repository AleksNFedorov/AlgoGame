/// <reference path="./common.ts" />
/// <reference path="./progresspanel.ts" />

declare var store: Store;

module Common {
    
    /*
        State to preload level assets and show banner with garantee display time
    */
    export class PractisePreloadState extends Phaser.State {
        
        private _loadProgress: ProgressBar; 
        private _banner: Phaser.Sprite;
        
        private _maxProgressValue: number;
        private _progressValue: number = 0;
        
        private _level: string;
        
        public init(level: string): void {
            this._level = level;
            this._progressValue = 0;
        }
        
        public create(): void {
            this.initScreen();
            this.initLoadCallbacks();
            this.loadLevelAssets();
        }
        
        private initScreen(): void {
            var bannerIndex = this.game.rnd.integerInRange(0, Constants.BANNERS_AMOUNT - 1);
            this._banner = this.game.add.sprite(
                    this.game.width/2, this.game.height/2,
                    Constants.BANNERS_ATTLAS,
                    bannerIndex
                );
            this._banner.anchor.setTo(0.5);
            
            this._loadProgress = new ProgressBar(this.game, "progressBarBig", "", true);

            this._maxProgressValue = Constants.LEVEL_ASSETS_AMOUNT + this.game.rnd.integerInRange(8, 14);               
            this._loadProgress.setMaxValue(this._maxProgressValue);
            this._loadProgress.setValue(this._progressValue, "");
                
            this._loadProgress.x = 0;
            this._loadProgress.y = this._banner.y + this._banner.height + 10;
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
            this.game.state.start(this._level + "Practise");
        }
        
        public shutdown(): void {
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
            var levelAttlasPath = Constants.GAME_ASSETS_PATH + levelAttlasName + "/level.png";
            var levelAttlasJSONPath = Constants.GAME_ASSETS_PATH + levelAttlasName + "/level.json";
            
            this.game.load.atlas(levelAttlasName,
                levelAttlasPath,
                levelAttlasJSONPath,
                Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
              
            this.game.load.start();                
            console.log("Level preloading started");
        }
    }
    
    /*
        General state for all game states. Contains all core stuff and keeps game state updated.
    */
    export class State extends Phaser.State {
        
        protected _game: AlgoGame;
        private _eventsToProcess: Phaser.LinkedList = new Phaser.LinkedList();
        private _levelStageState: LevelStageState = LevelStageState.UNKNOWN;
        private _pausedByModalWindow: boolean = false;
        protected _stateConfig: GameConfig.StageConfig;
        
        private _levelSave: LevelSave;

        public dispatch(eventId: string, caller: any, param?: any) {
            log.info(`New event received by state [${eventId}][${this.key}]`);
            
            var newEvent: GameEvent = new GameEvent(eventId, caller, param);
            this._eventsToProcess.add(newEvent);
        }
        
        public init(): void {
            this._game = <AlgoGame> this.game;
            this._stateConfig = this.getStateConfig(this.getStageType());
            this._levelSave = this.loadLevelSave();
            
        }
        
        protected loadLevelSave(): LevelSave {
            return this._game.store.get(this._stateConfig.level)
                            || new LevelSave();
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
    export class PractiseState extends Common.State {
        
        private _background: BackgroundGraphics;
        private _menu: Common.Menu;
        private _controlPanel: Common.PractisePanel;
        private _progressPanel: Common.ProgressPanel;
        private _practiseManager: StageInfo.PractiseManager;
        private _modalWindow: GameModal.ModalWindow;
        private _gamePlay: PractiseGamePlay<Common.GamePlayAction, Common.Algorithm>;
        
        
        public shutdown(): void {
            super.shutdown();
            this._menu.destroy();  
            this._controlPanel.destroy();
            this._practiseManager.destroy();
            this._modalWindow.destroy();
            this._gamePlay.destroy();
            this._progressPanel.destroy();
            this._background.destroy();
            this._menu = null;
            this.removeEventListener(Events.STAGE_INFO_ALL_INFO_SHOWED);

        }
    
        public create(): void {
            this._background = new BackgroundGraphics(this.algoGame);
            this.drawBackground();
        
            this._modalWindow = new GameModal.ModalWindow(this.algoGame);
            this.initModalWindows();
            
            this._menu = new Common.PractiseMenu(this.algoGame);
            this._controlPanel = new Common.PractisePanel(this.algoGame);
            this._gamePlay = this.buildGamePlay();
            this._progressPanel = new Common.ProgressPanel(this.algoGame);
            this._practiseManager = new StageInfo.PractiseManager(this.algoGame);
            
            super.onCreate();        

        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.STAGE_INFO_ALL_INFO_SHOWED);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INFO_ALL_INFO_SHOWED:
                    if (this.levelSave.practiseDone == 0) {
                        this._game.dispatch(Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, this);
                    }
                    break;
            }
        }
        
        private drawBackground(): void {
            this._background.drawLine(0, 80, this.algoGame.width, 80);
            this._background.drawLine(0, 600, this.algoGame.width, 600);
            
            this._background.drawLine(350, 600, 350, this.algoGame.height);
            
        }
        
        protected buildGamePlay(): PractiseGamePlay<Common.GamePlayAction, Common.Algorithm> {
            throw "Game play not initizliaed";
        }
        
        protected getStageType(): string {
            return "Practise";
        }

        protected initModalWindows(): void {
            var configs: GameModal.ModalConfig[] = [
                    new GameModal.ModalConfig(Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, "separator_arrow.png", Constants.GAME_GENERAL_ATTLAS),
                    new GameModal.ModalConfig(Events.GAME_PRACTISE_DONE, "separator_arrow.png", Constants.GAME_GENERAL_ATTLAS)
                ];
                
            this._modalWindow.createWindows(configs);
        }
    }
    
    //State for Exam stages only
    export class ExamState extends Common.State {
    
        private _background: BackgroundGraphics;
        private _menu: Common.Menu;
        private _controlPanel: Common.ExamPanel;
        private _progressPanel: Common.ProgressPanel;
        private _modalWindow: GameModal.ModalWindow;
        private _gamePlay: ExamGamePlay<Common.GamePlayAction, Common.Algorithm>;
        
    
        public shutdown(): void {
            super.shutdown();
            this._menu.destroy();
            this._controlPanel.destroy();
            this._modalWindow.destroy();
            this._gamePlay.destroy();
            this._progressPanel.destroy();
            this._background.destroy();
            this._menu = null;
        }
    
        create(): void {
    
            this._background = new BackgroundGraphics(this.algoGame);
            this.drawBackground();
    
            this._modalWindow = new GameModal.ModalWindow(this.algoGame);
            this.initModalWindows();
    
            this._menu = new Common.ExamMenu(this.algoGame);
            this._controlPanel = new Common.ExamPanel(this.algoGame);
            this._gamePlay = this.buildGamePlay();
            this._progressPanel = new Common.ProgressPanel(this.algoGame);
    
            super.onCreate();
        }
        
        private drawBackground(): void {
            this._background.drawLine(0, 80, this.algoGame.width, 80);
            this._background.drawLine(0, 600, this.algoGame.width, 600);
            
            this._background.drawLine(350, 600, 350, this.algoGame.height);
            
        }
        
        protected buildGamePlay(): ExamGamePlay<Common.GamePlayAction, Common.Algorithm> {
            throw "Game play not initizliaed";
        }
        
        protected getStageType(): string {
            return "Exam";
        }
        
        private initModalWindows(): void {
            var configs: GameModal.ModalConfig[] = [
                    new GameModal.ModalConfig(Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, "cursor"),
                    new GameModal.ModalConfig(Events.GAME_EXAM_DONE, "cursor")
                ];
                
            this._modalWindow.createWindows(configs);
        }
    
    }    
}
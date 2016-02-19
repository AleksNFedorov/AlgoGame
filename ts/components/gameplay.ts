/// <reference path="./common.ts" />

module Common {   
    
    
    export enum FlagPosition {CENTER, LEFT, RIGHT};
    export enum FlagLevel {TOP, MIDDLE, BOTTOM};
    
    export interface GamePlayAction {}
    
    // Abstract algorithm step, represents single step of given algorithm.
    // Particular algorithm should use it of extend.
    
    
    export interface IAlgorithmStep {
        
        isLast: boolean;
        stepNumber: number;
        
        setIsLast(): void;
    }
    
    export class AlgorithmStep implements IAlgorithmStep {
        
        isLast: boolean;
        stepNumber: number;

        constructor(isLast: boolean, stepNumber: number) {
            this.isLast = isLast;
            this.stepNumber = stepNumber;
        }
        
        public setIsLast(): void {
            this.isLast = true;
        }
        
    }
    
    export class ScenarioStep implements IAlgorithmStep {
        
        public realStep: IAlgorithmStep;
        public messageKeys: string[];
        
        public setIsLast(): void {
            this.realStep.isLast = true;
        }
        
        public get isLast(): boolean {
            return this.realStep.isLast;
        }
        
        public get stepNumber(): number {
            return this.realStep.stepNumber;
        }
    }
    
    export class AbstractAlgorithm {
        
        protected _sequence: any[];
        protected _steps: IAlgorithmStep[] = [];
        private _lastRequestedStepNumber: number = -1;
        
        protected init(steps: IAlgorithmStep[], sequence: any[]) {
            this._steps = steps;
            this._sequence = sequence;
        }
        
        public getNextStep(): IAlgorithmStep {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
        }
        
        public get sequence(): any[] {
            return this._sequence;
        }
    }
    
    export class ScenarioAlgorithm extends AbstractAlgorithm {
        
        constructor(steps: ScenarioStep[], sequence: any[]) {
            super();
            this._steps = steps;
            this._sequence = sequence;
        }
    }
    
    export class Algorithm extends AbstractAlgorithm {
        
        protected config: any;
        
        constructor(config: any) {
            super();
            this.config = config;
            this._sequence = this.generateSeqeunce(config);
            this._steps = this.runAlgorithm();
            this.updateLastStep();
        }
        
        protected runAlgorithm(): IAlgorithmStep[] {
            return [];   
        }
        
        private updateLastStep(): void {
            this._steps[this._steps.length - 1].setIsLast();
        }

        protected generateSeqeunce(config: any): any[] {

            var varElements = config.maxElementsInSeq - config.minElementsInSeq;    
            var count = config.minElementsInSeq + Algorithm.getRandomInteger(0, varElements);
    
            var newGeneratedArray: number[] = [];
            
            for (var i = 0; i < count; i++) { 
                var y = this.getRandomSeqNumber();
                newGeneratedArray.push(y);
                console.log("New element created " + y);
            }
            
            if (config.sorted) {
                console.log("Sorting array");
                newGeneratedArray.sort(function(a,b){return a-b;});
            }
            
            return newGeneratedArray;
        }
        
        protected getRandomSeqNumber(): number {
            return Algorithm.getRandomInteger(this.config.minSeqNumber, this.config.maxSeqNumber);
        }
        
        public static getRandomInteger(from: number, to: number): number {
            return Math.floor(Math.random() * (to - from) + from);
        }
        
    }   
    
    // contains location info for given flag, used to show on game arena as helpers
    export class FlagLocationInfo {
        constructor(public index: number, public position: FlagPosition, public level: FlagLevel) {};
    }
    
    export enum BoxState {ACTIVE, SELECTED_BLUE, SELECTED_GREEN, SELECTED_ORANGE, DISABLED}
    
    export class BoxContainer extends Phaser.Group {

        private _boxIndex: number;
        
        private _box: Phaser.Sprite;
        private _boxText: Phaser.Text;
        
        private _pressCallback: Function;
        private _releaseCallback: Function;
        
        private _state: BoxState;
        
        constructor(game:Common.AlgoGame, boxValue: any, pressCallback?: Function, releaseCallback?: Function) {
            super(game);
            this._pressCallback = pressCallback;
            this._releaseCallback = releaseCallback;
            
            this.initBox(game, boxValue);
            this._state = BoxState.ACTIVE;
            
            game.add.existing(this);
        }
        
        private initBox(game: Common.AlgoGame, value: any): void {

            var box: Phaser.Sprite =  game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, "Active.png");
            var boxKeyText: Phaser.Text = game.add.text(box.height/2, box.width/2 , "" + value, 
                JSON.parse(JSON.stringify(Constants.CONTROL_PANEL_MESSAGE_STYLE)));
            boxKeyText.anchor.x = 0.6;
            boxKeyText.anchor.y = 0.5;
            
            box.inputEnabled = true;
            boxKeyText.inputEnabled = true;

            if (this._pressCallback != null) {
                box.events.onInputDown.add(this.onInputDown.bind(this));
                boxKeyText.events.onInputDown.add(this.onInputDown.bind(this));
            }

            if (this._releaseCallback != null) {
                box.events.onInputUp.add(this.onInputUp.bind(this));
                boxKeyText.events.onInputUp.add(this.onInputUp.bind(this));
            }
            
            this.add(box);
            this.add(boxKeyText);
            
            this._box = box;
            this._boxText = boxKeyText;
        }
        
        public setState(newState: BoxState): void {
            
            if (this._state === BoxState.DISABLED) {
                return;
            }
            
            this._boxText.fill = Constants.MENU_LEVEL_TEXT_ENABLED;
            this._state = newState;
            switch(newState) {
                case BoxState.ACTIVE:
                    this._box.frameName = "Active.png";
                    break;
                case BoxState.SELECTED_BLUE:
                    this._box.frameName = "Selected_blue.png";
                    break;
                case BoxState.SELECTED_ORANGE:
                    this._box.frameName = "Selected_orange.png";
                    break;
                case BoxState.SELECTED_GREEN:
                    this._box.frameName = "Selected_green.png";
                    break;
                case BoxState.DISABLED:
                    this._box.frameName = "Disabled.png";
                    this._boxText.fill = Constants.MENU_LEVEL_STATS_TEXT_DISABLED;
                    break;
            }
        }
        
        public setBoxIndex(boxIndex: number): void {
            this._boxIndex = boxIndex;
        } 
        
        private onInputDown(): void {
            this._pressCallback(this._boxIndex);
        }
        
        private onInputUp(): void {
            this._releaseCallback(this._boxIndex);
        }
    }
    
    export class LineGameArena<T extends Common.GamePlayAction> {
        
        protected _boxes: BoxContainer[] = [];
        protected _boxIndexes: Phaser.Text[] = [];
        protected _boxLine: Phaser.Group;
        
        protected _game: AlgoGame;
        
        private _flags: Phaser.Sprite[] = [];
        private _boxSpace: number = 20;
        
        private _boxClickedCallback: Function;
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence);
        }
        
        protected init(seqeunce: number[]) {
            this._boxLine = this._game.add.group();

            this._boxes = this.createBoxes(seqeunce);
            
            this._boxLine.x = Constants.GAME_AREA_X;
            this._boxLine.y = Constants.GAME_AREA_LINE_Y;
            
        }
        
        protected createBoxes(seqeunce: number[]): BoxContainer[] {
            
            var boxes: BoxContainer[] = [];
            var boxInterval = (this._game.width - Constants.GAME_AREA_MARGIN * 2 - Constants.GAME_AREA_BOX_WIDTH)/(seqeunce.length - 1);
            
            for(var index = 0; index < seqeunce.length; ++index) {
                var boxContainer: BoxContainer = this.createBox(index, seqeunce[index]);
                this._boxLine.add(boxContainer);
                boxContainer.x = boxInterval * index + Constants.GAME_AREA_MARGIN;
                boxContainer.y = 0;
                
                boxes.push(boxContainer);
                
                var boxIndexText: Phaser.Text = this._game.add.text(boxContainer.x + boxContainer.width/2,  boxContainer.y + boxContainer.height + 10 , "" + (index + 1), Constants.GAME_AREA_INDEX_TEXT);
                boxIndexText.anchor.x = 0.7;
                this._boxLine.add(boxIndexText);
                this._boxIndexes.push(boxIndexText);
            }
            
            return boxes;
        }
        
        private createBox(index: number, value: number): BoxContainer {
            var boxContainer: BoxContainer = new BoxContainer(this._game,
                    value,
                    this.onBoxClickPressed.bind(this),
                    this.onBoxClickReleased.bind(this)
                );
            boxContainer.setBoxIndex(index);
            return boxContainer;
        }
        
        protected onBoxClickPressed(index: number): void {
        }
        
        protected onBoxClickReleased(index: number): void {
        }
        
        protected onAction(action: T): void {
            this._boxClickedCallback(action);
        }
        
        public selectBox(boxIndex: number, selectType = BoxState.SELECTED_ORANGE) {
            var boxContainer: Common.BoxContainer = this._boxes[boxIndex];
            boxContainer.setState(selectType);
        }
        
        public hideBoxesOutOf(from: number, to: number): void {
          
          for(var i = 0; i< this._boxes.length; ++i) {
              if (i < from || i > to) {
                this._boxes[i].setState(BoxState.DISABLED);
              }
          }
        }
        
        public hideBoxesIn(from: number, to: number): void {
          for(var i = 0; i< this._boxes.length; ++i) {
              if (i >= from && i <= to) {
                this._boxes[i].setState(BoxState.DISABLED);
              }
          }
        }
        
        public clearFlags(): void {
            for(var flag of this._flags) {
                flag.destroy();
            }
            this._flags = [];
        }
        
        public showFlags(flags: FlagLocationInfo[]): void {
            
            for(var flag of flags) {
                var flagSprite = this.createSpriteForFlag(flag.position, flag.level);
                var anchor = this._boxIndexes[flag.index];
                flagSprite.x = this.getXPosition(anchor, flag.position);
                flagSprite.y = this.getYPosition(anchor, flag.level);
                this._flags.push(flagSprite);
            }
        }
        
        private getXPosition(anchor: Phaser.Text, position: FlagPosition): number {
            switch(position) {
                case FlagPosition.CENTER:
                    return anchor.x + anchor.width/2 + this._boxLine.x - 13; 
                case FlagPosition.LEFT:
                    return anchor.x - this._boxSpace/2 + this._boxLine.x - 20;
                case FlagPosition.RIGHT:
                    return anchor.x + anchor.width + this._boxSpace/2 + this._boxLine.x;
            }
            throw `Unknown position for flag [${position}]`;
        }
        
        private getYPosition(anchor: Phaser.Text, level: FlagLevel): number {
            switch(level) {
                case FlagLevel.TOP:
                case FlagLevel.MIDDLE:
                    return anchor.y + anchor.width + 20 + this._boxLine.y;
                case FlagLevel.BOTTOM:
                    return anchor.y + anchor.width + 50 + this._boxLine.y;
            }
            throw `Unknown level for flag [${level}]`;
        }
        
        private createSpriteForFlag(position: FlagPosition, level: FlagLevel): Phaser.Sprite {
            var flagSprite = this.getFlagSpriteByLevel(level);
            var box: Phaser.Sprite = this._game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, flagSprite);
            box.scale.setTo(0.2);
            return box;
        }
        
        private getFlagSpriteByLevel(level: FlagLevel): string {
            switch(level) {
                case FlagLevel.TOP:
                    return "Selected_orange.png";
                case FlagLevel.MIDDLE:
                    return "Selected_green.png";
                case FlagLevel.BOTTOM:
                    return "Selected_blue.png";
            }
        }
        
        public destroy(): void {
            for(var box of this._boxes) {
                box.destroy();
            }
            
            for(var boxIndex of this._boxIndexes) {
                boxIndex.destroy();
            }

            this.clearFlags();

            this._boxLine.destroy();
            this._boxes = null;
            this._boxIndexes = null;
        }
        
    }
    
    export class CoreGamePlay<T extends GamePlayAction, A extends AbstractAlgorithm> extends Common.GameComponentContainer {

        protected _algorithm: A;
        protected _algorithmStep: IAlgorithmStep;
        
        constructor(game: Common.AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.initGame(true);
                    this.checkPractiseDone();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    if (this.isNotCurrentState(Common.LevelStageState.PAUSED)) {
                        if (this.isNotCurrentState(Common.LevelStageState.CREATED)) {
                            //non-first iteration
                            this.initGame(false);
                        } 
                        this.startGame();
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    this.onLastStep(false);
                    this._game.dispatch(
                        Events.CONTROL_PANEL_EVENT_PLAY, 
                        this,
                        this.createGamePlayInfo());
                    break;
            }
        }
        
        private initGame(isGameCreate: boolean) : void {
            this.destroyTempObjects();
            
            this._algorithm = this.createAlgorithm(this.stateConfig.gamePlay);
            this.onInit();
            
            if (isGameCreate) {
                this._game.dispatch(
                    Events.GAME_CREATED, 
                    this,
                    this.createGamePlayInfo());
            }
        }
        
        protected createAlgorithm(config: any): A {
            return null;
        }
        
        protected onInit(): void {
            
        }
        
        protected createGamePlayInfo(): Common.GamePlayInfo {
            return  new Common.GamePlayInfo(
                this.stateConfig.stepTime,
                this.stateConfig.stepsToPass,
                this.getStageDone());
        }
        
        protected startGame(): void {
            this.onNewStep();
            this._game.dispatch(Events.GAME_STARTED, this, 
                this.getStageDone());
        }
        
        protected boxClicked(action: T, isUser:boolean = true) {
            
            if (!this.checkStepAllowed(isUser)) {
                return;
            }
            
            var step: Common.AlgorithmStep = this._algorithmStep;
            
            if (this.isCorrectStep(action)) {
                this.updateGameStatistics(isUser);
                this.onCorrectAction(isUser);
                
                if (step.isLast) {
                    this.onLastStep(isUser);
                } else {
                    this.onNewStep();
                }
                this.checkPractiseDone();

            } else {
                this.onWrongStep(isUser);
            }
        }
        
        protected onWrongStep(isUser: boolean = true): void {
            this._game.dispatch(Events.GAME_WRONG_STEP_DONE, this, isUser);
        }
        
        protected checkStepAllowed(isUser: boolean): boolean {
            return true;
        }
        
        protected onNewStep(): void {
            this._algorithmStep = this._algorithm.getNextStep();
        };
        
        protected onCorrectAction(isUser: boolean): void {
            this._game.dispatch(
                Events.GAME_CORRECT_STEP_DONE, 
                this, 
                [this.getStageDone(), isUser]);
        }
        
        protected isCorrectStep(action: T): boolean {
            throw "Method is not implemented yet [isCorrectStep]";
        }
        
        protected updateGameStatistics(isUser: boolean): void {
            this.setStageDone(this.getStageDone() + 1);
            this.saveState();
        }
        
        protected onLastStep(isUser: boolean): void {
            this._game.dispatch(Events.GAME_END, this, [this.getStageDone(), isUser]);
            console.log("Game finished");
        }
        
        // True when practise done because of user actions during this game
        protected checkPractiseDone() {
            if (this.stateConfig.stepsToPass <= this.getStageDone() ) {
                if (!this.getStagePassed()) {
                    this.setStagePassed(true)
                    this._game.dispatch(this.getStagePassEvent(), this, this.getStagePassed());
                }
                this.saveState();
            }
        }
        
        destroy(): void {
            super.destroy();
            this.destroyTempObjects();
        }
        
        protected destroyTempObjects():void {
          this._algorithm = null;
        }
        
        protected getStagePassEvent(): string {
            throw "Method not implemented [getStagePassEvent]"
        }
        
        protected getStageDone(): number {
            throw "Method not implemented [getStageDone]"
        }
        
        protected setStageDone(val: number): void {
            throw "Method not implemented [setStageDone]"
        }
        
        protected getStagePassed(): boolean {
            throw "Method not implemented [getStagePassed]"
        }
        
        protected setStagePassed(passed: boolean): void {
            throw "Method not implemented [getStagePassed]"
        }
    }
    
    export class TutorialGamePlay<T extends GamePlayAction> extends CoreGamePlay<T, ScenarioAlgorithm> {
        
        protected onNewStep(): void {
            super.onNewStep();
            var scenarioStep: ScenarioStep = <ScenarioStep>this._algorithmStep;
            for(var messageKey of scenarioStep.messageKeys) {
                this._game.dispatch(
                    Events.GAME_SHOW_MESSAGE,
                    messageKey,
                    this
                );
            }
            this._algorithmStep = scenarioStep.realStep;
        };
        
        protected getStagePassEvent(): string {
            return Events.GAME_TUTORIAL_DONE;
        }
        
        protected getStageDone(): number {
            return this.levelSave.tutorialDone;
        }
        
        protected setStageDone(val: number): void {
            this.levelSave.tutorialDone = val;
        }
        
        protected getStagePassed(): boolean {
            return this.levelSave.tutorialPassed;
        }
        
        protected setStagePassed(passed: boolean): void {
            this.levelSave.tutorialPassed = passed;
        }
    }
    
    export class PractiseGamePlay<T extends GamePlayAction, A extends AbstractAlgorithm> extends CoreGamePlay<T, A> {

        protected _gameStepTimer: Phaser.Timer;
        protected _stepPerformed: boolean = false;
        
        constructor(game: Common.AlgoGame) {
            super(game);
            
            this._gameStepTimer = this._game.time.create(false);
            this._gameStepTimer.start();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    console.log("Play event received");
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    } 
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._gameStepTimer.pause();
                    break;
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    }                    
                    break;
            }
        }
        
        protected clickBox() {
        }
        
        protected checkStepAllowed(isUser: boolean): boolean {
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            
            if (isUser && this._stepPerformed) {
                console.log("Unable to make a second step");
                this._game.dispatch(Events.GAME_MULTI_STEP_DONE, this);
                return false;
            }
            
            this._stepPerformed = true;
            
            return true;
        }
        
        protected onNewStep(): void {
            super.onNewStep();
            this.addTimerEvents();
        };
        
        protected updateGameStatistics(isUser: boolean): void {
            if (!isUser) return;
            super.updateGameStatistics(isUser);
        }
        
        protected onLastStep(isUser: boolean): void {
            this._gameStepTimer.removeAll();
            super.onLastStep(isUser);
        }
        
        // True when practise done because of user actions during this game
        protected checkPractiseDone() {
            super.checkPractiseDone();
            this._stepPerformed = false;
        }
        
        protected addTimerEvents(): void {
            this._gameStepTimer.removeAll();
            this._gameStepTimer.repeat(this.stateConfig.stepTime, 0, this.clickBox, this);
        }
        
        destroy(): void {
            super.destroy();
            this._gameStepTimer.destroy();
        }
        
        protected destroyTempObjects():void {
          this._algorithm = null;
        }

        protected getStagePassEvent(): string {
            return Events.GAME_PRACTISE_DONE;
        }

        protected getStageDone(): number {
            return this.levelSave.practiseDone;
        }
        
        protected setStageDone(val: number): void {
            this.levelSave.practiseDone = val;
        }
        
        protected getStagePassed(): boolean {
            return this.levelSave.practisePassed;
        }
        
        protected setStagePassed(passed: boolean): void {
            this.levelSave.practisePassed = passed;
        }
    }
    
    export class ExamGamePlay<T extends GamePlayAction, A extends AbstractAlgorithm> extends PractiseGamePlay<T, A> {
        
        constructor(game: Common.AlgoGame) {
            super(game);
        }

        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_STOP);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.flushProgress();                    
                    break;
                case Events.CONTROL_PANEL_EVENT_STOP:
                    this.clickBox();
                    break;
            }
        }

        protected clickBox() {
            throw "No implementation for method [clickBox]";
        }

        protected checkStepAllowed(isUser: boolean): boolean {
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            
            return true;
        }
        
        protected updateGameStatistics(isUser: boolean): void {
            //In exam mode updates per iteration, not player action
        }
        
        protected onWrongStep(isUser: boolean): void {
            super.onWrongStep(isUser);
            this._game.dispatch(Events.GAME_EXAM_FAILED, this);
            this.flushProgress();
            super.onLastStep(isUser);
        }
        
        protected flushProgress(): void {
            if (!this.levelSave.examPassed) {
                this.levelSave.examDone = 0;
                this.saveState();
            }
        }
        
        protected onLastStep(isUser: boolean): void {

            if (isUser) {
                this.levelSave.examDone += 1;
            }

            super.onLastStep(isUser);
            
            if (this.levelSave.examPassed) {
                this.saveState();
            }
        }

        protected getStagePassEvent(): string {
            return Events.GAME_EXAM_DONE;
        }

        protected getStageDone(): number {
            return this.levelSave.examDone;
        }
        
        protected setStageDone(val: number): void {
            this.levelSave.examDone = val;
        }
        
        protected getStagePassed(): boolean {
            return this.levelSave.examPassed;
        }
        
        protected setStagePassed(passed: boolean): void {
            this.levelSave.examPassed = passed;
        }

    }

}
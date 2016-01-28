/// <reference path="./common.ts" />

module Common {   
    
    export interface GamePlayAction {}
    
    // Abstract algorithm step, represents single step of given algorithm.
    // Particular algorithm should use it of extend.
    export class AlgorithmStep {
        private _isLast: boolean = false;
        private _stepNumber: number = -1;
        
        constructor(isLast: boolean, stepNumber: number) {
            this._isLast = isLast;
            this._stepNumber = stepNumber;
        }
        
        public setIsLast(): void {
            this._isLast = true;
        }
        
        public get isLast(): boolean {
            return this._isLast;
        }
        
        public get stepNumber(): number {
            return this._stepNumber;
        }
    }
    
    export class Algorithm {
        
        private _steps: AlgorithmStep[] = [];
        private _lastRequestedStepNumber: number = -1;
        protected _sequence: any[];
        protected config: any;
        
        constructor(config: any) {
            this.config = config;
            this._sequence = this.generateSeqeunce(config);
            this._steps = this.runAlgorithm();
            this.updateLastStep();
        }
        
        protected runAlgorithm(): AlgorithmStep[] {
            return [];   
        }
        
        public getNextStep(): AlgorithmStep {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
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
        
        public get sequence(): any[] {
            return this._sequence;
        }
        
        protected getRandomSeqNumber(): number {
            return Algorithm.getRandomInteger(this.config.minSeqNumber, this.config.maxSeqNumber);
        }
        
        protected static getRandomInteger(from: number, to: number): number {
            return Math.floor(Math.random() * (to - from) + from);
        }
        
    }   
    
    export class PractiseGamePlay<T extends GamePlayAction, A extends Algorithm> extends Common.GameContainerWithStoreSupport {

        protected _algorithm: A;
        protected _algorithmStep: Common.AlgorithmStep;
        
        protected _gameStepTimer: Phaser.Timer;
        protected _stepPerformed: boolean = false;

        constructor(game: Common.AlgoGame) {
            super(game);
            
            this._gameStepTimer = this._game.time.create(false);
            this._gameStepTimer.start();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.initGame(true);
                    this.checkPractiseDone();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    console.log("Play event received");
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    } else {
                        if (this.isNotCurrentState(Common.LevelStageState.CREATED)) {
                            //non-first iteration
                            this.initGame(false);
                        }
                        this.startGame();
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._gameStepTimer.pause();
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
                Constants.STEP_TIME,
                this.stateConfig.stepsToPass,
                this.levelSave.practiseDone);
        }
        
        private startGame(): void {
            this.onNewStep();
            this._game.dispatch(Events.GAME_STARTED, this, 
                this.levelSave.practiseDone);

        }
        
        protected clickBox() {
        }
        
        protected boxClicked(action: T, isUser:boolean = true) {
            
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return;
            }
            
            if (isUser && this._stepPerformed) {
                console.log("Unable to make a second step");
                this._game.dispatch(Events.GAME_MULTI_STEP_DONE, this);
                return;
            }
            
            this._stepPerformed = true;

            var step: Common.AlgorithmStep = this._algorithmStep;
            
            if (this.isCorrectStep(action)) {
                this.onCorrectAction();
                this.updateGameStatistics(isUser);
                this._game.dispatch(
                    Events.GAME_CORRECT_STEP_DONE, 
                    this, 
                    [this.levelSave.practiseDone, isUser]);
                
                if (step.isLast) {
                    this.onLastStep();
                } else {
                    this.onNewStep();
                }
                this.checkPractiseDone();
                this._stepPerformed = false;

            } else {
                this._game.dispatch(Events.GAME_WRONG_STEP_DONE, this);
            }
        }
        
        protected onNewStep(): void {
            this._algorithmStep = this._algorithm.getNextStep();
            this.addTimerEvents();
        };
        
        protected onCorrectAction(): void {}
        
        protected isCorrectStep(action: T): boolean {
            return false;
        }
        
        
        protected updateGameStatistics(isUser: boolean): void {
            if (!isUser) return;
            
            this.levelSave.practiseDone += 1;
            this.saveState();
        }
        
        protected onLastStep(): void {
            this._gameStepTimer.removeAll();
            this._game.dispatch(Events.GAME_END, this, this.levelSave.practiseDone);
            console.log("Game finished");
        }
        
        // True when practise done because of user actions during this game
        protected checkPractiseDone() {
            if (this.stateConfig.stepsToPass <= this.levelSave.practiseDone) {
                this._game.dispatch(Events.GAME_PRACTISE_DONE, this, !this.levelSave.practisePassed);
                this.levelSave.practisePassed = true;
                this.saveState();
            }
        }
        
        protected addTimerEvents(): void {
            this._gameStepTimer.removeAll();
            this._gameStepTimer.repeat(Constants.STEP_TIME, 0, this.clickBox, this);
        }
        
        destroy(): void {
            super.destroy();
            this.destroyTempObjects();
            this._gameStepTimer.destroy();
        }
        
        protected destroyTempObjects():void {
          this._algorithm = null;
        }
    }
    
    export class ExamGamePlay<T extends GamePlayAction, A extends Algorithm>  extends PractiseGamePlay<T, A> {
        
        constructor(game: Common.AlgoGame) {
            super(game);
        }

        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.CONTROL_PANEL_EVENT_STOP);
        }

        protected createGamePlayInfo(): Common.GamePlayInfo {
            return  new Common.GamePlayInfo(
                Constants.STEP_TIME,
                this.stateConfig.stepsToPass, 
                this.levelSave.examDone);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_STOP:
                    /// put game fail here;
                    this.clickBox();
                    break;
            }
        }

        protected clickBox() {
            throw "No implementation for method [clickBox]";
        }

        protected boxClicked(action: T, isUser:boolean = true) {

            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return;
            }

            console.log("Box clicked [" + action + "]");

            var step: Common.AlgorithmStep = this._algorithmStep;

            if (this.isCorrectStep(action)) {
                this.onCorrectAction();
                this._game.dispatch(
                    Events.GAME_CORRECT_STEP_DONE,
                    this,
                    [this.levelSave.examDone, isUser]);

                if (step.isLast) {
                    this.onLastStep(1);
                } else {
                    this._algorithmStep = this._algorithm.getNextStep();
                    this.addTimerEvents();
                }
            } else {
                this._game.dispatch(Events.GAME_EXAM_FAILED, this, isUser);
                this.flushProgress();
                this.onLastStep();
            }
        }
        
        protected onCorrectAction(): void {
            throw "No implementation for method [onCorrectAction]";
        }

        protected flushProgress(): void {
            if (!this.levelSave.examPassed) {
                this.levelSave.examDone = 0;
            }
        }

        protected onLastStep(points: number = 0): void {
            this.levelSave.examDone += points;
            this._gameStepTimer.removeAll();
            this._game.dispatch(Events.GAME_END, this, this.levelSave.examDone);
            console.log("Game finished");

            if (!this.levelSave.examPassed && this.stateConfig.stepsToPass == this.levelSave.examDone) {
                this.levelSave.examPassed = true;
                this._game.dispatch(Events.GAME_EXAM_DONE, this);
            }
            
            if (this.levelSave.examPassed) {
                this.saveState();
            }
        }

    }

}
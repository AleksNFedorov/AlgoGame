/// <reference path="../../components/common.ts" />

module BinarySearch {
    
    export enum Operation {Less = 1, Greater = 2, Equals = 3, NotEquals = 4, Unknown = 5}

    class BinarySearchStep extends Common.Step {
        
        private _startIndex: number;
        private _endIndex: number;
        private _elementIndex: number;
        private _operation: Operation = Operation.Unknown;
      
        constructor(isLast: boolean, stepNumber: number,
                elementIndex: number,
                startIndex: number,
                endIndex: number,
                operation: Operation
            ) {
            super(isLast, stepNumber);
            this._startIndex = startIndex;
            this._endIndex = endIndex;
            this._elementIndex = elementIndex;
            this._operation = operation;
        }
        
        public get startIndex(): number {
            return this._startIndex;
        }
        
        public get endIndex(): number {
            return this._endIndex;  
        }
        
        public get elementIndex(): number {
            return this._elementIndex;  
        }
        
        public get operation(): Operation {
            return this._operation;  
        }
        
        public toString(): string {
          return "[" + this._elementIndex + "][" + this._startIndex + "][" + this._endIndex + "]";  
        }
        
    }
    
    class BinarySearchAlgorithm  {
        
        private _stepIndex: number = 0;
        private _sequence: number[];
        private _elementToFindIndex: number;
        private _nextStep: BinarySearchStep;
        
        constructor(config: any) {
            this._sequence = BinarySearchAlgorithm.generateSeqeunce(config);
            this._elementToFindIndex = this.defineElementToFind();
            
            this._nextStep = new BinarySearchStep(false, -1,  -1, 0, this._sequence.length - 1, Operation.Unknown)
        }
        
        public get nextStep(): BinarySearchStep {
            this._nextStep = this.evaluateNextStep();
            console.log("Next step - " + this._nextStep.toString());
            return this._nextStep;
        }
        
        private evaluateNextStep(): BinarySearchStep {

            if (this._nextStep.isLast) {
                return this._nextStep;
            }
            
            var step: BinarySearchStep = this._nextStep;
            this._stepIndex++;
        
            var pivotIndex: number = Math.floor((step.endIndex + step.startIndex) / 2);
            var pivotElement = this._sequence[pivotIndex];
            var elementToFind = this._sequence[this._elementToFindIndex];
        
            var nextStep: BinarySearchStep;
            if (pivotElement == elementToFind) {
                
                nextStep = new BinarySearchStep(true, this._stepIndex, 
                    pivotIndex, 
                    pivotIndex, 
                    pivotIndex, 
                    Operation.Equals);
                    
            } else if(step.startIndex == step.endIndex) {
                
        	    nextStep = new BinarySearchStep(true, this._stepIndex,
        	        pivotIndex, 
        	        pivotIndex,
        	        pivotIndex,
        	        Operation.NotEquals);
        	        
            } else if (pivotElement > elementToFind) {
                
                nextStep = new BinarySearchStep(false, this._stepIndex,
                    pivotIndex, 
                    step.startIndex, 
                    pivotIndex - 1, 
                    Operation.Less);
                
        	} else if(pivotElement < elementToFind) {
        	    
            	nextStep = new BinarySearchStep(false, this._stepIndex, 
            	pivotIndex, 
            	pivotIndex + 1, 
            	step.endIndex,
            	Operation.Greater);
            	
            } else {
            	console.log('Unknown state');
            }
        
            return nextStep;
        }

        private defineElementToFind(): number {
    
            var arrayMiddleElement = Math.floor(this._sequence.length/2);
            var index = -1;
            if (Math.random() > .5 ) {
                //Left side
                index = BinarySearchAlgorithm.getRandomInteger(0, Math.floor(arrayMiddleElement) - 2);
            } else {
                index = BinarySearchAlgorithm.getRandomInteger(Math.floor(arrayMiddleElement) + 2, this._sequence.length - 1);
            }
            
            return index;
        }

        public get sequence(): number[] {
          return this._sequence;  
        }
        
        public get elementToFindIndex(): number {
          return this._elementToFindIndex;  
        }
        
        private static generateSeqeunce(config: any): number[] {

            var varElements = config.maxElementsInSeq - config.minElementsInSeq;    
            var count = config.minElementsInSeq + this.getRandomInteger(0, varElements);
    
            var newGeneratedArray: number[] = [];
            
            for (var i = 0; i < count; i++) { 
                var y = BinarySearchAlgorithm.getRandomInteger(config.minSeqNumber, config.maxSeqNumber);
                newGeneratedArray.push(y);
            }
            
            newGeneratedArray.sort(function(a,b){return a-b;});
            
            return newGeneratedArray;
        }
        
        private static getRandomInteger(from: number, to: number): number {
            return Math.floor(Math.random() * (to - from) + from);
        }
        
    }
    
    class BoxContainer {
        
        constructor(
            public boxGroup: Phaser.Group, 
            public boxAndTextGroup: Phaser.Group
            ) {}
            
        destroy(): void {
          this.boxAndTextGroup.destroy();
        }
        
    }
    
    class BoxLine {
        
        private _boxes: BoxContainer[] = [];
        private _boxToFind: Phaser.Group;
        private _boxLine: Phaser.Group;
        private _game: Common.AlgoGame;
        private _boxClickedCallback: Function;
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[], elementToFindIndex: number) {
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence, elementToFindIndex);
        }
        
        private init(seqeunce: number[], elementToFindIndex: number) {
            this._boxLine = this._game.add.group();
            this._boxLine.x = 20;
            this._boxLine.y = 300;

            this._boxes = this.createBoxes(seqeunce);
            
            //Creating element to find box
            this._boxToFind = this.createElementToFindBox(seqeunce[elementToFindIndex]);
            this._boxToFind.x = 20;
            this._boxToFind.y = 200;
        }
        
        public hideBoxesOutOf(from: number, to: number) {
          
          for(var i = 0; i< this._boxes.length; ++i) {
              if (i < from || i > to) {
                this._boxes[i].boxGroup.alpha = 0.5;
              }
          }
        }
        
        public higlightBox(boxIndex: number) {
            var boxContainer: BoxContainer = this._boxes[boxIndex];
            var boxGroup: Phaser.Group = boxContainer.boxGroup;

            this._game.add.tween(boxGroup).to({y:boxGroup.y - 4}, 
                Constants.BS_BOX_HILIGHT_INTERVAL, 
                Phaser.Easing.Exponential.Out, true);
        }
        
        public selectBox(boxIndex: number) {
            this.higlightBox(boxIndex);
        }
        
        private createBoxes(seqeunce: number[]): BoxContainer[] {
            
            var boxes: BoxContainer[] = [];
            var boxInterval = 1000/seqeunce.length;
            
            for(var index = 0; index < seqeunce.length; ++index) {
                var boxContainer: BoxContainer = this.createBoxWithIndex(index, seqeunce[index]);
                this._boxLine.add(boxContainer.boxAndTextGroup);
                boxContainer.boxAndTextGroup.x = boxInterval * index;
                boxContainer.boxAndTextGroup.y = 0;
                
                boxes.push(boxContainer);
            }
            
            return boxes;
        }
        
        private createBoxWithIndex(index: number, value:number): BoxContainer {
            
            var boxAndTextGroup: Phaser.Group = this._game.add.group();
            
            var boxGroup = this._game.add.group();
            var box: Phaser.Sprite =  this._game.add.sprite(0,0, 'box');
            var boxKeyText: Phaser.Text = this._game.add.text(box.height/2, box.width/2 , "" + value, Constants.CONTROL_PANEL_MESSAGE_STYLE);
            boxKeyText.anchor.setTo(0.5);
            
            var boxIndexText: Phaser.Text = this._game.add.text(boxKeyText.x,  boxKeyText.y + 35 , "" + (index + 1), Constants.CONTROL_PANEL_MESSAGE_STYLE);
            boxKeyText.anchor.setTo(0.5);
            
            boxGroup.add(box);
            boxGroup.add(boxKeyText);
            boxAndTextGroup.add(boxGroup);
            boxAndTextGroup.add(boxIndexText);
            
            var boxClicked = this.createBoxClickCallback(index);
            
            box.inputEnabled = true;
            boxKeyText.inputEnabled = true;
            
            box.events.onInputDown.add(boxClicked);
            boxKeyText.events.onInputDown.add(boxClicked);
            
            return new BoxContainer(boxGroup, boxAndTextGroup);
        }
        
        private createElementToFindBox(value: number) {

            var boxGroup = this._game.add.group();

            var box: Phaser.Sprite =  this._game.add.sprite(0,0, 'box');
            var boxKeyText: Phaser.Text = this._game.add.text(box.height/2, box.width/2 , "" + value, Constants.CONTROL_PANEL_MESSAGE_STYLE);
            boxKeyText.anchor.setTo(0.5);
            
            boxGroup.add(box);
            boxGroup.add(boxKeyText);

            box.inputEnabled = true;
            boxKeyText.inputEnabled = true;
        
            return boxGroup;

        }
        
        private createBoxClickCallback(index: number): Function {
            return function() {
                this._boxClickedCallback(index);
            }.bind(this);
        }
        
        public destroy(): void {
            for(var box of this._boxes) {
                box.destroy();
            }
            
            this._boxes = [];
            this._boxLine.destroy();
            this._boxToFind.destroy();
        }
    }

    export class PractiseGamePlay extends Common.GameComponentContainer {

        protected _boxLine: BoxLine;
        protected _algorithm: BinarySearchAlgorithm;
        protected _algorithmStep: BinarySearchStep;
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
                    if (this._game.levelStageState == Common.LevelStageState.PAUSED) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    } else {
                        if (this._game.levelStageState != Common.LevelStageState.CREATED) {
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
            
            this._algorithm = new BinarySearchAlgorithm(this.stateConfig.gamePlay);
            
            this._boxLine = new BoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence, 
                this._algorithm.elementToFindIndex);
            
            console.log("Element to find index [" + this._algorithm.elementToFindIndex + "]");

            if (isGameCreate) {
                this._game.dispatch(
                    Events.GAME_CREATED, 
                    this,
                    this.createGamePlayInfo());
            }
        }

        protected createGamePlayInfo(): Common.GamePlayInfo {
            return  new Common.GamePlayInfo(
                Constants.BS_PR_STEP_TIME,
                this.stateConfig.stepsToPass,
                this.levelSave.practiseDone);
        }
        
        private startGame(): void {
            
            this._algorithmStep = this._algorithm.nextStep;
            this.addTimerEvents();
            this._game.dispatch(Events.GAME_STARTED, this, 
                this.levelSave.practiseDone);

        }
        
        protected clickBox() {
            this.boxClicked(this._algorithmStep.elementIndex, 0, false);
        }
        
        protected boxClicked(index: number, addToResult:number = 1, isUser:boolean = true) {
            
            if (this._game.levelStageState != Common.LevelStageState.RUNNING) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return;
            }
            
            if (isUser && this._stepPerformed) {
                console.log("Unable to make a step");
                this._game.dispatch(Events.GAME_MULTI_STEP_DONE, this);
                return;
            }
            
            this._stepPerformed = true;

            console.log("Box clicked [" + index + "]");
            
            var step: BinarySearchStep = this._algorithmStep;
            
            if (index == step.elementIndex) {
                this._boxLine.hideBoxesOutOf(step.startIndex, step.endIndex);
                this._boxLine.selectBox(step.elementIndex);
                this.updateGameStatistics(addToResult);
                this._game.dispatch(
                    Events.GAME_CORRECT_STEP_DONE, 
                    this, 
                    [this.levelSave.practiseDone, isUser]);
                
                if (step.isLast) {
                    this.onLastStep();
                } else {
                    this._algorithmStep = this._algorithm.nextStep;
                    this.addTimerEvents();
                }
                this.checkPractiseDone();

                this._stepPerformed = false;
            } else {
                this._game.dispatch(Events.GAME_WRONG_STEP_DONE, this);
            }
        }
        
        protected updateGameStatistics(addToResult: number): void {
            this.levelSave.practiseDone += addToResult;
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
            this._gameStepTimer.repeat(Constants.BS_PR_STEP_TIME, 0, this.clickBox, this);
        }
        
        destroy(): void {
            super.destroy();
            this.destroyTempObjects();
            this._gameStepTimer.destroy();
        }
        
        private destroyTempObjects():void {
          this._algorithm = null;
            if (this._boxLine != null) {
                this._boxLine.destroy();            
            }
        }
    }


    export class ExamGamePlay extends PractiseGamePlay {
        
        constructor(game: Common.AlgoGame) {
            super(game);
        }

        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.CONTROL_PANEL_EVENT_STOP);
        }

        protected createGamePlayInfo(): Common.GamePlayInfo {
            return  new Common.GamePlayInfo(
                Constants.BS_PR_STEP_TIME,
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
            this.boxClicked(-2, 0, false);
        }

        protected boxClicked(index: number, addToResult:number = 1, isUser:boolean = true) {

            if (this._game.levelStageState != Common.LevelStageState.RUNNING) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return;
            }

            console.log("Box clicked [" + index + "]");

            var step: BinarySearchStep = this._algorithmStep;

            if (index == step.elementIndex) {
                this._boxLine.hideBoxesOutOf(step.startIndex, step.endIndex);
                this._boxLine.selectBox(step.elementIndex);
                this._game.dispatch(
                    Events.GAME_CORRECT_STEP_DONE,
                    this,
                    [this.levelSave.examDone, isUser]);

                if (step.isLast) {
                    this.onLastStep(1);
                } else {
                    this._algorithmStep = this._algorithm.nextStep;
                    this.addTimerEvents();
                }
            } else {
                this._game.dispatch(Events.GAME_EXAM_FAILED, this, isUser);
                this.flushProgress();
                this.onLastStep();
            }
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

            if (this.stateConfig.stepsToPass == this.levelSave.examDone) {
                this.levelSave.examPassed = true;
                this._game.dispatch(Events.GAME_EXAM_DONE, this);
            }
            
            if (this.levelSave.examPassed) {
                this.saveState();
            }
        }

    }
}


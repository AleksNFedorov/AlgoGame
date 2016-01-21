/// <reference path="../../components/common.ts" />

module BinarySearch {
    
    export enum Operation {Less = 1, Greater = 2, Equals = 3, NotEquals = 4, Unknown = 5}

    
    export class BinarySearchAction implements Common.GamePlayAction {
        constructor(public index: number){};
    }

    class BinarySearchStep extends Common.AlgorithmStep {
        
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

    class BinarySearchAlgorithm extends Common.Algorithm {
        
        private _stepIndex: number = 0;
        private _elementToFindIndex: number;
        private _nextStep: BinarySearchStep;
        
        constructor(config: GameConfig.SequenceConfig) {
            super(config);
            this._elementToFindIndex = this.defineElementToFind();
            
            this._nextStep = new BinarySearchStep(false, -1,  -1, 0, this.sequence.length - 1, Operation.Unknown)
        }
        
        public getNextStep(): BinarySearchStep {
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
            var pivotElement = this.sequence[pivotIndex];
            var elementToFind = this.sequence[this._elementToFindIndex];
        
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
    
            var arrayMiddleElement = Math.floor(this.sequence.length/2);
            var index = -1;
            if (Math.random() > .5 ) {
                //Left side
                index = BinarySearchAlgorithm.getRandomInteger(0, Math.floor(arrayMiddleElement) - 2);
            } else {
                index = BinarySearchAlgorithm.getRandomInteger(Math.floor(arrayMiddleElement) + 2, this.sequence.length - 1);
            }
            
            return index;
        }

        public get elementToFindIndex(): number {
          return this._elementToFindIndex;  
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
                300, 
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
                this._boxClickedCallback(new BinarySearchAction(index));
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

    
    export class BinarySearchPractiseGamePlay extends Common.PractiseGamePlay<BinarySearchAction, BinarySearchAlgorithm> {
        
        protected _boxLine: BoxLine;
        
        protected onInit(): void {
            this._boxLine = new BoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence, 
                this._algorithm.elementToFindIndex);
        }

        
        protected createAlgorithm(config: any): BinarySearchAlgorithm {
            return new BinarySearchAlgorithm(config);
        }
        
        protected clickBox() {
            this.boxClicked(new BinarySearchAction(this.getCurrentStep().elementIndex), false);
        }

        protected isCorrectStep(action: BinarySearchAction): boolean {
            var step: BinarySearchStep = this.getCurrentStep();
            return action.index === step.elementIndex;
        }
        
        protected onCorrectAction(): void {
            var step: BinarySearchStep = this.getCurrentStep();
            this._boxLine.hideBoxesOutOf(step.startIndex, step.endIndex);
            this._boxLine.selectBox(step.elementIndex);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._boxLine != null) {
                this._boxLine.destroy();            
            }
        }
        
        protected getCurrentStep(): BinarySearchStep {
            return <BinarySearchStep>this._algorithmStep;
        }
    }

    
    export class BinarySearchExamGamePlay extends Common.ExamGamePlay<BinarySearchAction, BinarySearchAlgorithm> {
    
        protected _boxLine: BoxLine;
        
        protected onInit(): void {
            this._boxLine = new BoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence, 
                this._algorithm.elementToFindIndex);
        }

        
        protected createAlgorithm(config: any): BinarySearchAlgorithm {
            return new BinarySearchAlgorithm(config);
        }
        
        protected clickBox() {
            this.boxClicked(new BinarySearchAction(-2), false);
        }

        protected isCorrectStep(action: BinarySearchAction): boolean {
            var step: BinarySearchStep = this.getCurrentStep();
            return action.index === step.elementIndex;
        }
        
        protected onCorrectAction(): void {
            var step: BinarySearchStep = this.getCurrentStep();
            this._boxLine.hideBoxesOutOf(step.startIndex, step.endIndex);
            this._boxLine.selectBox(step.elementIndex);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._boxLine != null) {
                this._boxLine.destroy();            
            }
        }
        
        protected getCurrentStep(): BinarySearchStep {
            return <BinarySearchStep>this._algorithmStep;
        }        
    }
}


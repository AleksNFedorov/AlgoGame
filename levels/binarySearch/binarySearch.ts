/// <reference path="../../common.ts" />

module BinarySearch {
    
    export enum Operation {Less = 1, Greater = 2, Equals = 3, NotEquals = 4, Unknown = 5};

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
        };
        
        public get endIndex(): number {
            return this._endIndex;  
        };
        
        public get elementIndex(): number {
            return this._elementIndex;  
        };
        
        public get operation(): Operation {
            return this._operation;  
        };
        
    };
    
    class BinarySearchAlgorithm  {
        
        private _stepIndex: number = 0;
        private _sequence: number[];
        private _elementToFindIndex: number;
        private _nextStep: BinarySearchStep;
        
        constructor(count: number) {
            this._sequence = BinarySearchAlgorithm.generateSeqeunce(count);
            this._elementToFindIndex = this.defineElementToFind();
            
            this._nextStep = new BinarySearchStep(false, -1,  -1, 0, count - 1, Operation.Unknown)
        };
        
        public get nextStep(): BinarySearchStep {
            this._nextStep = this.evaluateNextStep();
            return this._nextStep;
        };
        
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
        };

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
        };
        
        public get elementToFindIndex(): number {
          return this._elementToFindIndex;  
        };
        
        private static generateSeqeunce(count: number): number[] {

                var newGeneratedArray: number[] = [];
                
                for (var i = 0; i < count; i++) { 
                    var y = BinarySearchAlgorithm.getRandomInteger(Constants.BS_MIN_SEQ_NUMBER, Constants.BS_MAX_SEQ_NUMBER);
                    newGeneratedArray.push(y);
                }
                
                newGeneratedArray.sort(function(a,b){return a-b;});
                
                return newGeneratedArray;
        };
        
        public static getRandomInteger(from: number, to: number): number {
            return Math.floor(Math.random() * (to - from) + from);
        }
        
    };
    
    class BoxContainer {
        
        constructor(
            public boxGroup: Phaser.Group, 
            public boxAndTextGroup: Phaser.Group
            ) {};
            
        destroy(): void {
          this.boxAndTextGroup.destroy();
        };
        
    }
    
    class BoxLine {
        
        private _boxes: BoxContainer[] = [];
        private _boxLine: Phaser.Group;
        private _game: AlgoGame;
        private _boxClickedCallback: Function;
        
        constructor(game: AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence);
        };
        
        private init(seqeunce: number[]) {
            this._boxLine = this._game.add.group();
            this._boxLine.x = 20;
            this._boxLine.y = 300;

            this._boxes = this.createBoxes(seqeunce);
        };
        
        public hideBoxesOutOf(from: number, to: number) {
          
          for(var i = 0; i< this._boxes.length; ++i) {
              if (i < from || i > to) {
                this._boxes[i].boxGroup.alpha = 0.5;
              }
          }
            
        };
        
        public higlightBox(boxIndex: number) {
            var boxContainer: BoxContainer = this._boxes[boxIndex];
            var boxGroup: Phaser.Group = boxContainer.boxGroup;

            this._game.add.tween(boxGroup).to({y:boxGroup.y - 5}, 400, Phaser.Easing.Exponential.Out, true);
        };
        
        public selectBox(boxIndex: number) {
            this._boxes[boxIndex].boxGroup.alpha = 0.2;
        };
        
        private createBoxes(seqeunce: number[]): BoxContainer[] {
            
            var boxes: BoxContainer[] = [];
            var boxInterval = 1000/seqeunce.length;
            
            for(var index = 0; index < seqeunce.length; ++index) {
                var boxContainer: BoxContainer = this.createBox(index, seqeunce[index]);
                this._boxLine.add(boxContainer.boxAndTextGroup);
                boxContainer.boxAndTextGroup.x = boxInterval * index;
                boxContainer.boxAndTextGroup.y = 0;
                
                boxes.push(boxContainer);
            }
            
            return boxes;
        };
        
        private createBox(index: number, value:number): BoxContainer {
            
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
        };
        
        private createBoxClickCallback(index: number): Function {
            return function() {
                this._boxClickedCallback(index);
            }.bind(this);
        };
        
        public destroy(): void {
            for(var box of this._boxes) {
                box.destroy();
            }
            
            this._boxes = [];
            this._boxLine.destroy();
        }
    }
    
    export class GamePlay extends Common.GameEventComponent {

        private _boxLine: BoxLine;
        private _algorithm: BinarySearchAlgorithm;
        
        constructor(game: AlgoGame) {
            super(game);
            this.addEventListener(Events.STAGE_INITIALIZED);
        };
        
        dispatchEvent(event: any, param1: any) {
            
            console.log("Menu event cought [" + event.type + "]");
            
            this._algorithm = new BinarySearchAlgorithm(14);
            
            this._boxLine = new BoxLine(this._game, this.boxClicked.bind(this), this._algorithm.sequence);
            
            console.log("Element to find index [" + this._algorithm.elementToFindIndex + "]");
        };
        
        public boxClicked(index: number) {
            console.log("Box clicked [" + index + "]");
            var step:BinarySearchStep = this._algorithm.nextStep;
            
            console.log(" Step data [" + step.elementIndex + "][" + step.startIndex + "][" + step.endIndex + "][" + step.isLast + "]");
            
            this._boxLine.higlightBox(step.elementIndex);
            this._boxLine.hideBoxesOutOf(step.startIndex, step.endIndex);
        };
        
        destroy(): void {
            super.destroy();
            
            if (this._boxLine != null) {
                this._boxLine.destroy();            
            };
        };
    };
}


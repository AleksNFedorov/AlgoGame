/// <reference path="../../components/common.ts" />

module Sort {


    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number, public position: number){};
    }

    export class Step extends Common.AlgorithmStep {
        private _elementIndex: number;
        private _newPosition: number;
      
        constructor(isLast: boolean, stepNumber: number,
                elementIndex: number,
                newPosition: number
            ) {
            super(isLast, stepNumber);
            this._elementIndex = elementIndex;
            this._newPosition = newPosition;
        }
        
        public get elementIndex(): number {
            return this._elementIndex;  
        }
        
        public get newPosition(): number {
            return this._newPosition;  
        }
        
        public toString(): string {
          return "[" + this.isLast + "][" + this.elementIndex + "][" + this.newPosition + "]";  
        }
    }
    
    class BinarySearchAlgorithm extends Common.Algorithm {
        
        private _stepIndex: number = 0;
        private _sequence: number[];
        private _elementToFindIndex: number;
        private _nextStep: BinarySearchStep;
        
        constructor(config: any) {
            super();
            this._sequence = Common.Algorithm.generateSeqeunce(config.minElementsInSeq, config.maxElementsInSeq, config.minSeqNumber, config.maxSeqNumber, true);
            this._elementToFindIndex = this.defineElementToFind();
            
            this._nextStep = new BinarySearchStep(false, -1,  -1, 0, this._sequence.length - 1, Operation.Unknown)
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
        
    }
    
}

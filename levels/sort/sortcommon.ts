/// <reference path="../../components/common.ts" />

module Sort {

    export enum Operation { Shift, Swap, Unknown};

    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number, public position: number){};
    }

    export class Step extends Common.AlgorithmStep {
        private _newPosition: number;
        private _operation: Operation.Unknown;
        private _currentArray: number[];
      
        constructor(stepNumber: number, newPosition: number, operation: Operation, array: number[]) {
            super(false, stepNumber);
            this._newPosition = newPosition;
            this._operation = operation;
            this._currentArray = array.slice(0);
        }
        
        public get newPosition(): number {
            return this._newPosition;  
        }
        
        public get operation(): Operation {
            return this._operation;
        }
        
        public toString(): string {
          return "[" + this.isLast + "][" + this.newPosition + "]";  
        }
    }
    
    class InsertionSortAlgorithm extends Common.Algorithm {
        
        private _steps: Step[] = [];
        private _lastRequestedStepNumber: number = -1;
        
        constructor(config: GameConfig.SequenceConfig) {
            super(config);
            this.runalgorithm();
            this.updateLastStep();
        }
        
        public getNextStep(): Step {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
        }
        
        private runalgorithm(): Step[] {
            
            var steps: Step[] = [];
            var values = this._sequence;
            
            var length = values.length;
            for(var i = 1; i < length; ++i) {
                var temp = values[i];
                var j = i - 1;
                for(; j >= 0 && values[j] > temp; --j) {
                    values[j+1] = values[j];
                }
                values[j+1] = temp;
                steps.push(new Step(i, j+1, Operation.Shift, values));
            }
            return steps;
        }
        
        private updateLastStep(): void {
            this._steps[this._steps.length - 1].setIsLast();
        }
    }
    
}

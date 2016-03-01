/// <reference path="sortcommon.ts" />

declare var mergeSortScenarios: any;

module Sort {

    class MergeSortAlgorithm extends Common.ConfigurableAlgorithm {
        
        private mergeSteps: Step[];
        
        constructor(config: any) {
            super(config);
        }
        
        protected runAlgorithm(): Step[] {
            
            this.mergeSteps = [];
            
            var values = this.sequence.slice(0);
            var indexedValues: ElementWithIndex[] = [];
            for(var i = 0; i < values.length; ++i) {
                indexedValues.push(new ElementWithIndex(values[i], i));
            }
            
            this.mergeSort(indexedValues, 0);
            
            return this.mergeSteps;
        }
        
        public getPivotElement(): number {
            return Math.floor(this.sequence.length/2);
        }
        
        public getSortingPairs(): number[] {
            
            var sortingPairs: number[] = [];
            for(var i = 0; i< this.getPivotElement(); i += 2) {
                sortingPairs.push(i);
            }
            
            for(var i = this.getPivotElement(); i< this.sequence.length; i += 2) {
                sortingPairs.push(i);
            }
            
            return sortingPairs;
        }
        
        private mergeSort(arr: ElementWithIndex[], startIndex: number): ElementWithIndex[] {
            
            if (arr.length < 2)
                return arr;
 
            var middle = Math.floor(arr.length / 2);
            var left   = arr.slice(0, middle);
            var right  = arr.slice(middle, arr.length);
 
          return this.merge(this.mergeSort(left, startIndex), this.mergeSort(right, startIndex + middle), startIndex);
        }
 
        private merge(left: ElementWithIndex[], right: ElementWithIndex[], startIndex: number): ElementWithIndex[] {
            
            var result: ElementWithIndex[] = [];
            
            while (left.length > 0 && right.length > 0) {
                if (left[0].value <= right[0].value) {
                    result.push(left.shift());
                } else {
                    var swapElement: ElementWithIndex = right.shift();
                    this.mergeSteps.push(new Step(swapElement.index, result.length + startIndex));
                    result.push(swapElement);
                }
            }
 
            while (left.length > 0) {
                result.push(left.shift());
            }
         
            while (right.length > 0) {
                result.push(right.shift());
            }
            
            //Reindex elements
            for(var i = 0; i<result.length ; ++i) {
                result[i].index = i + startIndex;
            }
         
            return result;
        }        
    }
    
    export class MergeSortTutorialGamePlay extends ShiftSortTutorialGamePlay<MergeSortAlgorithm> {
        
        protected createAlgorithm(config: any): MergeSortAlgorithm {
            return new MergeSortAlgorithm(config);
        }
        
        protected getScenarios(): any[] {
            return mergeSortScenarios.scenarios;
        }
        
        protected onInit(): void {
            super.onInit();

            var flags: Common.FlagLocationInfo[] = [];

            for(var index of this._algorithm.getSortingPairs()) {
                flags.push(new Common.FlagLocationInfo(
                    index,
                    Common.FlagPosition.LEFT,
                    Common.FlagLevel.MIDDLE
                    ));
            }
            this._boxLine.showFlags(flags);
            
        }
    }

    export class MergeSortPractiseGamePlay extends ShiftSortPractiseGamePlay<MergeSortAlgorithm> {
        
        protected createAlgorithm(config: any): MergeSortAlgorithm {
            return new MergeSortAlgorithm(config);
        }
        
        protected onInit(): void {
            super.onInit();

            var flags: Common.FlagLocationInfo[] = [];

            for(var index of this._algorithm.getSortingPairs()) {
                flags.push(new Common.FlagLocationInfo(
                    index,
                    Common.FlagPosition.LEFT,
                    Common.FlagLevel.MIDDLE
                    ));
            }
            this._boxLine.showFlags(flags);
            
        }
    }
    
    export class MergeSortExamGamePlay extends ShiftSortExamGamePlay<MergeSortAlgorithm> {
        protected createAlgorithm(config: any): MergeSortAlgorithm {
            return new MergeSortAlgorithm(config);
        }
        
        protected onInit(): void {
            super.onInit();

            var flags: Common.FlagLocationInfo[] = [];

            for(var index of this._algorithm.getSortingPairs()) {
                flags.push(new Common.FlagLocationInfo(
                    index,
                    Common.FlagPosition.LEFT,
                    Common.FlagLevel.MIDDLE
                    ));
            }
            this._boxLine.showFlags(flags);
            
        }
    }
}

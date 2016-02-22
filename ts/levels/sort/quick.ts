/// <reference path="sortcommon.ts" />

module Sort {

    class QuickSortAlgorithm extends Common.ConfigurableAlgorithm {
        
        private _mergeSteps: Step[];
        
        private _currentPivotIndex: number;
        private _currentLeft: number;
        private _currentRight: number;
        
        private _sortedFrom: number;
        private _sortedTo: number;

        constructor(config: any) {
            super(config);
        }
        
        protected runAlgorithm(): Step[] {
            
            this._mergeSteps = [];
            
            var values = this.sequence.slice(0);
            this.quickSort(values, 0, values.length - 1);
            
            for(var value of values) {
                console.log(`Value ${value}`)
            }
            
            return this._mergeSteps;
        }
        
        private quickSort(items: number[], left: number, right: number) {
            
            var index;
        
            if (items.length > 1) {
        
                index = this.partition(items, left, right);
                
                console.log(`Partition index [${index}]`);
        
                if (left < index - 1) {
                    this.quickSort(items, left, index - 1);
                    this._sortedFrom = left;
                    this._sortedTo = index - 1;
                }
        
                if (index < right) {
                    this.quickSort(items, index, right);
                    this._sortedFrom = index;
                    this._sortedTo = right;
                }
            }
            return items;
        }
        
        private partition(items: number[], left: number, right: number): number {
        
            console.log(`Partition ${items.length} - left [${left}], reight - [${right}]`);

            this._currentPivotIndex = Math.floor((right + left) / 2);
            this._currentLeft = left;
            this._currentRight = right;
            
            var pivot = items[this._currentPivotIndex];
            var i = left;
            var j = right;
            
            console.log(`Pivot ${pivot}`);
        
            while (i <= j) {
        
                while (items[i] < pivot) {
                    i++;
                }
        
                while (items[j] > pivot) {
                    j--;
                }
        
                if (i <= j) {
                    this.swap(items, i, j);
                    i++;
                    j--;
                }
            }
        
            return i;
        }        
                
        private swap(items: number[], firstIndex: number, secondIndex: number): void {
            console.log(`Swap ${items.length} - left [${firstIndex}][${items[firstIndex]}], reight - [${secondIndex}][${items[secondIndex]}]`);

            var temp = items[firstIndex];
            items[firstIndex] = items[secondIndex];
            items[secondIndex] = temp;
            
            if (firstIndex != secondIndex && items[firstIndex] != items[secondIndex]) {
                this._mergeSteps.push(new Step(firstIndex,secondIndex, [
                    this._currentPivotIndex,
                    this._currentLeft,
                    this._currentRight,
                    this._sortedFrom,
                    this._sortedTo
                    ]));
            }
            
        }
        
    }
    
    export class QuickSortPractiseGamePlay extends SwapSortPractiseGamePlay<QuickSortAlgorithm> {
        protected createAlgorithm(config: any): QuickSortAlgorithm {
            return new QuickSortAlgorithm(config);
        }
        
        protected onNewStep(): void {
            super.onNewStep();
            var step: Step = <Step>this._algorithmStep;
            
            this._boxLine.hideBoxesIn(step.parameters[3], step.parameters[4]);
            this._boxLine.clearFlags();
            
            var flags: Common.FlagLocationInfo[] = [];
            flags.push(new Common.FlagLocationInfo(
                step.parameters[0], 
                Common.FlagPosition.CENTER,
                Common.FlagLevel.BOTTOM
                ));
               
            flags.push(new Common.FlagLocationInfo(
                step.parameters[1], 
                Common.FlagPosition.LEFT,
                Common.FlagLevel.MIDDLE
                ));

            flags.push(new Common.FlagLocationInfo(
                step.parameters[2], 
                Common.FlagPosition.RIGHT,
                Common.FlagLevel.MIDDLE
                ));

            console.log(`Points to show ${step.parameters[0]}, ${step.parameters[1]}, ${step.parameters[2]}`);

            this._boxLine.showFlags(flags);
        }        
    }

    export class QuickSortExamGamePlay extends SwapSortExamGamePlay<QuickSortAlgorithm> {
        protected createAlgorithm(config: any): QuickSortAlgorithm {
            return new QuickSortAlgorithm(config);
        }
    }
}
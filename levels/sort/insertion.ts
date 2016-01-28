/// <reference path="sortcommon.ts" />

module Sort {

    class InsertionSortAlgorithm extends Common.Algorithm {
        
        constructor(config: any) {
            super(config);
        }
        
        protected runAlgorithm(): Step[] {
            
            var steps: Step[] = [];
            var values = this.sequence.slice(0);
            
            var length = values.length;
            for(var i = 1; i < length; ++i) {
                var temp = values[i];
                var j = i - 1;
                for(; j >= 0 && values[j] > temp; --j) {
                    values[j+1] = values[j];
                }
                values[j+1] = temp;
                
                if (i != (j + 1)) {
                    //No reason to keep speps with no changes
                    steps.push(new Step(i, j+1, values));
                }
            }
            return steps;
        }
        
    }
    
    export class InsertionSortPractiseGamePlay extends ShiftSortPractiseGamePlay<InsertionSortAlgorithm> {
        protected createAlgorithm(config: any): InsertionSortAlgorithm {
            return new InsertionSortAlgorithm(config);
        }
    }
    
    export class InsertionSortExamGamePlay extends ShiftSortExamGamePlay<InsertionSortAlgorithm> {
        protected createAlgorithm(config: any): InsertionSortAlgorithm {
            return new InsertionSortAlgorithm(config);
        }
    }
}

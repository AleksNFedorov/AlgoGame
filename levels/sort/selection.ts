/// <reference path="sortcommon.ts" />

module Sort {

    class SelectionSortAlgorithm extends Common.Algorithm {
        
        constructor(config: any) {
            super(config);
        }
        
        protected runAlgorithm(): Step[] {
            
            var steps: Step[] = [];
            var values = this.sequence.slice(0);
            
            var i, j, tmp, tmp2;
            for (i = 0; i < values.length - 1; i++) {
                tmp = i;
                for (j = i + 1; j < values.length; j++) {
                    if (values[j] < values[tmp])    {
                        tmp = j;
                    }
                }
                
                if(tmp!=i)  {
                    tmp2 = sortMe[tmp];
                    values[tmp] = values[i];
                    values[i] = tmp2;
                    steps.push(new Step(i, tmp, values));
                }
            }
            return steps;
        }
        
    }
    
    export class InsertionSortPractiseGamePlay extends SwapSortPractiseGamePlay<SelectionSortAlgorithm> {
        protected createAlgorithm(config: any): SelectionSortAlgorithm {
            return new SelectionSortAlgorithm(config);
        }
    }
    
    export class InsertionSortExamGamePlay extends SwapSortExamGamePlay<SelectionSortAlgorithm> {
        protected createAlgorithm(config: any): SelectionSortAlgorithm {
            return new SelectionSortAlgorithm(config);
        }
    }
}
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
                    tmp2 = values[tmp];
                    values[tmp] = values[i];
                    values[i] = tmp2;
                    steps.push(new Step(i, tmp, values));
                }
            }
            return steps;
        }
        
    }
    
    export class SelectionSortPractiseGamePlay extends SwapSortPractiseGamePlay<SelectionSortAlgorithm> {
        protected createAlgorithm(config: any): SelectionSortAlgorithm {
            return new SelectionSortAlgorithm(config);
        }
        
        protected onNewStep(): void {
            super.onNewStep();
            var step: Step = <Step>this._algorithmStep;
            
            this._boxLine.clearFlags();
            
            var flags: Common.FlagLocationInfo[] = [];
            flags.push(new Common.FlagLocationInfo(
                step.stepNumber, 
                Common.FlagPosition.CENTER,
                Common.FlagLevel.BOTTOM
                ));
               
            this._boxLine.showFlags(flags);
        }         
        
    }
    
    export class SelectionSortExamGamePlay extends SwapSortExamGamePlay<SelectionSortAlgorithm> {
        protected createAlgorithm(config: any): SelectionSortAlgorithm {
            return new SelectionSortAlgorithm(config);
        }
    }
}
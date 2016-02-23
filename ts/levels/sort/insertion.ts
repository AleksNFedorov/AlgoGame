/// <reference path="sortcommon.ts" />

declare var insertionSortScenarios: any;

module Sort {

    class InsertionSortAlgorithm extends Common.ConfigurableAlgorithm {
        
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
    
    export class InsertionSortTutorialGamePlay extends ShiftSortTutorialGamePlay<InsertionSortAlgorithm> {
        protected createAlgorithm(config: any): InsertionSortAlgorithm {
            return new InsertionSortAlgorithm(config);
        }
        
        protected getScenarios(): any[] {
            return insertionSortScenarios.scenarios;
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

    export class InsertionSortPractiseGamePlay extends ShiftSortPractiseGamePlay<InsertionSortAlgorithm> {
        protected createAlgorithm(config: any): InsertionSortAlgorithm {
            return new InsertionSortAlgorithm(config);
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
    
    export class InsertionSortExamGamePlay extends ShiftSortExamGamePlay<InsertionSortAlgorithm> {
        protected createAlgorithm(config: any): InsertionSortAlgorithm {
            return new InsertionSortAlgorithm(config);
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
}

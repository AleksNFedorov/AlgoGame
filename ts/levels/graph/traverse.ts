/// <reference path="graphcommon.ts" />

declare var depthFistSearchScenarios: any;

module Graph {
    
    class DebthFirstSearchAlgorithm extends AbstractTraverseAlgorithm {
        
        private _nodeToFind: GraphJS.Node;
        
        constructor(config: any) {
            super(config);
        }
        
        public restore(settings: any): void {
            super.restore(settings);
            this._nodeToFind = settings.nodeToFind;
        }
        
        protected runAlgorithm(): Common.AlgorithmStep[] {
            var algoSteps = [];
            this._nodeToFind = this.sequence[Common.Algorithm.getRandomInteger(1, this.sequence.length-1)];
            
            var nodes: GraphJS.Node[] = this._graph.getDFSTravaersal();
            for(var node of nodes) {
                algoSteps.push(new Common.AlgorithmStep(false, node.id));
                if (node.id === this._nodeToFind.id) {
                    break;
                }
            }
            
            return algoSteps;
        }
        
        public get nodeToFind(): GraphJS.Node {
            return this._nodeToFind;
        }
    }
    
    export class DebthFirstSearchTutorialGamePlay extends Common.TutorialGamePlay<GraphAction, DebthFirstSearchAlgorithm> {
        
        protected _graphUI: GraphUI;
        
        protected onInit(): void {
            super.onInit();
            this._graphUI = new GraphUI(this._game,     
                this._algorithm.sequence,
                this.boxClicked.bind(this),
                this._algorithm.nodeToFind,
                this._algorithm.columns
                );
        }
        
        protected tutorialNotifyStep(): void {
            var step = this.getCurrentStep();
            this._graphUI.blinkNode(step.stepNumber);
        }
        
        protected getScenarios(): any[] {
            return depthFistSearchScenarios.scenarios;
        }

        protected createAlgorithm(config: any): DebthFirstSearchAlgorithm {
            return new DebthFirstSearchAlgorithm(config);
        }
        
        protected isCorrectStep(action: GraphAction): boolean {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            return step.stepNumber === action.index; 
        }
        
        protected onCorrectAction(isUser:boolean): void {
            super.onCorrectAction(isUser);
            var step: Common.AlgorithmStep = this.getCurrentStep();
            this._graphUI.onNodeClicked(step.stepNumber);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._graphUI != null) {
                this._graphUI.destroy();            
            }
        }
        
        protected getCurrentStep(): Common.AlgorithmStep {
            return this._algorithmStep;
        }
    }
    
    export class DebthFirstSearchGamePlay extends Common.PractiseGamePlay<GraphAction, DebthFirstSearchAlgorithm> {
        
        protected _graphUI: GraphUI;
        
        protected onInit(): void {
            super.onInit();
            this._graphUI = new GraphUI(this._game,     
                this._algorithm.sequence,
                this.boxClicked.bind(this),
                this._algorithm.nodeToFind,
                this._algorithm.columns
                );
        }

        protected createAlgorithm(config: any): DebthFirstSearchAlgorithm {
            return new DebthFirstSearchAlgorithm(config);
        }
        
        protected clickBox() {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            this.boxClicked(new GraphAction(step.stepNumber), false);
            return false;
        }

        protected isCorrectStep(action: GraphAction): boolean {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            return step.stepNumber === action.index; 
        }
        
        protected onCorrectAction(isUser:boolean): void {
            super.onCorrectAction(isUser);
            var step: Common.AlgorithmStep = this.getCurrentStep();
            this._graphUI.onNodeClicked(step.stepNumber);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._graphUI != null) {
                this._graphUI.destroy();            
            }
        }
        
        protected getCurrentStep(): Common.AlgorithmStep {
            return this._algorithmStep;
        }
    }

    export class DebthFirstSearchExamGamePlay extends Common.ExamGamePlay<GraphAction, DebthFirstSearchAlgorithm> {
    
         protected _graphUI: GraphUI;
        
        protected onInit(): void {
            super.onInit();
            this._graphUI = new GraphUI(this._game,     
                this._algorithm.sequence,
                this.boxClicked.bind(this),
                this._algorithm.nodeToFind
                );
        }
        
        protected createAlgorithm(config: any): DebthFirstSearchAlgorithm {
            return new DebthFirstSearchAlgorithm(config);
        }
        
        protected clickBox() {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            this.boxClicked(new GraphAction(-1), false);
            return false;
        }

        protected isCorrectStep(action: GraphAction): boolean {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            return step.stepNumber === action.index; 
        }
        
        protected onCorrectAction(isUser:boolean): void {
            super.onCorrectAction(isUser);
            var step: Common.AlgorithmStep = this.getCurrentStep();
            this._graphUI.onNodeClicked(step.stepNumber);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._graphUI != null) {
                this._graphUI.destroy();            
            }
        }
        
        protected getCurrentStep(): Common.AlgorithmStep {
            return this._algorithmStep;
        }
    }
}

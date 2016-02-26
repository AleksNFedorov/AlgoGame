/// <reference path="graphcommon.ts" />
/// <reference path="../../lib/graph.d.ts" />

declare var djikstraScenarios: any;

module Graph {
    
    class DjikstraStep extends Common.AlgorithmStep {
        
        private _edge: GraphJS.Edge;
        private _weight: number;
        
        constructor(isLast: boolean, edge: GraphJS.Edge, weight: number) {
            super(isLast, edge.toNode.id);
            this._edge = edge;
            this._weight = weight;
        }
        
        public get weight(): number {
            return this._weight;
        }
        
        public get edge(): GraphJS.Edge {
            return this._edge;
        }
    }
    
    class DjikstraSearchAlgorithm extends AbstractTraverseAlgorithm {
        
        private _sourceNode: GraphJS.Node;
        private _destinationNode: GraphJS.Node;
        
        private _edgeSequence: number = 0;
        
        constructor(config: any) {
            super(config);
        }
        
        public restore(settings: any): void {
            super.restore(settings);
            this._sourceNode = this.sequence[0];
            this._destinationNode = settings.nodeToFind;
            this.indexEdges(this._sourceNode);
        }
        
        protected generateSeqeunce(config: any): any[] {
            var sequence = super.generateSeqeunce(config);
            this.addExtraEdges();
            return sequence;
        }
       
        private addExtraEdges(): void {

           var fromNode: GraphJS.Node;
           var toNode: GraphJS.Node;
           
           for(var row = 0; row < this._rows; ++row) {
               fromNode = null;
               for(var col = 0; col < this._columns; ++col) {
                   var currentNode = this._presenceMatrix[col][row]; 
                   if ( currentNode != null) {
                       if (fromNode != null) {
                            if (this.needCreate()) {
                                this.addEdge(fromNode, currentNode);
                                console.log(`extra edge has been added ${fromNode.name} - ${currentNode.name}`)
                            }                       
                       }
                       fromNode = currentNode
                   }
               }
           }
        }

        protected runAlgorithm(): DjikstraStep[] {
            var algoSteps:DjikstraStep[] = [];
            this._sourceNode = this.sequence[0];
            this._destinationNode = this.defineDestinationNode();
            
            var djikstraResult: GraphJS.DjikstraResult = this._graph.dijkstra(this._sourceNode, this._destinationNode);
            
            this.indexEdges(this._sourceNode);
            
            for(var step of djikstraResult.steps) {
                algoSteps.push(new DjikstraStep(false, step.edge, step.weight));
            }
            
            return algoSteps;
        }
        
        private indexEdges(node: GraphJS.Node): void {
            for(var edge of node.getAdjList()) {
                if (edge.id >= 0) {
                    continue;
                }
                edge.id = this._edgeSequence++;
                if (edge.toNode.getAdjList().length > 0) {
                    this.indexEdges(edge.toNode);
                }
            }
        }
        
        public defineDestinationNode(): GraphJS.Node {
            //Get random node from all bottom nodes
            var bottomNodes: GraphJS.Node[] = [];
            for(var node of this.sequence) {
                if (node.y == (this._rows - 1)) {
                    bottomNodes.push(node);
                }
            }
            return Phaser.ArrayUtils.getRandomItem(bottomNodes);
        }
        
        public get sourceNode(): GraphJS.Node {
            return this._sourceNode;
        }

        public get destinationNode(): GraphJS.Node {
            return this._destinationNode;
        }
    }
    
    class DjikstraGraphUI extends Graph.GraphUI {
        
        private _edgeWitghtText: EdgeUI[];
        private _extraStepCallback: Function;
        
        private _numberLine: Phaser.Group;
        
        constructor(game: Common.AlgoGame, nodes: GraphJS.Node[], 
            nodeClickedCallback: Function, 
            sourceNode: GraphJS.Node,
            destinationNode: GraphJS.Node,
            extraStepCallback: Function) {
        
            super(game, nodes, nodeClickedCallback, sourceNode);
            this._nodes[sourceNode.id].setState(Common.BoxState.SELECTED_GREEN);
            this._nodes[destinationNode.id].setState(Common.BoxState.SELECTED_ORANGE);
            this._extraStepCallback = extraStepCallback;
        }
        
        protected init(nodes: GraphJS.Node[]): void {
            this._edgeWitghtText = [];
            super.init(nodes);
        }
        
        protected createNode(node: GraphJS.Node): Common.BoxContainer {
            return new Common.CircleBoxContainer(this._game, "", this.createNodeClickCallback(node.id), function(){});
        }
        
        public showExtraNumbers(step: DjikstraStep): void {
            var targetNode = this._nodes[step.edge.toNode.id];
            var nodeText: Phaser.Text = <Phaser.Text>targetNode.children[1];
            var currentWeight = parseInt(nodeText.text || "0");
            var edgeWeight = step.edge.weight;
            var stepWeight = step.weight;
            
            if (stepWeight == currentWeight) {
                currentWeight = stepWeight + Common.Algorithm.getRandomInteger(1, 5);
            } 
            
            if (stepWeight == edgeWeight) {
                edgeWeight = edgeWeight + Common.Algorithm.getRandomInteger(1, 5);
            }
            
            this._numberLine = this.createNumberBoxes([
                edgeWeight,
                currentWeight,
                stepWeight]);
            this._numberLine.x = targetNode.worldPosition.x + targetNode.width + 10;
            this._numberLine.y = targetNode.worldPosition.y;
        }
        
        private createNumberBoxes(numbers: number[]): Phaser.Group {
            var numberLine = this._game.add.group();
            Phaser.ArrayUtils.shuffle(numbers);
            for(var i = 0; i< numbers.length; ++i) {
                var value = numbers[i];
                var boxContainer = this.createNumberBox(value);
                numberLine.add(boxContainer);
                boxContainer.x = 33 * i;
            }
            
            return numberLine;
        }
        
        private createNumberBox(boxValue: number): Common.BoxContainer {
            var boxContainer: Common.BoxContainer = new Common.CircleBoxContainerMedium(
                this._game,
                boxValue, 
                this.numberBoxPressed.bind(this)
            );
            
            boxContainer.setBoxIndex(boxValue);
            boxContainer.setState(Common.BoxState.SELECTED_BLUE);
            return boxContainer;
        }
        
        private numberBoxPressed(boxValue: number) {
            this._extraStepCallback(boxValue);
            this._numberLine.destroy();
        }
        
        public clearState(): void {
            if (this._numberLine != null) {
                this._numberLine.destroy();
            }
        }
        
        public higlightEdge(step: DjikstraStep): void {
            this._edgeWitghtText[step.edge.id].highlightEdge();
        }

        public updateNodeWeight(step: DjikstraStep): void {
            this._edgeWitghtText[step.edge.id].stopHiglightingEdge();
            var node = this._nodes[step.stepNumber];
            node.setBoxText("" + step.weight);
        }

        protected drawEdge(edge: GraphJS.Edge): EdgeUI {
            var newEdge = new EdgeUI(this._game, edge);
            this._edgeWitghtText[edge.id] = newEdge;
            return newEdge;
        }
        
        public destroy(): void {
            super.destroy();
            this.clearState();
        }
    }
    
    class DjikstraGamePlayAction extends GraphAction {
        
        private _weight: number;
        
        constructor(index: number, weight: number) {
            super(index);
            this._weight = weight;
        }

        public get weight(): number {
            return this._weight;
        }
    }
    
    export class DjikstraTutorialGamePlay extends Common.TutorialGamePlay<DjikstraGamePlayAction, DjikstraSearchAlgorithm> {
        
        protected _graphUI: DjikstraGraphUI;
        
        protected onInit(): void {
            super.onInit();
            this._graphUI = new DjikstraGraphUI(this._game,     
                this._algorithm.sequence,
                this.clickNode.bind(this),
                this._algorithm.sourceNode,
                this._algorithm.destinationNode,
                this.extraStepAction.bind(this)
            );
        }
        
        protected getScenarios(): any[] {
            return djikstraScenarios.scenarios;
        }
        
        protected createAlgorithm(config: any): DjikstraSearchAlgorithm {
            return new DjikstraSearchAlgorithm(config);
        }
        
        protected onNewStep(): void {
            super.onNewStep();
            var step: DjikstraStep = this.getCurrentStep();
            
            this._graphUI.clearState();
            this._graphUI.higlightEdge(step);
        };
        
        private clickNode(action: GraphAction): void {
        
            if (!this.checkStepAllowed(true)) {
                return;
            }
            
            var step: DjikstraStep = this.getCurrentStep();
            if (step.stepNumber === action.index) {
                //show extra step
                this._graphUI.showExtraNumbers(step);
            } 
        }
        
        private extraStepAction(value: number) {
            console.log(`Extra step action ${value}`);
            var step: DjikstraStep = this.getCurrentStep();
            if (step.weight === value) {
                this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, step.weight), true);
            } else {
                this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, -1), true);
            }
        }

        protected isCorrectStep(action: DjikstraGamePlayAction): boolean {
            var step: DjikstraStep = this.getCurrentStep();
            return step.stepNumber === action.index
                && step.weight === action.weight;
        }
        
        protected onCorrectAction(isUser:boolean): void {
            super.onCorrectAction(isUser);
            var step: DjikstraStep = this.getCurrentStep();
            this._graphUI.updateNodeWeight(step);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._graphUI != null) {
                this._graphUI.destroy();            
            }
        }
        
        protected getCurrentStep(): DjikstraStep {
            return <DjikstraStep>this._algorithmStep;
        }
    }
    
    export class DjikstraGamePlay extends Common.PractiseGamePlay<DjikstraGamePlayAction, DjikstraSearchAlgorithm> {
        
        protected _graphUI: DjikstraGraphUI;
        
        protected onInit(): void {
            super.onInit();
            this._graphUI = new DjikstraGraphUI(this._game,     
                this._algorithm.sequence,
                this.clickNode.bind(this),
                this._algorithm.sourceNode,
                this._algorithm.destinationNode,
                this.extraStepAction.bind(this)
            );
        }
        
        protected createAlgorithm(config: any): DjikstraSearchAlgorithm {
            return new DjikstraSearchAlgorithm(config);
        }
        
        protected onNewStep(): void {
            super.onNewStep();
            var step: DjikstraStep = this.getCurrentStep();
            
            this._graphUI.clearState();
            this._graphUI.higlightEdge(step);
        };
        
        
        protected clickBox() {
            var step: DjikstraStep = this.getCurrentStep();
            this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, step.weight), false);
            return false;
        }
        
        private clickNode(action: GraphAction): void {
        
            if (!this.checkStepAllowed(true)) {
                return;
            }
            
            this._stepPerformed = false;
        
            var step: DjikstraStep = this.getCurrentStep();
            if (step.stepNumber === action.index) {
                //show extra step
                this._graphUI.showExtraNumbers(step);
            } else {
                this.boxClicked(new DjikstraGamePlayAction(action.index, -1), true);
            }
        }
        
        private extraStepAction(value: number) {
            console.log(`Extra step action ${value}`);
            var step: DjikstraStep = this.getCurrentStep();
            if (step.weight === value) {
                this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, step.weight), true);
            } else {
                this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, -1), true);
            }
        }

        protected isCorrectStep(action: DjikstraGamePlayAction): boolean {
            var step: DjikstraStep = this.getCurrentStep();
            return step.stepNumber === action.index
                && step.weight === action.weight;
        }
        
        protected onCorrectAction(isUser:boolean): void {
            super.onCorrectAction(isUser);
            var step: DjikstraStep = this.getCurrentStep();
            this._graphUI.updateNodeWeight(step);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._graphUI != null) {
                this._graphUI.destroy();            
            }
        }
        
        protected getCurrentStep(): DjikstraStep {
            return <DjikstraStep>this._algorithmStep;
        }
    }
    
    export class DjikstraExamGamePlay extends Common.ExamGamePlay<DjikstraGamePlayAction, DjikstraSearchAlgorithm> {
    
       protected _graphUI: DjikstraGraphUI;
        
        protected onInit(): void {
            super.onInit();
            this._graphUI = new DjikstraGraphUI(this._game,     
                this._algorithm.sequence,
                this.clickNode.bind(this),
                this._algorithm.sourceNode,
                this._algorithm.destinationNode,
                this.extraStepAction.bind(this)
            );
        }
        
        protected createAlgorithm(config: any): DjikstraSearchAlgorithm {
            return new DjikstraSearchAlgorithm(config);
        }
        
        protected onNewStep(): void {
            super.onNewStep();
            var step: DjikstraStep = this.getCurrentStep();
            
            this._graphUI.clearState();
            this._graphUI.higlightEdge(step);
        };
        
        
        protected clickBox() {
            this.boxClicked(new DjikstraGamePlayAction(-1, -1), false);
        }
        
        private clickNode(action: GraphAction): void {
        
            var step: DjikstraStep = this.getCurrentStep();
            if (step.stepNumber === action.index) {
                //show extra step
                this._graphUI.showExtraNumbers(step);
            } else {
                this.boxClicked(new DjikstraGamePlayAction(action.index, -1), true);
            }
        }
        
        private extraStepAction(value: number) {
            console.log(`Extra step action ${value}`);
            var step: DjikstraStep = this.getCurrentStep();
            if (step.weight === value) {
                this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, step.weight), true);
            } else {
                this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, -1), true);
            }
        }

        protected isCorrectStep(action: DjikstraGamePlayAction): boolean {
            var step: DjikstraStep = this.getCurrentStep();
            return step.stepNumber === action.index
                && step.weight === action.weight;
        }
        
        protected onCorrectAction(): void {
            var step: DjikstraStep = this.getCurrentStep();
            this._graphUI.updateNodeWeight(step);
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._graphUI != null) {
                this._graphUI.destroy();            
            }
        }
        
        protected getCurrentStep(): DjikstraStep {
            return <DjikstraStep>this._algorithmStep;
        }
    }
}

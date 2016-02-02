/// <reference path="graphcommon.ts" />
/// <reference path="../../lib/graph.d.ts" />

module Graph {
    
    class DjikstraStep extends Common.AlgorithmStep {
        
        private _weight: number;
        
        constructor(isLast: boolean, index: number, weight: number) {
            super(isLast, index);
            this._weight = weight;
        }
        
        public get weight(): number {
            return this._weight;
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
    
    class DjikstraSearchAlgorithm extends AbstractTraverseAlgorithm {
        
        private _sourceNode: GraphJS.Node;
        private _destinationNode: GraphJS.Node;
        
        constructor(config: any) {
            super(config);
        }
        
        protected generateSeqeunce(config: any): any[] {

            var sequence = super.generateSeqeunce(config);
            this.addExtraEdges();
            return sequence;
        }
       
        private addExtraEdges(): void {
           var rows = this._presenceMatrix[0].length;
           var cols = this._presenceMatrix.length;
           
           var fromNode: GraphJS.Node;
           var toNode: GraphJS.Node;
           
           for(var row = 0; row < rows; ++row) {
               fromNode = null;
               for(var col = 0; col < cols; ++col) {
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
            this._sourceNode = this._sequence[0];
            this._destinationNode = this._sourceNode;
            
            while(this._sourceNode === this._destinationNode) {
                this._destinationNode = this._sequence[Common.Algorithm.getRandomInteger(1, this._sequence.length-1)];
            }                
            
            var djikstraResult: GraphJS.DjikstraResult = this._graph.dijkstra(this._sourceNode, this._destinationNode);
            for(var step of djikstraResult.steps) {
                console.log(`Step ${step.node.id} - weight ${step.weight}`);
                algoSteps.push(new DjikstraStep(false, step.node.id, step.weight));
            }
            
            return algoSteps;
        }
        
        public get sourceNode(): GraphJS.Node {
            return this._sourceNode;
        }

        public get destinationNode(): GraphJS.Node {
            return this._destinationNode;
        }

    }
    
    class DjikstraGraphUI extends Graph.GraphUI {
        
        private _edgeWitghtText: Phaser.Text[];
        
        constructor(game: Common.AlgoGame, nodes: GraphJS.Node[], 
            nodeClickedCallback: Function, 
            sourceNode: GraphJS.Node,
            destinationNode: GraphJS.Node) {
        
            super(game, nodes, nodeClickedCallback, sourceNode);
            this._nodes[destinationNode.id].alpha = 0.2;
        }
        
        protected init(nodes: GraphJS.Node[]): void {
            this._edgeWitghtText = [];
            super.init(nodes);
        }
        
        public updateNodeWeight(index: number, weight: number): void {
            var node = this._nodes[index];
            var nodeText: Phaser.Text = <Phaser.Text>node.children[1];
            nodeText.text = "" + weight;
        }
        
        protected drawEdge(parent: GraphJS.Node, child: GraphJS.Node, weight: number): void {
            super.drawEdge(parent, child, weight);
            var parentPoint = this.getNodeScreenCoordinates(parent);
            var childPoint = this.getNodeScreenCoordinates(child);
            
            var xDiff = childPoint.x - parentPoint.x;
            var yDiff = childPoint.y - parentPoint.y;
            
            var wightTextX = parentPoint.x + xDiff * 0.85;
            var wightTextY = parentPoint.y + yDiff * 0.85;
            
            var edgeWeightText: Phaser.Text = this._game.add.text(wightTextX, wightTextY, "" + weight , Constants.CONTROL_PANEL_MESSAGE_STYLE);
            edgeWeightText.anchor.setTo(0.5);
            this._edgeWitghtText.push(edgeWeightText);
        }
        
        public destroy(): void {
            super.destroy();
            for(var text of this._edgeWitghtText) {
                text.destroy();
            }
        }
    }
    
    export class DjikstraGamePlay extends Common.PractiseGamePlay<DjikstraGamePlayAction, DjikstraSearchAlgorithm> {
        
        protected _graphUI: DjikstraGraphUI;
        
        protected onInit(): void {
            this._graphUI = new DjikstraGraphUI(this._game,     
                this._algorithm.sequence,
                this.boxClicked.bind(this),
                this._algorithm.sourceNode,
                this._algorithm.destinationNode
            );
        }
        
        protected createAlgorithm(config: any): DjikstraSearchAlgorithm {
            return new DjikstraSearchAlgorithm(config);
        }
        
        protected clickBox() {
            var step: DjikstraStep = this.getCurrentStep();
            this.boxClicked(new DjikstraGamePlayAction(step.stepNumber, step.weight), false);
            return false;
        }

        protected isCorrectStep(action: DjikstraGamePlayAction): boolean {
            var step: DjikstraStep = this.getCurrentStep();
            return step.stepNumber === action.index
                && step.weight === action.weight;
        }
        
        protected onCorrectAction(): void {
            var step: DjikstraStep = this.getCurrentStep();
            this._graphUI.updateNodeWeight(step.stepNumber, step.weight);
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
    
        protected _graphUI: GraphUI;
        
        protected onInit(): void {
            this._graphUI = new DjikstraGraphUI(this._game,     
                this._algorithm.sequence,
                this.boxClicked.bind(this),
                this._algorithm.sourceNode,
                this._algorithm.destinationNode
            );
        }
        
        protected createAlgorithm(config: any): DjikstraSearchAlgorithm {
            return new DjikstraSearchAlgorithm(config);
        }
        
        protected clickBox() {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            this.boxClicked(new DjikstraGamePlayAction(-1, -1), false);
            return false;
        }

        protected isCorrectStep(action: DjikstraGamePlayAction): boolean {
            var step: DjikstraStep = this.getCurrentStep();
            return step.stepNumber === action.index
                && step.weight === action.weight;
        }
        
        protected onCorrectAction(): void {
            var step: DjikstraStep = this.getCurrentStep();
            this._graphUI.onNodeClicked(step.stepNumber);
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

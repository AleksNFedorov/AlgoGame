/// <reference path="graphcommon.ts" />
/// <reference path="../../lib/graph.d.ts" />

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
        
        private _columns: number;
        private _rows: number;
        
        private _edgeSequence: number;
        
        constructor(config: any) {
            super(config);
        }
        
        protected generateSeqeunce(config: any): any[] {

            this._columns = config.columns;
            this._rows = config.rows;
            this._edgeSequence = 0;

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
            this._sourceNode = this._sequence[0];
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
    
    class EdgeUI {
        constructor(public edge: GraphJS.Edge, public text:Phaser.Text){}
    }
    
    class DjikstraGraphUI extends Graph.GraphUI {
        
        private _edgeWitghtText: EdgeUI[];
        
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
        
        protected drawEdge(edge: GraphJS.Edge): void {
            super.drawEdge(edge);
            var parentPoint = this.getNodeScreenCoordinates(edge.fromNode);
            var childPoint = this.getNodeScreenCoordinates(edge.toNode);
            
            var xDiff = childPoint.x - parentPoint.x;
            var yDiff = childPoint.y - parentPoint.y;
            
            var wightTextX = parentPoint.x + xDiff * 0.85;
            var wightTextY = parentPoint.y + yDiff * 0.85;
            
            var edgeWeightText: Phaser.Text = this._game.add.text(wightTextX, wightTextY, "" + edge.weight , Constants.CONTROL_PANEL_MESSAGE_STYLE);
            edgeWeightText.anchor.setTo(0.5);
            this._edgeWitghtText.push(new EdgeUI(edge, edgeWeightText));
        }
        
        public destroy(): void {
            super.destroy();
            for(var edgeUI of this._edgeWitghtText) {
                edgeUI.text.destroy();
            }
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
            this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, step.weight), false);
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
            var step: DjikstraStep = this.getCurrentStep();
            this.boxClicked(new DjikstraGamePlayAction(step.edge.toNode.id, step.edge.weight), false);
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

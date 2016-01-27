/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />
/// <reference path="../../lib/graph.d.ts" />

module Graph {

    export class GraphAction implements Common.GamePlayAction {
        constructor(public index: number){};
    }
    
    class AbstractTraverseAlgorithm extends Common.Algorithm {
       
       private _presenceMatrix: GraphJS.Node[][];
       private _workSeqeunce: GraphJS.Node[];
       protected _graph: GraphJS.Graph;
       
       constructor(config: any) {
           super(config);
       }
       
       protected generateSeqeunce(config: any): any[] {
           
           this._presenceMatrix = [];
           this._workSeqeunce = [];
           
           for(var column = 0; column < config.columns; column++) {
            this._presenceMatrix[column] = [];
           }
           
           this._graph = new GraphJS.Graph();
           
           var topVertex = this.addNode(2,0);
           this.createChildVertexes(topVertex);
           
           return this._workSeqeunce;
       }
       
       protected addEdge(from: GraphJS.Node, to: GraphJS.Node): void {
            var edgeValue = this.getRandomSeqNumber();
            from.addEdge(to, edgeValue);
       }
       
       protected addNode(x, y, parent?: GraphJS.Node): GraphJS.Node {
            var nodeValue = this.getRandomSeqNumber();
            var newNode: GraphJS.Node = new GraphJS.Node("" + nodeValue);
            newNode.x = x;
            newNode.y = y;
            newNode.id = this._workSeqeunce.length;
               
            this._workSeqeunce.push(newNode);
            this._presenceMatrix[x][y] = newNode;

            this._graph.addNode(newNode);            
            
            if (parent) {
                this.addEdge(parent, newNode);
            }
            return newNode;
       }
       
       protected createChildVertexes(parent: GraphJS.Node): void {
           
            if (parent.y >= (this.config.rows - 1)) {
               return;
            }
           
            //under and left
            if (parent.x > 0 && this.canAddNewVertex(parent.x - 1, parent.y + 1)) {
                this.createChildVertexes(this.addNode(parent.x - 1, parent.y + 1, parent));
            }
            
            //under
            if (this.canAddNewVertex(parent.x,parent.y + 1)) {
                this.createChildVertexes(this.addNode(parent.x, parent.y + 1, parent));
            }
            
            //under and right
            if (parent.x < (this.config.columns - 1) && this.canAddNewVertex(parent.x + 1, parent.y + 1)) {
                this.createChildVertexes(this.addNode(parent.x + 1, parent.y + 1, parent));
            }

       }
       
       private canAddNewVertex(x: number, y: number): boolean {
           return this._presenceMatrix[x][y] == null && Common.Algorithm.getRandomInteger(0, 3) > 0;
       }
    }
    
    class DebthFirstSearchAlgorithm extends AbstractTraverseAlgorithm {
        
        private _nodeToFind: GraphJS.Node;
        
        constructor(config: any) {
            super(config);
        }
        
        protected runAlgorithm(): Common.AlgorithmStep[] {
            var algoSteps = [];
            this._nodeToFind = this._sequence[Common.Algorithm.getRandomInteger(1, this._sequence.length-1)];
            
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
    
    class GraphUI {
        
        private TOP_LEFT_X: number = 150;
        private TOP_LEFT_Y: number = 100;
        private STEP_X: number = 110;
        private STEP_Y: number = 80;
        
        private _game: Common.AlgoGame;
        private _nodeClickedCallback: Function;
        private _nodes: Phaser.Group[] = [];        
        
        private _nodeToFind: Phaser.Group;
        private _graphics: Phaser.Graphics;
        
        constructor(game: Common.AlgoGame, nodes: GraphJS.Node[], nodeClickedCallback: Function, nodeToFind: GraphJS.Node) {
            this._game = game;
            this._nodeClickedCallback = nodeClickedCallback;
            this.init(nodes);
            
            this._nodeToFind = this.createNode(nodeToFind, false);
            this._nodeToFind.x = 50;
            this._nodeToFind.y = 100;
            
            this.onNodeClicked(nodeToFind.id);
            
        }
        
        private init(nodes: GraphJS.Node[]): void {
            
            this._graphics = this._game.add.graphics(0, 0);
            
            for(var node of nodes) {
                this._nodes.push(this.createNode(node));               
            }
        }
        
        private createNode(node: GraphJS.Node, drawEdges: boolean = true): Phaser.Group {
            
            if (drawEdges) {
                this.drawEdges(node);
            }
            
            var nodeGroup = this._game.add.group();
            
            var box: Phaser.Sprite = this._game.add.sprite(0,0, 'box');
            box.scale.setTo(0.7);
            var boxKeyText: Phaser.Text = this._game.add.text(box.height/2, box.width/2 , node.name, Constants.CONTROL_PANEL_MESSAGE_STYLE);
            boxKeyText.anchor.setTo(0.5);

            
            box.inputEnabled = true;
            box.events.onInputDown.add(this.createNodeClickCallback(node.id));

            boxKeyText.inputEnabled = true;
            boxKeyText.events.onInputDown.add(this.createNodeClickCallback(node.id));
            
            nodeGroup.add(box);
            nodeGroup.add(boxKeyText);
            
            var nodePoint = this.getNodeScreenCoordinates(node);
            
            nodeGroup.x = nodePoint.x;
            nodeGroup.y = nodePoint.y;
            
            return nodeGroup;
        }
        
        private drawEdges(parent: GraphJS.Node): void {
            for(var child of parent.getAdjList()) {
                var parentPoint = this.getNodeScreenCoordinates(parent);
                var childPoint = this.getNodeScreenCoordinates(child);
                
                this._graphics.moveTo(parentPoint.x + 15, parentPoint.y + 15);
                this._graphics.lineStyle(2, 0x33FF00);
                this._graphics.lineTo(childPoint.x + 15, childPoint.y + 15);                    
            }
        }
        
        private getNodeScreenCoordinates(node: GraphJS.Node): Phaser.Point {
            var x = this.TOP_LEFT_X + this.STEP_X * node.x;
            var y = this.TOP_LEFT_Y + this.STEP_Y * node.y;
            return new Phaser.Point(x,y);
        }
        
        private createNodeClickCallback(index: number): Function {
            return function() {
                this._nodeClickedCallback(new GraphAction(index));
            }.bind(this);
        }
        
        public onNodeClicked(index: number): void {
            this._nodes[index].alpha = 0.5;
        }
        
        public destroy(): void {
            for(var node of this._nodes) {
                node.destroy();
            }
            this._graphics.destroy();
            this._nodeToFind.destroy();
            this._game = null;
            this._nodeClickedCallback = null;
        }
    }
    
    export class DebthFirstSearchGamePlay extends Common.PractiseGamePlay<GraphAction, DebthFirstSearchAlgorithm> {
        
        protected _graphUI: GraphUI;
        
        protected onInit(): void {
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
            this.boxClicked(new GraphAction(step.stepNumber), false);
            return false;
        }

        protected isCorrectStep(action: GraphAction): boolean {
            var step: Common.AlgorithmStep = this.getCurrentStep();
            return step.stepNumber === action.index; 
        }
        
        protected onCorrectAction(): void {
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
        
        protected onCorrectAction(): void {
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

/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />
/// <reference path="../../lib/graph.d.ts" />

module Graph {

    export class GraphAction implements Common.GamePlayAction {
        constructor(public index: number){};
    }
    
    export class AbstractTraverseAlgorithm extends Common.Algorithm {
       
       private _workSeqeunce: GraphJS.Node[];

       protected _presenceMatrix: GraphJS.Node[][];
       protected _graph: GraphJS.Graph;
       
       constructor(config: any) {
           super(config);
       }
       
       protected generateSeqeunce(config: any): any[] {

            var minElementsInGraph = config.minElements;
            
            this._workSeqeunce = [];
            while(this._workSeqeunce.length < minElementsInGraph) {
                this.createGraph(config.columns);
            }
           
            return this._workSeqeunce;
       }
       
       protected createGraph(columns: number): void {
           
           this._presenceMatrix = [];
           this._workSeqeunce = [];
           
           for(var column = 0; column < columns; column++) {
            this._presenceMatrix[column] = [];
           }
           
           this._graph = new GraphJS.Graph();
           
           var topVertex = this.addNode(2,0);
           this.createChildVertexes(topVertex);
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
            if (parent.x > 0 
                && this.canAddNewVertex(parent.x - 1, parent.y + 1) 
                && this._presenceMatrix[parent.x][parent.y + 1] == null
            ) {
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
           return this._presenceMatrix[x][y] == null && this.needCreate();
       }
       
       protected needCreate(): boolean {
           return Common.Algorithm.getRandomInteger(0, 3) > 0;
       }
    }
    
  export class GraphUI {
        
        private TOP_LEFT_X: number = 150;
        private TOP_LEFT_Y: number = 100;
        private STEP_X: number = 110;
        private STEP_Y: number = 80;
        
        protected _game: Common.AlgoGame;
        private _nodeClickedCallback: Function;
        protected _nodes: Phaser.Group[] = [];        
        
        protected _graphics: Phaser.Graphics;
        
        constructor(game: Common.AlgoGame, nodes: GraphJS.Node[], nodeClickedCallback: Function, nodeToFind: GraphJS.Node) {
            this._game = game;
            this._nodeClickedCallback = nodeClickedCallback;
            this.init(nodes);
            
            this.onNodeClicked(nodeToFind.id);
        }
        
        protected init(nodes: GraphJS.Node[]): void {
            
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
            var boxKeyText: Phaser.Text = this._game.add.text(box.height/2, box.width/2 , "", Constants.CONTROL_PANEL_MESSAGE_STYLE);
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
            for(var edge of parent.getAdjList()) {
                this.drawEdge(edge);
            }
        }
        
        protected drawEdge(edge: GraphJS.Edge): void {
            var parentPoint = this.getNodeScreenCoordinates(edge.fromNode);
            var childPoint = this.getNodeScreenCoordinates(edge.toNode);
            
            this._graphics.moveTo(parentPoint.x + 15, parentPoint.y + 15);
            this._graphics.lineStyle(2, 0x33FF00);
            this._graphics.lineTo(childPoint.x + 15, childPoint.y + 15);                    
        }
        
        protected getNodeScreenCoordinates(node: GraphJS.Node): Phaser.Point {
            var x = this.TOP_LEFT_X + this.STEP_X * node.x;
            var y = this.TOP_LEFT_Y + this.STEP_Y * node.y;
            return new Phaser.Point(x,y);
        }
        
        protected createNodeClickCallback(index: number): Function {
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
            this._game = null;
            this._nodeClickedCallback = null;
        }
    }
    
}

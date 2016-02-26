/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />
/// <reference path="../../lib/graph.d.ts" />

module Graph {

    export class GraphAction implements Common.GamePlayAction {
        constructor(public index: number){};
    }
    
    export class AbstractTraverseAlgorithm extends Common.ConfigurableAlgorithm {
       
        private _workSeqeunce: GraphJS.Node[];

        protected _presenceMatrix: GraphJS.Node[][];
        protected _graph: GraphJS.Graph;
        
        protected _columns: number;
        protected _rows: number;
       
       constructor(config: any) {
           this._columns = config.columns;
           this._rows = config.rows;
           
           super(config);
       }
       
       public restore(settings: any) {
           super.restore(settings);
           this._columns = settings.columns;
           this._rows = settings.rows;
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
       
       public get columns(): number {
           return this._columns;
       }
       
       public get rows(): number {
           return this._rows;
       }
    }
    
    
    
    export class EdgeUI extends Phaser.Group {
        
        private _weightText: Phaser.Text;
        private _arrow: Common.ArrowUI;
        
        constructor(game: Common.AlgoGame, edge: GraphJS.Edge, hideWieght: boolean = false) {
            super(game);   
            this.drawEdge(edge, this.getEdgeOrientation(edge));
            if (hideWieght) {
                this.hideWieght();
            }
        }
        
        private getEdgeOrientation(edge: GraphJS.Edge): Common.ArrowDirection {
            var fromNode = edge.fromNode;
            var toNode = edge.toNode;
            
            if (toNode.y > fromNode.y) {
                if (toNode.x === fromNode.x) {
                    return Common.ArrowDirection.UPDOWN;
                } else if (toNode.x > fromNode.x) {
                    return Common.ArrowDirection.UPDOWNRIGHT;
                } else {
                    return Common.ArrowDirection.UPDOWNLEFT;
                }
            } else {
                if (toNode.x < fromNode.x) {
                    return Common.ArrowDirection.RIGHTLEFT;
                } else {
                    return Common.ArrowDirection.LEFTRIGHT;
                }
            }
        }
        
        public hideWieght(): void {
            this._weightText.alpha = 0;
        }
        
        private drawEdge(edge: GraphJS.Edge, direction: Common.ArrowDirection): void {
            var fromNodePoint = GraphUI.getNodeScreenCoordinates(edge.fromNode);
            var toNodePoint = GraphUI.getNodeScreenCoordinates(edge.toNode);
            this._weightText = this.game.add.text((fromNodePoint.x + toNodePoint.x)/2, (fromNodePoint.y + toNodePoint.y)/2, "" + edge.weight, Constants.GAME_AREA_GRAPH_WEIGHT_TEXT, this);
            this._weightText.anchor.setTo(0.5);
            
            this._arrow = new Common.ArrowUI(this.game, fromNodePoint, toNodePoint, direction);
            this.add(this._arrow);

            switch(direction) {
                case Common.ArrowDirection.RIGHTLEFT:
                    this._weightText.x -= 24;                    
                    this._weightText.y += 14;       
                    this._arrow.y += 25;        
                    this._arrow.x -= 1;        
                    break;
                case Common.ArrowDirection.LEFTRIGHT:
                    this._weightText.x += 20;                    
                    this._weightText.y += 14;                    
                    this._arrow.y += 25;        
                    this._arrow.x += 1;        
                    break;
                case Common.ArrowDirection.UPDOWN:
                    this._weightText.x += 8;                    
                    this._weightText.y += 26;                    

                    break;
                case Common.ArrowDirection.UPDOWNLEFT:
                    this._weightText.x += 18;                    
                    this._weightText.y += 16;                    

                    break;
                case Common.ArrowDirection.UPDOWNRIGHT:
                    this._weightText.x += 28;                    
                    this._weightText.y += 15;                    
                    break;
            }
           
        }
        
        public highlightEdge(): void {
            this._arrow.highlightArrow();
        }
        
        public stopHiglightingEdge(): void {
            this._arrow.stopHiglightingArrow();
        }

    }
    
    export class GraphUI {
        
        private TOP_LEFT_X: number = 150;
        private TOP_LEFT_Y: number = 100;
        
        public static STEP_X: number = 110;
        public static STEP_Y: number = 80;
        
        protected _game: Common.AlgoGame;
        private _nodeClickedCallback: Function;
        protected _nodes: Common.BoxContainer[] = [];        
        
        protected _graph: Phaser.Group;
        
        constructor(game: Common.AlgoGame, nodes: GraphJS.Node[], nodeClickedCallback: Function, nodeToFind: GraphJS.Node, columns: number = 5) {
            this._game = game;
            this._nodeClickedCallback = nodeClickedCallback;
            
            this._graph = game.add.group();
            
            this.init(nodes);
            
            this._graph.y = Constants.GAME_AREA_Y;
            this._graph.x = game.width/2 - (columns * GraphUI.STEP_X)/2;
            
            this._nodes[nodeToFind.id].setState(Common.BoxState.SELECTED_ORANGE);
        }
        
        protected init(nodes: GraphJS.Node[]): void {
            
            for(var node of nodes) {
                var newNode = this.drawNode(node);
                this._graph.add(newNode);
                this._nodes.push(newNode);               
            }
            
        }
        
        private drawNode(node: GraphJS.Node, drawEdges: boolean = true): Common.BoxContainer {
            
             if (drawEdges) {
                 this.drawEdges(node);
             }
            
            var nodeGroup = this.createNode(node);
            var nodePoint = GraphUI.getNodeScreenCoordinates(node);
            
            nodeGroup.x = nodePoint.x;
            nodeGroup.y = nodePoint.y;
            
            return nodeGroup;
        }
        
        protected createNode(node: GraphJS.Node): Common.BoxContainer {
            return new Common.CircleBoxContainer(this._game, node.id, this.createNodeClickCallback(node.id), function(){});
        }
        
        private drawEdges(parent: GraphJS.Node): void {
            for(var edge of parent.getAdjList()) {
                var newEdge = this.drawEdge(edge);
                this._graph.add(newEdge);
            }
        }
        
        protected drawEdge(edge: GraphJS.Edge): EdgeUI {
            return new EdgeUI(this._game, edge, true);
        }
        
        public static getNodeScreenCoordinates(node: GraphJS.Node): Phaser.Point {
            var x = GraphUI.STEP_X * node.x;
            var y = GraphUI.STEP_Y * node.y;
            return new Phaser.Point(x,y);
        }
        
        protected createNodeClickCallback(index: number): Function {
            return function() {
                this._nodeClickedCallback(new GraphAction(index));
            }.bind(this);
        }
        
        public onNodeClicked(index: number): void {
            this._nodes[index].setState(Common.BoxState.SELECTED_GREEN);
        }
        
        public destroy(): void {
            this._graph.destroy();
            this._game = null;
            this._nodeClickedCallback = null;
        }
    }
    
}

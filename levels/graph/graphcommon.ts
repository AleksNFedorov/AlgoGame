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
        
        protected _columns: number;
        protected _rows: number;
       
       constructor(config: any) {
           this._columns = config.columns;
           this._rows = config.rows;
           
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
       
       public get columns(): number {
           return this._columns;
       }
       
       public get rows(): number {
           return this._rows;
       }
    }
    
    
    enum EdgeDirection {UPDOWNRIGHT, UPDOWN, UPDOWNLEFT, LEFTRIGHT, RIGHTLEFT}
    
    export class EdgeUI extends Phaser.Group {
        
        private _edge: Phaser.Sprite;
        private _arrow: Phaser.Sprite;
        private _weightText: Phaser.Text;
        
        constructor(game: Common.AlgoGame, edge: GraphJS.Edge, hideWieght: boolean = false) {
            super(game);   
            this.drawEdge(edge, this.getEdgeOrientation(edge));
            if (hideWieght) {
                this.hideWieght();
            }
        }
        
        private getEdgeOrientation(edge: GraphJS.Edge): EdgeDirection {
            var fromNode = edge.fromNode;
            var toNode = edge.toNode;
            
            if (toNode.y > fromNode.y) {
                if (toNode.x === fromNode.x) {
                    return EdgeDirection.UPDOWN;
                } else if (toNode.x > fromNode.x) {
                    return EdgeDirection.UPDOWNRIGHT;
                } else {
                    return EdgeDirection.UPDOWNLEFT;
                }
            } else {
                if (toNode.x < fromNode.x) {
                    return EdgeDirection.RIGHTLEFT;
                } else {
                    return EdgeDirection.LEFTRIGHT;
                }
            }
        }
        
        public hideWieght(): void {
            this._weightText.alpha = 0;
        }
        
        private drawEdge(edge: GraphJS.Edge, direction: EdgeDirection): void {
            var fromNodePoint = GraphUI.getNodeScreenCoordinates(edge.fromNode);
            var toNodePoint = GraphUI.getNodeScreenCoordinates(edge.toNode);
            this._edge = this.game.add.sprite(fromNodePoint.x, fromNodePoint.y, Constants.GAME_GENERAL_ATTLAS, "graphEdge.png", this);
            this._arrow = this.game.add.sprite(toNodePoint.x, toNodePoint.y , Constants.GAME_GENERAL_ATTLAS, "graph-arrow1.png", this);
            this._weightText = this.game.add.text((fromNodePoint.x + toNodePoint.x)/2, (fromNodePoint.y + toNodePoint.y)/2, "" + edge.weight, Constants.GAME_AREA_GRAPH_WEIGHT_TEXT, this);
            this._weightText.anchor.setTo(0.5);
            switch(direction) {
                case EdgeDirection.RIGHTLEFT:
                    this._edge.width = toNodePoint.x - fromNodePoint.x - 59;
                    this._edge.y += 28;
                    this._edge.angle = -180;
                    
                    this._arrow.x += 67;
                    this._arrow.y += 35;
                    this._arrow.angle = -180;
                    
                    this._weightText.x -= 24;                    
                    this._weightText.y += 14;                    
                    break;
                case EdgeDirection.LEFTRIGHT:
                    this._edge.width = toNodePoint.x - fromNodePoint.x - 59;
                    this._edge.x += 53;
                    this._edge.y += 24;
                    
                    this._arrow.x += -13;
                    this._arrow.y += 17;
                    
                    this._weightText.x += 20;                    
                    this._weightText.y += 14;                    
                    
                    break;
                case EdgeDirection.UPDOWN:
                    this._edge.width -= 60;
                    this._edge.x += 29;
                    this._edge.y += 27;
                    this._edge.angle = 90;
                    
                    this._arrow.x += 36;
                    this._arrow.y += -11;
                    this._arrow.angle = 90;

                    this._weightText.x += 8;                    
                    this._weightText.y += 26;                    

                    break;
                case EdgeDirection.UPDOWNLEFT:
                    this._edge.width -= 13;
                    this._edge.x += 27;
                    this._edge.y += 27;
                    this._edge.angle = -215;
                    
                    this._arrow.x += 60;
                    this._arrow.y += 9;
                    this._arrow.angle = -215;

                    this._weightText.x += 18;                    
                    this._weightText.y += 16;                    

                    break;
                case EdgeDirection.UPDOWNRIGHT:
                    this._edge.width -= 15;
                    this._edge.x += 27;
                    this._edge.y += 27;
                    this._edge.angle = 35;
                    
                    this._arrow.y -= 3;
                    this._arrow.angle = 35;
                    
                    this._weightText.x += 28;                    
                    this._weightText.y += 15;                    
                    break;
            }
           
        }
        
        public highlightEdge(): void {
            this._arrow.frameName = "graph-arrow4.png";
        }
        
        public stopHiglightingEdge(): void {
            this._arrow.frameName = "graph-arrow1.png";
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
            return new Common.BoxContainer(this._game, node.id, this.createNodeClickCallback(node.id), function(){});
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

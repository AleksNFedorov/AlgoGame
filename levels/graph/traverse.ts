/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />
/// <reference path="../../lib/graph.d.ts" />

module Graph {

    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number){};
    }
    
    
    class AbstractTraverseAlgorithm extends Common.Algorithm {
       
       private _presenceMatrix: GraphJS.Node[][] = [];
       private _workSeqeunce: GraphJS.Node[] = [];
       
       protected _graph: GraphJS.Graph;
       
       constructor(config: any) {
           super(config);
       }
       
       protected generateSeqeunce(config: any): any[] {
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
               
            this._workSeqeunce.push(newNode);
            this._presenceMatrix[x][y] = newNode;
            
            if (parent) {
                this.addEdge(parent, newNode);
            }
            return newNode;
       }
       
       protected createChildVertexes(parent: GraphJS.Node): void {
           
           if (parent.y >= (this.config.rows - 1)) {
               return;
           }
           
            //under
            if (this.canAddNewVertex(parent.x,parent.y + 1)) {
                this.createChildVertexes(this.addNode(parent.x, parent.y + 1, parent));
            }
            
            //under and left
            if (parent.x > 0 && this.canAddNewVertex(parent.x - 1, parent.y + 1)) {
                this.createChildVertexes(this.addNode(parent.x - 1, parent.y + 1, parent));
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
    
    class DebthFirstSearch extends AbstractTraverseAlgorithm {
        
        constructor(config: any) {
            super(config);
        }
    }
    
}

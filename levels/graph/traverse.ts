/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />

module Graph {

    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number){};
    }
    
    
    class Vertex {
        
        private _x: number;
        private _y: number;
        private _value: number;
        public children: Edge[] = [];
        
        constructor(x: number, y: number, value: number) {
            this._x = x;
            this._y = y;
            this._value = value;
        }
        
        public get x(): number {
            return this._x;
        }
        
        public get y(): number {
            return this._y;
        }
        
        public get value(): number {
            return this._value;
        }
                
    }
    
    class Edge {
        private _value: number;
        private _from: Vertex;
        private _to: Vertex;
        
        constructor(value: number, from: Vertex, to: Vertex) {
            this._value = value;
            this._from = from;
            this._to = to;
        }
        
        public get from(): Vertex {
            return this._from;
        }
        
        public get to(): Vertex {
            return this._to;
        }
        
        public get value(): number {
            return this._value;
        }
    }
    
    class AbstractTraverseAlgorithm extends Common.Algorithm {
       
       private _presenceMatrix: Vertex[][] = [];
       private _workSeqeunce: Vertex[] = [];
       
       constructor(config: any) {
           super(config);
       }
       
       protected generateSeqeunce(config: any): any[] {
           for(var column = 0; column < config.columns; column++) {
            this._presenceMatrix[column] = [];
           }
           
           var topVertex = this.addVertex(2,0);
           this.createChildVertexes(topVertex);
           
           return this._workSeqeunce;
       }
       
       protected addEdge(from: Vertex, to: Vertex): Edge {
           var newEdge: Edge = new Edge(
                this.getRandomSeqNumber(),
                from,
                to);
            from.children.push(newEdge);
            return newEdge;
       }
       
       protected addVertex(x, y, parent?: Vertex): Vertex {
           var newVertex: Vertex = new Vertex(
               x, y, this.getRandomSeqNumber()); 
               
            this._workSeqeunce.push(newVertex);
            this._presenceMatrix[x][y] = newVertex;
            
            if (parent) {
                this.addEdge(parent, newVertex);
            }
            return newVertex;
       }
       
       protected createChildVertexes(parent: Vertex): void {
           
           if (parent.y >= (this.config.rows - 1)) {
               return;
           }
           
            //under
            if (this.canAddNewVertex(parent.x,parent.y + 1)) {
                this.createChildVertexes(this.addVertex(parent.x, parent.y + 1, parent));
            }
            
            //under and left
            if (parent.x > 0 && this.canAddNewVertex(parent.x - 1, parent.y + 1)) {
                this.createChildVertexes(this.addVertex(parent.x - 1, parent.y + 1, parent));
            }
            
            //under and right
            if (parent.x < (this.config.columns - 1) && this.canAddNewVertex(parent.x + 1, parent.y + 1)) {
                this.createChildVertexes(this.addVertex(parent.x + 1, parent.y + 1, parent));
            }
       }
       
       private canAddNewVertex(x: number, y: number): boolean {
           return this._presenceMatrix[x][y] == null && Common.Algorithm.getRandomInteger(0, 3) > 0;
       }
    }    
    
}

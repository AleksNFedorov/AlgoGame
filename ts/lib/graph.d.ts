
declare module GraphJS {
    
    export class Edge {
        id: number;
        fromNode: Node;
        toNode: Node;
        weight: number;
    }
    
    export class Node {
        id: number;
        x: number;
        y: number;
        name: string;
        constructor(name: string);
        addEdge(node: Node, wight: number): void;
        getAdjList(): Edge[];
        
    }
    
    export class DjikstraStep {
        edge: Edge;
        weight: number;
    }
    
    export class DjikstraResult {
        distance: number;
        steps: DjikstraStep[];
    }
    
    export class Graph {
        addNode(node: Node): Node;
        getAllNodes(): Node[];
        getDFSTravaersal(): Node[];
        dijkstra(source: Node, destination: Node): DjikstraResult;
    }
    
    
}
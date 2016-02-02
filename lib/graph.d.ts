
declare module GraphJS {
    
    export class Node {
        id: number;
        x: number;
        y: number;
        name: string;
        weight: number[];
        constructor(name: string);
        addEdge(node: Node, wight: number): void;
        getAdjList(): Node[];
        compare(node: Node): boolean;
        
    }
    
    export class DjikstraStep {
        node: Node;
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
        dijkstra(source: Node, destination: Node):DjikstraResult;
    }
    
    
}
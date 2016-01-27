
declare module GraphJS {
    
    export class Node {
        id: number;
        x: number;
        y: number;
        name: string;
        constructor(name: string);
        addEdge(node: Node, wight: number): void;
        getAdjList(): Node[];
        compare(node: Node): boolean;
        
    }
    
    export class Graph {
        addNode(node: Node): Node;
        getAllNodes(): Node[];
        getDFSTravaersal(): Node[];
    }
    
    
}
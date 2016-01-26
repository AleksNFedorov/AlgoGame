
declare module GraphJS {
    
    export class Node {
        x: number;
        y: number;
        constructor(name: string);
        addEdge(node: Node, wight: number): void;
        getAdjList(): Node[];
        compare(node: Node): boolean;
        
    }
    
    export class Graph {
        addNode(node: Node): Node;
        getAllNodex(): Node[];
        getDFSTravaersal(): Node[];
    }
    
    
}
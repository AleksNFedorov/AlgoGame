
var graphMatrix = [[],[],[],[],[]];
var graphArray = [];


function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomInt(max) {
    return Math.floor(Math.random()*(max+1));
}

var addEdge = function(parent, child) {
        var edge = {
            weight: randomInt(20),
            child: child
        }
        
        parent.children.push(edge);
}

var addVertex = function(x,y, parent)  {
    var vertex = {
        x: x,
        y: y,
        value: randomInt(200),
        children: []
    };
    
    graphArray.push(vertex);
    graphMatrix[vertex.x][vertex.y] = vertex;
    
    if (parent) {
        addEdge(parent, vertex);
    }
    
    return vertex;
};

var createChildVertexes = function(parent) {
    if (parent.y == 4) {
        return;
    }
    
    //under
    if (graphMatrix[parent.x][parent.y + 1] == null && randomInt(2) > 0) {
        createChildVertexes(addVertex(parent.x, parent.y + 1, parent));
    }
    
    //under and left
    if (parent.x > 0 && graphMatrix[parent.x - 1][parent.y + 1] == null && randomInt(2) > 0) {
        createChildVertexes(addVertex(parent.x - 1, parent.y + 1, parent));
    }
    
    //under and right
    if (parent.x < 4 && graphMatrix[parent.x + 1][parent.y + 1] == null && randomInt(2) > 0) {
        createChildVertexes(addVertex(parent.x + 1, parent.y + 1, parent));
    }
};

var createGraph = function() {
 
    graphMatrix = [[],[],[],[],[]];
    
    graphArray = [];
    
    createChildVertexes(addVertex(2,0));
    print(JSON.stringify(graphArray[0]));

};

createGraph();
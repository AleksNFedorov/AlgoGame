//@author devenbhooshan

function Graph(){
	
	this.isWeighted=false;
	this.nodes=[];
	
	this.addNode = function(node){
		this.nodes.push(node);
		return node;
	};
	
	this.removeNode = function (node){
		
		var index = this.nodes.indexOf(node);
		if(index>-1){
			this.nodes.splice(index,1);
			var len=this.nodes.length;

			for (var i = 0; i < len; i++) {
				if(this.nodes[i].adjList.indexOf(node)>-1){
					this.nodes[i].adjList.slice(this.nodes[i].adjList.indexOf(node));
					this.nodes[i].weight.slice(this.nodes[i].adjList.indexOf(node));
				}
			}
		}
	};
	
	this.nodeExist = function (node){
		var index = this.nodes.indexOf(node);
		if(index > -1){
			return true;
		}
		return false;
	};

	this.getAllNodes = function(){
		return this.nodes;
	};
	
	this.getDFSTravaersal = function(){

		var ans = [];
		var traversedNodes = [];
		traversedNodes.push(this.nodes[0]);
		var marked={};
		while(traversedNodes.length!=0){
			var v = traversedNodes.pop();
			marked[v.id] = true;
			var adjList = v.getAdjList();
			console.log(v);
			ans.push(v);
			for (var i = 0;i < adjList.length;i++){
				var u = adjList[i].toNode;
				if(marked[u.id]!=true){
					traversedNodes.push(u);
					marked[u.id]=true;
				}
			}			
		}
		return ans;
	};
	
	this.dijkstra = function(source,destination) {
		
		this.traversalSteps = [];
		
		this.previousNode = [];
		this.distance = new Array();				
		this.distance[source.id] = 0;
		this.pq = new MinPQ();
		
		var nodes = this.getAllNodes();
		var length = nodes.length;
		
		for(var i = 0;i < length;i++){
			if(nodes[i] != source){
				this.distance[nodes[i].id] = Number.POSITIVE_INFINITY;
			}
	        this.pq.push(nodes[i],this.distance[nodes[i].id]);
		}
	
		while(this.pq.size() != 0){
			var u = this.pq.pop();
			var adjList = u.getAdjList();
			for (var i = 0; i < adjList.length; i++) {
				var edge = adjList[i];
				var v = edge.toNode;
				
				if(this.distance[u.id] != Number.POSITIVE_INFINITY) {
					
					var step = {
						edge: edge
					};
					
					var alt = this.distance[u.id] + edge.weight;
					if(alt < this.distance[v.id]){
						step.weight = alt;	
						this.distance[v.id] = alt;
						this.previousNode[v.id] = u.id;
	                    this.pq.remove(v);
	                    this.pq.push(v,this.distance[v.id]);
					} else {
						step.weight = this.distance[v.id];	
					}
					this.traversalSteps.push(step);
				}
			}
		}
		if(typeof destination === 'undefined'){
	
		} else {
			return {
				distance: this.distance[destination.name],
				steps: this.traversalSteps
			}
		}
	}
}

function Edge(fromNode, toNode, weight) {
	this.fromNode = fromNode;
	this.toNode = toNode;
	this.weight = weight;
}

function Node(Name, id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
	this.name = Name;
	this.edges = [];

	this.addEdge = function (toNode, weight){
		var newEdge = new Edge(this, toNode, weight);
		this.edges.push(newEdge);
		return newEdge;
	};
	
	this.getAdjList = function(){
		return this.edges;
	};
}



function bfs(graph){
	ans=[];
	traversedNodes=[];
	traversedNodes.push(graph.nodes[0]);
	allNodes=graph.getAllNodes();
	marked={};
	while(traversedNodes.length!=0){
		var v=traversedNodes.shift();
		marked[v.name]=true;
		console.log(v);
		ans.push(v);
		adjList=v.adjList;
		for (var i=0;i<adjList.length;i++){
			u=adjList[i];
			if(marked[u.name]!=true){
				traversedNodes.push(u);
				marked[u.name]=true;

			}
		}			
	}
	return ans;
}


function binaryHeap(){
	this.nodes=[];
}

binaryHeap.prototype.size=function(){
		return this.nodes.length;
};

binaryHeap.prototype.compare = function(node1,node2) {
	return node1.priority-node2.priority;
};
binaryHeap.prototype.insert_push = function(element) {
	this.nodes.push(element);
	this.bubbleUp(this.nodes.length-1);
};

binaryHeap.prototype.remove_pop = function() {
	var ans=this.nodes[0];
	var last_element=this.nodes.pop();
	
	if(this.nodes.length> 0){
		this.nodes[0]=last_element;
		this.sinkDown(0);
	}
	return ans;
};

binaryHeap.prototype.delete_node = function(node) {
	var length=this.nodes.length;
	isPresent=false;
	for (var i = 0; i < length; i++) {
		if((this.nodes[i].content!=node)) continue;
		var end=this.nodes.pop();
		if(i==length-1) break;
		this.nodes[i]=end;
		this.bubbleUp(i);
		this.sinkDown(i);
		isPresent=true;
		break;
	}
	return isPresent;
};

binaryHeap.prototype.top = function() {
	return this.nodes[0];
};

binaryHeap.prototype.sinkDown = function(i) {
	var length=this.nodes.length;	
	while(true && i<length){
		var flag=0;
		if(2*i+1 < length && this.compare(this.nodes[i],this.nodes[2*i+1])>0){
			if(2*i+2< length && this.compare(this.nodes[2*i+1],this.nodes[2*i+2])>0){
				flag=2;
			}else{
				flag=1;
			}	
		}else if( 2*i+2 < length && this.compare(this.nodes[i],this.nodes[2*i+2])>0){
			flag=2;
		}else {
			break;
		}
			var temp=this.nodes[2*i+flag];
			this.nodes[2*i+flag]=this.nodes[i];
			this.nodes[i]=temp;
			i=2*i+flag;
	}
};


binaryHeap.prototype.bubbleUp = function(i) {
	
	var length=this.nodes.length;	
	while(i>0){
		var index=Math.floor((i+1)/2)-1;
		//console.log(this.compare(this.nodes[i],this.nodes[index]));
		if(this.compare(this.nodes[i],this.nodes[index])<0){
			//console.log(this.nodes[i].priority+' '+this.nodes[index].priority);
			var temp=this.nodes[index];
			this.nodes[index]=this.nodes[i];
			this.nodes[i]=temp;
			i=index;
		}else {
			break;
		}
			
	}
};


function MinPQ(list){
	
	bh=new binaryHeap();
	this.heap=bh;
}

MinPQ.prototype.push=function(node,priority){
	var temp=new MinPQNodes(node,priority);
	this.heap.insert_push(temp);
};

MinPQ.prototype.pop=function(){
	return this.heap.remove_pop().content;
};


MinPQ.prototype.remove=function(node){
	return this.heap.delete_node(node);
};

MinPQ.prototype.top=function(){
	return this.heap.top().content;
};
MinPQ.prototype.size=function(){
	return this.heap.size();
};

function MinPQNodes(content,priority){
	this.content=content;
	this.priority=priority;
}



function bellman_ford(graph,source,destination){
	this.previousNode=[];
	this.distance=new Array();				
	this.distance[source.name]=0;
	var nodes=graph.getAllNodes();
	length=nodes.length;
	for(var i=0;i<length;i++){
		if(nodes[i]!=source){
			this.distance[nodes[i].name]=Number.POSITIVE_INFINITY;
		}
	}
	
	for(var k=0;k<length;k++){
		for(var j=0;j<length;j++){
			u=nodes[j];
			adjList=u.adjList;
			for (var i = 0; i < adjList.length; i++) {
				v=adjList[i];
				if(this.distance[u.name]!=Number.POSITIVE_INFINITY){	
					alt=this.distance[u.name]+u.weight[i];
					if(alt<this.distance[v.name]){

						this.previousNode[v.name]=u.name;
						this.distance[v.name]=alt;
					}
				}
			}
		}
	}

	for(var j=0;j<length;j++){
		u=nodes[j];
		adjList=u.adjList;
		for (var i = 0; i < adjList.length; i++) {
			v=adjList[i];
			if(this.distance[u.name]!=Number.POSITIVE_INFINITY){	
				alt=this.distance[u.name]+u.weight[i];
				if(alt<this.distance[v.name]){
					return null;
				}
			}
		}
	}
	
	return this.distance[destination.name];	

}

function johnson(graph){
	try
	{
		// http://en.wikipedia.org/wiki/Johnson%27s_algorithm
		temp=new Node('temp');
		graph.addNode(temp);
		nodes=graph.getAllNodes();
		length=nodes.length;
		for(var j=0;j<length-1;j++){
			u=nodes[j];
			temp.addEdge(u,0);
		}
		vari=bellman_ford(graph,temp,temp);
		if(vari==null) {
			return null;
		}
		bell=new bellman_ford(graph,temp,temp);
		length=nodes.length;
		h=bell.distance;
		graph.removeNode(temp);		
		length=nodes.length;
		for(var j=0;j<length;j++){
			u=nodes[j];
			adjList=u.adjList;
			for (var i = 0; i < adjList.length; i++) {
				v=adjList[i];
				u.weight[i]=u.weight[i]+h[u.name]-h[v.name];
			}
		}	
		distanceMatrix=new Array()
		length=nodes.length;
		for(var j=0;j<length;j++){
			u=nodes[j];
			list=u.weight;
			len=list.length;
			dij=new dijkstra(graph,nodes[j]);
			distanceMatrix[nodes[j].name]=dij.previousNode;
			
		}
		for(var j=0;j<length;j++){
			u=nodes[j];
			adjList=u.adjList;
			for (var i = 0; i < adjList.length; i++) {
				v=adjList[i];
				u.weight[i]=u.weight[i]-h[u.name]+h[v.name];
			}
		}
	}
	catch(e)
	{
		console.log(e);
	}
	return distanceMatrix;	
}
//Minimum Spanning Tree

function prim(graph){

	nodes=graph.getAllNodes();
	this.error=false;
	this.Vnode=[];
	this.Vedge=[];
	this.Vnode.push(nodes[0]);

	this.pq=new MinPQ();
	
	this.InsertEdgeIntoPQ(nodes[0],this.pq)
	
	while(this.Vnode.length!=nodes.length){

		if(this.pq.size()==0){ 
			this.error=true;
			return ;
		}

		while(this.pq.size()!=0){

			minEdge=this.pq.pop();
			if(this.Vnode.indexOf(minEdge[1])==-1){

				this.Vedge.push(minEdge);
				this.Vnode.push(minEdge[1]);
				this.InsertEdgeIntoPQ(minEdge[1],this.pq);
				break;
			}

		}
	}
	return;
}

prim.prototype.InsertEdgeIntoPQ = function(node,pq) {
	adjList=node.adjList;
	wights=node.weight;
	for (var i = 0; i < adjList.length; i++) {
		temp=[];
		temp.push(node);
		temp.push(adjList[i]);
		pq.push(temp,wights[i]);		
	}
}

var GraphJS = GraphJS || {};

GraphJS.Graph = Graph;
GraphJS.Node = Node;



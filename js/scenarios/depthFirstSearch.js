var depthFistSearchScenarios = {
    scenarios: [
        {
            columns:4,
            rows:3,
            finalMessage: "scenarios.depthFirstSearch.0.message9",
            steps: [
                {
                    isLast: false,
                    stepNumber: 0,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.0.message1",
                        "scenarios.depthFirstSearch.0.message2",
                    ],
                },
                {
                    stepNumber: 1,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.0.message3",
                        "scenarios.depthFirstSearch.0.message4",
                    ],
                },
                {
                    stepNumber: 2,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.0.message5",
                        "scenarios.depthFirstSearch.0.message6",
                    ],
                },
                {
                    stepNumber: 3,
                    isLast: true,
                    messageKeys: [
                        "scenarios.depthFirstSearch.0.message7",
                        "scenarios.depthFirstSearch.0.message8",
                    ],
                },
            ],
            init: function() {
                var node1 = new Node("1", 0, 2, 0);
                var node2 = new Node("2", 1, 3, 1);
                var node3 = new Node("3", 2, 4, 2);
                var node4 = new Node("4", 3, 1, 1);
                
                node1.addEdge(node2, 0);
                node2.addEdge(node3, 0);
                node1.addEdge(node4, 0);
                
                this.nodeToFind = node4;
                this.sequence = [node1, node2, node3, node4];
            }
        },
        {
            columns:4,
            rows:3,
            finalMessage: "scenarios.depthFirstSearch.1.message9",
            steps: [
                {
                    isLast: false,
                    stepNumber: 0,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.1.message1",
                        "scenarios.depthFirstSearch.1.message2",
                    ],
                },
                {
                    stepNumber: 1,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.1.message3",
                        "scenarios.depthFirstSearch.1.message4",
                    ],
                },
                {
                    stepNumber: 4,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.1.message5",
                        "scenarios.depthFirstSearch.1.message6",
                    ],
                },
                {
                    stepNumber: 3,
                    isLast: false,
                    messageKeys: [
                        "scenarios.depthFirstSearch.1.message7",
                    ],
                },
                {
                    stepNumber: 2,
                    isLast: true,
                    messageKeys: [
                        "scenarios.depthFirstSearch.1.message8",
                    ],
                },
            ],
            init: function() {
                var node1 = new Node("1", 0, 2, 0);
                var node2 = new Node("2", 1, 3, 1);
                var node3 = new Node("3", 2, 1, 1);
                var node4 = new Node("4", 3, 2, 2);
                var node5 = new Node("5", 4, 4, 2);
                
                node1.addEdge(node2, 0);
                node2.addEdge(node5, 0);
                node2.addEdge(node4, 0);
                node1.addEdge(node3, 0);
                
                this.nodeToFind = node3;
                this.sequence = [node1, node2, node3, node4, node5];
            }
        },
    ],
};


depthFistSearchScenarios.scenarios[0].init();
depthFistSearchScenarios.scenarios[1].init();


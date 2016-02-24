var djikstraScenarios = {
    scenarios: [
        {
            columns:3,
            rows:2,
            finalMessage: "scenarios.djikstraSearch.0.message6",
            steps: [
                {
                    weight: 10,
                    stepNumber: 1,
                    isLast: false,
                    messageKeys: [
                        "scenarios.djikstraSearch.0.message1",
                        "scenarios.djikstraSearch.0.message2",
                    ],
                },
                {
                    weight: 4,
                    stepNumber: 2,
                    isLast: false,
                    messageKeys: [
                        "scenarios.djikstraSearch.0.message3",
                    ],
                },
                {
                    weight: 9,
                    stepNumber: 1,
                    isLast: true,
                    messageKeys: [
                        "scenarios.djikstraSearch.0.message4",
                        "scenarios.djikstraSearch.0.message5",
                    ],
                },
            ],
            init: function() {
                var node1 = new Node("", 0, 2, 0);
                var node2 = new Node("", 1, 3, 1);
                var node3 = new Node("", 2, 1, 1);
                
                var edge12 = node1.addEdge(node2, 10);
                var edge13 = node1.addEdge(node3, 4);
                var edge32 = node3.addEdge(node2, 5);
                
                this.steps[0].edge = edge12;
                this.steps[1].edge = edge13;
                this.steps[2].edge = edge32;
                
                this.nodeToFind = node2;
                this.sequence = [node1, node2, node3];
            }
        },
        {
            columns:3,
            rows:3,
            finalMessage: "scenarios.djikstraSearch.1.message9",
            steps: [
                {
                    weight: 3,
                    stepNumber: 3,
                    isLast: false,
                    messageKeys: [
                        "scenarios.djikstraSearch.1.message1",
                        "scenarios.djikstraSearch.1.message2",
                    ],
                },
                {
                    weight: 13,
                    stepNumber: 2,
                    isLast: false,
                    messageKeys: [
                        "scenarios.djikstraSearch.1.message3",
                    ],
                },
                {
                    weight: 4,
                    stepNumber: 1,
                    isLast: false,
                    messageKeys: [
                        "scenarios.djikstraSearch.1.message4",
                    ],
                },
                {
                    weight: 4,
                    stepNumber: 1,
                    isLast: false,
                    messageKeys: [
                        "scenarios.djikstraSearch.1.message5",
                        "scenarios.djikstraSearch.1.message6",
                    ],
                },
                {
                    weight: 11,
                    stepNumber: 2,
                    isLast: true,
                    messageKeys: [
                        "scenarios.djikstraSearch.1.message7",
                        "scenarios.djikstraSearch.1.message8",
                    ],
                },
            ],
            init: function() {
                var node1 = new Node("", 0, 2, 0);
                var node2 = new Node("", 1, 3, 1);
                var node3 = new Node("", 2, 2, 2);
                var node4 = new Node("", 3, 1, 1);
                
                var edge12 = node1.addEdge(node2, 5);
                var edge14 = node1.addEdge(node4, 3);
                var edge42 = node4.addEdge(node2, 1);
                var edge43 = node4.addEdge(node3, 10);
                var edge23 = node2.addEdge(node3, 7);
                
                this.steps[0].edge = edge14;
                this.steps[1].edge = edge43;
                this.steps[2].edge = edge42;
                this.steps[3].edge = edge12;
                this.steps[4].edge = edge23;
                
                this.nodeToFind = node3;
                this.sequence = [node1, node2, node3, node4];
            }
        },
    ],
};

djikstraScenarios.scenarios[0].init();
djikstraScenarios.scenarios[1].init();


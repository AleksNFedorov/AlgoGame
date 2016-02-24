var quickSortScenarios = {
    scenarios: [
        {
            sequence: [8,2,1, 3 ,7,6,5],
            finalMessage: "scenarios.quickSort.0.message10",
            steps: [
                {
                    newPosition: 3,
                    parameters: [3,0,6,-1,-1],
                    isLast: false,
                    stepNumber: 0,
                    messageKeys: [
                        "scenarios.quickSort.0.message1",
                        "scenarios.quickSort.0.message2",
                    ],
                },
                {
                    newPosition: 2,
                    parameters: [1,0,2,-1,-1],
                    isLast: false,
                    stepNumber: 0,
                    messageKeys: [
                        "scenarios.quickSort.0.message3",
                        "scenarios.quickSort.0.message4",
                        "scenarios.quickSort.0.message5",
                    ],
                },
                {
                    newPosition: 6,
                    parameters: [4,3,6,0,2],
                    isLast: false,
                    stepNumber: 3,
                    messageKeys: [
                        "scenarios.quickSort.0.message6",
                        "scenarios.quickSort.0.message7",
                        "scenarios.quickSort.0.message8",
                    ],
                },
                {
                    newPosition: 5,
                    parameters: [4,3,6,-1,-1],
                    isLast: true,
                    stepNumber: 4,
                    messageKeys: [
                        "scenarios.quickSort.0.message9",
                    ],
                },
            ],
        },
        {
            sequence: [3,2,1, 1 ,15,6,4],
            finalMessage: "scenarios.quickSort.1.message7",
            steps: [
                {
                    newPosition: 3,
                    parameters: [3,0,6,-1,-1],
                    isLast: false,
                    stepNumber: 0,
                    messageKeys: [
                        "scenarios.quickSort.1.message1",
                        "scenarios.quickSort.1.message2",
                    ],
                },
                {
                    newPosition: 2,
                    parameters: [3,0,6,-1,-1],
                    isLast: false,
                    stepNumber: 1,
                    messageKeys: [
                        "scenarios.quickSort.1.message3",
                    ],
                },
                {
                    newPosition: 6,
                    parameters: [4,2,6,-1,-1],
                    isLast: true,
                    stepNumber: 4,
                    messageKeys: [
                        "scenarios.quickSort.1.message4",
                        "scenarios.quickSort.1.message5",
                        "scenarios.quickSort.1.message6",
                    ],
                },
            ],
        },
  ],
};
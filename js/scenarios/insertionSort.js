var insertionSortScenarios = {
    scenarios: [
        {
            sequence: [3,2,1,4,5,6,7],
            finalMessage: "scenarios.insertionSort.0.message5",
            steps: [
                {
                    newPosition: 0,
                    parameters: [],
                    isLast: false,
                    stepNumber: 1,
                    messageKeys: [
                        "scenarios.insertionSort.0.message1",
                        "scenarios.insertionSort.0.message2",
                    ],
                },
                {
                    newPosition: 0,
                    parameters: [],
                    isLast: true,
                    stepNumber: 2,
                    messageKeys: [
                        "scenarios.insertionSort.0.message3",
                        "scenarios.insertionSort.0.message4",
                    ],
                },
            ],
        },
        {
            sequence: [3,2,1,1,15,6,4],
            finalMessage: "scenarios.insertionSort.1.message11",
            steps: [
                {
                    newPosition: 0,
                    parameters: [],
                    isLast: false,
                    stepNumber: 1,
                    messageKeys: [
                        "scenarios.insertionSort.1.message1",
                        "scenarios.insertionSort.1.message2",
                    ],
                },
                {
                    newPosition: 0,
                    parameters: [],
                    isLast: false,
                    stepNumber: 2,
                    messageKeys: [
                        "scenarios.insertionSort.1.message3",
                        "scenarios.insertionSort.1.message4",
                    ],
                },
                {
                    newPosition: 1,
                    parameters: [],
                    isLast: false,
                    stepNumber: 3,
                    messageKeys: [
                        "scenarios.insertionSort.1.message5",
                        "scenarios.insertionSort.1.message6",
                    ],
                },
                {
                    newPosition: 4,
                    parameters: [],
                    isLast: false,
                    stepNumber: 5,
                    messageKeys: [
                        "scenarios.insertionSort.1.message7",
                        "scenarios.insertionSort.1.message8",
                    ],
                },
                {
                    newPosition: 4,
                    parameters: [],
                    isLast: true,
                    stepNumber: 6,
                    messageKeys: [
                        "scenarios.insertionSort.1.message9",
                        "scenarios.insertionSort.1.message10",
                    ],
                },
            ],
        },
  ],
};
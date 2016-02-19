var binarySearchScenarios = {
    scenarios: [
        {
            sequence: [1,2,3,4,5,6,7,8,9],
            elementToFindIndex: 0,
            steps: [
                {
                    realStep: {
                        _startIndex: 0,
                        _endIndex: 8,
                        _elementIndex: 4,
                        isLast: false,
                        stepNumber: 0,
                    },
                    messageKey: [
                        "message1",
                        "message2",
                    ],
                },
                {
                    realStep: {
                        _startIndex: 0,
                        _endIndex: 3,
                        _elementIndex: 1,
                        isLast: false,
                        stepNumber: 1,
                    },
                    messageKey: [
                        "message3",
                        "message4",
                    ],
                },
                {
                    realStep: {
                        _startIndex: 0,
                        _endIndex: 1,
                        _elementIndex: 0,
                        isLast: false,
                        stepNumber: 2,
                    },
                    messageKey: [
                        "message4",
                        "message5",
                    ],
                },
            ],
        }
    ],
};
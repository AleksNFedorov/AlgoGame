var globalConfig = {
    levelConfigs: {
        binarySearch: {
            practise: {
                stageName: "binarySearchPractise",
                stepsToPass: 5,
                menu: {
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://google.com",
                    MENU_BUTTON_PRACTISE: "",
                    MENU_BUTTON_EXAM:"binarySearchExam",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 14,
                    maxElementsInSeq: 20,
                    sorted: true
                }
            },
            exam: {
                stageName: "binarySearchExam",
                stepsToPass: 2,
                menu: {
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://fb.com",
                    MENU_BUTTON_OBJECTIVES: "OBJECTIVES",
                    MENU_BUTTON_PRACTISE: "binarySearchPractise",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 21,
                    sorted: true
                }
            }
        },
        bubbleSort: {
            dependsOn: "binarySearch",
            practise: {
                stageName: "bubbleSortPractise",
                stepsToPass: 5,
                menu: {
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://google.com",
                    MENU_BUTTON_PRACTISE: "",
                    MENU_BUTTON_EXAM:"bubbleSortExam",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 14,
                    maxElementsInSeq: 20
                }
            },
            exam: {
                stageName: "bubbleSortExam",
                stepsToPass: 10,
                menu: {
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://fb.com",
                    MENU_BUTTON_OBJECTIVES: "OBJECTIVES",
                    MENU_BUTTON_PRACTISE: "bubbleSortPractise",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 21
                }
            }
        },
    }
};




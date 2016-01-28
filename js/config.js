var globalConfig = {
    levelConfigs: {
        binarySearch: {
            practise: {
                stageName: "binarySearchPractise",
                stepsToPass: 5,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"binarySearchExam",
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
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonObjectives: "OBJECTIVES",
                    MenuButtonPractise: "binarySearchPractise",
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
        insertionSort: {
            practise: {
                stageName: "insertionSortPractise",
                stepsToPass: 5,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"insertionSortExam",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 14,
                    maxElementsInSeq: 20,
                    sorted: false
                }
            },
            exam: {
                stageName: "insertionSortExam",
                stepsToPass: 2,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonObjectives: "OBJECTIVES",
                    MenuButtonPractise: "insertionSortPractise",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 21,
                    sorted: false
                }
            }
        },
        debthFirstSearch: {
            practise: {
                stageName: "debthFirstSearchPractise",
                stepsToPass: 5,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"debthFirstSearchExam",
                },
                gamePlay: {
                    minSeqNumber: 10,
                    maxSeqNumber: 100,
                    columns: 5,
                    rows: 5,
                }
            },
            exam: {
                stageName: "debthFirstSearchExam",
                stepsToPass: 20,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonObjectives: "OBJECTIVES",
                    MenuButtonPractise: "debthFirstSearchPractise",
                },
                gamePlay: {
                    minSeqNumber: 10,
                    maxSeqNumber: 100,
                    columns: 5,
                    rows: 5,
                }
            }
        },
        
        bubbleSort: {
            dependsOn: "binarySearch",
            practise: {
                stageName: "bubbleSortPractise",
                stepsToPass: 5,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"bubbleSortExam",
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
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonObjectives: "OBJECTIVES",
                    MenuButtonPractise: "bubbleSortPractise",
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




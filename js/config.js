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
        insertionSort: {
            practise: {
                stageName: "insertionSortPractise",
                stepsToPass: 5,
                menu: {
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://google.com",
                    MENU_BUTTON_PRACTISE: "",
                    MENU_BUTTON_EXAM:"insertionSortExam",
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
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://fb.com",
                    MENU_BUTTON_OBJECTIVES: "OBJECTIVES",
                    MENU_BUTTON_PRACTISE: "insertionSortPractise",
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
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://google.com",
                    MENU_BUTTON_PRACTISE: "",
                    MENU_BUTTON_EXAM:"debthFirstSearchExam",
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
                stepsToPass: 2,
                menu: {
                    MENU_BUTTON_MENU: "menu",
                    MENU_BUTTON_DESCRIPTION: "http://fb.com",
                    MENU_BUTTON_OBJECTIVES: "OBJECTIVES",
                    MENU_BUTTON_PRACTISE: "debthFirstSearchPractise",
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




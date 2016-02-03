var globalConfig = {
    levelConfigs: {
        binarySearch: {
            practise: {
                stageName: "binarySearchPractise",
                stepsToPass: 5,
                stepTime: 2000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"binarySearchExam",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 5,
                    maxElementsInSeq: 9,
                    sorted: true
                }
            },
            exam: {
                stageName: "binarySearchExam",
                stepsToPass: 2,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonObjectives: "OBJECTIVES",
                    MenuButtonPractise: "binarySearchPractise",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 9,
                    sorted: true
                }
            }
        },
        insertionSort: {
            practise: {
                stageName: "insertionSortPractise",
                stepsToPass: 5,
                stepTime: 4000,
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
                stepTime: 4000,
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
        selectionSort: {
            practise: {
                stageName: "selectionSortPractise",
                stepsToPass: 50,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"selectionSortExam",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 30,
                    minElementsInSeq: 5,
                    maxElementsInSeq: 7,
                    sorted: false
                }
            },
            exam: {
                stageName: "selectionSortExam",
                stepsToPass: 2,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonPractise: "selectionSortPractise",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 20,
                    minElementsInSeq: 4,
                    maxElementsInSeq: 7,
                    sorted: false
                }
            }
        },
        mergeSort: {
            practise: {
                stageName: "mergeSortPractise",
                stepsToPass: 50,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"mergeSortExam",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 10,
                    sorted: false
                }
            },
            exam: {
                stageName: "mergeSortExam",
                stepsToPass: 2,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonPractise: "mergeSortPractise",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 20,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 10,
                    sorted: false
                }
            }
        },
        quickSort: {
            practise: {
                stageName: "quickSortPractise",
                stepsToPass: 50,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"quickSortExam",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 10,
                    sorted: false
                }
            },
            exam: {
                stageName: "quickSortExam",
                stepsToPass: 2,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonPractise: "quickSortPractise",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 20,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 10,
                    sorted: false
                }
            }
        },
        // Graphs
        debthFirstSearch: {
            practise: {
                stageName: "debthFirstSearchPractise",
                stepsToPass: 5,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"debthFirstSearchExam",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 10,
                    maxSeqNumber: 100,
                    columns: 5,
                    rows: 5,
                }
            },
            exam: {
                stageName: "debthFirstSearchExam",
                stepsToPass: 20,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonPractise: "debthFirstSearchPractise",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 10,
                    maxSeqNumber: 100,
                    columns: 5,
                    rows: 5,
                }
            }
        },
        djikstra: {
            practise: {
                stageName: "djikstraPractise",
                stepsToPass: 5,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://google.com",
                    MenuButtonPractise: "",
                    MenuButtonExam:"djikstraExam",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    columns: 4,
                    rows: 3,
                }
            },
            exam: {
                stageName: "djikstraExam",
                stepsToPass: 20,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://fb.com",
                    MenuButtonPractise: "djikstraPractise",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    columns: 4,
                    rows: 3,
                }
            }
        },
    }
};




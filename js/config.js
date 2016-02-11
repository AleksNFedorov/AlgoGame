var globalConfig = {
    levelConfigs: {
        binarySearch: {
            practise: {
                stageName: "binarySearchPractise",
                stepsToPass: 15,
                stepTime: 3000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://wiki.roblox.com/index.php?title=Binary_search",
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
                    MenuButtonDescription: "http://wiki.roblox.com/index.php?title=Binary_search",
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
                    MenuButtonDescription: "http://jackson-.github.io/2014/10/07/Sowhatexactlyisinsertionsort.html",
                    MenuButtonPractise: "",
                    MenuButtonExam:"insertionSortExam",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 10,
                    maxElementsInSeq: 16,
                    sorted: false
                }
            },
            exam: {
                stageName: "insertionSortExam",
                stepsToPass: 2,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://jackson-.github.io/2014/10/07/Sowhatexactlyisinsertionsort.html",
                    MenuButtonPractise: "insertionSortPractise",
                },
                gamePlay: {
                    minSeqNumber: 100,
                    maxSeqNumber: 1000,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 16,
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
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
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
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
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
                    MenuButtonDescription: "http://www.personal.kent.edu/~rmuhamma/Algorithms/MyAlgorithms/Sorting/mergeSort.htm",
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
                    MenuButtonDescription: "http://www.personal.kent.edu/~rmuhamma/Algorithms/MyAlgorithms/Sorting/mergeSort.htm",
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
                stepTime: 8000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "http://www.mayankacademy.com/cs101/quick_sort/",
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
                    MenuButtonDescription: "http://www.mayankacademy.com/cs101/quick_sort/",
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
        debthFirst: {
            practise: {
                stageName: "debthFirstPractise",
                stepsToPass: 5,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "https://www.cs.drexel.edu/~introcs/F2K/lectures/7.2_AI/Formal3.html",
                    MenuButtonPractise: "",
                    MenuButtonExam:"debthFirstExam",
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
                stageName: "debthFirstExam",
                stepsToPass: 20,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "https://www.cs.drexel.edu/~introcs/F2K/lectures/7.2_AI/Formal3.html",
                    MenuButtonPractise: "debthFirstPractise",
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
//            dependsOn: "debthFirst",
            practise: {
                stageName: "djikstraPractise",
                stepsToPass: 5,
                stepTime: 10000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
                    MenuButtonPractise: "",
                    MenuButtonExam:"djikstraExam",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    columns: 5,
                    rows: 5,
                }
            },
            exam: {
                stageName: "djikstraExam",
                stepsToPass: 20,
                stepTime: 4000,
                menu: {
                    MenuButtonMenu: "menu",
                    MenuButtonDescription: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
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




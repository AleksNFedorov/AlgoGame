var globalConfig = {
    levelConfigs: {
        binarySearch: {
            freeToPlay: true,
            tutorial: {
                stageName: "binarySearchTutorial",
                stepsToPass: 9,
                menu: {
                    MenuButtonDescription: "http://wiki.roblox.com/index.php?title=Binary_search",
                },
            },
            practise: {
                stageName: "binarySearchPractise",
                stepsToPass: 20,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "http://wiki.roblox.com/index.php?title=Binary_search",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 20,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 14,
                    sorted: true
                }
            },
            exam: {
                stageName: "binarySearchExam",
                stepsToPass: 10,
                stepTime: 3000,
                menu: {
                    MenuButtonDescription: "http://wiki.roblox.com/index.php?title=Binary_search",        
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 10,
                    sorted: true
                }
            }
        },
        insertionSort: {
            freeToPlay: true,
            tutorial: {
                stageName: "insertionSortTutorial",
                stepsToPass: 9,
                menu: {
                    MenuButtonDescription: "http://jackson-.github.io/2014/10/07/Sowhatexactlyisinsertionsort.html",
                },
            },
            practise: {
                stageName: "insertionSortPractise",
                stepsToPass: 20,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "http://jackson-.github.io/2014/10/07/Sowhatexactlyisinsertionsort.html",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 50,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 12,
                    sorted: false
                }
            },
            exam: {
                stageName: "insertionSortExam",
                stepsToPass: 10,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "http://jackson-.github.io/2014/10/07/Sowhatexactlyisinsertionsort.html",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 30,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 12,
                    sorted: false
                }
            }
        },
        selectionSort: {
            freeToPlay: true,
            dependsOn:"insertionSort",
            tutorial: {
                stageName: "selectionSortTutorial",
                stepsToPass: 8,
                menu: {
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
                },
            },
            practise: {
                stageName: "selectionSortPractise",
                stepsToPass: 30,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 7,
                    maxElementsInSeq: 12,
                    sorted: false
                }
            },
            exam: {
                stageName: "selectionSortExam",
                stepsToPass: 20,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
                },
                gamePlay: {
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    minElementsInSeq: 6,
                    maxElementsInSeq: 14,
                    sorted: false
                }
            }
        },
        mergeSort: {
            freeToPlay: true,
            dependsOn:"selectionSort",
            tutorial: {
                stageName: "mergeSortTutorial",
                stepsToPass: 15,
                menu: {
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
                },
            },
            practise: {
                stageName: "mergeSortPractise",
                stepsToPass: 30,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "http://www.personal.kent.edu/~rmuhamma/Algorithms/MyAlgorithms/Sorting/mergeSort.htm",
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
                stepsToPass: 10,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "http://www.personal.kent.edu/~rmuhamma/Algorithms/MyAlgorithms/Sorting/mergeSort.htm",
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
            freeToPlay: true,
            dependsOn: "mergeSort",
            tutorial: {
                stageName: "quickSortTutorial",
                stepsToPass: 10,
                menu: {
                    MenuButtonDescription: "https://matse-hamburg.wikispaces.com/Selectionsort",
                },
            },
            practise: {
                stageName: "quickSortPractise",
                stepsToPass: 30,
                stepTime: 6000,
                menu: {
                    MenuButtonDescription: "http://www.mayankacademy.com/cs101/quick_sort/",
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
                stepsToPass: 10,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "http://www.mayankacademy.com/cs101/quick_sort/",
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
            freeToPlay: true,
            tutorial: {
                stageName: "debthFirstTutorial",
                stepsToPass: 12,
                menu: {
                    MenuButtonDescription: "https://www.cs.drexel.edu/~introcs/F2K/lectures/7.2_AI/Formal3.html",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 10,
                    maxSeqNumber: 100,
                    columns: 5,
                    rows: 5,
                }
            },
            practise: {
                stageName: "debthFirstPractise",
                stepsToPass: 20,
                stepTime: 2000,
                menu: {
                    MenuButtonDescription: "https://www.cs.drexel.edu/~introcs/F2K/lectures/7.2_AI/Formal3.html",
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
                stepsToPass: 10,
                stepTime: 2000,
                menu: {
                    MenuButtonDescription: "https://www.cs.drexel.edu/~introcs/F2K/lectures/7.2_AI/Formal3.html",
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
            freeToPlay: true,
            dependsOn: "debthFirst",
            tutorial: {
                stageName: "djikstraTutorial",
                stepsToPass: 10,
                menu: {
                    MenuButtonDescription: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
                },
                gamePlay: {
                    minElements: 5,
                    minSeqNumber: 1,
                    maxSeqNumber: 10,
                    columns: 5,
                    rows: 5,
                }
            },
            practise: {
                stageName: "djikstraPractise",
                stepsToPass: 30,
                stepTime: 5000,
                menu: {
                    MenuButtonDescription: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
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
                stepsToPass: 10,
                stepTime: 4000,
                menu: {
                    MenuButtonDescription: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
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




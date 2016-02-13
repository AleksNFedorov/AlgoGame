var Dictionary = {
    StageInit: {
        type: "info",
        messages: ["Level ready!"]
    },
    GameStarted: {
        type: "info",
        messages: [
            "Hurry Up ",
            "Let's go",
            "Ready to roll out",
            "let's do this",
            "Game started",
            "Run run run",
            "Fight!",
        ],
    },
    GameCorrectStepDone: {
        type: "Success",
        messages: [
            "Good job",
            "Yep, this one",
            "Awesome",
            "You are on a right track",
            "You are doing great! Keep going",
            "That was awesome!",
            "Sweet!",
            "That was flat-out good!",
            "Keep up the good work",
            "That was really cool",
            "That was very creative"
        ],
    },
    GameWrongStepDone: {
        type: "Fail",
        messages: [
            "No",
            "Nope",
            "Heck no",
            "Maybe another time",
            "NoNoNoNoNoNo",
            "I wish I could make it work",
            "Unfortunately not",
            "I cry, but decline",
        ],
    },
    GameMultiStepDone: {
        type: "Info",
        messages: [
            "No cheating",
            "You have only one attempt",
            "Hold on",
            "Hey, just wait a f'n minute!",
            "Give computer a chance",
            "gimme a sec",
        ],
    },
    //Element info messages
    MenuButtonDescription: "Algorithm descripion\nPress to get more \nabout algorithm",
    MenuButtonObjectives: "What you need\nto do this level",
    ControlPanelText: "Important game\n messages",
    ControlPanelButtonPlay: "Press to see \nalgorithm in action\nPress it now!!",
    ProgressBarStep: "Time till next step\nDo next step faster\nthen computer",
    ProgressBarComplete: "Your rigth steps\nFill it to open exam",
    MenuButtonExam: "Test your skills\nin Exam mode",
    
    //Menu buttons name
    binarySearch: {
        short: "Binary",
        full: "Binary search"
    },
    insertionSort: {
        short: "Insertion",
        full: "Insertion sort"
    },
    selectionSort: {
        short: "Selection",
        full: "Selection sort"
    },
    mergeSort: {
        short: "Merge",
        full: "Merge sort"
    },
    quickSort: {
        short: "Quick",
        full: "Quick sort"
    },
    debthFirst: {
        short: "Depth-first",
        full: "Depth-frist search"
    },
    djikstra: {
        short: "Djikstra",
        full: "Dijkstra's algorithm"
    },
};
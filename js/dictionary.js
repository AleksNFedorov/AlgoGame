var Dictionary = {
    
    statusUpdate: {
        WinHeadLine: "Win",
        WinSubHeadLine: "Win subheadline",
        
        FailHeadLine: "Fail",
        FailSubHeadLine: "Fail subheadline",
    
        ComputerWinHeadLine: "Computer win",
        ComputerWinSubHeadLine: "computer win subheadline",
        
        ComputerTurnHeadLine: "Computer turn",
        ComputerTurnSubHeadLine: "Computer turn sub headline",
        
    },

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
            "Just do it!",
        ],
    },
    GameEndByUser: {
        type: "info",
        messages: [
            "Wow, counting is a piece of cake to you ... great job!",
            "Algorithms is definitely your thing: keep going!",
            "You're gonna go far kid! Keep playing & learning!",
            "You truly have the ninja way with algorithms: well done!",
            "Algorithms have very little secrets for you ... you're on a roll!",
            "Impressive: keep challenging yourself!",
            "Show us some more of those algo-ninja chops!",
            "Keep using that brain power! You're on the right track."
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
    ProgressBarStep: "Time till next step\nDo next step faster\nthan computer",
    ProgressBarComplete: "Your rigth steps\nFill it to open exam",
    MenuButtonExam: "Test your skills\nin Exam mode",
    
    //Tutorial extra help message
    tutorialExtraHelp: "Pay attention",
    
    stageNames: {
        tutorial: "(tutorial)",
        practise: "(practise)",
        exam: "(exam)",
    },
    
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
        full: "Depth-first search"
    },
    djikstra: {
        short: "Djikstra",
        full: "Dijkstra's algorithm"
    },
    
    GeneralMessages : [
        "No algorithms? No open doors!",
        "Top IT companies are looking for you...but you have to know algorithms!",
        "Join the pro crowd, learn algorithms and unlock future opportunities.",
        "The most successful professionals already know this. Don't be left behind!",
        "Wanna be a successful developer? Algorithms are the way!",
        "What do the best software engineers have in common? they know algorithms.",
        "Algorithms are the stepping stone to your success!",
        "Master the algorithm and become a developing master!"
    ],
    
    //Scenario messages (Direct)
    scenarios: {
        general: {
        },
        binarySearch: [
          {
              message1: "1. Target value: X = 1",
              message2: "2. Click middle element: Y = 5",
              message3: "3. Y > X. Repeat with left side [1,2,3,4]",
              message4: "4. Click middle element: Y = 2",
              message5: "5. Y > X. Repeat with left side [1]",
              message6: "6. Click middle element: Y = 1",
              message7: "7. Y = X. Element found!",
          },
          {
              message1: "1. Target value: X = 28",
              message2: "2. Click middle element: Y = 16",
              message3: "3. Y < X. Repeat with right side [27,28,31,89,91,93]",
              message4: "4. Click middle element: Y = 31",
              message5: "5. Y > X. Repeat with left side [27, 28]",
              message6: "6. Click middle element: Y = 27",
              message7: "7. Y < X. Repeat with right side [28]",
              message8: "8. Click middle element: Y = 28",
              message9: "9. Y = X. Element found!",
          },
        ],
        insertionSort: [
          {
              message1: "1. Find first unsorted element: 2",
              message2: "2. Drag it to the right position: 1",
              message3: "3. Find next unsorted element: 1",
              message4: "4. Drag it to the right position: 1",
              message5: "5. Seqeunce sorted",
          },
          {
              message1: "1. Find first unsorted element: 2",
              message2: "2. Drag it to the right position: 1",
              message3: "3. Find next unsorted element: 1",
              message4: "4. Drag it to the right position: 1",
              message5: "5. Find next unsorted element: 1",
              message6: "6. Drag it to the right position: 2",
              message7: "7. Find next unsorted element: 6",
              message8: "8. Drag it to the right position 5",
              message9: "9. Find next unsorted element: 4",
              message10: "10. Drag it to the right position: 5",
              message11: "11. Seqeunce sorted",
          },
        ],
        selectionSort: [
          {
              message1: "1. Swap current element (3) with the smallest one",
              message2: "2. Drag 3 to 1",
              message3: "3. Elements 2,3,4 already sorted",
              message4: "4. Swap 7 with the next minimum: 5",
              message5: "5. Drag 7 to 5",
              message6: "6. Seqeunce sorted",
          },
          {
              message1: "1. Swap current (3) with the next minimum (1)",
              message2: "2. Drag 3 to 1 at position 3",
              message3: "3. Swap current (2) with the next minimum (1)",
              message4: "4. Drag 2 to 1 at position 4",
              message5: "5. Swap current (3) with the next minimum (2)",
              message6: "6. Drag 3 to 2",
              message7: "7. Swap current (15) with the next minimum (4)",
              message8: "8. Drag 15 to 4",
              message9: "9. Seqeunce sorted",
          },
        ],
        mergeSort: [
          {
              message1: "1. Recrusively divide on pairs (3,2)(1)|(4,7)(6,5)",
              message2: "2. Sort pair (3,2)",
              message3: "3. Drag 2 to position 1",
              message4: "4. Merge (2,3) and (1)",
              message5: "5. Drag 1 to position 1",
              message6: "6. Pair (4,7) already sorted",
              message7: "7. Sort pair (6,5)",
              message8: "8. Drag 5 to position 6",
              message9: "9. Merge (4,7) and (5,6)",
              message10: "10. Drag 5 to position 5",
              message11: "11. Drag 6 to position 6",
              message12: "12. Sorted!",
          },
          {
              message1: "1. Recrusively divide on pairs (3,2)(1)|(1,15)(6,4)",
              message2: "2. Sort pair (3,2)",
              message3: "3. Drag 2 to position 1",
              message4: "4. Merge (2,3) and (1)",
              message5: "5. Drag 1 to position 1",
              message6: "6. Pair (1,15) already sorted",
              message7: "7. Sort pair (6,4)",
              message8: "8. Drag 4 to position 6",
              message9: "9. Merge (1,15) and (4,6)",
              message10: "10. Drag 4 to position 5",
              message11: "11. Drag 6 to position 6",
              message12: "12. Merge (1,2,3) and (1,4,6,15)",
              message13: "13. Drag 1 at position 4 to position 2",
              message14: "14. Sorted!",
          },
        ],
        quickSort: [
          {
              message1: "1. Pivot: 3, Move all >= Pivot to the right side",
              message2: "2. Drag 8 on 3",
              message3: "3. Apply quick sort to the left side: (3,2,1)",
              message4: "4. Pivot: 2, Move all >= Pivot to the right side",
              message5: "5. Drag 3 on 1",
              message6: "6. Apply quick sort to the right side: (8,7,6,5)",
              message7: "7. Pivot: 7, Move all >= Pivot to the right side",
              message8: "8. Drag 8 on 5",
              message9: "9. Drag 7 on 6",
              message10: "10. Sorted!",
          },
          {
              message1: "1. Pivot: 1, Move all >= Pivot to the right side",
              message2: "2. Drag 3 on 1 at position 4",
              message3: "3. Drag 2 on 1 at position 3",
              message4: "4. Apply quick sort to the right side: (2,3,15,6,4)",
              message5: "5. Pivot: 15, Move all >= Pivot to the right side",
              message6: "6. Drag 15 on 4",
              message7: "7. Sorted!",
          },
        ],
        depthFirstSearch: [
          {
              message1: "1. Element to find: 3",
              message2: "2. Click top node: 0",
              
              message3: "3. Recursivelly iterate over all children",
              message4: "4. Click right child: 1",
              
              message5: "5. Recursivelly iterate over all children of node 1",
              message6: "6. Click node 2",
              
              message7: "7. Click left node of 0",
              message8: "8. Click node 3",
              message9: "9. Found",
          },
          {
              message1: "1. Element to find: 2",
              message2: "2. Click top node: 0",
              
              message3: "3. Recursivelly iterate over all children",
              message4: "4. Click right child: 1",
              
              message5: "5. Recursivelly iterate over all children of node 1",
              message6: "6. Click node 4",
              
              message7: "7. Click node 3",
              
              message8: "8. Click node 2",
              
              message9: "9. Found",
          },
        ],
        djikstraSearch: [
          {
              message1: "1. Find the cheapest route from green to orange node",
              message2: "2. Click node (blinkig arrow) and set price: 10",
              
              message3: "3. Click next node and set price: 4",
              
              message4: "4. Update price for next node: 10 > 9",
              message5: "5. Click node and set price: 9",
              
              message6: "5. The cheapest route cost: 9",
          },
          {
              message1: "1. Find the cheapest route from green to orange node",
              message2: "2. Click node (blinkig arrow) and set price 3",
              
              message3: "3. Click next node and set price: 13 (3 + 10)",
              
              message4: "4. Click next node and set price: 4 (3 + 1)",
              
              message5: "5. No need to update price: 5 > 4",
              message6: "6. Click next node and set old price: 4",

              message7: "7. Update price for the next node: 11 < 13",
              message8: "8. Click node and set price: 11",

              message9: "9. The cheapest route cost: 11",
          },
        ],
    },
};
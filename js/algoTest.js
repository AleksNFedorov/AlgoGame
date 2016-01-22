

var arraysToSort = [];

var printArray = function(array) {
    
    var content = "[";
    for(var i=0; i< array.length; ++i) {
        content += array[i] +", ";
        
    }
    content += "]";
    print(content);
};

var printStep = function(step) {
    print("[ isLast:" + step.isLast + "][ elementIndex: " + step.index + "][ moveTo:" + step.moveTo + "]");
    printArray(step.array);
};

var evluate = function() {

    for(var i=0; i<arraysToSort.length; ++i) {
        print("----------------------------");
        
        var steps = sort(arraysToSort[i]);
        for(var k=0; k<steps.length;++k) {
            printStep(steps[k]);
        }
        
        print("----------- END ----------------");
    }
    
};

var addStep = function(steps, index, moveTo, array) {
    steps.push({
        isLast:false,
        index:index,
        moveTo:moveTo,
        array: array.slice(0)
    });
}

//////////////////////////////////////////////////
var sort = function(values) {
    
    var steps = [];
    
//    addStep(steps, -1, -2, values);
    
    var length = values.length;
    for(var i = 1; i < length; ++i) {
        var temp = values[i];
        var j = i - 1;
        for(; j >= 0 && values[j] > temp; --j) {
            values[j+1] = values[j];
        }
        values[j+1] = temp;
        addStep(steps, i, j+1, values)
        
    }
    
    steps[steps.length - 1].isLast = true;
    
    return steps;
};

/////////////////////////////////////////////
arraysToSort.push([1,3,5,2,3,67,8,9,4]);

evluate();






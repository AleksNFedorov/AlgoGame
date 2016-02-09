/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />

module Sort {

    export class ElementWithIndex {
        constructor(public value: number, public index: number){}
    }

    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number, public position: number){};
    }

    export class Step extends Common.AlgorithmStep {
        private _newPosition: number;
        private _currentArray: number[];
      
        constructor(stepNumber: number, newPosition: number, array: number[] = []) {
            super(false, stepNumber);
            this._newPosition = newPosition;
            this._currentArray = array.slice(0);
        }
        
        public get parameters(): number[] {
            return this._currentArray.slice(0);
        }
        
        public get newPosition(): number {
            return this._newPosition;  
        }
        
        public toString(): string {
          return "[" + this.isLast + "][" + this.newPosition + "]";  
        }
    }
    
    
    class AbstractSortingBoxLine extends Common.LineGameArena<SortAction> {
        
        private _dragging: boolean = false;
        protected _placeToInsert: number = -1;
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            super(game, boxClickedCallback, sequence);
        }

        protected init(sequence: number[]): void {
            super.init(sequence);
            this._game.input.addMoveCallback(this.move, this);
        }
        
        private move(pointer: any, x: number, y: number): void {
            if (this._dragging) {
                this.updateSeparator(x, y);
            }
        }
        
        protected updateSeparator(x, y): void {
            throw "Method is not implemented [updateSeprator]";
        }

        protected onBoxClickPressed(index: number): void {
            this._dragging = true;
            this._placeToInsert = index;
            this._boxes[index].alpha = 0.5;
        }
        
        protected onBoxClickReleased(index: number): void {
            this._boxes[index].alpha = 1;
            this.hideSeparator();
            if (this._dragging) {
                console.log("Box [" + index + "][" + this._placeToInsert + "]");
                this.onAction(new SortAction(index, this._placeToInsert));
                this._dragging = false;
            }
        }
        
        public hideSeparator(): void {
            throw "Method is not implemented [hideSeparator]";
        }

        public applyAction(action: SortAction): void {
            throw "Method is not implemented [applyAction]";
        }
        
    }
    
    class SwapBoxLine extends AbstractSortingBoxLine {
        
        private _stepSize: number;
        private _swapBox: Common.BoxContainer
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            super(game, boxClickedCallback, sequence);
            this._stepSize = this.calcualteStepSize();
        }
        
        private calcualteStepSize(): number {
            return this._boxes[1].x - this._boxes[0].x;
        }
        
        public applyAction(action: SortAction): void {
            
            var fromBoxIndex = action.index;
            var toBoxIndex = action.position;
            
            var fromBox: Common.BoxContainer = this._boxes[fromBoxIndex];
            var toBox: Common.BoxContainer = this._boxes[toBoxIndex];

            this.swapBoxes(fromBoxIndex, toBoxIndex);

            var fromBoxMoveUp: Phaser.Tween = this._game.add.tween(fromBox).to({y: fromBox.y - 60}, 300, "Quart.easeOut");
            var fromBoxMoveTo: Phaser.Tween = this._game.add.tween(fromBox).to({y: toBox.y, x: toBox.x}, 300, "Quart.easeOut");
            
            fromBoxMoveUp.chain(fromBoxMoveTo);

            var toBoxMoveUp: Phaser.Tween = this._game.add.tween(toBox).to({y: toBox.y - 60}, 300, "Quart.easeOut");
            var toBoxMoveFrom: Phaser.Tween = this._game.add.tween(toBox).to({y: fromBox.y, x: fromBox.x}, 300, "Quart.easeOut");
            
            toBoxMoveUp.chain(toBoxMoveFrom);
            
            fromBoxMoveUp.start();
            toBoxMoveUp.start();
        }
        
        private swapBoxes(fromIndex: number, toIndex: number) {
            var fromBox = this._boxes[fromIndex];
            var toBox = this._boxes[toIndex];
            
            fromBox.setBoxIndex(toIndex);
            toBox.setBoxIndex(fromIndex);
            
            this._boxes[fromIndex] = toBox;
            this._boxes[toIndex] = fromBox;
        }
        
        protected updateSeparator(x, y): void {

            this.hideSeparator();

            var elementIndex = Math.floor((x - this._boxLine.x) / this._stepSize);
            elementIndex = Math.max(0, elementIndex);
            elementIndex = Math.min(this._boxes.length - 1, elementIndex);
            
            console.log(`Element index [${elementIndex}] `);
            this._swapBox = this._boxes[elementIndex];
            this._swapBox.setState(Common.BoxState.SELECTED_GREEN);
            
            this._placeToInsert = elementIndex;

        }

        public hideSeparator(): void {
            
            if (this._swapBox != null) {
                this._swapBox.setState(Common.BoxState.ACTIVE);
            }
        }
    }
    
    class ShiftBoxLine extends AbstractSortingBoxLine {
        
        private _separator: Phaser.Sprite;
        private _separatorIndex: number[] = [];
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            super(game, boxClickedCallback, sequence);
            this._separator = this.createSeparator();
            this._separatorIndex = this.createSeparatorIndex();
        }
         
        protected updateSeparator(x: number, y: number): void {
            
            var stepWidth = this._separatorIndex[1] - this._separatorIndex[0];
            x += stepWidth / 2;
            var leftBorder = this._separatorIndex[0];
            var nx = Math.max(leftBorder, x);
            nx = Math.min(this._boxLine.x + this._boxLine.width + stepWidth / 2, nx);

            var indexElement = Math.floor( (nx-leftBorder)/stepWidth);
            
            this._separator.alpha = 1;
            this._separator.y = this._boxLine.y;
            this._separator.x = this._separatorIndex[indexElement];
            
            this._placeToInsert = indexElement;
        }
        
        public applyAction(action: SortAction): void {
            
            var targetElementIndex: number = action.index;
            var newPosition: number = action.position;
            
            var targetBox: Common.BoxContainer = this._boxes[targetElementIndex];
            var moveUp: Phaser.Tween = this._game.add.tween(targetBox).to({y: targetBox.y - 60}, 70, "Quart.easeOut");
            var moveDown: Phaser.Tween = this._game.add.tween(targetBox).to({y: targetBox.y}, 70, "Quart.easeOut");
            
            var headTween: Phaser.Tween = moveUp;
            var shiftedBox: Common.BoxContainer = targetBox;
            
            if (targetElementIndex < newPosition) {
                //shifting right
                for(var i = targetElementIndex + 1; i<newPosition; i++) {
                    var shiftingBox = this._boxes[i];
                    
                    this.moveBox(shiftingBox, i-1);
                    
                    this._game.add.tween(shiftingBox).to({x: shiftedBox.x}, 100, "Quart.easeOut").start();
                    shiftedBox = shiftingBox;
                    
                }
                this.moveBox(targetBox, newPosition - 1);

                
            } else if (targetElementIndex > newPosition) {
                //shifting left
                for(var i = targetElementIndex - 1; i>=newPosition; i--) {
                    var shiftingBox = this._boxes[i];
                    
                    this.moveBox(shiftingBox, i+1);
                    
                    this._game.add.tween(shiftingBox).to({x: shiftedBox.x}, 100, "Quart.easeOut").start();
                    shiftedBox = shiftingBox;
                    
                }
                this.moveBox(targetBox, newPosition);
            }
            
           var moveHorizontal: Phaser.Tween = this._game.add.tween(targetBox).to({x: shiftedBox.x}, 300, "Quart.easeOut");
           headTween.chain(moveHorizontal);
           moveHorizontal.chain(moveDown);
            
           moveUp.start();
        }
        
        public hideSeparator(): void {
            this._separator.alpha = 0;
        }
        
        private createSeparator(): Phaser.Sprite {
            var seprator: Phaser.Sprite =  this._game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, "separator_arrow.png");
            seprator.alpha = 0;
            seprator.anchor.x = 0.5;
            seprator.anchor.y = 1.1;
            
            return seprator;
        }
        
        private createSeparatorIndex(): number[] {
            
            var boxWidth = this._boxes[0].width;
            var boxSpace = this._boxes[1].x - (this._boxes[0].x + boxWidth);
            var stepDelta = boxSpace + boxWidth;
            var startPosition = Constants.GAME_AREA_MARGIN - boxSpace /2 ;
            
            var index: number[] = [];
            for(var i=0; i<= this._boxes.length; ++i) {
                index.push(startPosition + (i * stepDelta));
            }
            
            return index;
        }
        
        protected moveBox(box: Common.BoxContainer, newPosition: number): void {
            this._boxes[newPosition] = box;
            box.setBoxIndex(newPosition);
        }
        
        public destroy(): void {
            super.destroy();
            this._separator.destroy();
            this._separatorIndex = null;
        }
    }
    
    class AbstractSortPractiseGamePlay<T extends Common.Algorithm> extends Common.PractiseGamePlay<SortAction, T> {
        
        protected _boxLine: AbstractSortingBoxLine;
        
        protected onInit(): void {
            this._boxLine = this.createBoxLine();
        }
        
        protected highlightElement(index: number) {
            this._boxLine.selectBox(index);
        }
        
        protected createBoxLine(): AbstractSortingBoxLine {
            throw "Method is not implemented [createBoxLine]";
        }
        
        protected createAlgorithm(config: any): T {
            throw "Method not implemented [createAlgorithm()]";
        }
        
        protected clickBox() {
            var step: Step = this.getCurrentStep();
            this.boxClicked(new SortAction(step.stepNumber, step.newPosition), false);
            this._boxLine.hideSeparator();
            console.log("Timer clicked " + step.stepNumber);
        }

        protected isCorrectStep(action: SortAction): boolean {
            var step: Step = this.getCurrentStep();
            return step.stepNumber === action.index 
                && step.newPosition === action.position;
        }
        
        protected onCorrectAction(): void {
            var step: Step = this.getCurrentStep();
            this._boxLine.applyAction(new SortAction(step.stepNumber, step.newPosition));
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._boxLine != null) {
                this._boxLine.destroy();            
            }
        }
        
        protected getCurrentStep(): Step {
            return <Step>this._algorithmStep;
        }
    }
    
    class AbstractSortExamGamePlay < T extends Common.Algorithm > extends Common.ExamGamePlay<SortAction, T> {
        
        protected _boxLine: AbstractSortingBoxLine;
        
        protected onInit(): void {
            this._boxLine = this.createBoxLine();
        }
        
        protected highlightElement(index: number) {
            this._boxLine.selectBox(index);
        }
        
        protected createBoxLine(): AbstractSortingBoxLine {
            throw "Method is not implemented [createBoxLine()]";
        }
        
        protected createAlgorithm(config: any): T {
            throw "Method not implemented [createAlgorithm()]";
        }
        
        protected clickBox() {
            this.boxClicked(new SortAction(0, 0), false);
            this._boxLine.hideSeparator();
        }

        protected isCorrectStep(action: SortAction): boolean {
            var step: Step = this.getCurrentStep();
            return step.stepNumber === action.index 
                && step.newPosition === action.position;
        }
        
        protected onCorrectAction(): void {
            var step: Step = this.getCurrentStep();
            this._boxLine.applyAction(new SortAction(step.stepNumber, step.newPosition));
        }
        
        protected destroyTempObjects():void {
            super.destroyTempObjects();
            if (this._boxLine != null) {
                this._boxLine.destroy();            
            }
        }
        
        protected getCurrentStep(): Step {
            return <Step>this._algorithmStep;
        }

    }
    
    export class ShiftSortPractiseGamePlay< T extends Common.Algorithm > extends AbstractSortPractiseGamePlay<T> {
        
        protected createBoxLine(): AbstractSortingBoxLine {
            return new ShiftBoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence);
        }
    }
    
    export class ShiftSortExamGamePlay< T extends Common.Algorithm > extends AbstractSortExamGamePlay<T> {
        
        protected createBoxLine(): AbstractSortingBoxLine {
            return new ShiftBoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence);
        }
    }
    
    export class SwapSortPractiseGamePlay< T extends Common.Algorithm > extends AbstractSortPractiseGamePlay<T> {
        
        protected createBoxLine(): AbstractSortingBoxLine {
            return new SwapBoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence);
        }
    }
    
    export class SwapSortExamGamePlay< T extends Common.Algorithm > extends AbstractSortExamGamePlay<T> {
        
        protected createBoxLine(): AbstractSortingBoxLine {
            return new SwapBoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence);
        }
    }
}

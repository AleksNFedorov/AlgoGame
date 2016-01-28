/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />

module Sort {

    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number, public position: number){};
    }

    export class Step extends Common.AlgorithmStep {
        private _newPosition: number;
        private _currentArray: number[];
      
        constructor(stepNumber: number, newPosition: number, array: number[]) {
            super(false, stepNumber);
            this._newPosition = newPosition;
            this._currentArray = array.slice(0);
        }
        
        public get newPosition(): number {
            return this._newPosition;  
        }
        
        public toString(): string {
          return "[" + this.isLast + "][" + this.newPosition + "]";  
        }
    }
    
    export class BoxContainer extends Phaser.Group {

        private _boxIndex: number;
        
        private _pressCallback: Function;
        private _releaseCallback: Function;
        
        constructor(game:Common.AlgoGame, boxValue: number, pressCallback: Function, releaseCallback: Function) {
            super(game);
            this._pressCallback = pressCallback;
            this._releaseCallback = releaseCallback;
            
            this.initBox(game, boxValue);
            
            game.add.existing(this);
        }
        
        private initBox(game: Common.AlgoGame, value: number): void {

            var box: Phaser.Sprite =  game.add.sprite(0,0, 'box');
            var boxKeyText: Phaser.Text = game.add.text(box.height/2, box.width/2 , "" + value, Constants.CONTROL_PANEL_MESSAGE_STYLE);
            boxKeyText.anchor.setTo(0.5);
            
            box.inputEnabled = true;
            box.events.onInputDown.add(this.onInputDown.bind(this));
            box.events.onInputUp.add(this.onInputUp.bind(this));

            boxKeyText.inputEnabled = true;
            boxKeyText.events.onInputDown.add(this.onInputDown.bind(this));
            boxKeyText.events.onInputUp.add(this.onInputUp.bind(this));

            
            this.add(box);
            this.add(boxKeyText);
        }
        
        public setBoxIndex(boxIndex: number): void {
            this._boxIndex = boxIndex;
        } 
        
        private onInputDown(): void {
            console.log("Index clicked " + this._boxIndex);
            this._pressCallback(this._boxIndex);
        }
        
        private onInputUp(): void {
            this._releaseCallback(this._boxIndex);
        }
    }
    
    class AbstractSortingBoxLine {
        
        protected _boxes: BoxContainer[] = [];
        protected _boxLine: Phaser.Group;
        protected _game: Common.AlgoGame;
        
        private _boxClickedCallback: Function;
        
        private _dragging: boolean = false;
        protected _placeToInsert: number = -1;

        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence);
        }
        
        private init(seqeunce: number[]) {
            this._boxLine = this._game.add.group();
            this._boxLine.x = 20;
            this._boxLine.y = 300;

            this._boxes = this.createBoxes(seqeunce);
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

        private onBoxStartDragging(index: number): void {
            this._dragging = true;
            this._placeToInsert = index;
            this._boxes[index].alpha = 0.5;
        }
        
        private onBoxStopDragging(index: number): void {
            this._boxes[index].alpha = 1;
            this.hideSeparator();
            if (this._dragging) {
                console.log("Box [" + index + "][" + this._placeToInsert + "]");
                this._boxClickedCallback(new SortAction(index, this._placeToInsert));
                this._dragging = false;
            }
        }
        
        public hideSeparator(): void {
            throw "Method is not implemented [hideSeparator]";
        }

        public applyAction(action: SortAction): void {
            throw "Method is not implemented [applyAction]";
        }
        
        protected moveBox(box: BoxContainer, newPosition: number): void {
            this._boxes[newPosition] = box;
            box.setBoxIndex(newPosition);
        }
        
        protected createBoxes(seqeunce: number[]): BoxContainer[] {
            
            var boxes: BoxContainer[] = [];
            var boxInterval = 1000/seqeunce.length;
            
            for(var index = 0; index < seqeunce.length; ++index) {
                var boxContainer: BoxContainer = this.createBox(index, seqeunce[index]);
                this._boxLine.add(boxContainer);
                boxContainer.x = boxInterval * index;
                boxContainer.y = 0;
                
                boxes.push(boxContainer);
                
                var boxIndexText: Phaser.Text = this._game.add.text(boxContainer.x + 30,  boxContainer.y + 60 , "" + (index + 1), Constants.CONTROL_PANEL_MESSAGE_STYLE);
                boxIndexText.anchor.setTo(0.5);
                this._boxLine.add(boxIndexText);
            }
            
            return boxes;
        }
        
        private createBox(index: number, value: number): BoxContainer {
            var boxContainer: BoxContainer = new BoxContainer(this._game,
                    value,
                    this.onBoxStartDragging.bind(this),
                    this.onBoxStopDragging.bind(this)
                );
            boxContainer.setBoxIndex(index);
            return boxContainer;
        }

        public destroy(): void {
            for(var box of this._boxes) {
                box.destroy();
            }
            
            this._boxes = [];
            this._boxLine.destroy();
        }
        
    }
    
    class SwapBoxLine extends AbstractSortingBoxLine {
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            super(game, boxClickedCallback, sequence);
        }
        
        public applyAction(action: SortAction): void {
            
            var fromBoxIndex = action.index;
            var toBoxIndex = action.position;
            
            var fromBox: BoxContainer = this._boxes[fromBoxIndex];
            var toBox: BoxContainer = this._boxes[toBoxIndex];

            var fromBoxMoveUp: Phaser.Tween = this._game.add.tween(fromBox).to({y: fromBox.y - 60}, 70, "Quart.easeOut");
            var fromBoxMoveTo: Phaser.Tween = this._game.add.tween(fromBox).to({y: toBox.y, x: toBox.x}, 70, "Quart.easeOut");
            
            fromBoxMoveUp.chain(fromBoxMoveTo);

            var toBoxMoveUp: Phaser.Tween = this._game.add.tween(toBox).to({y: toBox.y - 60}, 70, "Quart.easeOut");
            var toBoxMoveFrom: Phaser.Tween = this._game.add.tween(toBox).to({y: fromBox.y, x: fromBox.x}, 70, "Quart.easeOut");
            
            toBoxMoveUp.chain(toBoxMoveFrom);
            
            fromBoxMoveUp.start();
            toBoxMoveUp.start();
            
            this.moveBox(fromBox, toBoxIndex);
            this.moveBox(toBox, fromBoxIndex);
        }

    }
    
    class ShiftBoxLine extends AbstractSortingBoxLine {
        
        private _separator: Phaser.Sprite;
        private _separatorIndex: number[] = [];
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            super(game, boxClickedCallback, sequence);
            this._separatorIndex = this.createSeparatorIndex();
            this._separator = this.createSeparator();
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
            
            var targetBox: BoxContainer = this._boxes[targetElementIndex];
            var moveUp: Phaser.Tween = this._game.add.tween(targetBox).to({y: targetBox.y - 60}, 70, "Quart.easeOut");
            var moveDown: Phaser.Tween = this._game.add.tween(targetBox).to({y: targetBox.y}, 70, "Quart.easeOut");
            
            var headTween: Phaser.Tween = moveUp;
            var shiftedBox: BoxContainer = targetBox;
            
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
            var seprator: Phaser.Sprite =  this._game.add.sprite(0,0, 'box');
            seprator.alpha = 0;
            seprator.width *= 0.1;
            seprator.anchor.x = 0.5;
            
            return seprator;
        }
        
        private createSeparatorIndex(): number[] {
            
            var boxWidth = this._boxes[0].width;
            var boxSpace = this._boxes[1].x - (this._boxes[0].x + boxWidth);
            var stepDelta = boxSpace + boxWidth;
            var startPosition = this._boxLine.x - boxSpace/2;
            
            var index: number[] = [];
            for(var i=0; i<= this._boxes.length; ++i) {
                index.push(startPosition + (i * stepDelta));
            }
            
            return index;
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
        
        protected createBoxLine(): AbstractSortingBoxLine {
            throw "Method is not implemented [createBoxLine]";
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

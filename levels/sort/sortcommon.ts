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
    
    class InsertionSortAlgorithm extends Common.Algorithm {
        
        private _steps: Step[] = [];
        private _lastRequestedStepNumber: number = -1;
        
        constructor(config: any) {
            super(config);
            this._steps = this.runalgorithm();
            this.updateLastStep();
        }
        
        public getNextStep(): Step {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
        }
        
        private runalgorithm(): Step[] {
            
            var steps: Step[] = [];
            var values = this.sequence.slice(0);
            
            var length = values.length;
            for(var i = 1; i < length; ++i) {
                var temp = values[i];
                var j = i - 1;
                for(; j >= 0 && values[j] > temp; --j) {
                    values[j+1] = values[j];
                }
                values[j+1] = temp;
                
                if (i != (j + 1)) {
                    //No reason to keep speps with no changes
                    steps.push(new Step(i, j+1, values));
                }
            }
            return steps;
        }
        
        private updateLastStep(): void {
            this._steps[this._steps.length - 1].setIsLast();
        }
    }
    
    class BoxContainer extends Phaser.Group {

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
            console.log("Set box index [" + boxIndex + "][" + this._boxIndex + "]");
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
    
    
    class BoxLine {
        
        private _boxes: BoxContainer[] = [];
        private _separatorIndex: number[] = [];
        private _boxLine: Phaser.Group;
        private _game: Common.AlgoGame;
        private _boxClickedCallback: Function;
        private _separator: Phaser.Sprite;
        
        private _dragging: boolean = false;
        private _placeToInsert: number = -1;

        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence);
            this._separator = this.createSeparator();
        }
        
        private init(seqeunce: number[]) {
            this._boxLine = this._game.add.group();
            this._boxLine.x = 20;
            this._boxLine.y = 300;

            this._boxes = this.createBoxes(seqeunce);
            this._separatorIndex = this.createSeparatorIndex();
            this._game.input.addMoveCallback(this.move, this);
        }
        
        private move(pointer: any, x: number, y: number): void {
            if (this._dragging) {
                this.updateSeparator(x, y);
            }
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
                this._boxClickedCallback(new SortAction(index, this._placeToInsert));
                this._dragging = false;
            }
        }
        
        private updateSeparator(x: number, y: number): void {
            
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
        
        public shiftElements(targetElementIndex: number, newPosition: number): void {
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
        
        private moveBox(box: BoxContainer, newPosition: number): void {
            this._boxes[newPosition] = box;
            box.setBoxIndex(newPosition);
        }
        
        private hideSeparator(): void {
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

        private createBoxes(seqeunce: number[]): BoxContainer[] {
            
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
    
    
    export class SortPractiseGamePlay extends Common.PractiseGamePlay<SortAction, InsertionSortAlgorithm> {
        
        protected _boxLine: BoxLine;
        
        protected onInit(): void {
            this._boxLine = new BoxLine(this._game,     
                this.boxClicked.bind(this), 
                this._algorithm.sequence);
        }

        
        protected createAlgorithm(config: any): InsertionSortAlgorithm {
            return new InsertionSortAlgorithm(config);
        }
        
        protected clickBox() {
            var step: Step = this.getCurrentStep();
            this.boxClicked(new SortAction(step.stepNumber, step.newPosition), false);
        }

        protected isCorrectStep(action: SortAction): boolean {
            var step: Step = this.getCurrentStep();
            return step.stepNumber === action.index 
                && step.newPosition === action.position;
        }
        
        protected onCorrectAction(): void {
            var step: Step = this.getCurrentStep();
            this._boxLine.shiftElements(step.stepNumber, step.newPosition);
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
    
}

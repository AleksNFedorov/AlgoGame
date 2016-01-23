/// <reference path="../../components/common.ts" />
/// <reference path="../../components/gameplay.ts" />

module Sort {

    export enum Operation {Shift, Swap, Unknown}

    export class SortAction implements Common.GamePlayAction {
        constructor(public index: number, public position: number){};
    }

    export class Step extends Common.AlgorithmStep {
        private _newPosition: number;
        private _operation: Operation = Operation.Unknown;
        private _currentArray: number[];
      
        constructor(stepNumber: number, newPosition: number, operation: Operation, array: number[]) {
            super(false, stepNumber);
            this._newPosition = newPosition;
            this._operation = operation;
            this._currentArray = array.slice(0);
        }
        
        public get newPosition(): number {
            return this._newPosition;  
        }
        
        public get operation(): Operation {
            return this._operation;
        }
        
        public toString(): string {
          return "[" + this.isLast + "][" + this.newPosition + "]";  
        }
    }
    
    class InsertionSortAlgorithm extends Common.Algorithm {
        
        private _steps: Step[] = [];
        private _lastRequestedStepNumber: number = -1;
        
        constructor(config: GameConfig.SequenceConfig) {
            super(config);
            this.runalgorithm();
            this.updateLastStep();
        }
        
        public getNextStep(): Step {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
        }
        
        private runalgorithm(): Step[] {
            
            var steps: Step[] = [];
            var values = this.sequence;
            
            var length = values.length;
            for(var i = 1; i < length; ++i) {
                var temp = values[i];
                var j = i - 1;
                for(; j >= 0 && values[j] > temp; --j) {
                    values[j+1] = values[j];
                }
                values[j+1] = temp;
                steps.push(new Step(i, j+1, Operation.Shift, values));
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
            box.events.onInputDown.add(this.onInputDown);
            box.events.onInputUp.add(this.onInputUp);

            boxKeyText.inputEnabled = true;
            boxKeyText.events.onInputDown.add(this.onInputDown);
            boxKeyText.events.onInputUp.add(this.onInputUp);

            
            this.add(box);
            this.add(boxKeyText);
        }
        
        public set boxIndex(boxIndex: number) {
            this._boxIndex = boxIndex;
        } 
        
        private onInputDown(): void {
            this._pressCallback(this._boxIndex);
        }
        
        private onInputUp(): void {
            this._releaseCallback(this._boxIndex);
        }
        
    }
    
    
    class BoxLine {
        
        private _boxes: BoxContainer[] = [];
        private _boxLine: Phaser.Group;
        private _game: Common.AlgoGame;
        private _boxClickedCallback: Function;
        
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
        }
        
        public higlightBox(boxIndex: number) {
            /*
            var boxContainer: BoxContainer = this._boxes[boxIndex];
            var boxGroup: Phaser.Group = boxContainer.boxGroup;

            this._game.add.tween(boxGroup).to({y:boxGroup.y - 4}, 
                300, 
                Phaser.Easing.Exponential.Out, true);
            */                
        }
        
        public selectBox(boxIndex: number) {
            // this.higlightBox(boxIndex);
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
                
                var boxIndexText: Phaser.Text = this._game.add.text(boxContainer.x,  boxContainer.y + 35 , "" + (index + 1), Constants.CONTROL_PANEL_MESSAGE_STYLE);
                boxIndexText.anchor.setTo(0.5);
                
            }
            
            return boxes;
        }
        
        private createBox(index: number, value: number): BoxContainer {
            var boxContainer: BoxContainer = new BoxContainer(this._game,
                    value,
                    this.onBoxStartDragging.bind(this),
                    this.onBoxStopDragging.bind(this)
                );
            boxContainer.boxIndex = index;
            return boxContainer;
        }

        private onBoxStartDragging(index: number): void {
        }
        
        private onBoxStopDragging(index: number): void {
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
            this.boxClicked(new SortAction(0,0));
        }

        protected isCorrectStep(action: SortAction): boolean {
            var step: Step = this.getCurrentStep();
            return false;
        }
        
        protected onCorrectAction(): void {
            var step: Step = this.getCurrentStep();
            // this._boxLine.hideBoxesOutOf(step.startIndex, step.endIndex);
            // this._boxLine.selectBox(step.elementIndex);
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

/// <reference path="./common.ts" />
/// <reference path="./captainup.ts" />

module Common {   
    
    
    export enum FlagPosition {CENTER, LEFT, RIGHT};
    export enum FlagLevel {TOP, MIDDLE, BOTTOM};
    
    export interface GamePlayAction {}
    
    // Abstract algorithm step, represents single step of given algorithm.
    // Particular algorithm should use it of extend.
    export class AlgorithmStep {
        
        messageKeys: string[] = [];
        isLast: boolean;
        stepNumber: number;

        constructor(isLast: boolean, stepNumber: number) {
            this.isLast = isLast;
            this.stepNumber = stepNumber;
        }
        
        public setIsLast(): void {
            this.isLast = true;
        }
        
    }
    
    export class Algorithm {

        protected _sequence: any[];
        protected _steps: AlgorithmStep[] = [];
        
        private _lastRequestedStepNumber: number = -1;
        
        public restore(settings: any): void {
            this._sequence = settings.sequence;
            this._steps = settings.steps;
        }
        
        public getNextStep(): AlgorithmStep {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
        }

        public get sequence(): any[] {
            return this._sequence;
        }
        
        public init(): void {}

        public static getRandomInteger(from: number, to: number): number {
            return Math.floor(Math.random() * (to - from) + from);
        }
    }

    export class ConfigurableAlgorithm extends Algorithm {
        
        protected config: any;

        constructor(config: any) {
            super();
            this.config = config;
        }
        
        public init(): void {
            this._sequence = this.generateSeqeunce(this.config);
            this._steps = this.runAlgorithm();
            this.updateLastStep();
        }
        
        protected runAlgorithm(): AlgorithmStep[] {
            return [];   
        }
        
        private updateLastStep(): void {
            this._steps[this._steps.length - 1].setIsLast();
        }

        protected generateSeqeunce(config: any): any[] {

            var varElements = config.maxElementsInSeq - config.minElementsInSeq;    
            var count = config.minElementsInSeq + Algorithm.getRandomInteger(0, varElements);
    
            var newGeneratedArray: number[] = [];
            
            for (var i = 0; i < count; i++) { 
                var y = this.getRandomSeqNumber();
                newGeneratedArray.push(y);
                console.log("New element created " + y);
            }
            
            if (config.sorted) {
                console.log("Sorting array");
                newGeneratedArray.sort(function(a,b){return a-b;});
            }
            
            return newGeneratedArray;
        }
        
        protected getRandomSeqNumber(): number {
            return Algorithm.getRandomInteger(this.config.minSeqNumber, this.config.maxSeqNumber);
        }

    }   
    
    export enum ArrowDirection {UPDOWNRIGHT, UPDOWN, UPDOWNLEFT, LEFTRIGHT, RIGHTLEFT}
    
    export class ArrowUI extends Phaser.Group {
        
        private _arrow: Phaser.Sprite;
        private _edge: Phaser.Sprite;
        
        constructor(game: Phaser.Game, fromPoint: Phaser.Point, toPoint: Phaser.Point, direction: ArrowDirection) {
            super(game);
            
            this.drawArrow(fromPoint, toPoint, direction)
                        
            this._arrow.animations.add("blink", [
                    "graph-arrow1.png",
                    "graph-arrow2.png",
                    "graph-arrow3.png",
                    "graph-arrow4.png"
                    ], 6, true);

        }
        
        private drawArrow(fromNodePoint: Phaser.Point, toNodePoint: Phaser.Point, direction: ArrowDirection) {
            
            var edge = this.game.add.sprite(fromNodePoint.x, fromNodePoint.y, Constants.GAME_GENERAL_ATTLAS, "graphEdge.png", this);
            var arrow = this.game.add.sprite(toNodePoint.x, toNodePoint.y , Constants.GAME_GENERAL_ATTLAS, "graph-arrow1.png", this);
            
            switch(direction) {
                case ArrowDirection.RIGHTLEFT:
                    edge.width = fromNodePoint.x - toNodePoint.x - arrow.width;
                    arrow.x += arrow.width;
                    edge.angle = -180;
                    
                    arrow.y += arrow.height/2 - edge.height/2;
                    
                    arrow.angle = -180;
                    break;
                case ArrowDirection.LEFTRIGHT:
                    edge.width = toNodePoint.x - fromNodePoint.x - arrow.width;
                    arrow.x -= arrow.width;
                    arrow.y -= arrow.height/2 - edge.height/2;
                    
                    break;
                case ArrowDirection.UPDOWN:
                    edge.width -= 60;
                    edge.x += 29;
                    edge.y += 27;
                    edge.angle = 90;
                    
                    arrow.x += 36;
                    arrow.y += -11;
                    arrow.angle = 90;

                    break;
                case ArrowDirection.UPDOWNLEFT:
                    edge.width -= 13;
                    edge.x += 27;
                    edge.y += 27;
                    edge.angle = -215;
                    
                    arrow.x += 60;
                    arrow.y += 9;
                    arrow.angle = -215;

                    break;
                case ArrowDirection.UPDOWNRIGHT:
                    edge.width -= 15;
                    edge.x += 27;
                    edge.y += 27;
                    edge.angle = 35;
                    
                    arrow.y -= 3;
                    arrow.angle = 35;
                    
                    break;
            }
            this._arrow = arrow;
            this._edge = edge;
        }
        
        public highlightArrow(): void {
            this._arrow.animations.play("blink");
        }
        
        public stopHiglightingArrow(): void {
            this._arrow.animations.stop("blink");
            this._arrow.frameName = "graph-arrow1.png";
        }
    }
    
    // contains location info for given flag, used to show on game arena as helpers
    export class FlagLocationInfo {
        constructor(public index: number, public position: FlagPosition, public level: FlagLevel) {};
    }
    
    export enum BoxState {ACTIVE , SELECTED_BLUE, SELECTED_GREEN, SELECTED_ORANGE, DISABLED}
    
    export class BoxContainer extends Phaser.Group {

        protected _boxIndex: number;
        
        protected _box: Phaser.Sprite;
        protected _boxText: Phaser.Text;
        
        protected _pressCallback: Function;
        protected _releaseCallback: Function;
        
        protected _state: BoxState;
        protected _notifierSprite: Phaser.Sprite;
        
        private _blinker: Blinker;
        
        constructor(game:Common.AlgoGame, boxValue: any, pressCallback?: Function, releaseCallback?: Function) {
            super(game);
            this._pressCallback = pressCallback;
            this._releaseCallback = releaseCallback;
            
            this.initBox(game, boxValue);
            this._state = BoxState.ACTIVE;
            this._notifierSprite = this.createSeparator();
            this._blinker = new Blinker(game, this._notifierSprite);
            this._blinker.setEndCallback(function(){this._notifierSprite.alpha = 0}.bind(this));
            
            game.add.existing(this);
        }
        
        protected initBox(game: Common.AlgoGame, value: any): void {

            var box: Phaser.Sprite =  game.add.sprite(
                0,0, Constants.GAME_GENERAL_ATTLAS, 
                this.getBoxFrames()[BoxState.ACTIVE]);
            var boxKeyText: Phaser.Text = game.add.text(
                0, 
                0,
                "" + value, 
                JSON.parse(JSON.stringify(this.getTextStyle())));

            box.inputEnabled = true;
            boxKeyText.inputEnabled = true;

            if (this._pressCallback != null) {
                box.events.onInputDown.add(this.onInputDown.bind(this));
                boxKeyText.events.onInputDown.add(this.onInputDown.bind(this));
            }

            if (this._releaseCallback != null) {
                box.events.onInputUp.add(this.onInputUp.bind(this));
                boxKeyText.events.onInputUp.add(this.onInputUp.bind(this));
            }
            
            this.add(box);
            this.add(boxKeyText);
            
            this._box = box;
            this._boxText = boxKeyText;
            
            this.updateBoxTextPosition();
        }
        
        private createSeparator(): Phaser.Sprite {
            var seprator: Phaser.Sprite =  this.game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, "separator_arrow.png", this);
            seprator.alpha = 0;
            return seprator;
        }
        
        protected updateBoxTextPosition() {
            this._boxText.x = this._box.width/2 - this._boxText.width/2;
            this._boxText.y = this._box.height/2 - this._boxText.height/2;
        }
        
        protected getTextStyle(): any {
            return Constants.CONTROL_PANEL_MESSAGE_STYLE;
        }
        
        public setState(newState: BoxState): void {
            
            if (this._state === BoxState.DISABLED) {
                return;
            }
            
            this._state = newState;
            this._box.frameName = this.getBoxFrames()[newState];
            switch(newState) {
                case BoxState.DISABLED:
                    this._boxText.fill = Constants.MENU_LEVEL_STATS_TEXT_DISABLED;
                    break;
                default:
                    this._boxText.fill = Constants.MENU_LEVEL_TEXT_ENABLED;
            }
        }
        
        protected getBoxFrames(): string[] {
            throw "Method not implemented [getBoxFrames]";
        }
        
        public blink(): void {
            this._notifierSprite.x = this._box.width/2 - this._notifierSprite.width/2;
            this._notifierSprite.y = this._box.y - this._notifierSprite.height - 5;
            this._blinker.blink();
        }
        
        public setBoxText(text: string): void {
            this._boxText.text = text;
            this.updateBoxTextPosition()
        }

        public setBoxIndex(boxIndex: number): void {
            this._boxIndex = boxIndex;
        } 
        
        private onInputDown(): void {
            this._pressCallback(this._boxIndex);
        }
        
        private onInputUp(): void {
            this._releaseCallback(this._boxIndex);
        }
    }
    
    export class CircleBoxContainer extends BoxContainer {
     
        protected getBoxFrames(): string[] {
            return Constants.CIRCLE_BOX_FRAMES;
        }
        
        protected updateBoxTextPosition() {
            super.updateBoxTextPosition();
            this._boxText.x -= 2;
            this._boxText.y += 2;
        }

    }
    
    export class CircleBoxContainerSmall extends BoxContainer {
     
        protected getBoxFrames(): string[] {
            return Constants.SMALL_CIRCLE_BOX_FRAMES;
        }
        
        protected getTextStyle(): any {
            return Constants.CONTROL_PANEL_MESSAGE_STYLE_SMALL;
        }
        
    }
    
    export class CircleBoxContainerMedium extends BoxContainer {
     
        protected getBoxFrames(): string[] {
            return Constants.MEDIUM_CIRCLE_BOX_FRAMES;
        }

        protected getTextStyle(): any {
            return Constants.CONTROL_PANEL_MESSAGE_STYLE_MED;
        }
        
        protected updateBoxTextPosition() {
            super.updateBoxTextPosition();
            this._boxText.y += 3;
        }

    }

    export class SquareBoxContainer extends BoxContainer {

        protected getBoxFrames(): string[] {
            return Constants.SQUARE_BOX_FRAMES;
        }
    }
    
    export class SortingBoxContainer extends SquareBoxContainer {
        
        private static MAX_MULTIPLIER = 3;
        
        public setValueFromMax(percent: number): void {

            var textOffset = this._box.height/2;

            var extaTall = Math.ceil(this._box.height * SortingBoxContainer.MAX_MULTIPLIER * percent);   
            this._box.height += extaTall;
            
            this._boxText.y = this._box.height - textOffset - 15;
        }
    }
    
    export class LineGameArena<T extends Common.GamePlayAction> {
        
        protected _boxes: BoxContainer[] = [];
        protected _boxIndexes: Phaser.Text[] = [];
        protected _boxLine: Phaser.Group;
        
        protected _game: AlgoGame;
        
        private _flags: Phaser.Sprite[] = [];
        private _boxSpace: number = 20;
        
        private _boxClickedCallback: Function;
        
        constructor(game: Common.AlgoGame, boxClickedCallback:Function, sequence: number[]) {
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence);
        }
        
        protected init(seqeunce: number[]) {
            this._boxLine = this._game.add.group();

            this._boxes = this.createBoxes(seqeunce);
            
            this._boxLine.x = Constants.GAME_AREA_X;
            this._boxLine.y = Constants.GAME_AREA_LINE_Y;
        }
        
        protected createBoxes(seqeunce: number[]): BoxContainer[] {
            
            var boxes: BoxContainer[] = [];
            var boxInterval = (this._game.width - Constants.GAME_AREA_MARGIN * 2 - Constants.GAME_AREA_BOX_WIDTH)/(seqeunce.length - 1);
            var sequenceMax = Math.max.apply(Math, seqeunce);
            var sequenceMin = Math.min.apply(Math, seqeunce);
            
            for(var index = 0; index < seqeunce.length; ++index) {
                var boxContainer: BoxContainer = this.createBox(index, seqeunce[index], sequenceMax, sequenceMin);
                this._boxLine.add(boxContainer);
                boxContainer.x = boxInterval * index + Constants.GAME_AREA_MARGIN;
                boxContainer.y = -boxContainer.height;
                
                boxes.push(boxContainer);
                
                var boxIndexText: Phaser.Text = this._game.add.text(0,  boxContainer.y + boxContainer.height + 10 , "" + (index + 1), Constants.GAME_AREA_INDEX_TEXT);
                boxIndexText.x = boxContainer.x + boxContainer.width/2 - boxIndexText.width/2;                
                this._boxLine.add(boxIndexText);
                this._boxIndexes.push(boxIndexText);
            }
            
            return boxes;
        }
        
        private createBox(index: number, value: number, seqMax: number, seqMin: number): BoxContainer {
            var boxContainer: SortingBoxContainer = new SortingBoxContainer(this._game,
                    value,
                    this.onBoxClickPressed.bind(this),
                    this.onBoxClickReleased.bind(this)
                );
            boxContainer.setBoxIndex(index);
            var relativeToMax = (value - seqMin)/(seqMax - seqMin);
            boxContainer.setValueFromMax(relativeToMax);
            return boxContainer;
        }
        
        protected onBoxClickPressed(index: number): void {
        }
        
        protected onBoxClickReleased(index: number): void {
        }
        
        protected onAction(action: T): void {
            this._boxClickedCallback(action);
        }
        
        public selectBox(boxIndex: number, selectType = BoxState.SELECTED_ORANGE) {
            var boxContainer: Common.BoxContainer = this._boxes[boxIndex];
            boxContainer.setState(selectType);
        }
        
        public blinkBox(boxIndex: number): void {
            this._boxes[boxIndex].blink();
        }
        
        public hideBoxesOutOf(from: number, to: number): void {
          
          for(var i = 0; i< this._boxes.length; ++i) {
              if (i < from || i > to) {
                this._boxes[i].setState(BoxState.DISABLED);
              }
          }
        }
        
        public hideBoxesIn(from: number, to: number): void {
          for(var i = 0; i< this._boxes.length; ++i) {
              if (i >= from && i <= to) {
                this._boxes[i].setState(BoxState.DISABLED);
              }
          }
        }
        
        public clearFlags(): void {
            for(var flag of this._flags) {
                flag.destroy();
            }
            this._flags = [];
        }
        
        public showFlags(flags: FlagLocationInfo[]): void {
            
            for(var flag of flags) {
                var flagSprite = this.createSpriteForFlag(flag.position, flag.level);
                var anchor = this._boxIndexes[flag.index];
                flagSprite.x = this.getXPosition(anchor, flag.position, flagSprite);
                flagSprite.y = this.getYPosition(anchor, flag.level);
                this._flags.push(flagSprite);
            }
        }
        
        protected getXPosition(anchor: any, position: FlagPosition, target: any): number {
            switch(position) {
                case FlagPosition.CENTER:
                    return anchor.x + anchor.width/2 - target.width/2 + this._boxLine.x; 
                case FlagPosition.LEFT:
                    return anchor.x - this._boxSpace/2 + this._boxLine.x;
                case FlagPosition.RIGHT:
                    return anchor.x + anchor.width + this._boxSpace/2 + this._boxLine.x;
            }
            throw `Unknown position for flag [${position}]`;
        }
        
        protected getYPosition(anchor: any, level: FlagLevel): number {
            switch(level) {
                case FlagLevel.TOP:
                    return anchor.y + anchor.width + 20 + this._boxLine.y;
                case FlagLevel.MIDDLE:
                    return anchor.y + anchor.width + 40 + this._boxLine.y;
                case FlagLevel.BOTTOM:
                    return anchor.y + anchor.width + 60 + this._boxLine.y;
            }
            throw `Unknown level for flag [${level}]`;
        }
        
        private createSpriteForFlag(position: FlagPosition, level: FlagLevel): Phaser.Sprite {
            var flagSprite = this.getFlagSpriteByLevel(level);
            var box: Phaser.Sprite = this._game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, flagSprite);
            return box;
        }
        
        private getFlagSpriteByLevel(level: FlagLevel): string {
            switch(level) {
                case FlagLevel.TOP:
                    return "Circle_orange_small.png";
                case FlagLevel.MIDDLE:
                    return "Circle_green_small.png";
                case FlagLevel.BOTTOM:
                    return "Circle_yellow_small.png";
            }
        }
        
        public destroy(): void {
            for(var box of this._boxes) {
                box.destroy();
            }
            
            for(var boxIndex of this._boxIndexes) {
                boxIndex.destroy();
            }

            this.clearFlags();

            this._boxLine.destroy();
            this._boxes = null;
            this._boxIndexes = null;
        }
        
    }
    
    export class CoreGamePlay<T extends GamePlayAction, A extends Algorithm> extends Common.GameComponentContainer {

        protected _algorithm: A;
        protected _algorithmStep: AlgorithmStep;
        protected _captainUp: CaptainUp.Core;

        constructor(game: Common.AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.initGame(true);
                    this.checkPractiseDone();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    if (this.isNotCurrentState(Common.LevelStageState.PAUSED)) {
                        if (this.isNotCurrentState(Common.LevelStageState.CREATED)) {
                            //non-first iteration
                            this.initGame(false);
                        } 
                        this.startGame();
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    this.onLastStep(false);
                    this._game.dispatch(
                        Events.CONTROL_PANEL_EVENT_PLAY, 
                        this,
                        this.createGamePlayInfo());
                    break;
            }
        }
        
        private initGame(isGameCreate: boolean) : void {
            this.destroyTempObjects();
            
            this._algorithm = this.createAlgorithm(this.stateConfig.gamePlay);
            this.onInit();
            
            if (isGameCreate) {
                this._game.dispatch(
                    Events.GAME_CREATED, 
                    this,
                    this.createGamePlayInfo());
            }
        }
        
        protected createAlgorithm(config: any): A {
            return null;
        }
        
        protected onInit(): void {
            this._algorithm.init();    
        }
        
        protected createGamePlayInfo(): Common.GamePlayInfo {
            return  new Common.GamePlayInfo(
                this.stateConfig.stepTime,
                this.stateConfig.stepsToPass,
                this.getStageDone());
        }
        
        protected startGame(): void {
            this.onNewStep();
            this._game.dispatch(Events.GAME_STARTED, this, 
                this.getStageDone());
        }
        
        protected boxClicked(action: T, isUser:boolean = true) {
            
            if (!this.checkStepAllowed(isUser)) {
                return;
            }
            
            var step: Common.AlgorithmStep = this._algorithmStep;
            
            if (this.isCorrectStep(action)) {
                this.updateGameStatistics(isUser);
                this.onCorrectAction(isUser);
                
                if (step.isLast) {
                    this.onLastStep(isUser);
                } else {
                    this.onNewStep();
                }
                this.checkPractiseDone();

            } else {
                this.onWrongStep(isUser);
            }
        }
        
        protected onWrongStep(isUser: boolean = true): void {
            this._game.dispatch(Events.GAME_WRONG_STEP_DONE, this, isUser);
        }
        
        protected checkStepAllowed(isUser: boolean): boolean {
            return true;
        }
        
        protected onNewStep(): void {
            this._algorithmStep = this._algorithm.getNextStep();
            this._game.dispatch(
                Events.GAME_NEW_STEP_CREATED,
                this,
                this._algorithmStep
            );
        };
        
        protected onCorrectAction(isUser: boolean): void {
            this._game.dispatch(
                Events.GAME_CORRECT_STEP_DONE, 
                this, 
                [this.getStageDone(), isUser]);
        }
        
        protected isCorrectStep(action: T): boolean {
            throw "Method is not implemented yet [isCorrectStep]";
        }
        
        protected updateGameStatistics(isUser: boolean): void {
            this.setStageDone(this.getStageDone() + 1);
            this.saveState();
        }
        
        protected onLastStep(isUser: boolean): void {
            this._game.dispatch(Events.GAME_END, this, [this.getStageDone(), isUser]);
            console.log("Game finished");
        }
        
        // True when practise done because of user actions during this game
        protected checkPractiseDone() {
            if (this.stateConfig.stepsToPass <= this.getStageDone() ) {
                if (!this.getStagePassed()) {
                    this.onPractiseDone();
                }
                this.saveState();
            }
        }
        
        protected onPractiseDone(): void {
            this.setStagePassed(true)
            this._game.dispatch(this.getStagePassEvent(), this, this.getStagePassed());
        }
        
        destroy(): void {
            super.destroy();
            this.destroyTempObjects();
            this._captainUp.destroy();
        }
        
        protected destroyTempObjects():void {
          this._algorithm = null;
        }
        
        protected getStagePassEvent(): string {
            throw "Method not implemented [getStagePassEvent]"
        }
        
        protected getStageDone(): number {
            throw "Method not implemented [getStageDone]"
        }
        
        protected setStageDone(val: number): void {
            throw "Method not implemented [setStageDone]"
        }
        
        protected getStagePassed(): boolean {
            throw "Method not implemented [getStagePassed]"
        }
        
        protected setStagePassed(passed: boolean): void {
            throw "Method not implemented [getStagePassed]"
        }
    }
    
    export class TutorialGamePlay<T extends GamePlayAction, A extends Algorithm> extends CoreGamePlay<T, A> {
        
        private _settings: any
        private _tutorialIteration: number = 0;
        private _scenarios: any[];
        
        constructor(game: Common.AlgoGame) {
            super(game);
            this._scenarios = this.getScenarios();
            this._captainUp = new CaptainUp.Tutorial(game);
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_INACTIVITY_NOTIFY);
        }
        
        protected onInit(): void {
            this._settings = this.getSettings(this._tutorialIteration++);
            this._algorithm.restore(this._settings);
        }
        
        protected getScenarios(): any[] {
            throw "Method not implemented [getScenarios]";
        }
        
        private getSettings(iteration: number): any {
            var scenarioIndex = iteration % this._scenarios.length;
            return this._scenarios[scenarioIndex];
        }

        protected checkStepAllowed(isUser: boolean): boolean {
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            
            return true;
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_INACTIVITY_NOTIFY:
                    if (this._algorithmStep != null) {
                        this.tutorialNotifyStep();
                    }
                    break;
            }
        }
        
        protected tutorialNotifyStep(): void {}

        protected onLastStep(isUser: boolean): void {
            super.onLastStep(isUser);
            if (isUser) {
                this._game.dispatch(Events.GAME_SHOW_MESSAGE, 
                this, 
                this._settings.finalMessage);
            }
        }
        
        protected onWrongStep(isUser: boolean = true): void {
            this._game.dispatch(Events.GAME_INACTIVITY_NOTIFY, this);
        }

        protected getStagePassEvent(): string {
            return Events.GAME_TUTORIAL_DONE;
        }
        
        protected getStageDone(): number {
            return this.levelSave.tutorialDone;
        }
        
        protected setStageDone(val: number): void {
            this.levelSave.tutorialDone = val;
        }
        
        protected getStagePassed(): boolean {
            return this.levelSave.tutorialPassed;
        }
        
        protected setStagePassed(passed: boolean): void {
            this.levelSave.tutorialPassed = passed;
        }
    }
    
    export class PractiseGamePlay<T extends GamePlayAction, A extends Algorithm> extends CoreGamePlay<T, A> {

        protected _gameStepTimer: Phaser.Timer;
        protected _stepPerformed: boolean = false;
        
        constructor(game: Common.AlgoGame) {
            super(game);
            this._captainUp = new CaptainUp.Practice(game);
            
            this._gameStepTimer = this._game.time.create(false);
            this._gameStepTimer.start();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    console.log("Play event received");
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    } 
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._gameStepTimer.pause();
                    break;
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    }                    
                    break;
            }
        }
        
        protected clickBox() {
        }
        
        protected checkStepAllowed(isUser: boolean): boolean {
            
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            
            if (isUser && this._stepPerformed) {
                console.log("Unable to make a second step");
                this._game.dispatch(Events.GAME_MULTI_STEP_DONE, this);
                return false;
            }
            
            this._stepPerformed = true;
            
            return true;
        }

        protected onNewStep(): void {
            super.onNewStep();
            this.addTimerEvents();
        };
        
        protected updateGameStatistics(isUser: boolean): void {
            if (!isUser) return;
            super.updateGameStatistics(isUser);
        }
        
        protected onLastStep(isUser: boolean): void {
            this._gameStepTimer.removeAll();
            super.onLastStep(isUser);
        }
        
        // True when practise done because of user actions during this game
        protected checkPractiseDone() {
            super.checkPractiseDone();
            this._stepPerformed = false;
        }
        
        protected addTimerEvents(): void {
            this._gameStepTimer.removeAll();
            this._gameStepTimer.repeat(this.stateConfig.stepTime, 0, this.clickBox, this);
        }
        
        destroy(): void {
            super.destroy();
            this._gameStepTimer.destroy();
        }
        
        protected destroyTempObjects():void {
          this._algorithm = null;
        }

        protected getStagePassEvent(): string {
            return Events.GAME_PRACTISE_DONE;
        }

        protected getStageDone(): number {
            return this.levelSave.practiseDone;
        }
        
        protected setStageDone(val: number): void {
            this.levelSave.practiseDone = val;
        }
        
        protected getStagePassed(): boolean {
            return this.levelSave.practisePassed;
        }
        
        protected setStagePassed(passed: boolean): void {
            this.levelSave.practisePassed = passed;
        }
    }
    
    export class ExamGamePlay<T extends GamePlayAction, A extends Algorithm> extends PractiseGamePlay<T, A> {
        
        constructor(game: Common.AlgoGame) {
            super(game);
            this._captainUp = new CaptainUp.Exam(game);
        }

        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_STOP);
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.flushProgress();                    
                    break;
                case Events.CONTROL_PANEL_EVENT_STOP:
                    this.clickBox();
                    break;
            }
        }

        protected clickBox() {
            throw "No implementation for method [clickBox]";
        }

        protected checkStepAllowed(isUser: boolean): boolean {
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            
            return true;
        }
        
        protected updateGameStatistics(isUser: boolean): void {
            if (!isUser) {
                return;
            }
            
            this.setStageDone(this.getStageDone() + 1);
            if (this.levelSave.examPassed) {
                this.saveState();
            }
            
        }
        
        protected onWrongStep(isUser: boolean): void {
            super.onWrongStep(isUser);
            this._game.dispatch(Events.GAME_EXAM_FAILED, this);
            this.flushProgress();
            super.onLastStep(isUser);
        }
        
        protected flushProgress(): void {
            if (!this.getStagePassed()) {
                this.setStageDone(0);
                this.saveState();
            }
        }
        
        protected getStagePassEvent(): string {
            return Events.GAME_EXAM_DONE;
        }

        protected getStageDone(): number {
            return this.levelSave.examDone;
        }
        
        protected setStageDone(val: number): void {
            this.levelSave.examDone = val;
        }
        
        protected getStagePassed(): boolean {
            return this.levelSave.examPassed;
        }
        
        protected setStagePassed(passed: boolean): void {
            this.levelSave.examPassed = passed;
        }

    }

}
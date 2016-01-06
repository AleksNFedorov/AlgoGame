/// <reference path="./lib/phaser.d.ts" />

module Common {
    
    export class GamePlayInfo {
        
        private _stepWaitTime: number;
        private _totalItertions: number;
        private _doneIterations: number;
        
        constructor(stepWaitTime: number, totalIterations: number, doneIterations: number) {
            this._stepWaitTime = stepWaitTime;
            this._totalItertions = totalIterations;
            this._doneIterations = doneIterations;
        }
        
        public get stepWaitTime(): number {
            return this._stepWaitTime;
        };
        
        public get totalItertions(): number {
            return this._totalItertions;
        };
        
        public get doneIterations(): number {
            return this._doneIterations;
        };
        
    }
    
    export class Step {
        private _isLast: boolean = false;
        private _stepNumber: number = -1;
        
        constructor(isLast: boolean, stepNumber: number) {
            this._isLast = isLast;
            this._stepNumber = stepNumber;
        }
        
        public get isLast(): boolean {
            return this._isLast;
        };
        
        public get stepNumber(): number {
            return this._stepNumber;
        };
    }
    
    export class GameEventComponent {
        
        protected _game: AlgoGame;
        private _listeners: Array<string> = [];
        
        constructor(game: AlgoGame) {
            this._game = game;
        }
        
        destroy(): void {
        
            for(var eventId in this._listeners) {
                this.removeEventListener(eventId);
            }
        };
        
        dispatchEvent(event: any, param1: any) {
            console.log("Menu event cought [" + event.type + "]");
        };
        
        addEventListener(eventId: string): void {
        
            this._game.eventBus.addEventListener(eventId, this.dispatchEvent, this);  
            this._listeners.push(eventId);
        };
        
        removeEventListener(eventId: string): void {
            this._game.eventBus.removeEventListener(eventId, this.dispatchEvent, this);  
        };
        
        getCallbackForEventId(eventId: string, param?: any) {
            
            return function() {
                console.log("Event created " + eventId);
                this._game.eventBus.dispatch(eventId, this, param);
            };
        };
        
    };
    
    class Button extends Phaser.Button {
        
        private _activeFrames: number[];
        private _inactiveFrame: number;
        private _callback: Function;
        
        constructor(game:AlgoGame, callback: Function, context:any, frames:number[]) {
            super(game, 0,0, Constants.MENU_BUTTON_ATTLAS, callback, context, 
            frames[0],
            frames[1],
            frames[2],
            frames[3]
            );
            this._activeFrames = frames;
            this._inactiveFrame = frames[4];
            this._callback = callback;
        };
        
        activate(): void {
            this.input.enabled = true;
            this.setFrames(
                this._activeFrames[0], 
                this._activeFrames[1], 
                this._activeFrames[2],
                this._activeFrames[3]
                );
        };
        
        deactivate():void {
            this.input.enabled = false;
            this.setFrames(
                this._inactiveFrame, 
                this._inactiveFrame, 
                this._inactiveFrame, 
                this._inactiveFrame
            );
        };
        
        get callback(): Function {
            return this._callback;
        };
    }

    class ControlPanel extends GameEventComponent {
        
        protected _playButton: Button;
        protected _infoText: Phaser.Text;
        
        constructor(game: AlgoGame) {
            super(game);
            this.createElements();
        };
        
        createElements(): void {
            
            this._playButton = new Button(this._game,
                this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PLAY),
                this,
                [46, 46, 50, 46, 35]
                );
                
            this._playButton.x = 100;
            this._playButton.y = 500;
            this._playButton.scale.setTo(0.3);

            this._game.add.existing(this._playButton);
            
            this._infoText = new Phaser.Text(this._game, 250, 500, "Control panel text", Constants.CONTROL_PANEL_MESSAGE_STYLE);
            this._game.add.existing(this._infoText);
            
            this.initEventListners();

        };
        
        initEventListners(): void {
                
        };
        
        destroy() {
           super.destroy(); 
           this._playButton = null;
           this._infoText = null;
        };
        
    };
    
    export class PractisePanel extends ControlPanel {
        
        private _pauseButton: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        };
        
       createElements():void {
            super.createElements();
            
            this._pauseButton = new Button(this._game,
                this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PAUSE),
                this,
                [61,61,37,61, 65]
                );

            this._pauseButton.x = 50;
            this._pauseButton.y = 500;
            this._pauseButton.scale.setTo(0.3);
            
            this._game.add.existing(this._pauseButton);
            
            this._pauseButton.deactivate();
        };

        initEventListners(): void {
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            super.addEventListener(Events.GAME_END);
        };
        
        dispatchEvent(event: any, param1: any) {
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._playButton.deactivate();
                    this._pauseButton.activate();
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._playButton.activate();
                    this._pauseButton.deactivate();
                    //Set correct info text here
                    break;
                case Events.GAME_END:
                    this._playButton.activate();
                    this._pauseButton.deactivate();
                    break;
            }
        };
        
    };

    export class Menu extends GameEventComponent {
        
        private _menuButtons: Button[] = [];
        private _practiseState: string = Constants.STATE_MENU;
        private _testState: string = Constants.STATE_MENU;
        private _mentState: string = Constants.STATE_MENU;
        
        constructor(game:AlgoGame) {
            super(game);
            this.createButtons();
            this.initEventListners();
        };
        
        createButtons(): void {
            var goBackButton: Button = this.createButton(Events.MENU_EVENT_GO_MENU, [19, 19, 84, 19, 45])
            goBackButton.x = 50;
            goBackButton.y = 50;
            goBackButton.scale.setTo(0.3);
        
            this._game.add.existing(goBackButton);
        
            this._menuButtons.push(goBackButton);
            console.log("Button has been added");
        };
        
        destroy(): void {
            
            console.log("Destroying buttons");
            
            super.destroy();
            
            for(var menuButton of this._menuButtons) {
                menuButton.destroy();
            };
            
            console.log("Buttons destroyed");
            
        };

        private createButton(eventid: string, frames: number[]): Button {

            return new Button(
                this._game, 
                this.getCallbackForEventId(Events.MENU_EVENT_GO_MENU),
                this,
                frames);
        };
        
        private initEventListners():void {
            
          super.addEventListener(Events.MENU_EVENT_GO_MENU);  
          super.addEventListener(Events.MENU_EVENT_OPEN_ALGO_DESCR);  
          super.addEventListener(Events.MENU_EVENT_SHOW_LEVEL_OBJECT);  
          super.addEventListener(Events.MENU_EVENT_GO_PRACTISE);  
          super.addEventListener(Events.MENU_EVENT_GO_TEST);  
          
        };
    }    
    
    
    class ProgressBar extends Phaser.Group {
    
        private _maxProgressWidth: number;
        private _maxProgressValue: number;
    
        private _progressImage: Phaser.Sprite;
        private _progressText: Phaser.Text;
        
        constructor(game: AlgoGame, backImageId: string, frontImageId: string, 
            legendTextString: string) {
            
            super(game);
            
            var progressBackground = game.add.sprite(
                0, 0, 
                Constants.PROGRESS_BARS_ATTLAS,
                backImageId,
                this
                );
                
            var progressImage: Phaser.Sprite = game.add.sprite(
                4, 3, 
                Constants.PROGRESS_BARS_ATTLAS,
                frontImageId,
                this
            );
            
            var progressText: Phaser.Text = this.game.add.text(
                progressImage.x + 5,
                progressImage.y + 2,
                '', 
                Constants.CONTROL_PANEL_MESSAGE_STYLE,
                this
            );
            
            
           var legendText = this.game.add.text(
                progressBackground.x, 
                progressBackground.y + progressBackground.height/2 - 4, 
                legendTextString, 
                Constants.CONTROL_PANEL_MESSAGE_STYLE,
                this
            );
                
            
            legendText.anchor.y = 0;
            
            progressBackground.scale.setTo(0.4);
            progressImage.scale.setTo(0.4);
            
            this._maxProgressWidth = progressImage.width;
            this._progressImage = progressImage;
            this._progressImage.width = 0;
            this._progressText = progressText;
        };
        
        public setMaxValue(maxProgressValue: number): void {
          this._maxProgressValue = maxProgressValue;
        };
        
        public setValue(newValue: number, suffix: string): void {
        
            var completines = newValue/this._maxProgressValue;
        
            this._progressImage.width = this._maxProgressWidth * completines;
            this._progressText.text = newValue + suffix;
        };
    }
    
    export class ProgressPanel extends GameEventComponent {
    
        private _topProgressBar: ProgressBar;
        private _bottomProgressBar: ProgressBar;
      
        constructor(game:AlgoGame) {
            super(game);
            
            this._topProgressBar = new ProgressBar(game, "slice27_27.png", "slice16_16.png", "Step time");
            this._bottomProgressBar = new ProgressBar(game, "slice27_27.png", "slice35_35.png", "Steps done");
            
            this._topProgressBar.x = 800;
            this._topProgressBar.y = 100;
            
            this._bottomProgressBar.x = 800;
            this._bottomProgressBar.y = 160;
            
            this.addEventListener(Events.GAME_CREATED);
        };
        
        dispatchEvent(event: any, param1: any) {
            switch(event.type) {
                case Events.GAME_CREATED:
                    var playInfo: Common.GamePlayInfo = <Common.GamePlayInfo> param1;
                    this._topProgressBar.setMaxValue(playInfo.stepWaitTime);
                    this._bottomProgressBar.setMaxValue(playInfo.totalItertions);
                    this._bottomProgressBar.setValue(playInfo.doneIterations + 20, "");
                    break;
            }
        };
        
        destroy(): void {
          super.destroy();
          
          this._topProgressBar.destroy();
          this._bottomProgressBar.destroy();
          
        };
        
    };
}
/// <reference path="./lib/phaser.d.ts" />

module Common {
    
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
}
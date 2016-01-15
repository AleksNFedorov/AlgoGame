/// <reference path="./common.ts" />

declare var Dictionary: any;

module Common {   
   
    class InfoTextPanel extends GameComponentContainer {
        
        protected _infoText: Common.Text;

        constructor(game: AlgoGame) {
            super(game);
            this.createElements();
        }
        
        protected createElements(): void {
            this._infoText = new Common.Text(this._game, 250, 500, "Control panel text", Constants.CONTROL_PANEL_MESSAGE_STYLE);
            this._game.add.existing(this._infoText);
            this.addGameElement(Common.GameElements.CONTROL_PANEL_TEXT, this._infoText);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                default:
                this.setInfoMessageFromDictionary(event.type);
                console.log("Control panel event [" + event.type + "]");
            }
        }
        
        private setInfoMessageFromDictionary(key: string) {
            var messages: any[] = Dictionary[key];
            if (messages != null) {
                this._infoText.text = Phaser.ArrayUtils.getRandomItem(messages, 0, messages.length);
            } 
        }
        
        initEventListners(): void {
            super.initEventListners();
            for (var eventId of Events.getAllEvents()) {
               this.addEventListener(eventId);
            }
        }
        
        destroy() {
           super.destroy(); 
           this._infoText.destroy();
        }
    }
   
    class ControlPanel extends InfoTextPanel {
        
        protected _playButton: Common.Button;

        protected _autoStartTimer: Phaser.Timer;
        
        constructor(game: AlgoGame) {
            super(game);
            this._autoStartTimer = game.time.create(false);
            this._autoStartTimer.start();
        }
        
        protected createElements(): void {

            super.createElements();
            
            this._playButton = this.createButton(
                Common.GameElements.CONTROL_PANEL_BUTTON_PLAY, 
                Events.CONTROL_PANEL_EVENT_PLAY, 
                [46, 46, 50, 46, 35]
            );
            
            this.initButton(this._playButton, 100, 500);
        }
        
        protected createButton(elementId: Common.GameElements, eventId: string, frames: number[]): Button {
            var extraButton: Button = new Button(this._game, frames);
            extraButton.callback = this.getCallbackForEventId(eventId);
            this.addGameElement(elementId, extraButton);
            
            return extraButton;
        }
        
        protected initButton(button: Button, x: number, y: number) {
            button.x = x;
            button.y = 500;
            button.scale.setTo(0.3);
            this._game.add.existing(button);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._autoStartTimer.removeAll();
                    break;
                case Events.GAME_END:
                    console.log("Game END event received");
                    this._autoStartTimer.repeat(
                        Constants.GAME_AUTOSTART_INTERVAL, 0, 
                        this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PLAY), 
                        this);
                    break;
                case Events.GAME_DISABLE_ALL:
                    this._autoStartTimer.pause();
                    break;
                case Events.GAME_ENABLE_ALL:
                    this._autoStartTimer.resume();
                    break;
            }
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.GAME_END);
            super.addEventListener(Events.GAME_DISABLE_ALL);
            super.addEventListener(Events.GAME_ENABLE_ALL);
        }
        
        destroy() {
           super.destroy(); 
           this._autoStartTimer.destroy();
        }
        
    }
    
    export class PractisePanel extends ControlPanel {
        
        protected _pauseButton: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
       createElements():void {
            super.createElements();
            
            this._pauseButton = this.createButton(
                Common.GameElements.CONTROL_PANEL_BUTTON_PAUSE,
                Events.CONTROL_PANEL_EVENT_PAUSE,
                [61,61,37,61, 65]
            );
            
            this.initButton(this._pauseButton, 50, 500);
            
            this._pauseButton.deactivate();
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            super.addEventListener(Events.GAME_END);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
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
        }
    }
    
    export class ExamPanel extends ControlPanel {
        
        protected _stopButton: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
       createElements():void {
            super.createElements();
            
            this._stopButton = this.createButton(
                Common.GameElements.CONTROL_PANEL_BUTTON_STOP,
                Events.CONTROL_PANEL_EVENT_STOP,
                [2,2,82,2, 6]
            );
            
            this.initButton(this._stopButton, 50, 500);
            
            this._stopButton.deactivate();
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.GAME_EXAM_FAILED);
            super.addEventListener(Events.GAME_EXAM_DONE);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._playButton.deactivate();
                    this._stopButton.activate();
                    break;
                case Events.GAME_EXAM_FAILED:
                case Events.GAME_EXAM_DONE:
                    this._playButton.activate();
                    this._stopButton.deactivate();
                    //Set correct info text here
                    break;
            }
        }
        
    }
}
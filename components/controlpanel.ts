/// <reference path="./common.ts" />

module Common {   
   
    class ControlPanel extends GameComponentContainer {
        
        protected _playButton: Common.Button;
        protected _infoText: Phaser.Text;
        protected _autoStartTimer: Phaser.Timer;
        
        constructor(game: AlgoGame) {
            super(game);
            this.createElements();
            this._autoStartTimer = game.time.create(false);
            this._autoStartTimer.start();
        }
        
        createElements(): void {
            
            this._playButton = new Common.Button(this._game, [46, 46, 50, 46, 35] );
                
            this._playButton.x = 100;
            this._playButton.y = 500;
            this._playButton.scale.setTo(0.3);
            this._playButton.callback = this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PLAY);

            this._game.add.existing(this._playButton);
            this.addGameElement(Common.GameElements.PRACTISE_CONTROL_PANEL_BUTTON_PLAY, this._playButton);

            this._infoText = new Phaser.Text(this._game, 250, 500, "Control panel text", Constants.CONTROL_PANEL_MESSAGE_STYLE);
            this._game.add.existing(this._infoText);
            this.addGameElement(Common.GameElements.PRACTISE_CONTROL_PANEL_TEXT, this._infoText);
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
                case Events.CONTROL_PANEL_SHOW_TEXT:
                    this._infoText.text = param1 + "";
                    break;
            }
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.GAME_END);
            super.addEventListener(Events.CONTROL_PANEL_SHOW_TEXT);
        }
        
        destroy() {
           super.destroy(); 
           this._infoText.destroy();
           this._autoStartTimer.destroy();
        }
        
    };
    
    export class PractisePanel extends ControlPanel {
        
        private _pauseButton: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
       createElements():void {
            super.createElements();
            
            this._pauseButton = new Button(this._game, [61,61,37,61, 65]);

            this._pauseButton.x = 50;
            this._pauseButton.y = 500;
            this._pauseButton.scale.setTo(0.3);
            this._pauseButton.callback = this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PAUSE);
            
            this._game.add.existing(this._pauseButton);
            this.addGameElement(Common.GameElements.PRACTISE_CONTROL_PANEL_BUTTON_PAUSE, this._pauseButton);
            
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
}
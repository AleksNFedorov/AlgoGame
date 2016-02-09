/// <reference path="./common.ts" />

declare var Dictionary: any;

module Common {   
    
    class GameMessage extends Phaser.Group implements GameUIObjectWithState {
        
        private _text: Common.Text;
        private _icon: Phaser.Sprite;
        private _game: AlgoGame;
        
        constructor(game: AlgoGame, text: string, messageType: MessageType) {
            super(game);
            this._game = game;
            this.alpha = 0;
            
            this._icon = this.addIcon(messageType);
            this._text = this.addText(text, messageType);
        }
        
        private addIcon(messageType: MessageType): Phaser.Sprite {
            switch(messageType) {
                case MessageType.INFO:
                    return this.game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, "Info-message-icon.png", this);
                case MessageType.SUCCESS:
                    return this.game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, "Success-message-icon.png", this);
                case MessageType.FAIL:
                    return this.game.add.sprite(0,0, Constants.GAME_GENERAL_ATTLAS, "Fail-message-icon.png", this);
            }
        }
        
        private addText(text: string, messageType: MessageType): Common.Text {
            var messageStyle;
            switch(messageType) {
                case MessageType.INFO:
                    messageStyle = Constants.MESSAGE_INFO_TEXT;
                    break;
                case MessageType.SUCCESS:
                    messageStyle = Constants.MESSAGE_SUCCESS_TEXT;
                    break;
                case MessageType.FAIL:
                    messageStyle = Constants.MESSAGE_FAIL_TEXT;
                    break;
            }
            var messageText: Common.Text = new Common.Text(this._game, 50, 0, text, messageStyle);
            this.add(messageText);
            return messageText;
        }
        
        public displayMessage(): void {
            this.game.add.tween(this).to({alpha: 1}, 200, "Quart.easeOut").start();
        }
        
        saveStateAndDisable(): void {};
        restoreState(): void {};
    }
   
    class InfoTextPanel extends GameContainerWithStoreSupport {
        
        protected _panelGroup: Phaser.Group;
        protected _messages: GameMessage[] = [];

        constructor(game: AlgoGame) {
            super(game);
            this._panelGroup = game.add.group();
            this._panelGroup.x = Constants.CONTROL_PANEL_POSITION_X;
            this._panelGroup.y = Constants.CONTROL_PANEL_POSITION_Y;
            this.createElements();
        }
        
        protected createElements(): void {
            
            for(var i=0; i< Constants.CONTROL_PANEL_MESSAGES_HISTORY_SIZE; ++i) {
                var text = this.createNewMessageText("", Common.MessageType.INFO);
                text.x = Constants.CONTROL_PANEL_MESSAGE_X;
                text.y = i * 50;
                this._messages.push(text);
            }
            
            this.addGameElement(Common.GameElements.ControlPanelText, this._messages[0]);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    var paramArray: any[] = param1;
                    //false - non user action
                    if (paramArray[1] === false) {
                        break;
                    }
                default:
                    this.setInfoMessageFromDictionary(event.type);
            }
        }
        
        private setInfoMessageFromDictionary(key: string) {
            var eventMessages: any = Dictionary[key];
            if (eventMessages != null) {
                var messageTypeString: string = eventMessages.type.toUpperCase();
                var messagesArray: string[] = eventMessages.messages;

                var messageType: Common.MessageType = Common.MessageType[messageTypeString];
                var message: string = Phaser.ArrayUtils.getRandomItem(messagesArray, 0, messagesArray.length);
                this.updateMessages(message, messageType);
                this.displayNewMessage();
            } 
        }
        
        private updateMessages(newMessage: string, type: Common.MessageType): void {
            var newText = this.createNewMessageText(newMessage, type);
            this._messages.unshift(newText);
            for(var i=0; i<(this._messages.length - 1); ++i) {
                this._messages[i].x = this._messages[i + 1].x;
                this._messages[i].y = this._messages[i + 1].y;
            }
            this._messages.pop().destroy();
        }
        
        private displayNewMessage(): void {
            var messageToDisplay = this._messages[0];
            messageToDisplay.displayMessage();
        }
        
        private createNewMessageText(message: string, type: Common.MessageType): GameMessage {
            var gameMessage = new GameMessage(this._game, message, type);
            gameMessage.x = Constants.CONTROL_PANEL_MESSAGE_X;
            gameMessage.y = 0;
            this._panelGroup.add(gameMessage);
            return gameMessage;
        }
        
        initEventListners(): void {
            super.initEventListners();
            for (var eventId of Events.getAllEvents()) {
               this.addEventListener(eventId);
            }
        }
        
        destroy() {
           super.destroy(); 
           for(var text of this._messages) {
               text.destroy();
           }
        }
    }
   
    class ControlPanel extends InfoTextPanel {
        
        protected _playButton: Common.Button;

        protected _autoStartTimer: Phaser.Timer;
        protected _autoStartEnabled: boolean = true; 
        
        constructor(game: AlgoGame) {
            super(game);
            this._autoStartTimer = game.time.create(false);
            this._autoStartTimer.start();
        }
        
        protected createElements(): void {

            super.createElements();
            
            this._playButton = this.createButton(
                Common.GameElements.ControlPanelButtonPlay, 
                Events.CONTROL_PANEL_EVENT_PLAY, 
                [
                    "Play-button_Mouse-over.png", 
                    "Play-button_Enabled.png", 
                    "Play-button_clicked.png", 
                    "Play-button_Enabled.png", 
                    "Play-button_Disabled.png"
                ]
            );
            
            this.initButton(this._playButton, Constants.CONTROL_PANEL_SECOND_BUTTON_X,  0);
        }
        
        protected createButton(elementId: Common.GameElements, eventId: string, frames: any[]): Button {
            var extraButton: Button = new Button(this._game, frames);
            extraButton.callback = this.getCallbackForEventId(eventId);
            this.addGameElement(elementId, extraButton);
            
            return extraButton;
        }
        
        protected initButton(button: Button, x: number, y: number) {
            button.x = x;
            button.y = y;
            this._panelGroup.add(button);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._autoStartTimer.removeAll();
                    break;
                case Events.GAME_END:
                    console.log("Game END event received");
                    if (this._autoStartEnabled) {
                        this._autoStartTimer.repeat(
                            Constants.GAME_AUTOSTART_INTERVAL, 0, 
                            this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PLAY), 
                            this);
                    }
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
        
        private static AUTOSTART_FRAMES_OFF = [
                    "AutoStart-toggle_off.png",
                    "AutoStart-toggle_off.png",
                    "AutoStart-toggle_off.png",
                    "AutoStart-toggle_off.png",
                    "AutoStart-toggle_off.png"
                ];
                
        private static AUTOSTART_FRAMES_ON = [
                    "AutoStart-toggle_on.png", 
                    "AutoStart-toggle_on.png", 
                    "AutoStart-toggle_on.png", 
                    "AutoStart-toggle_on.png", 
                    "AutoStart-toggle_off.png"
                ];
        
        protected _pauseButton: Button;
        protected _replayButton: Button;
        
        private _autoStart: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
       createElements():void {
            super.createElements();
            
            this._pauseButton = this.createButton(
                Common.GameElements.ControlPanelButtonPause,
                Events.CONTROL_PANEL_EVENT_PAUSE,
                [
                    "Pause-button_Mouse-over.png", 
                    "Pause-button_Enabled.png", 
                    "Pause-button_clicked.png", 
                    "Pause-button_Enabled.png", 
                    "Pause-button_Disabled.png"
                ]
            );
            
            this._replayButton = this.createButton(
                Common.GameElements.ControlPanelButtonPause,
                Events.CONTROL_PANEL_EVENT_REPLAY,
                [
                    "Replay-button_Mouse-over.png", 
                    "Replay-button_Enabled.png", 
                    "Replay-button_clicked.png", 
                    "Replay-button_Enabled.png", 
                    "Replay-button_Disabled.png"
                ]
            );
            

            this.initButton(this._replayButton, Constants.CONTROL_PANEL_FIRST_BUTTON_X, 0);
            this.initButton(this._pauseButton, Constants.CONTROL_PANEL_SECOND_BUTTON_X, 0);
            
            this._pauseButton.deactivate();
            this._pauseButton.alpha = 0;
            
            this.createAutoStartButton();
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            super.addEventListener(Events.GAME_END);
        }
        
        createAutoStartButton(): void {
            this._autoStart = this.createButton(
                Common.GameElements.ControlPanelButtonAutoStart,
                "NONE", PractisePanel.AUTOSTART_FRAMES_ON
            );
            this.initButton(this._autoStart, 
            Constants.CONTROL_PANEL_AUTOSTART_X,
            Constants.CONTROL_PANEL_AUTOSTART_Y);
            
            this._autoStart.callback = this.onAutostartClick.bind(this);
            var autoStartText = this._game.add.text(
                Constants.CONTROL_PANEL_AUTOSTART_X - 100,
                Constants.CONTROL_PANEL_AUTOSTART_Y + 6,
                "Autostart", Constants.PROGRESS_BAR_TEXT, this._panelGroup);

        }
        
        private onAutostartClick(): void {
            this._autoStartEnabled = !this._autoStartEnabled;
            var frames: string[] = this._autoStartEnabled ? 
                PractisePanel.AUTOSTART_FRAMES_ON :
                PractisePanel.AUTOSTART_FRAMES_OFF;

            this._autoStart.setFrames(
                frames[0],
                frames[1],
                frames[2],
                frames[3]
            );
            
            this.levelSave.autoStart = this._autoStartEnabled;
            this.saveState();
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._playButton.alpha = 0;
                    this._pauseButton.alpha = 1;
                    this._playButton.deactivate();
                    this._pauseButton.activate();
                    break;
                case Events.GAME_END:
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._playButton.alpha = 1;
                    this._pauseButton.alpha = 0;
                    this._playButton.activate();
                    this._pauseButton.deactivate();
                    //Set correct info text here
                    break;
                case Events.STAGE_INITIALIZED:
                    this._autoStartEnabled = !this.levelSave.autoStart;
                    this.onAutostartClick();
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
                Common.GameElements.ControlPanelButtonStop,
                Events.CONTROL_PANEL_EVENT_STOP,
                [
                    "Stop-button_Mouse-over.png", 
                    "Stop-button_Enabled.png", 
                    "Stop-button_clicked.png", 
                    "Stop-button_Enabled.png", 
                    "Stop-button_Disabled.png"
                ]
            );
            
            this.initButton(this._stopButton, Constants.CONTROL_PANEL_FIRST_BUTTON_X, -1);
            
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
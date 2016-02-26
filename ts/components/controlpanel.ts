/// <reference path="./common.ts" />

declare var Dictionary: any;

module Common {   
    
    class GameMessage extends Phaser.Group implements GameUIObjectWithState {
        
        private _text: Common.Text;
        private _icon: Phaser.Sprite;
        private _game: AlgoGame;
        
        private _playButtonBlinker: Blinker;
        
        constructor(game: AlgoGame, text: string, messageType: MessageType) {
            super(game);
            this._game = game;
            this.alpha = 0;
            
            this._icon = this.addIcon(messageType);
            this._text = this.addText(text, messageType);
            this._playButtonBlinker = new Blinker(game, this._icon);
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
        
        public blinkMessage(): void {
            this._playButtonBlinker.blink();
        }
        
        public displayMessage(): void {
            this.game.add.tween(this).to({alpha: 1}, 200, "Quart.easeOut").start();
        }
        
        public destroy(): void {
            this._playButtonBlinker.destroy();
            super.destroy();
        }
        
        saveStateAndDisable(): void {};
        restoreState(): void {};
        
    }
   
    class InfoTextPanel extends GameComponentContainer {
        
        protected _panelGroup: Phaser.Group;
        protected _messages: GameMessage[] = [];
        private _eventsToIgnore: Phaser.ArraySet = new Phaser.ArraySet([]);

        constructor(game: AlgoGame) {
            super(game);
            this.createElements();
            
            for(var ignoreEvent of this.getEventsToIgnore()) {
                this._eventsToIgnore.add(ignoreEvent);
            }
        }
        
        protected getEventsToIgnore(): string[] {
            return [];
        }
        
        protected createElements(): void {
            this._panelGroup = this._game.add.group();
            this._panelGroup.x = Constants.CONTROL_PANEL_POSITION_X;
            this._panelGroup.y = Constants.CONTROL_PANEL_POSITION_Y;
            var infoPosition = new Common.GroupWrapper(
                this._game,
                Constants.CONTROL_PANEL_MESSAGE_X,
                0
                )
                
            this._panelGroup.add(infoPosition)                
            this.addGameElement(Common.GameElements.ControlPanelText, infoPosition);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            if (this._eventsToIgnore.exists(event.type)) {
                console.log(`Skipping message diplaying [${event.type}]`);
                return;
            }
            
            switch(event.type) {
                case Events.GAME_STARTED:
                case Events.GAME_CREATED:
                    this.destroyMessages();
                    this.setInfoMessageFromDictionary(event.type);
                    break;
                case Events.GAME_NEW_STEP_CREATED:
                    var step: AlgorithmStep = <AlgorithmStep> param1;
                    for(var messageKey of step.messageKeys) {
                        this.setDirectMessage(messageKey);
                    }                        
                    this.setInfoMessageFromDictionary(event.type);
                    break;
                case Events.GAME_CORRECT_STEP_DONE:
                    var paramArray: any[] = param1;
                    //false - non user action
                    if (paramArray[1] === false) {
                        break;
                    }
                    //Do not put break here!!!
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
        
        private setDirectMessage(path: string): void {
            
            var keys = path.split(".");
            
            var message: any = Dictionary;
            for (var key of keys) {
                if (!isNaN(Number(key))) {
                    message = message[Number(key)];
                } else {
                    message = message[key];
                }
            }

            if (message != null) {
                var messageType: Common.MessageType = Common.MessageType.INFO;
                this.updateMessages("" + message, messageType);
                this.displayNewMessage();
            } 
        }
        
        private updateMessages(newMessage: string, type: Common.MessageType): void {
            var newText = this.createNewMessageText(newMessage, type);
            this._messages.unshift(newText);
            for(var i=0; i<this._messages.length; ++i) {
                this._messages[i].x  = Constants.CONTROL_PANEL_MESSAGE_X;
                this._messages[i].y = i * 50;
            }
            
            if (this._messages.length > Constants.CONTROL_PANEL_MESSAGES_HISTORY_SIZE) {
                this._messages.pop().destroy();
            }
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
        
        destroyMessages(): void {
           for(var text of this._messages) {
               text.destroy();
           }
           this._messages = [];
        }
        
        destroy() {
           super.destroy(); 
           this.destroyMessages();
        }
    }
   
    class ControlPanel extends InfoTextPanel {
        
        protected _playButton: Common.Button;

        protected _autoStartTimer: Phaser.Timer;
        protected _autoStartEnabled: boolean = true; 
        
        private _playButtonBlinker: Blinker;
        
        constructor(game: AlgoGame) {
            super(game);
            this._autoStartTimer = game.time.create(false);
            this._autoStartTimer.start();
            this._playButtonBlinker = new Blinker(game, this._playButton);
        }
        
        protected createElements(): void {

            super.createElements();
            
            this._playButton = this.createButton(
                Common.GameElements.ControlPanelButtonPlay, 
                Events.CONTROL_PANEL_EVENT_PLAY, 
                Constants.PLAY_BUTTON_FRAMES
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
                case Events.GAME_INACTIVITY_NOTIFY:
                    if (this.isNotCurrentState(Common.LevelStageState.PAUSED)
                        && this.isNotCurrentState(Common.LevelStageState.RUNNING)
                    ) {
                        this._playButtonBlinker.blink();
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._autoStartTimer.removeAll();
                    break;
                case Events.GAME_END:
                    console.log("Game END event received");
                    if (this._autoStartEnabled) {
                        this._autoStartTimer.repeat(
                            this.getAutostartInterval(), 
                            0, 
                            this.getCallbackForEventId(Events.CONTROL_PANEL_EVENT_PLAY), 
                            this);
                    }
                    break;
                case Events.GAME_STEP_ON_PAUSE:
                    this._playButtonBlinker.blink();
                    break;
                case Events.GAME_DISABLE_ALL:
                    this._autoStartTimer.pause();
                    break;
                case Events.GAME_ENABLE_ALL:
                    this._autoStartTimer.resume();
                    break;
            }
        }
        
        protected getAutostartInterval(): number {
            return Constants.GAME_AUTOSTART_INTERVAL;
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.GAME_END);
            super.addEventListener(Events.GAME_DISABLE_ALL);
            super.addEventListener(Events.GAME_ENABLE_ALL);
            super.addEventListener(Events.GAME_INACTIVITY_NOTIFY);
        }
        
        destroy() {
           super.destroy(); 
           this._autoStartTimer.destroy();
        }
        
    }
    
    class CorePractisePanel extends ControlPanel {
        
        protected _replayButton: Button;
        protected _autoStart: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
        protected getEventsToIgnore(): string[] {
            return [];
        }
        
       createElements():void {
            super.createElements();
            
            this._replayButton = this.createButton(
                Common.GameElements.ControlPanelButtonPause,
                Events.CONTROL_PANEL_EVENT_REPLAY,
                Constants.REPLAY_BUTTON_FRAMES
            );

            this.initButton(this._replayButton, Constants.CONTROL_PANEL_FIRST_BUTTON_X, 0);
            
            this.createAutoStartButton();
        }
        
        initEventListners(): void {
            super.initEventListners();
            super.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            super.addEventListener(Events.GAME_END);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this._autoStartEnabled = !this.levelSave.autoStart;
                    this.onAutostartClick();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._playButton.deactivate();
                    break;
                case Events.GAME_END:
                    this._playButton.activate();
                    break;
            }
        }
        
        createAutoStartButton(): void {
            this._autoStart = this.createButton(
                Common.GameElements.ControlPanelButtonAutoStart,
                "NONE", Constants.AUTOSTART_FRAMES_ON
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
                Constants.AUTOSTART_FRAMES_ON :
                Constants.AUTOSTART_FRAMES_OFF;

            this._autoStart.setFrames(
                frames[0],
                frames[1],
                frames[2],
                frames[3]
            );
            
            this.levelSave.autoStart = this._autoStartEnabled;
            this.saveState();
        }
        
    }
    
    export class TutorialPanel extends CorePractisePanel {
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
        protected getEventsToIgnore(): string[] {
            return [Events.GAME_STARTED];
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_INACTIVITY_NOTIFY:
                    if (this._messages.length > 0) {
                        this._messages[0].blinkMessage();
                    }
                    break;
                case Events.GAME_NEW_STEP_CREATED:
                    this.onNewStepCreatedEvent(<AlgorithmStep> param1);
                    break;
            }
        }
        
        protected onNewStepCreatedEvent(step: AlgorithmStep): void {
            for(var i=0; i<step.messageKeys.length; ++i) {
                this._messages[i].blinkMessage();
            }
        }
        
        protected getAutostartInterval(): number {
            return 2000;
        }
        
    }

    export class PractisePanel extends CorePractisePanel {
        
        protected _pauseButton: Button;
        
        constructor(game: AlgoGame) {
            super(game);  
        }
        
       createElements():void {
            super.createElements();
            
            this._pauseButton = this.createButton(
                Common.GameElements.ControlPanelButtonPause,
                Events.CONTROL_PANEL_EVENT_PAUSE,
                Constants.PAUSE_BUTTON_FRAMES
            );
            
            this.initButton(this._pauseButton, Constants.CONTROL_PANEL_SECOND_BUTTON_X, 0);
            
            this._pauseButton.deactivate();
            this._pauseButton.alpha = 0;
            
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    this._playButton.alpha = 0;
                    this._pauseButton.alpha = 1;
                    this._pauseButton.activate();
                    break;
                case Events.GAME_END:
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._playButton.alpha = 1;
                    this._playButton.activate();
                    this._pauseButton.alpha = 0;
                    this._pauseButton.deactivate();
                    //Set correct info text here
                    break;
            }
        }
        
        protected getAutostartInterval(): number {
            return Constants.GAME_AUTOSTART_INTERVAL;
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
                Constants.STOP_BUTTON_FRAMES
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
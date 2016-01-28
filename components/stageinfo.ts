/// <reference path="./common.ts" />

declare var Dictionary: any;

module StageInfo {
    
    enum Quarter {TOPLEFT = 0, TOPRIGHT = 1, BOTTOMLEFT = 2, BOTTOMRIGHT = 3}
    enum LevelStageType {MENU = 0, PRACTISE = 1, EXAM = 2, UNKNOWN = 3}
    
    class Save {
        gameInfoSaves: {[stage: string]: number} = {}
    }
    
    class ShowInfo {
        
        private _elementId: Common.GameElements;
        private _eventToHide: string;

        constructor(elementId: Common.GameElements, 
            eventToHide?: string
        ) {
            this._elementId = elementId;
            this._eventToHide = eventToHide;
        }
        
        public get elementId(): Common.GameElements {
            return this._elementId;
        }
        
        public get eventToHide(): string {
            return this._eventToHide;
        }
    }
    
    export class InfoWidget implements Common.InfoWidget {
        
        private _cursorSprite: Phaser.Sprite;
        private _messageBox: Phaser.Group;
        
        private _infoToShow: ShowInfo;
        
        constructor(game: Common.AlgoGame, infoToShow: ShowInfo, closeCallback?: Function) {
            this._infoToShow = infoToShow;
            var message = Dictionary[Common.GameElements[infoToShow.elementId]];
            this.createWidgetUI(game, message, closeCallback);
        }
        
        private createWidgetUI(game: Common.AlgoGame, message: string, closeCallback?: Function): void {
            var cursorSprite = game.add.sprite(-100, -100, 'cursor');
            cursorSprite.scale.setTo(0.3);
            game.world.bringToTop(cursorSprite);
            
            var textBackground: Phaser.Sprite =  game.add.sprite(0,0, 'modalBg');
            textBackground.scale.x = 0.7;
            textBackground.scale.y = 0.5;
            var boxIndexText: Phaser.Text = game.add.text(30,  30 , message , Constants.CONTROL_PANEL_MESSAGE_STYLE);

            this._messageBox = game.add.group();
        
            this._messageBox.add(textBackground);
            this._messageBox.add(boxIndexText);

            if (this._infoToShow.eventToHide == null) {
                //Close by click
                cursorSprite.inputEnabled = true;
                textBackground.inputEnabled = true;
                boxIndexText.inputEnabled = true;
                
                cursorSprite.events.onInputDown.add(closeCallback);
                textBackground.events.onInputDown.add(closeCallback);
                boxIndexText.events.onInputDown.add(closeCallback);
                
            } 
            

            this._cursorSprite = cursorSprite;
        }
        
        public get showInfo(): ShowInfo {
            return this._infoToShow;
        }
        
        public getElementId(): number {
            return this._infoToShow.elementId;   
        }
        
        public showFor(element: Common.GameUIObjectWithState): void {
            var quarter: Quarter = InfoWidget.getQuarter(element.worldPosition.x, element.worldPosition.y);
            
            switch(quarter) {
                case Quarter.TOPRIGHT:
                    this._cursorSprite.x = element.worldPosition.x - this._cursorSprite.width - 10;
                    this._cursorSprite.y = element.worldPosition.y + element.height - 10;
                    this._cursorSprite.angle = 90;
                    this._cursorSprite.anchor.setTo(0.2, 0.8);
                    
                    this._messageBox.x = this._cursorSprite.x - 10 - this._messageBox.width;
                    this._messageBox.y = this._cursorSprite.y + 10 + this._cursorSprite.height;
                    
                    break;
                case Quarter.TOPLEFT:
                    this._cursorSprite.x = element.worldPosition.x + element.width;
                    this._cursorSprite.y = element.worldPosition.y + element.height;
                    
                    this._messageBox.x = this._cursorSprite.x + 10 + this._cursorSprite.width;
                    this._messageBox.y = this._cursorSprite.y + 10 + this._cursorSprite.height;

                    break;
                case Quarter.BOTTOMRIGHT:
                    this._cursorSprite.x = element.worldPosition.x - this._cursorSprite.width - 10;
                    this._cursorSprite.y = element.worldPosition.y - this._cursorSprite.height + 10;
                    this._cursorSprite.anchor.setTo(1);
                    this._cursorSprite.angle = -210;
                    
                    this._messageBox.x = this._cursorSprite.x - 10 - this._messageBox.width;
                    this._messageBox.y = this._cursorSprite.y - 10 - this._messageBox.height;

                    break;
                case Quarter.BOTTOMLEFT:
                    this._cursorSprite.x = element.worldPosition.x + element.width + 10;
                    this._cursorSprite.y = element.worldPosition.y - this._cursorSprite.height - 10;
                    this._cursorSprite.anchor.setTo(0.8);
                    this._cursorSprite.angle = 230;
                    
                    this._messageBox.x = this._cursorSprite.x + 10 + this._cursorSprite.width;
                    this._messageBox.y = this._cursorSprite.y - 10 - this._messageBox.height;
                    
                    break;
            }
            
        }
        
        public destroy(): void {
            this._cursorSprite.destroy();
            this._messageBox.destroy();
        }
        
        private static getQuarter(x: number, y: number): Quarter {
            var centerX = Constants.GAME_WIDTH / 2;
            var centerY = Constants.GAME_HEIGHT / 2;
            if (x > centerX) {
                if (y > centerY) {
                    return Quarter.BOTTOMRIGHT;
                }
                return Quarter.TOPRIGHT;
            } else {
                if (y > centerY) {
                    return Quarter.BOTTOMLEFT;
                }
                return Quarter.TOPLEFT;
            }
        }
    }
    
    class Manager extends Common.GameEventComponent {
        
        private _infoToShow: ShowInfo[];
        private _infoSave: Save;
        private _levelStageType: LevelStageType = LevelStageType.UNKNOWN;
        private _requestedShowWidget: InfoWidget;
        private _infoToShowIndex: number;
        
        constructor(game: Common.AlgoGame, stageType: LevelStageType, infoToShow: ShowInfo[]) {
            super(game);
            this._infoToShow = infoToShow;
            this._levelStageType = stageType;
            
            this._infoSave = game.store.get(Constants.GAME_SHOW_INFO_SAVE_ID) 
                || new Save();
                
            if (this._infoSave.gameInfoSaves[this._levelStageType] == null) {
                this._infoSave.gameInfoSaves[this._levelStageType] = -1;
            }
        }
        
        initEventListners(): void {
            super.addEventListener(Events.STAGE_INITIALIZED);
        }
        
        onInfoShowed(): void {
            var infoToShow = this._requestedShowWidget.showInfo;
            if (infoToShow.eventToHide != null) {
                super.removeEventListener(infoToShow.eventToHide);
            }
            this._infoSave.gameInfoSaves[this._levelStageType] = this._infoToShowIndex;
            this._game.store.set(Constants.GAME_SHOW_INFO_SAVE_ID, this._infoSave);
            this._requestedShowWidget.destroy();
            this.sendShowInfoRequest();
        }
        
        private sendShowInfoRequest(): void {
            
            var lastShowedElementId = this._infoSave.gameInfoSaves[this._levelStageType];
            var elementToShow = lastShowedElementId + 1;
            if (elementToShow >= this._infoToShow.length) {
                console.log("Last show info has been displayed");
                return;
            }
            
            this._infoToShowIndex = elementToShow;
            
            var newShowInfo: ShowInfo = this._infoToShow[elementToShow];
            this._requestedShowWidget = new InfoWidget(this._game, newShowInfo, this.onInfoShowed.bind(this));
            
            if (newShowInfo.eventToHide != null) {
                super.addEventListener(newShowInfo.eventToHide);
            }
            
            this._game.dispatch(Events.STAGE_INFO_SHOW, this, 
                this._requestedShowWidget);
        }
        
        
        dispatchEvent(event: any, param: any) {
            
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.sendShowInfoRequest();
                    break;
                default:
                    if (this._requestedShowWidget != null 
                        && this._requestedShowWidget.showInfo.eventToHide != null
                        && event.type == this._requestedShowWidget.showInfo.eventToHide) {
                            this.onInfoShowed();
                        }
            }
        }
        
        destroy(): void {
            super.destroy();
            if (this._requestedShowWidget != null) {
                this._requestedShowWidget.destroy();
            }
        }
    }
    
    export class PractiseManager extends Manager {
        
        constructor(game: Common.AlgoGame) {
            super(game, LevelStageType.PRACTISE,
                [
                    new ShowInfo(Common.GameElements.MenuButtonPractise),
                    new ShowInfo(Common.GameElements.MenuButtonMenu),
                    new ShowInfo(Common.GameElements.ControlPanelButtonPlay,
                        Events.CONTROL_PANEL_EVENT_PLAY
                        ),
                    new ShowInfo(Common.GameElements.ProgressBarStep)
                ]
            );
        }
        
    }
    
}
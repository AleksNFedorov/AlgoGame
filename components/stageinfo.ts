/// <reference path="./common.ts" />

module StageInfo {
    
    enum Quarter {TOPLEFT = 0, TOPRIGHT = 1, BOTTOMLEFT = 2, BOTTOMRIGHT = 3};
    
    class Save {
        gameInfoSaves: {[stage: string]: number} = {};
    }
    
    class ShowInfo {
        private _elementId: Common.GameElements;
        private _descriptionText: string;
        private _eventToHide: string;
        
        constructor(elementId: Common.GameElements, 
            descriptionText: string,
            eventToHide?: string
        ) {
            this._elementId = elementId;
            this._descriptionText = descriptionText;
            this._eventToHide = eventToHide;
        }
        
        public get elementId(): Common.GameElements {
            return this._elementId;
        }
        
        public get descriptionText(): string {
            return this._descriptionText;
        }
        
        public get eventToHide(): string {
            return this._eventToHide;
        }
    }
    
    export class InfoWidget implements Common.InfoWidget {
        
        private _cursorSprite: Phaser.Sprite;
        private _infoToShow: ShowInfo;
        
        constructor(game: Common.AlgoGame, infoToShow: ShowInfo, closeCallback?: Function) {
            this._infoToShow = infoToShow;
            this._cursorSprite = this.createSprite(game, closeCallback);
        }
        
        private createSprite(game: Common.AlgoGame, closeCallback?: Function): Phaser.Sprite {
            var cursorSprite = game.add.sprite(-100, -100, 'cursor');
            cursorSprite.scale.setTo(0.3);
            game.world.bringToTop(cursorSprite);
            
            if (this._infoToShow.eventToHide == null) {
                //Close by click
                cursorSprite.inputEnabled = true;
                cursorSprite.events.onInputDown.add(closeCallback);
            } 
            
            return cursorSprite;
        }
        
        public get showInfo(): ShowInfo {
            return this._infoToShow;
        }
        
        public getElementId(): number {
            return this._infoToShow.elementId;   
        }
        
        public showFor(element: any): void {
            var quarter: Quarter = InfoWidget.getQuarter(element.x, element.y);
            
            switch(quarter) {
                case Quarter.TOPRIGHT:
                    this._cursorSprite.x = element.x - this._cursorSprite.width - 10;
                    this._cursorSprite.y = element.y + element.height - 10;
                    this._cursorSprite.angle = 90;
                    this._cursorSprite.anchor.setTo(0.2, 0.8);
                    break;
                case Quarter.TOPLEFT:
                    this._cursorSprite.x = element.x + element.width;
                    this._cursorSprite.y = element.y + element.height;
                    break;
                case Quarter.BOTTOMRIGHT:
                    this._cursorSprite.x = element.x - this._cursorSprite.width - 10;
                    this._cursorSprite.y = element.y - this._cursorSprite.height + 10;
                    this._cursorSprite.anchor.setTo(1);
                    this._cursorSprite.angle = -210;
                    break;
                case Quarter.BOTTOMLEFT:
                    this._cursorSprite.x = element.x + element.width + 10;
                    this._cursorSprite.y = element.y - this._cursorSprite.height - 10;
                    this._cursorSprite.anchor.setTo(0.8);
                    this._cursorSprite.angle = 230;
                    break;
            }
            
        }
        
        public destroy(): void {
            this._cursorSprite.destroy();
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
        private _stageType: Common.StageType = Common.StageType.UNKNOWN;
        private _requestedShowWidget: InfoWidget;
        private _infoToShowIndex: number;
        
        constructor(game: Common.AlgoGame, stageType: Common.StageType, infoToShow: ShowInfo[]) {
            super(game);
            this._infoToShow = infoToShow;
            this._stageType = stageType;
            super.addEventListener(Events.STAGE_INITIALIZED);
            
            this._infoSave = game.store.get(Constants.GAME_SHOW_INFO_SAVE_ID) 
                || new Save();
                
            if (this._infoSave.gameInfoSaves[this._stageType] == null) {
                this._infoSave.gameInfoSaves[this._stageType] = -1;
            }
        }
        
        onInfoShowed(): void {
            var infoToShow = this._requestedShowWidget.showInfo;
            if (infoToShow.eventToHide != null) {
                super.removeEventListener(infoToShow.eventToHide);
            }
            this._infoSave.gameInfoSaves[this._stageType] = this._infoToShowIndex;
            this._game.store.set(Constants.GAME_SHOW_INFO_SAVE_ID, this._infoSave);
            this._requestedShowWidget.destroy();
            this.sendShowInfoRequest();
        }
        
        private sendShowInfoRequest(): void {
            
            var lastShowedElementId = this._infoSave.gameInfoSaves[this._stageType];
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
            
            this._game.dispatch(Events.CONTROL_PANEL_SHOW_TEXT, this, 
                newShowInfo.descriptionText);
                
            this._game.dispatch(Events.STAGE_INFO_SHOW, this, 
                this._requestedShowWidget);
        }
        
        
        dispatchEvent(event: any, param: any) {
            
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.sendShowInfoRequest();
                    break;
                default:
                    this.onInfoShowed();
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
            super(game, Common.StageType.PRACTISE,
                [
                    new ShowInfo(
                        Common.GameElements.PRACTISE_CONTROL_PANEL_BUTTON_PLAY,
                        "Play button description",
                        Events.CONTROL_PANEL_EVENT_PLAY
                        ),
                    new ShowInfo(
                        Common.GameElements.PRACTISE_PROGRESS_STEP,
                        "Progress step description"
                        )
                    ]
            );
        }
        
    }
    
};
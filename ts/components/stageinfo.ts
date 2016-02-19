/// <reference path="./common.ts" />

declare var Dictionary: any;

module StageInfo {
    
    enum Quarter {TOPLEFT = 0, TOPRIGHT = 1, BOTTOMLEFT = 2, BOTTOMRIGHT = 3}
    enum LevelStageType {MENU, PRACTISE, EXAM, TUTORIAL, UNKNOWN}
    
    class Save {
        gameInfoSaves: {[stage: string]: number} = {}
    }
    
    export class InfoWidget extends Phaser.Group implements Common.InfoWidget {
        
        private _infoIcon: Phaser.Sprite;
        
        private _infoToShow: Common.ShowInfo;
        
        constructor(game: Common.AlgoGame, infoToShow: Common.ShowInfo, closeCallback?: Function) {
            super(game);
            this._infoToShow = infoToShow;
            var message = Dictionary[infoToShow.messageKey];
            this.createWidgetUI(game, message, closeCallback);
        }
        
        private createWidgetUI(game: Common.AlgoGame, message: string, closeCallback?: Function): void {
            
            var textBackground: Phaser.Sprite =  game.add.sprite(45 ,0, Constants.GAME_GENERAL_ATTLAS, "info_bg_rectangle.png", this);
            this._infoIcon = game.add.sprite(0, 0, Constants.GAME_GENERAL_ATTLAS, "info_3.png", this);
            var boxIndexText: Phaser.Text = game.add.text(textBackground.x + 10,  0, message , Constants.GAME_AREA_INDEX_TEXT, this);
            boxIndexText.x = textBackground.x + textBackground.width/2 - boxIndexText.width/2;            
            boxIndexText.y = this._infoIcon.height/2 - boxIndexText.height/2;            

            if (this._infoToShow.eventToHide == null) {
                //Close by click
                this._infoIcon.inputEnabled = true;
                textBackground.inputEnabled = true;
                boxIndexText.inputEnabled = true;
                
                this._infoIcon.events.onInputDown.add(closeCallback);
                textBackground.events.onInputDown.add(closeCallback);
                boxIndexText.events.onInputDown.add(closeCallback);
                
            } 
            
            this._infoIcon.animations.add("blink", ["info_1.png", "info_2.png", "info_3.png"],3, true);
            this._infoIcon.animations.play("blink");
            
            game.world.bringToTop(this);
        }
        
        public get showInfo(): Common.ShowInfo {
            return this._infoToShow;
        }
        
        public getElementId(): number {
            return this._infoToShow.elementId;   
        }
        
        public showFor(element: Common.GameUIObjectWithState): void {
            var quarter: Quarter = InfoWidget.getQuarter(element.worldPosition.x, element.worldPosition.y);
            
            switch(quarter) {
                case Quarter.TOPRIGHT:
                    this.y = element.worldPosition.y + element.height + 10;
                    this.x = element.worldPosition.x + element.width/2 + this._infoIcon.width/2 - this.width;            
            
                    var pointerSprite = this.game.add.sprite(0, 0 , Constants.GAME_GENERAL_ATTLAS, "triangle_up.png", this);
                    pointerSprite.x = this.width - this._infoIcon.width/2 ;
                    pointerSprite.y = -11;
                    pointerSprite.anchor.x = 0.5;

                    break;
                case Quarter.TOPLEFT:
                
                    this.y = element.worldPosition.y + element.height + 10;
                    this.x = element.worldPosition.x + element.width/2 - this._infoIcon.width/2 ;            
                
                    var pointerSprite = this.game.add.sprite(0, 0 , Constants.GAME_GENERAL_ATTLAS, "triangle_up.png", this);
                    
                    pointerSprite.anchor.x = 0.5;
                    pointerSprite.x = 25;
                    pointerSprite.y = -11;

                    break;
                case Quarter.BOTTOMRIGHT:
                
                    this.y = element.worldPosition.y + element.height + 10;
                    this.y = element.worldPosition.y - this.height - 25 ;
            
                    var pointerSprite = this.game.add.sprite(0, 0 , Constants.GAME_GENERAL_ATTLAS, "triangle_down.png", this);
                    pointerSprite.x = this.width - this._infoIcon.width/2 ;
                    pointerSprite.y = this.height;
                    pointerSprite.anchor.x = 0.5;

                    break;
                case Quarter.BOTTOMLEFT:
                    
                    this.x = element.worldPosition.x + element.width/2 - this._infoIcon.width/2 ;            
                    this.y = element.worldPosition.y - this.height - 25 ;
                    
                    var pointerSprite = this.game.add.sprite(0, 0 , Constants.GAME_GENERAL_ATTLAS, "triangle_down.png", this);

                    pointerSprite.anchor.x = 0.5;
                    pointerSprite.x = 25;
                    pointerSprite.y = this.height;
                    
                    break;
            }
            
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
    
    export class Manager extends Common.GameEventComponent {
        
        private _infoToShow: Common.ShowInfo[];
        private _infoSave: Save;
        private _levelStageType: LevelStageType = LevelStageType.UNKNOWN;
        private _requestedShowWidget: InfoWidget;
        private _infoToShowIndex: number;
        
        constructor(game: Common.AlgoGame, stageType: LevelStageType, infoToShow: Common.ShowInfo[]) {
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
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.STAGE_CUSTOM_INFO_SHOW);
        }
        
        onInfoShowed(): void {
            var infoToShow = this._requestedShowWidget.showInfo;
            if (infoToShow.eventToHide != null) {
                super.removeEventListener(infoToShow.eventToHide);
            }
            this._infoSave.gameInfoSaves[this._levelStageType] = this._infoToShowIndex;
            this._game.store.set(Constants.GAME_SHOW_INFO_SAVE_ID, this._infoSave);
            this._requestedShowWidget.destroy();
            infoToShow.hideCallback();
            this.createAndSendShowInfoRequest();
        }
        
        private createAndSendShowInfoRequest(): void {
            
            var lastShowedElementId = this._infoSave.gameInfoSaves[this._levelStageType] || 0;
            var elementToShow = lastShowedElementId + 1;
            if (elementToShow >= this._infoToShow.length) {
                console.log("Last show info has been displayed");
                this._game.dispatch(Events.STAGE_INFO_ALL_INFO_SHOWED, this);
                return;
            }
            
            this._infoToShowIndex = elementToShow;
            
            this.sendShowInfoRequest(this._infoToShow[elementToShow]);
        }
        
        private sendShowInfoRequest(infoToShow: Common.ShowInfo): void {
            this._requestedShowWidget = new InfoWidget(this._game, infoToShow, this.onInfoShowed.bind(this));
            
            if (infoToShow.eventToHide != null) {
                super.addEventListener(infoToShow.eventToHide);
            }
            
            this._game.dispatch(Events.STAGE_INFO_SHOW, this, 
                this._requestedShowWidget);
        }
        
        dispatchEvent(event: any, param: any) {
            
            switch(event.type) {
                case Events.STAGE_CUSTOM_INFO_SHOW:
                    this.sendShowInfoRequest(param);
                    break;
                case Events.STAGE_INITIALIZED:
                    this.createAndSendShowInfoRequest();
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
    
    export class TutorialManager extends Manager {
        
        constructor(game: Common.AlgoGame) {
            super(game, LevelStageType.TUTORIAL,[]);
        }
    }

    export class PractiseManager extends Manager {
        
        constructor(game: Common.AlgoGame) {
            super(game, LevelStageType.PRACTISE,
                [
                    new Common.ShowInfo(Common.GameElements.MenuButtonDescription),
                    new Common.ShowInfo(Common.GameElements.MenuButtonObjectives),
                    new Common.ShowInfo(Common.GameElements.ControlPanelText),
                    new Common.ShowInfo(Common.GameElements.ControlPanelButtonPlay,
                        Events.CONTROL_PANEL_EVENT_PLAY
                        ),
                    new Common.ShowInfo(Common.GameElements.ProgressBarStep),
                    new Common.ShowInfo(Common.GameElements.ProgressBarComplete),
                    new Common.ShowInfo(Common.GameElements.MenuButtonExam),
                ]
            );
        }
    }
    
    export class ExamManager extends Manager {
        
        constructor(game: Common.AlgoGame) {
            super(game, LevelStageType.EXAM,[]);
        }
    }
    
}
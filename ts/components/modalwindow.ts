/// <reference path="./common.ts" />

declare var Dictionary: any;

module GameModal {
    
    export class ModalConfig {
        constructor(
            public modalId: string,
            public contentImageId: string,
            public imageAtlas?: string,
            public delay:number = 3000
            ) {};
    }
    
    export class ModalWindow extends Common.GameEventComponent {
        
        private _windowConfigs: ModalConfig[] = [];
        
        private _activeWindow: Phaser.Group;
        private _delayTimer: Phaser.Timer;
        
        constructor(game: Common.AlgoGame) {
            super(game)
            this._delayTimer = game.time.create(false);
            this._delayTimer.start();
        }
        
        protected initEventListners(): void {
            for (var eventId of Events.getAllEvents()) {
               this.addEventListener(eventId);
            }
        }
        
        public dispatchEvent(event: any, param1: any) {
            console.log("Modal event received");
            switch(event.type) {
                case Events.GAME_PRACTISE_DONE:
                    var isUserAction: boolean = <boolean> param1;
                    if (!isUserAction) {
                        break;
                    }
                case Events.GAME_TUTORIAL_DONE:
                case Events.GAME_EXAM_DONE:
                case Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES:
                    this.show(event.type);
                    break;
                default:
                    break;
            }
        }
        
        public registerWindow(config: ModalConfig): void {
            this._windowConfigs[config.modalId] = config;
        }
         
        private show(modalId: string): void {
            this.onShow();
            this.showModalWindow(modalId);
        }
        
        private showModalWindow(windowId: string): void {
        
            var config = this._windowConfigs[windowId];
            
            var windowGroup = this._game.add.group();
            
            var graphics = this._game.add.graphics(0, 0);
            graphics.lineStyle(0);
            graphics.beginFill(Constants.GAME_BACKGROUND_SEPARATOR, 1);
            graphics.drawRect(0, 0, this._game.width - 100, this._game.height - 100);
            graphics.endFill();
            
            windowGroup.add(this._game.add.sprite(0,0, graphics.generateTexture()));
            graphics.destroy();
            
            var contentImage: Phaser.Sprite;
            
            if (config.imageAtlas) {
                contentImage = this._game.add.sprite(0,0, config.imageAtlas, config.contentImageId);
            } else {
                contentImage = this._game.add.sprite(0,0, config.contentImageId);
            }
            
            contentImage.x = windowGroup.width/2 - contentImage.width/2;
            contentImage.y = 40;
            
            var playButton = new Common.Button(
                this._game,
                Constants.PLAY_BUTTON_MID_FRAMES
            );
            playButton.callback = this.onHide.bind(this);

            playButton.x = contentImage.x + contentImage.width - playButton.width;
            playButton.y = windowGroup.height - (windowGroup.height - (contentImage.y + contentImage.height)) / 2 - playButton.height/2;
            playButton.deactivate();            

            var text: string = <string>Phaser.ArrayUtils.getRandomItem(Dictionary.GeneralMessages);
            var gameText = new Common.Text(
                this._game,
                contentImage.x, 
                0,
                text,
                Constants.PROGRESS_BAR_TEXT);
                
            gameText.y = playButton.y + playButton.height/2 - gameText.height/2;                
            
            windowGroup.add(contentImage);
            windowGroup.add(gameText);
            windowGroup.add(playButton);
            
            windowGroup.x = 50;
            windowGroup.y = 50;

            this._activeWindow = windowGroup;
            
            this._delayTimer.add(config.delay, playButton.activate, playButton);
        }
        
        protected onShow(): void {
            console.log("Modal window showed");
            this._game.dispatch(Events.MODAL_WINDOW_DISPLAYING, this);
        }
        
        protected onHide(): void {
            console.log("Modal window hide");
            this._activeWindow.destroy();
            this._game.dispatch(Events.MODAL_WINDOW_HIDE, this);
        }
        
        destroy(): void {
            super.destroy();
            this._delayTimer.destroy();
            this._windowConfigs = null;
        }
    }
}


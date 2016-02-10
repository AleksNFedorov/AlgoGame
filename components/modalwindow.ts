/// <reference path="./common.ts" />

module GameModal {
    
    export class ModalConfig {
        constructor(
            public modalId: string,
            public contentImageId: string,
            public imageAtlas?: string
            ) {};
    }
    
    export class ModalWindow extends Common.GameEventComponent {
        
        private _windowConfigs: ModalConfig[] = [];
        
        private _activeWindow: Phaser.Group;
        
        constructor(game: Common.AlgoGame) {
            super(game)
        }
        
        protected initEventListners(): void {
            this.addEventListener(Events.GAME_PRACTISE_DONE);
            this.addEventListener(Events.GAME_EXAM_DONE);
            this.addEventListener(Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES);
        }
        
        public dispatchEvent(event: any, param1: any) {
            console.log("Modal event received");
            switch(event.type) {
                case Events.GAME_PRACTISE_DONE:
                    var isUserAction: boolean = <boolean> param1;
                    if (!isUserAction) {
                        break;
                    }
                case Events.GAME_EXAM_DONE:
                case Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES:
                    this.show(event.type);
                    break;
            }
        }
        
        public createWindows(configs: ModalConfig[]): void {
            for(var config of configs) {
                this._windowConfigs[config.modalId] = config;
            }
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
            
            contentImage.anchor.setTo(0.5);
            contentImage.x = windowGroup.width/2;
            contentImage.y = windowGroup.height/2;
            
            windowGroup.add(contentImage);
            
            windowGroup.x = 50;
            windowGroup.y = 50;

            this._game.input.onUp.add(this.onHide, this);
            
            this._activeWindow = windowGroup;
        }
        
        
        protected onShow(): void {
            console.log("Modal window showed");
            this._game.dispatch(Events.MODAL_WINDOW_DISPLAYING, this);
        }
        
        protected onHide(): void {
            console.log("Modal window hide");
            this._activeWindow.destroy();
            this._game.input.onUp.remove(this.onHide, this);
            this._game.dispatch(Events.MODAL_WINDOW_HIDE, this);
        }
        
        destroy(): void {
            super.destroy();
            this._windowConfigs = null;
        }
    }
}


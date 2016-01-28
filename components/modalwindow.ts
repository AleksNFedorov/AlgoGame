/// <reference path="../lib/gamemodal.d.ts" />
/// <reference path="./common.ts" />

module GameModal {
    
    export class ModalConfig {
        constructor(
            public modalId: string,
            public contentImageId: string) {};
    }
    
    class GameModalWindowComponent {
        type: string;
        content: any;
        contentScale: number;
        fontSize: number;
        color: string;
        offsetY: number; 
        offsetX: number;
        callback: Function;
    }
    
    class GameModalOptions {
        
        type: string;
        includeBackground: boolean;
        backgroundColor: string;
        backgroundOpacity: number;
        modalCloseOnInput: boolean;
        modalBackgroundCallback: boolean;
        vCenter: boolean;
        hCenter: boolean;
        itemsArr: GameModalWindowComponent[];
        hideCallback: Function;
    }
    
    
    export class ModalWindow extends Common.GameEventComponent {
        
        private _gameModal;
        private _createdWindows: ModalConfig[];
        
        constructor(game: Common.AlgoGame) {
            super(game)
            this._gameModal = new GameModal(game);
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
            this._createdWindows = configs;
            for(var config of configs) {
                this.createAndRegisterNewWindow(config);
            }
        }
         
        private createAndRegisterNewWindow(config: ModalConfig): void {
            
            var modalOptions: GameModalOptions = new GameModalOptions();
            modalOptions.type = config.modalId;
            modalOptions.includeBackground = true;
            modalOptions.modalCloseOnInput = true;
            modalOptions.hideCallback = this.onHide.bind(this);
            
            var bg: GameModalWindowComponent = new GameModalWindowComponent();
            bg.type = "image";
            bg.content = "modalBg";
            bg.contentScale = 1;
            
            var windowContent: GameModalWindowComponent = new GameModalWindowComponent();
            windowContent.type = "image";
            windowContent.content = config.contentImageId;
            windowContent.offsetY = -60;
            windowContent.offsetX = -125;
            windowContent.contentScale = 0.5;
    
            modalOptions.itemsArr = [bg, windowContent];
            
            this._gameModal.createModal(modalOptions);
        }
        
        private show(modalId: string): void {
            this.onShow();
            this._gameModal.showModal(modalId);
        }
        
        
        protected onShow(): void {
            console.log("Modal window showed");
            this._game.dispatch(Events.MODAL_WINDOW_DISPLAYING, this);
        }
        
        protected onHide(): void {
            console.log("Modal window hide");
            this._game.dispatch(Events.MODAL_WINDOW_HIDE, this);
        }
        
        destroy(): void {
            super.destroy();
            for(var config of this._createdWindows) {
                this._gameModal.destroyModal(config.modalId);   
            }
        }
    }
}


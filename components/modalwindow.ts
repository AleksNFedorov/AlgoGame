/// <reference path="../lib/gamemodal.d.ts" />
/// <reference path="./common.ts" />

module GameModal {

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
        private _type: string
        private _paused: boolean;
        
        constructor(game: Common.AlgoGame, type: string) {
            super(game)
            this._gameModal = new GameModal(game);
            this._type = type;
        }
        
        public show(image: string): void {
            
            this._paused = false;
            
            var modalOptions: GameModalOptions = new GameModalOptions();
            modalOptions.type = this._type;
            modalOptions.includeBackground = true;
            modalOptions.modalCloseOnInput = true;
            modalOptions.hideCallback = this.onHide.bind(this);
            
            var bg: GameModalWindowComponent = new GameModalWindowComponent();
            bg.type = "image";
            bg.content = "modalBg";
            bg.contentScale = 1;
            
            var windowContent: GameModalWindowComponent = new GameModalWindowComponent();
            windowContent.type = "image";
            windowContent.content = image;
            windowContent.offsetY = -60;
            windowContent.offsetX = -125;
            windowContent.contentScale = 0.5;
    
            modalOptions.itemsArr = [bg, windowContent];
            
            this._gameModal.createModal(modalOptions);
            this.onShow();
            this._gameModal.showModal(this._type);
        }
        
        protected onShow(): void {
            console.log("Modal window [" + this._type + "] showed");
            if (this._game.levelStageState == Common.LevelStageState.RUNNING) {
                this._game.dispatch(Events.CONTROL_PANEL_EVENT_PAUSE, this);
                this._paused = true;
            }
        }
        
        protected onHide(): void {
            console.log("Modal window [" + this._type + "] hide");
            if (this._paused) {
                this._game.dispatch(Events.CONTROL_PANEL_EVENT_PLAY, this);
                this._paused = false;
            }
        }
        
        destroy(): void {
            this._gameModal.destroyModal(this._type);   
        }
    }
}


/// <reference path="./common.ts" />

module Common {   
    
    export class Menu extends GameContainerWithStoreSupport {
        
        protected _menuButtons: Common.Button[] = [];
        private _menuGroup: Phaser.Group;

        constructor(game:AlgoGame) {
            super(game);
            
            this._menuGroup = game.add.group();
            this._menuGroup.x = Constants.MENU_POSITION_X;
            this._menuGroup.y = Constants.MENU_POSITION_Y;
            
            this.createButtons();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.MENU_EVENT_GO_MENU);
            this.addEventListener(Events.MENU_EVENT_OPEN_ALGO_DESCR);
            this.addEventListener(Events.MENU_EVENT_GO_PRACTISE);
            this.addEventListener(Events.MENU_EVENT_GO_EXAM);
        }
        
        protected createButtons(): void {
            this.addButtonToMenu(Common.GameElements.MENU_BUTTON_MENU, Events.MENU_EVENT_GO_MENU, [12,2,82,2, 6], 50, 30);
            this.addButtonToMenu(Common.GameElements.MENU_BUTTON_DESCRIPTION, Events.MENU_EVENT_OPEN_ALGO_DESCR, [3,3,68,3, 81], 110, 30);
            this.addButtonToMenu(Common.GameElements.MENU_BUTTON_OBJECTIVES, Events.MENU_EVENT_SHOW_LEVEL_OBJECT, [77,77,53,77, 66], 170, 30);
            this.addButtonToMenu(Common.GameElements.MENU_BUTTON_PRACTISE, Events.MENU_EVENT_GO_PRACTISE, [63,63,39,63, 0], 870, 30);
            this.addButtonToMenu(Common.GameElements.MENU_BUTTON_EXAM, Events.MENU_EVENT_GO_EXAM, [5,5,14,5, 31], 940, 30);
            console.log("Button has been added");
        }
        
        protected addButtonToMenu(elementId: GameElements, eventId: string, frames: number[], x: number, y: number) {
            var newButton: Common.Button = this.createButton(frames);
            newButton.x = x;
            newButton.y = y;
            newButton.callback = super.getCallbackForEventId(eventId);
        
            this._menuGroup.add(newButton);
            this._menuButtons[elementId] = newButton;
            super.addGameElement(elementId, newButton);
        }
        
        protected createButton(frames: number[]): Common.Button {
            var newButton: Common.Button = new Common.Button(this._game, frames);
            newButton.scale.setTo(0.3);
            return newButton;
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.MENU_EVENT_GO_MENU:
                    var elementIdName = GameElements[GameElements.MENU_BUTTON_MENU];
                    this._game.state.start(this.stateConfig.menu[elementIdName]);
                    break;
                case Events.MENU_EVENT_OPEN_ALGO_DESCR:
                    var elementIdName = GameElements[GameElements.MENU_BUTTON_DESCRIPTION];
                    window.open(this.stateConfig.menu[elementIdName], "_blank");
                    break;
                case Events.MENU_EVENT_GO_PRACTISE:
                    var elementIdName = GameElements[GameElements.MENU_BUTTON_PRACTISE];
                    this._game.state.start(this.stateConfig.menu[elementIdName]);
                    break;
                case Events.MENU_EVENT_GO_EXAM:
                    var elementIdName = GameElements[GameElements.MENU_BUTTON_EXAM];
                    this._game.state.start(this.stateConfig.menu[elementIdName]);
                    break;
                    break;
            }
        }

        
        destroy(): void {
            
            console.log("Destroying buttons");
            
            super.destroy();
            this._menuGroup.destroy();
            
            console.log("Buttons destroyed");
        }
    }    
    
    export class PractiseMenu extends Menu {
        
        constructor(game: AlgoGame) {
            super(game);
            var goPractiseButton = this._menuButtons[GameElements.MENU_BUTTON_PRACTISE];
            goPractiseButton.deactivate();

            var goExamButton = this._menuButtons[GameElements.MENU_BUTTON_EXAM];
            goExamButton.deactivate();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_PRACTISE_DONE);
        }
        
        public dispatchEvent(event: any, param1: any): void {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_PRACTISE_DONE:
                    var goExamButton = this._menuButtons[GameElements.MENU_BUTTON_EXAM];
                    goExamButton.activate();
                    break;
            }
        }
    }
    
    export class ExamMenu extends Menu {
        
        constructor(game: AlgoGame) {
            super(game);

            var goExamButton = this._menuButtons[GameElements.MENU_BUTTON_EXAM];
            goExamButton.deactivate();
        }
        
    }
    
}
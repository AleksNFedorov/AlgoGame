/// <reference path="./common.ts" />

declare var Dictionary: any;

module Common {   
    
    export class Menu extends GameComponentContainer {
        
        protected _menuButtons: Common.Button[] = [];
        private _menuGroup: Phaser.Group;

        constructor(game:AlgoGame) {
            super(game);
            
            this._menuGroup = game.add.group();
            this._menuGroup.x = Constants.MENU_POSITION_X;
            this._menuGroup.y = Constants.MENU_POSITION_Y;
            
            this.createButtons();
        }
        
        private addLevelName(): void {
            var text = Dictionary[this.stateConfig.level].full;
            var levelNameText = this._game.add.text(
                this._game.width/2, 
                15, 
                text, Constants.MENU_HEADER_TEXT_STYLE, this._menuGroup);
            levelNameText.anchor.x = 0.5;            
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.MENU_EVENT_GO_MENU);
            this.addEventListener(Events.MENU_EVENT_OPEN_ALGO_DESCR);
            this.addEventListener(Events.MENU_EVENT_GO_PRACTISE);
            this.addEventListener(Events.MENU_EVENT_GO_EXAM);
        }
        
        protected createButtons(): void {
            this.addButtonToMenu(Common.GameElements.MenuButtonMenu, Events.MENU_EVENT_GO_MENU, Constants.MENU_BUTTON_FRAMES , 50, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonDescription, Events.MENU_EVENT_OPEN_ALGO_DESCR, Constants.ALGO_DESCR_FRAMES, 110, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonObjectives, Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, Constants.LEVEL_OBJECTIVES_FRAMES, 170, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonPractise, Events.MENU_EVENT_GO_PRACTISE, Constants.GO_PRACTISE_FRAMES, 870, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonExam, Events.MENU_EVENT_GO_EXAM, Constants.GO_EXAM_FRAMES, 940, 10);
            console.log("Button has been added");
        }
        
        protected addButtonToMenu(elementId: GameElements, eventId: string, frames: any[], x: number, y: number) {
            var newButton: Common.Button = this.createButton(frames);
            newButton.x = x;
            newButton.y = y;
            newButton.callback = super.getCallbackForEventId(eventId);
        
            this._menuGroup.add(newButton);
            this._menuButtons[elementId] = newButton;
            super.addGameElement(elementId, newButton);
        }
        
        protected createButton(frames: any[]): Common.Button {
            var newButton: Common.Button = new Common.Button(this._game, frames, Constants.GAME_GENERAL_ATTLAS);
            newButton.scale.setTo(0.8);
            return newButton;
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INITIALIZED:
                    this.addLevelName();
                break;
                case Events.MENU_EVENT_GO_MENU:
                    var elementIdName = GameElements[GameElements.MenuButtonMenu];
                    this._game.state.start(this.stateConfig.menu[elementIdName]);
                    break;
                case Events.MENU_EVENT_OPEN_ALGO_DESCR:
                    var elementIdName = GameElements[GameElements.MenuButtonDescription];
                    window.open(this.stateConfig.menu[elementIdName], "_blank");
                    break;
                case Events.MENU_EVENT_GO_PRACTISE:
                    var elementIdName = GameElements[GameElements.MenuButtonPractise];
                    this._game.state.start(this.stateConfig.menu[elementIdName]);
                    break;
                case Events.MENU_EVENT_GO_EXAM:
                    var elementIdName = GameElements[GameElements.MenuButtonExam];
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
            var goPractiseButton = this._menuButtons[GameElements.MenuButtonPractise];
            var goExamButton = this._menuButtons[GameElements.MenuButtonExam];
            
            goPractiseButton.deactivate();
            if (!game.currentState.levelSave.practisePassed) {
                goExamButton.deactivate();
            }
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_PRACTISE_DONE);
        }
        
        public dispatchEvent(event: any, param1: any): void {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_PRACTISE_DONE:
                    var goExamButton = this._menuButtons[GameElements.MenuButtonExam];
                    goExamButton.activate();
                    break;
            }
        }
    }
    
    export class ExamMenu extends Menu {
        
        constructor(game: AlgoGame) {
            super(game);

            var goExamButton = this._menuButtons[GameElements.MenuButtonExam];
            goExamButton.deactivate();
        }
        
    }
    
}
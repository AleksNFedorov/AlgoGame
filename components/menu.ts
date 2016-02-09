/// <reference path="./common.ts" />

declare var Dictionary: any;

module Common {   
    
    export class Menu extends GameContainerWithStoreSupport {
        
        private static MENU_BUTTON_FRAMES = [
                "Menu-button_Mouse-over.png",
                "Menu-button_Enabled.png",
                "Menu-button_Clicked.png",
                "Menu-button_Enabled.png",
                "Menu-button_disable.png"
        ];
        
        private static ALGO_DESCR_FRAMES = [
                "Algorithm-description_Mouse-over.png",
                "Algorithm-description_Enabled.png",
                "Algorithm-description_Clicked.png",
                "Algorithm-description_Enabled.png",
                "Algorithm-description_disable.png"
        ];

        private static LEVEL_OBJECTIVES_FRAMES = [
                "Level-Objectives_Mouse-over.png",
                "Level-Objectives_Enabled.png",
                "Level-Objectives_Clicked.png",
                "Level-Objectives_Enabled.png",
                "Level-Objectives_disable.png"
        ];

        private static GO_PRACTISE_FRAMES = [
                "Go-Practise_Enabled_Mouse-over.png",
                "Go-Practise_Enabled.png",
                "Go-Practise_Enabled_Clicked.png",
                "Go-Practise_Enabled.png",
                "Go-Practise_disable.png"
        ];

        private static GO_EXAM_FRAMES = [
                "Go-Exam_Enabled_Mouse-over.png",
                "Go-Exam_Enabled.png",
                "Go-Exam_Enabled_Clicked.png",
                "Go-Exam_Enabled.png",
                "Go-Exam_disable.png"
        ];

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
            var text = Dictionary[this.stateConfig.level];
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
            this.addButtonToMenu(Common.GameElements.MenuButtonMenu, Events.MENU_EVENT_GO_MENU, Menu.MENU_BUTTON_FRAMES , 50, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonDescription, Events.MENU_EVENT_OPEN_ALGO_DESCR, Menu.ALGO_DESCR_FRAMES, 110, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonObjectives, Events.MENU_EVENT_SHOW_LEVEL_OBJECTIVES, Menu.LEVEL_OBJECTIVES_FRAMES, 170, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonPractise, Events.MENU_EVENT_GO_PRACTISE, Menu.GO_PRACTISE_FRAMES, 870, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonExam, Events.MENU_EVENT_GO_EXAM, Menu.GO_EXAM_FRAMES, 940, 10);
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
            goPractiseButton.deactivate();

            var goExamButton = this._menuButtons[GameElements.MenuButtonExam];
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
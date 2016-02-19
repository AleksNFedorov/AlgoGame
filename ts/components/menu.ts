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
                7, 
                text, Constants.MENU_HEADER_TEXT_STYLE, this._menuGroup);
            levelNameText.anchor.x = 0.5;            
            
            var stageNameTextValue = Dictionary["stageNames"][this.getStageName()]
            var stageText = this._game.add.text(
                this._game.width/2, 
                levelNameText.y + levelNameText.height + 2, 
                stageNameTextValue, 
                Constants.GAME_AREA_INDEX_TEXT, this._menuGroup);
            stageText.anchor.x = 0.5;            
        }
        
        protected getStageName(): string {
            throw "Method not implemented yet [getStageNameText]";
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.MENU_EVENT_GO_MENU);
            this.addEventListener(Events.MENU_EVENT_OPEN_ALGO_DESCR);
            this.addEventListener(Events.MENU_EVENT_GO_PRACTISE);
            this.addEventListener(Events.MENU_EVENT_GO_EXAM);
            this.addEventListener(Events.MENU_EVENT_GO_TUTORIAL);
        }
        
        protected createButtons(): void {
            this.addButtonToMenu(Common.GameElements.MenuButtonMenu, Events.MENU_EVENT_GO_MENU, Constants.MENU_BUTTON_FRAMES , 50, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonDescription, Events.MENU_EVENT_OPEN_ALGO_DESCR, Constants.ALGO_DESCR_FRAMES, 110, 10);
            this.addButtonToMenu(Common.GameElements.MenuButtonTutorial, Events.MENU_EVENT_GO_TUTORIAL, Constants.GO_TUTORIAL_FRAMES, 800, 10);
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
                    this._game.state.start("menu");
                    break;
                case Events.MENU_EVENT_OPEN_ALGO_DESCR:
                    var elementIdName = GameElements[GameElements.MenuButtonDescription];
                    window.open(this.stateConfig.menu[elementIdName], "_blank");
                    break;
                case Events.MENU_EVENT_GO_TUTORIAL:
                    this._game.state.start(this.stateConfig.level + "Tutorial");
                    break;
                case Events.MENU_EVENT_GO_PRACTISE:
                    this._game.state.start(this.stateConfig.level + "Practise");
                    break;
                case Events.MENU_EVENT_GO_EXAM:
                    this._game.state.start(this.stateConfig.level + "Exam");
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
    
    export class TutorialMenu extends Menu {
        
        constructor(game: AlgoGame) {
            super(game);
            var goPractiseButton = this._menuButtons[GameElements.MenuButtonPractise];
            var goExamButton = this._menuButtons[GameElements.MenuButtonExam];
            var goTutorialButton = this._menuButtons[GameElements.MenuButtonTutorial];
            
            goTutorialButton.deactivate();
            if (!game.currentState.levelSave.tutorialPassed) {
                goPractiseButton.deactivate();
            }
            if (!game.currentState.levelSave.practisePassed) {
                goExamButton.deactivate();
            }
        }
        
        protected getStageName(): string {
            return "tutorial";
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_TUTORIAL_DONE);
        }
        
        public dispatchEvent(event: any, param1: any): void {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_TUTORIAL_DONE:
                    var goPractiseButton = this._menuButtons[GameElements.MenuButtonPractise];
                    goPractiseButton.activate();
                    break;
            }
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
        
        protected getStageName(): string {
            return "practise";
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
        
        protected getStageName(): string {
            return "exam";
        }
    }
    
}
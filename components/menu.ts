/// <reference path="./common.ts" />

module Common {   
    
    export class Menu extends GameComponentContainer {
        
        private _menuButtons: Common.Button[] = [];
        private _menuGroup: Phaser.Group;

        constructor(game:AlgoGame) {
            super(game);
            
            this._menuGroup = game.add.group();
            this._menuGroup.x = Constants.MENU_POSITION_X;
            this._menuGroup.y = Constants.MENU_POSITION_Y;
            
            this.createButtons();
        }
        
        protected createButtons(): void {
            this.addButtonToMenu(Common.GameElements.MENU_BUTTON_BACK, [19, 19, 84, 19, 45], 50, 50);
            console.log("Button has been added");
        }
        
        protected addButtonToMenu(elementId: GameElements, frames: number[], x: number, y: number) {
            var newButton: Common.Button = this.createButton(frames);
            newButton.x = x;
            newButton.y = y;
        
            this._menuGroup.add(newButton);
            this._menuButtons[elementId] = newButton;
            super.addGameElement(elementId, newButton);
        }
        
        protected createButton(frames: number[]): Common.Button {
            var newButton: Common.Button = new Common.Button(this._game, frames);
            newButton.scale.setTo(0.3);
            return newButton;
        }
        
        setCallbackToElement(gameElement: GameElements, callback: Function): void {
            var button: Common.Button = this._menuButtons[gameElement];
            button.callback = callback;
        }
        
        destroy(): void {
            
            console.log("Destroying buttons");
            
            super.destroy();
            this._menuGroup.destroy();
            
            console.log("Buttons destroyed");
        }
    }    
}
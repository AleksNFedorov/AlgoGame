/// <reference path="./common.ts" />

// Raname file to reflect it related to levels

module Common {
    
    class LevelInfo {
        private _levelSave: StateSave;
        private _levelName: string;
        
        public levelEnabled: boolean = false;
        public stateToStart: string;
        
        constructor(levelName: string, levelSave: StateSave) {
            this._levelSave = levelSave;
            this._levelName = levelName;
        }
        
        public get practiseDone(): number {
            return this._levelSave.practiseDone;
        }
        
        public get practisePassed(): boolean {
            return this._levelSave.practisePassed;
        }

        public get examPassed(): boolean {
            return this._levelSave.examPassed;
        }
    }
    
    class LevelButton extends Phaser.Group implements Common.GameUIObjectWithState {
        
        private _button: Button;
        private _text: Phaser.Text;
        
        constructor(game: AlgoGame, levelInfo: LevelInfo, x: number, y:number, frames: number[]) {

            super(game);

            this._button = new Button(game, frames);
            this._button.scale.setTo(0.3);
            
            if (!levelInfo.levelEnabled) {
                this._button.deactivate();
            }
            
            this._button.callback = function() {
                console.log("Starting new level " + levelInfo.stateToStart);
                game.state.start(levelInfo.stateToStart);
            };
            
            this._text = this.game.add.text(
                0,
                50,
                "" + levelInfo.practiseDone + " " + levelInfo.practisePassed + " " + levelInfo.practisePassed, 
                Constants.CONTROL_PANEL_MESSAGE_STYLE
            );

            this.add(this._button);
            this.add(this._text);
            
            this.x = x;
            this.y = y;
            
            game.add.existing(this);
        }
        
        saveStateAndDisable(): void {}
        
        restoreState(): void {}
    }
    
    export class LevelButtonsPanel extends GameComponentContainer {
        
        constructor(game: AlgoGame) {
            super(game);
            this.createLevelButtons();
        }
        
        private createLevelButtons(): void {
            
            var levelSave: StateSave = this._game.store.get("binarySearch");
            var levelInfo: LevelInfo = new LevelInfo("binarySearch", levelSave);
            levelInfo.levelEnabled = true;
            levelInfo.stateToStart = "binarySearchPractise";
            
            var binarySearchButton = new LevelButton(this._game, levelInfo, 50,50, [12,2,82,2, 6]);
            this.addGameElement(GameElements.LEVEL_BUTTON, binarySearchButton);
        }
    }
}
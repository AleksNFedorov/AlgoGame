/// <reference path="./common.ts" />

module Common {
    
    class LevelInfo {
        
        private _levelSave: LevelSave;
        private _levelName: string;
        private _practiseToPass: number;
        
        public levelEnabled: boolean = false;
        public stateToStart: string;
        
        constructor(levelName: string, levelSave: LevelSave, practiseToPass: number) {
            this._levelSave = levelSave;
            this._levelName = levelName;
            this._practiseToPass = practiseToPass;
        }
        
        public get levelName(): string {
            return this._levelName;
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
        
        public get practiseToPass(): number {
            return this._practiseToPass;
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
                "[" + levelInfo.stateToStart + "]" + levelInfo.practiseDone + " " + levelInfo.practisePassed + " " + levelInfo.practisePassed, 
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
    
    class LevelLocker {
        
        private _game: AlgoGame;
        private _levelInfo: LevelInfo[] = [];
        
        constructor(game: AlgoGame) {
            this._game = game;
            this.initLevelInfo();
        }
        
        private initLevelInfo(): void {
            for(var levelName in this._game.config.levelConfigs) {
                console.log("Processing level [" + levelName + "] config");
                var levelInfo: LevelInfo = this.createLevelInfo(levelName);
                this._levelInfo.push(levelInfo);
            }
        }
        
        private createLevelInfo(levelName: string): LevelInfo {
            
            var levelSave: LevelSave = this._game.store.get(levelName) || new LevelSave();
            var levelConfig: GameConfig.LevelConfig = this._game.config.levelConfigs[levelName];
            var levelPractiseConfig: GameConfig.StageConfig = levelConfig.practise;

            var levelInfo: LevelInfo = new LevelInfo(levelName, levelSave, levelPractiseConfig.stepsToPass);
            levelInfo.stateToStart = levelPractiseConfig.stageName;
            
            if (levelConfig.dependsOn != null) {
                var dependsOnLevelSave: LevelSave = this._game.store.get(levelConfig.dependsOn) || new LevelSave();
                levelInfo.levelEnabled = dependsOnLevelSave.examPassed;
            } else {
                levelInfo.levelEnabled = true;
            }
            
            return levelInfo;
        }
        
        get levelInfos(): LevelInfo[] {
            return this._levelInfo;
        }
        
    }
    
    export class LevelButtonsPanel extends GameComponentContainer {
        
        private _levelLocker: LevelLocker;
        
        constructor(game: AlgoGame) {
            super(game);
            
            this._levelLocker = new LevelLocker(game);
            
            this.createLevelButtons();
        }
        
        private createLevelButtons(): void {
            
            var yOffset = 0;
            
            for(var levelInfo of this._levelLocker.levelInfos) {
                yOffset += 100;
                var levelButton = new LevelButton(this._game, levelInfo, 50, yOffset, [12,2,82,2, 6]);
                this.addGameElement(GameElements.LEVEL_BUTTON, levelButton);
            }
        }
    }
}
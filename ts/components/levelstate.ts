/// <reference path="./common.ts" />

declare var FB: any;
declare var Dictionary: any;

module Common {
    
    class LevelButtonSettings {
        
        constructor(
            public value: any,
            public overFrame: string,
            public outFrame: string, 
            public clickedFrame: string,
            public disabledFrame: string,
            public textOverColor: string,
            public textOutColor: string,
            public textDisabledColor: string
            ) {}
            
        public getButtonFrames(): string[] {
            return [this.overFrame, this.outFrame, this.clickedFrame, this.outFrame, this.disabledFrame];
        }            
        
    }
    
    class LevelInfo {
        
        private _levelSave: LevelSave;
        private _levelName: string;
        
        public levelEnabled: boolean = false;
        public stateToStart: string;
        
        constructor(levelName: string, levelSave: LevelSave) {
            this._levelSave = levelSave;
            this._levelName = levelName;
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

        public get examDone(): number {
            return this._levelSave.examDone;
        }

        public get examPassed(): boolean {
            return this._levelSave.examPassed;
        }

        public get tutorialDone(): number {
            return this._levelSave.tutorialDone;
        }

        public get tutorialPassed(): boolean {
            return this._levelSave.tutorialPassed;
        }
    }
    
    class LevelButton extends Phaser.Group implements GameUIObjectWithState {
        
        private _nameText: Phaser.Text;
        private _statsText: Phaser.Text;
        private _button: Button;
        private _settings: LevelButtonSettings;
        
        constructor(game: AlgoGame, name: string, settings: LevelButtonSettings, clickCallback: Function) {
            super(game);

            this._settings = settings;

            this._button = new Button(game, settings.getButtonFrames(), Constants.MAIN_MENU_ATTLAS);
            this._button.scale.setTo(0.7);
            this._button.callback = clickCallback;

            this._nameText = this.game.add.text(
                87,
                31,
                name, 
                JSON.parse(JSON.stringify(Constants.MENU_LEVEL_TEXT_STYLE))
            );
            
            this._nameText.fill = Constants.MENU_LEVEL_TEXT_ENABLED;
            this._nameText.anchor.setTo(0.5);

            this._statsText = this.game.add.text(
                190,
                32,
                settings.value,
                JSON.parse(JSON.stringify(Constants.MENU_LEVEL_STATS_TEXT_STYLE))
            );
            this._statsText.fill = this._settings.textOutColor;
            
            this._button.onInputOver.add(function() {
                this._statsText.fill = this._settings.textOverColor;
            }, this);

            this._button.onInputOut.add(function() {
                this._statsText.fill = this._settings.textOutColor;
            }, this);

            this._statsText.anchor.setTo(0.5);

            this.add(this._button);
            this.add(this._statsText);
            this.add(this._nameText);

            game.add.existing(this);

        }
        
        activate(): void {
            this._button.activate();
            this._statsText.fill = this._settings.textOutColor;
        }
        
        deactivate():void {
            this._button.deactivate();
            this._statsText.fill = this._settings.textDisabledColor;
        }
        
        public saveStateAndDisable(): void {
            this._button.saveStateAndDisable();
        }
        
        public restoreState(): void {
            this._button.restoreState();
        }
    }
    
    class LevelLocker {
        
        private _game: AlgoGame;
        private _levelInfo: LevelInfo[] = [];
        private _examPassedLevels: number = 0;
        
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

            var levelInfo: LevelInfo = new LevelInfo(levelName, levelSave);
            levelInfo.stateToStart = levelName + "Preload";
            
            if (levelConfig.dependsOn != null) {
                var dependsOnLevelSave: LevelSave = this._game.store.get(levelConfig.dependsOn) || new LevelSave();
                levelInfo.levelEnabled = dependsOnLevelSave.examPassed;
            } else {
                levelInfo.levelEnabled = true;
            }
            
            if (levelSave.examPassed) {
                this._examPassedLevels++;
            }
            
            return levelInfo;
        }
        
        get examPassedCount(): number {
            return this._examPassedLevels;
        }
        
        get levelInfos(): LevelInfo[] {
            return this._levelInfo;
        }
        
    }
    
    export class LevelButtonsPanel extends GameComponentContainer {
        
        private _levelLocker: LevelLocker;
        private _progressBar: ProgressBar;
        
        constructor(game: AlgoGame) {
            super(game);
            
            this._levelLocker = new LevelLocker(game);
            
            this.createLevelButtons();
            
            this._progressBar = new ProgressBar(game, "progressBarBig", "", true);
            this._progressBar.y = 650;
            this._progressBar.x = 5;

            var totalLevels = this._levelLocker.levelInfos.length;
            var passed = this._levelLocker.examPassedCount;

            this._progressBar.setMaxValue(totalLevels);
            this._progressBar.setValue(passed, passed + "/" + totalLevels);

/*
            Facebook test button
            
            var facebookButton = new Common.Button(this._game, [12,2,82,2, 6]);

            facebookButton.x = 300;
            facebookButton.y = 50;
            facebookButton.scale.setTo(0.3);
            this._game.add.existing(facebookButton);
            
            facebookButton.callback = function() {
               FB.ui( {
                    method: 'share',
                    href: 'http://algo.ninja'
                }, function(response){});
            }
*/
        }
        
        private createLevelButtons(): void {
            
            var searchX = 63;
            var searchY = 120;

            var sortX = 402;
            var sortY = 120;
            
            var graphsX = 742;
            var graphsY = 120;
            
            var stepConstant = 100;

            for(var levelInfo of this._levelLocker.levelInfos) {
                var x = 0;
                var y = 0;
                if (levelInfo.levelName.indexOf("Search") != -1) {
                    x = searchX;
                    y = searchY;
                    searchY += stepConstant;
                } else if (levelInfo.levelName.indexOf("Sort") != -1) {
                    x = sortX;
                    y = sortY;
                    sortY += stepConstant;
                } else {
                    x = graphsX;
                    y = graphsY;
                    graphsY += stepConstant;
                }

                this.createLevelButton(levelInfo, x, y);
            }
        }
        
        private createLevelButton(levelInfo: LevelInfo, x:number, y:number): void {
            var levelName = Dictionary[levelInfo.levelName].short;
            var levelStats = levelInfo.practiseDone;
            var buttonSettings = this.getButtonSettings(levelInfo);
            
            var levelButton = new LevelButton(
                this._game,
                levelName,
                buttonSettings,
                this.createButtonClickCallback(levelInfo)
            );
            
            levelButton.x = x;
            levelButton.y = y;
            
            if (!levelInfo.levelEnabled) {
                levelButton.deactivate();
            }
            
            this.addGameElement(GameElements.LevelButton, levelButton);
        }
        
        private createButtonClickCallback(levelInfo: LevelInfo): Function {
            return function() {
                console.log("Starting new level " + levelInfo.stateToStart);
                this._game.state.start(levelInfo.stateToStart, true, false, levelInfo.levelName);
            }.bind(this);
        }
        
        private getButtonSettings(levelInfo: LevelInfo): LevelButtonSettings {
            
            if (levelInfo.levelEnabled) {
                if (!levelInfo.tutorialPassed) {
                    return new LevelButtonSettings(
                        levelInfo.tutorialDone,
                        "buttonExamPassedMouseOver.png",
                        "buttonExamPassedEnable.png",
                        "buttonExamPassedClicked.png",
                        "buttonLevelClosedDisable.png",
                        Constants.MENU_LEVEL_TEXT_ENABLED,
                        Constants.MENU_LEVEL_STATS_TEXT_EXAM_PASSED,
                        Constants.MENU_LEVEL_STATS_TEXT_DISABLED
                    );
                } else if (!levelInfo.practisePassed) {
                    return new LevelButtonSettings(
                        levelInfo.practiseDone,
                        "buttonPractisePassedMouseOver.png",
                        "buttonPractisePassedEnable.png",
                        "buttonPractisePassedClicked.png",
                        "buttonLevelClosedDisable.png",
                        Constants.MENU_LEVEL_TEXT_ENABLED,
                        Constants.MENU_LEVEL_STATS_TEXT_PRACTISE_PASSED,
                        Constants.MENU_LEVEL_STATS_TEXT_DISABLED
                    );
                } else {
                    return new LevelButtonSettings(
                        levelInfo.examDone,
                        "buttonExamPassedMouseOver.png",
                        "buttonExamPassedEnable.png",
                        "buttonExamPassedClicked.png",
                        "buttonLevelClosedDisable.png",
                        Constants.MENU_LEVEL_TEXT_ENABLED,
                        Constants.MENU_LEVEL_STATS_TEXT_EXAM_PASSED,
                        Constants.MENU_LEVEL_STATS_TEXT_DISABLED
                    );
                }
            } else { 
                return new LevelButtonSettings(
                    "",
                    "buttonLevelOpenMouseOver.png",
                    "buttonLevelOpenEnable.png",
                    "buttonLevelOpenClicked.png",
                    "buttonLevelClosedDisable.png",
                    Constants.MENU_LEVEL_TEXT_ENABLED,
                    Constants.MENU_LEVEL_STATS_TEXT_ENABLED,
                    Constants.MENU_LEVEL_STATS_TEXT_DISABLED
                );
            }
        }
    }
}
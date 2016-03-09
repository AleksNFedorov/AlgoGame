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
        public freeToPlay: boolean = false;
        
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
        
        private _openLevels: number = 0;
        private _tutorialPassed: number = 0;
        private _practisePassed: number = 0;
        private _examPassed: number = 0;
        
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
            
            var levelSave: LevelSave = this._game.loadLevelSave(levelName);
            var levelConfig: GameConfig.LevelConfig = this._game.config.levelConfigs[levelName];
            var levelPractiseConfig: GameConfig.StageConfig = levelConfig.practise;

            var levelInfo: LevelInfo = new LevelInfo(levelName, levelSave);
            levelInfo.freeToPlay = levelConfig.freeToPlay;
            levelInfo.stateToStart = levelName + "Preload";
            
            if (levelConfig.dependsOn != null) {
                var dependsOnLevelSave: LevelSave = this._game.store.get(levelConfig.dependsOn) || new LevelSave();
                levelInfo.levelEnabled = dependsOnLevelSave.examPassed;
            } else {
                levelInfo.levelEnabled = true;
            }
            
            if (levelInfo.levelEnabled) {
                this.updateStatistics(levelInfo);
            }                

            return levelInfo;
        }
        
        private updateStatistics(info: LevelInfo) {
            this._openLevels++;
            
            if (info.tutorialPassed) {
                this._tutorialPassed++;
                
                if (info.practisePassed) {
                    this._practisePassed++;
                    
                    if (info.examPassed) {
                        this._examPassed++;
                    }
                }
            }
        }
        
        get examsPassed(): number {
            return this._examPassed;
        }
        
        get practisesPassed(): number {
            return this._practisePassed;
        }
        
        get levelsOpen(): number {
            return this._openLevels;
        }
        
        get tutorialsPassed(): number {
            return this._tutorialPassed;
        }
        
        get levelInfos(): LevelInfo[] {
            return this._levelInfo;
        }
        
    }
    
    export class LevelButtonsPanel extends GameComponentContainer {
        
        private _levelLocker: LevelLocker;
        
        private _openProgress: ProgressBar;
        private _tutorialProgress: ProgressBar;
        private _practiseProgress: ProgressBar;
        private _examProgress: ProgressBar;
        
        private _buttons: LevelButton[] = [];
        
        constructor(game: AlgoGame) {
            super(game);
            
            this._levelLocker = new LevelLocker(game);
            
            this.createLevelButtons();
            this.createProgressBars();
            
            this.addGameElement(Common.GameElements.MainMenuButton, this._buttons[0]);
            this.addGameElement(Common.GameElements.MainMenuProgress, this._openProgress);
        }
        
        public destroy(): void {
            super.destroy();
            for(var button of this._buttons) {
                button.destroy();
            }
            this._openProgress.destroy();
            this._tutorialProgress.destroy();
            this._practiseProgress.destroy();
            this._examProgress.destroy();
        }
        
        
        private createProgressBars(): void {
            this._openProgress = new ProgressBar(this._game, "progressOrangeMed", "Open levels", false);
            this._tutorialProgress = new ProgressBar(this._game, "progressBlueMed", "Tutorial passed", false);
            this._practiseProgress = new ProgressBar(this._game, "progressYellowMed", "Practise passed", false);
            this._examProgress = new ProgressBar(this._game, "progressGreenMed", "Exam passed", false);

            var totalLevels = this._levelLocker.levelInfos.length;
            var openLevels = this._levelLocker.levelsOpen;
            var examPassed = this._levelLocker.examsPassed;
            var practisesPassed = this._levelLocker.practisesPassed;
            var tutorialsPassed = this._levelLocker.tutorialsPassed;

            this._openProgress.setMaxValue(totalLevels);
            this._tutorialProgress.setMaxValue(totalLevels);
            this._practiseProgress.setMaxValue(totalLevels);
            this._examProgress.setMaxValue(totalLevels);
            
            this._openProgress.setValue(openLevels, openLevels + "/" + totalLevels);
            this._tutorialProgress.setValue(tutorialsPassed, tutorialsPassed + "/" + totalLevels);
            this._practiseProgress.setValue(practisesPassed, practisesPassed + "/" + totalLevels);
            this._examProgress.setValue(examPassed, examPassed + "/" + totalLevels);

            this._openProgress.y = 640;
            this._openProgress.x = 5;

            this._tutorialProgress.y = 640;
            this._tutorialProgress.x = 612;

            this._practiseProgress.y = 720;
            this._practiseProgress.x = 5;

            this._examProgress.y = 720;
            this._examProgress.x = 612;
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

                var newButton = this.createLevelButton(levelInfo, x, y);
                this._buttons.push(newButton);
            }
        }
        
        private createLevelButton(levelInfo: LevelInfo, x:number, y:number): LevelButton {
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
            
            return levelButton;
        }
        
        private createButtonClickCallback(levelInfo: LevelInfo): Function {
            return function() {
                var socialSignals = this._game.gameSave.facebookPosts;
                if (!levelInfo.freeToPlay && socialSignals < 1) {
                    this._game.dispatch(Events.SHARE_REQUIRED, this);
                } else {
                    console.log("Starting new level " + levelInfo.stateToStart);
                    this._game.state.start(levelInfo.stateToStart, true, false, levelInfo.levelName);
                }
            }.bind(this);
        }
        
        private getButtonSettings(levelInfo: LevelInfo): LevelButtonSettings {
            
            if (levelInfo.levelEnabled) {
                
                if (levelInfo.tutorialDone == 0) {
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
                } else if (!levelInfo.tutorialPassed) {
                    return new LevelButtonSettings(
                        levelInfo.tutorialDone,
                        "buttonTutorialMouseOver.png",
                        "buttonTutorialEnabled.png",
                        "buttonTutorialClicked.png",
                        "buttonLevelClosedDisable.png",
                        Constants.MENU_LEVEL_TEXT_ENABLED,
                        Constants.MENU_LEVEL_STATS_TEXT_TUTORIAL_PASSED,
                        Constants.MENU_LEVEL_STATS_TEXT_DISABLED
                    );
                } else if (!levelInfo.practisePassed || !levelInfo.examPassed) {
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
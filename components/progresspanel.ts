/// <reference path="./common.ts" />

module Common {

    export class ProgressBar extends Phaser.Group implements Common.GameUIObjectWithState {
    
        private _maxProgressWidth: number;
        private _maxProgressValue: number; 
    
        private _progressImage: any;
        private _progressText: Phaser.Text;
        
        constructor(game: Phaser.Game, type: string, legendTextString: string, isBig: boolean = false) {
            
            super(game);
            
            var progressBarBackground = type + "Background" + ".png";
            var progressBarForeground = type + "Foreground" + ".png";
            var progressBarCover = type + "Cover" + ".png";
            
            var textStyle = isBig ? Constants.PROGRESS_BAR_BIG_TEXT : Constants.PROGRESS_BAR_TEXT;
            
            var progressBackground = game.add.sprite(
                0, 0, 
                Constants.PROGRESS_BARS_ATTLAS,
                progressBarBackground,
                this
                );
            progressBackground.anchor.setTo(0.5);    
                
            var progressImage: any = game.add.sprite(
                0, 0, 
                Constants.PROGRESS_BARS_ATTLAS,
                progressBarForeground,
                this
            );
            progressImage.anchor.setTo(0.5);
            
            var progressCover = game.add.sprite(
                0, 0, 
                Constants.PROGRESS_BARS_ATTLAS,
                progressBarCover,
                this
                );
                
            progressBackground.x = progressCover.width/2;                
            progressBackground.y = progressCover.height/2;
            
            progressImage.x = progressBackground.x;                
            progressImage.y = progressBackground.y;

            var progressText: Phaser.Text = this.game.add.text(
                0,
                0,
                '', 
                textStyle,
                this
            );
            progressText.anchor.setTo(1, 0.42);
            progressText.y = progressImage.y;

           var legendText = this.game.add.text(
                progressBackground.x, 
                progressBackground.y + progressBackground.height/2 - 4, 
                legendTextString, 
                textStyle,
                this
            );

            legendText.anchor.y = 0;
            
            this._maxProgressWidth = progressImage.width;
            this._progressImage = progressImage;
            this._progressText = progressText;
        }
        
        public setMaxValue(maxProgressValue: number): void {
          this._maxProgressValue = maxProgressValue;
        }
        
        public setValue(newValue: number, textValue: string): void {
            
            var completines = Math.min(1, newValue/this._maxProgressValue);
        
            var width = this._maxProgressWidth * completines;
            var cropRect: Phaser.Rectangle = new Phaser.Rectangle(
                0, 0, 
                width,
                this._progressImage.height);
            
            this._progressImage.crop(cropRect);
            this._progressText.text = textValue;
            this._progressText.x = Math.max(this._progressText.width + 10, width - 10);
        }
        
        saveStateAndDisable(): void {}
        
        restoreState(): void {}
    }
    
    export class ProgressPanel extends GameComponentContainer {
    
        private _topProgressBar: ProgressBar;
        private _bottomProgressBar: ProgressBar;
        
        private _timer: Phaser.Timer;
        private _maxTimeValue: number;
        private _timerStep: number;
        
        private _progressGroup: Phaser.Group;
        
        constructor(game:AlgoGame) {
            super(game);
            
            this._progressGroup = game.add.group();
            this._progressGroup.x = Constants.PROGRESS_BAR_POSITION_X;
            this._progressGroup.y = Constants.PROGRESS_BAR_POSITION_Y;
            
            this.createProgressBars();
            
            this._timer = this._game.time.create(false);
            this._timer.start();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.STAGE_INFO_SHOW);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.addEventListener(Events.GAME_STARTED);
            this.addEventListener(Events.GAME_END);
            this.addEventListener(Events.GAME_CREATED);
        }

        protected createProgressBars(): void {
        
        /*
            this._topProgressBar = this.createAndAddProgressBar(
                "slice27_27.png", "slice16_16.png", "Step time",
                Common.GameElements.ProgressBarStep);
            this._topProgressBar.x = 0;
            this._topProgressBar.y = 0;

            this._bottomProgressBar = this.createAndAddProgressBar(
                "slice27_27.png", "slice35_35.png", "Steps done",
                Common.GameElements.ProgressBarComplete);
            this._bottomProgressBar.x = 0;
            this._bottomProgressBar.y = 60;
            
        */
        
        }
        
        protected createAndAddProgressBar(backImage: string, fromImage: string, legendText: string, elementId: Common.GameElements): ProgressBar {
            var newProgress;
            // var newProgress: ProgressBar = new ProgressBar(this._game, backImage, fromImage, legendText);
            this._progressGroup.add(newProgress);
            this.addGameElement(elementId, newProgress);
            return newProgress;            
        }

        private scheduleUpdates(): void {
          
            var updatesCount = this._maxTimeValue/Constants.GAME_TIME_PROGRESS_UPDATE_INTERVAL;
            this._timerStep = 0;
            this._timer.repeat(Constants.GAME_TIME_PROGRESS_UPDATE_INTERVAL, updatesCount, this.updateTimerProgressBar, this);
            
        }
        
        private updateTimerProgressBar(): void {
            this._timerStep++;
            var newValue = this._maxTimeValue - Constants.GAME_TIME_PROGRESS_UPDATE_INTERVAL * this._timerStep;
            this._topProgressBar.setValue(newValue, "");
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    this._timer.removeAll();
                    this._topProgressBar.setValue(this._maxTimeValue, "");
                    this._bottomProgressBar.setValue(<number> param1[0], param1[0]);
                    this.scheduleUpdates();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    if (this._game.levelStageState == Common.LevelStageState.PAUSED) {
                        this._timer.resume();                        
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._timer.pause();
                    break;
                case Events.GAME_STARTED:
                    this._topProgressBar.setValue(this._maxTimeValue, "");
                    this.scheduleUpdates();
                    break;
                case Events.GAME_END:
                    this._timer.removeAll();
                    var stepsDone: number = <number>param1;
                    this._bottomProgressBar.setValue(stepsDone, stepsDone + "");
                    this._topProgressBar.setValue(0, "");
                    break;
                case Events.GAME_CREATED:
                    var playInfo: Common.GamePlayInfo = <Common.GamePlayInfo> param1;
                    this._topProgressBar.setMaxValue(playInfo.stepWaitTime);
                    this._bottomProgressBar.setMaxValue(playInfo.totalItertions);
                    this._bottomProgressBar.setValue(playInfo.doneIterations, playInfo.doneIterations + "");
                    this._maxTimeValue = playInfo.stepWaitTime;
                    break;
            }
        }
        
        destroy(): void {
          super.destroy();
          
          this._progressGroup.destroy();
          this._timer.destroy();
        }
    }
}

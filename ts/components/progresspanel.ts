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
                Constants.GAME_GENERAL_ATTLAS,
                progressBarBackground,
                this
                );
                
            var progressImage: any = game.add.sprite(
                0, 0, 
                Constants.GAME_GENERAL_ATTLAS,
                progressBarForeground,
                this
            );
            progressImage.anchor.setTo(0.5);
            
            var progressCover = game.add.sprite(
                0, 0, 
                Constants.GAME_GENERAL_ATTLAS,
                progressBarCover,
                this
                );
                
            progressCover.anchor.setTo(0.5);    

            progressImage.x = progressBackground.width/2;                
            progressImage.y = progressBackground.height/2;

            progressCover.x = progressBackground.width/2;                
            progressCover.y = progressBackground.height/2;

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
               0,0,
                legendTextString, 
                textStyle,
                this
            );
            
            legendText.x = progressBackground.x
            legendText.y = progressBackground.y - legendText.height, 

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
        
        public destory(): void {
            this._progressImage.destroy();
            this._progressText.destroy();
        }
        
        saveStateAndDisable(): void {}
        
        restoreState(): void {}
    }
    
    export class TutorialProgressPanel extends GameComponentContainer {
    
        protected _stepProgressBar: ProgressBar;
        protected _progressGroup: Phaser.Group;
        
        constructor(game:AlgoGame) {
            super(game);
            
            this._progressGroup = game.add.group();
            this._progressGroup.x = Constants.PROGRESS_BAR_POSITION_X;
            this._progressGroup.y = Constants.PROGRESS_BAR_POSITION_Y;
            
            this.createProgressBars();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.GAME_END);
            this.addEventListener(Events.GAME_CREATED);
        }

        protected createProgressBars(): void {
        
            this._stepProgressBar = this.createAndAddProgressBar(
                "progressBarGreen", "Steps done",
                Common.GameElements.ProgressBarComplete);
            this._stepProgressBar.x = this._game.width - this._stepProgressBar.width - 50;
            this._stepProgressBar.y = 30;
        }
        
        protected createAndAddProgressBar(type: string, legendText: string, elementId: Common.GameElements): ProgressBar {
            var newProgress: ProgressBar = new ProgressBar(this._game, type, legendText, false);
            this._progressGroup.add(newProgress);
            this.addGameElement(elementId, newProgress);
            return newProgress;            
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    this._stepProgressBar.setValue(<number> param1[0], param1[0]);
                    break;
                case Events.GAME_END:
                    var stepsDone: number = <number>param1[0];
                    this._stepProgressBar.setValue(stepsDone, stepsDone + "");
                    break;
                case Events.GAME_CREATED:
                    var playInfo: Common.GamePlayInfo = <Common.GamePlayInfo> param1;
                    this._stepProgressBar.setMaxValue(playInfo.totalItertions);
                    this._stepProgressBar.setValue(playInfo.doneIterations, playInfo.doneIterations + "");
                    break;
            }
        }
        
        destroy(): void {
          super.destroy();
          this._stepProgressBar.destory();
          this._progressGroup.destroy();
        }
    }

    export class ProgressPanel extends TutorialProgressPanel {
    
        private _timeProgressBar: ProgressBar;
        
        private _timer: Phaser.Timer;
        private _maxTimeValue: number;
        private _timerStep: number;
        
        constructor(game:AlgoGame) {
            super(game);
            
            this._timer = this._game.time.create(false);
            this._timer.start();
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
            this.addEventListener(Events.GAME_STARTED);
            this.addEventListener(Events.GAME_END);
            this.addEventListener(Events.GAME_CREATED);
        }

        protected createProgressBars(): void {

            super.createProgressBars();        
        
            this._timeProgressBar = this.createAndAddProgressBar(
                "progressBarRed", "Step time",
                Common.GameElements.ProgressBarStep);
            this._timeProgressBar.x = 50;
            this._timeProgressBar.y = 30;

        }
        
        private scheduleUpdates(): void {

            var updatesCount = this._maxTimeValue/Constants.GAME_TIME_PROGRESS_UPDATE_INTERVAL;
            this._timerStep = 0;
            this._timer.repeat(Constants.GAME_TIME_PROGRESS_UPDATE_INTERVAL, updatesCount, this.updateTimerProgressBar, this);
        }
        
        private updateTimerProgressBar(): void {
            this._timerStep++;
            var newValue = this._maxTimeValue - Constants.GAME_TIME_PROGRESS_UPDATE_INTERVAL * this._timerStep;
            this._timeProgressBar.setValue(newValue, "");
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    this._timer.removeAll();
                    this._timeProgressBar.setValue(this._maxTimeValue, "");
                    this.scheduleUpdates();
                    break;

                case Events.CONTROL_PANEL_EVENT_PLAY:
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    if (this._game.levelStageState == Common.LevelStageState.PAUSED) {
                        this._timer.resume();                        
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._timer.pause();
                    break;
                case Events.GAME_STARTED:
                    this._timeProgressBar.setValue(this._maxTimeValue, "");
                    this.scheduleUpdates();
                    break;
                case Events.GAME_END:
                    this._timer.removeAll();
                    this._timeProgressBar.setValue(0, "");
                    break;
                case Events.GAME_CREATED:
                    var playInfo: Common.GamePlayInfo = <Common.GamePlayInfo> param1;
                    this._timeProgressBar.setMaxValue(playInfo.stepWaitTime);
                    this._maxTimeValue = playInfo.stepWaitTime;
                    break;
            }
        }
        
        destroy(): void {
          super.destroy();
          this._timeProgressBar.destory();
          this._timer.destroy();
        }
    }
}

/// <reference path="./common.ts" />

module Common {

    class ProgressBar extends Phaser.Group {
    
        private _maxProgressWidth: number;
        private _maxProgressValue: number;
    
        private _progressImage: Phaser.Sprite;
        private _progressText: Phaser.Text;
        
        constructor(game: AlgoGame, backImageId: string, frontImageId: string, 
            legendTextString: string) {
            
            super(game);
            
            var progressBackground = game.add.sprite(
                0, 0, 
                Constants.PROGRESS_BARS_ATTLAS,
                backImageId,
                this
                );
                
            var progressImage: Phaser.Sprite = game.add.sprite(
                4, 3, 
                Constants.PROGRESS_BARS_ATTLAS,
                frontImageId,
                this
            );
            
            var progressText: Phaser.Text = this.game.add.text(
                progressImage.x + 5,
                progressImage.y + 2,
                '', 
                Constants.CONTROL_PANEL_MESSAGE_STYLE,
                this
            );
            
            
           var legendText = this.game.add.text(
                progressBackground.x, 
                progressBackground.y + progressBackground.height/2 - 4, 
                legendTextString, 
                Constants.CONTROL_PANEL_MESSAGE_STYLE,
                this
            );
                
            
            legendText.anchor.y = 0;
            
            progressBackground.scale.setTo(0.4);
            progressImage.scale.setTo(0.4);
            
            this._maxProgressWidth = progressImage.width;
            this._progressImage = progressImage;
            this._progressImage.width = 0;
            this._progressText = progressText;
        }
        
        public setMaxValue(maxProgressValue: number): void {
          this._maxProgressValue = maxProgressValue;
        }
        
        public setValue(newValue: number, textValue: string): void {
        
            var completines = newValue/this._maxProgressValue;
        
            this._progressImage.width = this._maxProgressWidth * completines;
            this._progressText.text = textValue;
        }
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
        
        protected createProgressBars(): void {
        
            this._topProgressBar = this.createProgressBar("slice27_27.png", "slice16_16.png", "Step time");
            this._topProgressBar.x = 0;
            this._topProgressBar.y = 0;
            this._progressGroup.add(this._topProgressBar);

            this._bottomProgressBar = this.createProgressBar("slice27_27.png", "slice35_35.png", "Steps done");
            this._bottomProgressBar.x = 0;
            this._bottomProgressBar.y = 60;
            this._progressGroup.add(this._bottomProgressBar);
            
            this.addGameElement(Common.GameElements.PRACTISE_PROGRESS_STEP, this._topProgressBar);

        }
        
        protected createProgressBar(backImage: string, fromImage: string, legendText: string): ProgressBar {
            var newProgress: ProgressBar = new ProgressBar(this._game, backImage, fromImage, legendText);
            
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
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    this._timer.removeAll();
                    this._topProgressBar.setValue(this._maxTimeValue, "");
                    this._bottomProgressBar.setValue(<number> param1[0], param1[0]);
                    this.scheduleUpdates();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    if (this.gameState == Common.GameState.PAUSED) {
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
                    break;
                case Events.GAME_CREATED:
                    var playInfo: Common.GamePlayInfo = <Common.GamePlayInfo> param1;
                    this._topProgressBar.setMaxValue(playInfo.stepWaitTime);
                    this._bottomProgressBar.setMaxValue(playInfo.totalItertions);
                    this._bottomProgressBar.setValue(playInfo.doneIterations, playInfo.doneIterations + "");
                    this._maxTimeValue = playInfo.stepWaitTime;
                    break;
            };
            super.dispatchEvent(event, param1);

        }
        
        initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.STAGE_INFO_SHOW);
        }

        destroy(): void {
          super.destroy();
          
          this._progressGroup.destroy();
          this._timer.destroy();
        }
    }
}

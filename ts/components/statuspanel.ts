
declare var Dictionary: any;

module Common {
    
    export enum GameResult {
        Win, 
        Fail, 
        ComputerWin,
        ComputerTurn
    };
    
    export class StatusPanel extends GameEventComponent {
        
        private _groups: Phaser.Group[] = [];
        
        constructor(game: AlgoGame) {
            super(game);
            
            this._groups[GameResult.Win] = this.createStatusPanel(GameResult.Win, Constants.STATUS_TEXT_WIN, Constants.MESSAGE_SUCCESS_TEXT);
            this._groups[GameResult.Fail] = this.createStatusPanel(GameResult.Fail, Constants.STATUS_TEXT_FAIL, Constants.MESSAGE_FAIL_TEXT);
            this._groups[GameResult.ComputerWin] = this.createStatusPanel(GameResult.ComputerWin, Constants.STATUS_TEXT_COMPUTER_WIN, Constants.MESSAGE_INFO_TEXT);
            this._groups[GameResult.ComputerTurn] = this.createStatusPanel(GameResult.ComputerTurn, Constants.STATUS_TEXT_COMPUTER_WIN, Constants.MESSAGE_INFO_TEXT);
        }
        
        private createStatusPanel(type: GameResult, headlineStyle: any, subHeadlineStyle: any): Phaser.Group {
            var group = this._game.add.group();
            
            var headLineTextValue = Dictionary.statusUpdate[GameResult[type] + "HeadLine"];
            var subHeadLineTextValue = Dictionary.statusUpdate[GameResult[type] + "SubHeadLine"];

            var headLineText = this._game.add.text(0,0, headLineTextValue, headlineStyle, group);
            var subHeadLineText = this._game.add.text(0, headLineText.height + 10, subHeadLineTextValue, subHeadlineStyle, group);

            headLineText.x = group.width/2 - headLineText.width/2;
            
            group.alpha = 0;
            group.x = this._game.width/2 - group.width/2;
            group.y = Constants.GAME_STATUS_Y;
            
            return group;              
        }
        
        protected initEventListners(): void {
            this.addEventListener(Events.GAME_STARTED);
            this.addEventListener(Events.GAME_END);
            this.addEventListener(Events.GAME_MULTI_STEP_DONE);
        }
        
        public dispatchEvent(event: any, param1: any) {
            switch(event.type) {
                case Events.GAME_END:
                    if (param1[1]) {
                        this.showStatusPanel(GameResult.Win);
                    } else {
                        this.showStatusPanel(GameResult.ComputerWin);
                    }
                    break;
                case Events.GAME_MULTI_STEP_DONE:
                        this.showStatusPanel(GameResult.ComputerTurn);
                    break;
            }
        }
        
        protected showStatusPanel(type: GameResult): void {
            for(var group of this._groups) {
                group.alpha = 0;
            }
            
            var workGroup = this._groups[type];
            
            var showTween = this._game.add.tween(workGroup).to({alpha: 1}, 1000, "Quart.easeOut", false, 0, 0, true);
            showTween.start();
        }
        
        public destroy() {
            super.destroy();
            for(var group of this._groups) {
                group.destroy();
            }
        }
    }
    
    export class ExamStatusPanel extends StatusPanel {
        
        private _isExamFail: boolean = false;
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_EXAM_FAILED);
            this.addEventListener(Events.GAME_STARTED);
        }
        
        public dispatchEvent(event: any, param1: any) {
            
            if (!this._isExamFail) {
                super.dispatchEvent(event, param1);
            }
            
            switch(event.type) {
                case Events.GAME_STARTED:
                    this._isExamFail = false;
                    break;
                case Events.GAME_EXAM_FAILED:
                    this._isExamFail = true;
                    this.showStatusPanel(GameResult.Fail);
                    break;
            }
        }
        

    }

}
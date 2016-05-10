/// <reference path="./common.ts" />

declare var captain: any;

module CaptainUp {
    
    class Constants {
        static TUTORIAL_STEP_EVENT:string = "tutorial step";
        static TUTORIAL_PASS_EVENT:string = "tutorial done";
        static PRACTICE_STEP_EVENT:string = "practice step";
        static PRACTICE_PASS_EVENT:string = "practice done";
        static EXAM_STEP_EVENT:string = "exam step";
        static EXAM_PASS_EVENT:string = "exam passed";
        static CLUE_EVENT:string = "clue";
        static SOCIAL_SHARE_EVENT:string = "share";
        
        static ALL_SEARCH_LEVELS_PASSED:string = "all search";
        static ALL_SORT_LEVELS_PASSED:string = "all sort";
        static ALL_GRAPH_LEVELS_PASSED:string = "all graph";

        static LAST_SEARCH_LEVEL: string = "binarySearchExam";
        static LAST_SORT_LEVEL: string = "quickSortExam";
        static LAST_GRAPH_LEVEL: string = "djikstraExam";
    }
    
    export class Core extends Common.GameComponentContainer {
        
        constructor(game: Common.AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            this.addEventListener(Events.STAGE_INFO_SHOW);
            this.addEventListener(Events.FACEBOOK_SHARE);
            
        }

        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            switch(event.type) {
                case Events.STAGE_INFO_SHOW:
                    this.fireEvent(Constants.CLUE_EVENT);
                    break;
                case Events.FACEBOOK_SHARE:
                    this.fireEvent(Constants.SOCIAL_SHARE_EVENT);
                    break;
            }
        }

        protected fireEvent(event: string, entity?: any) {
            captain.up(function() {
                captain.action(event, {
                    entity: {}
                });
            });
            console.log(`Event [${event}] fired`);
        }
    }
    
    export class Tutorial extends Core {
        constructor(game: Common.AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.GAME_TUTORIAL_DONE);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            var eventToFire;
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    eventToFire = Constants.TUTORIAL_STEP_EVENT;
                    break;
                case Events.GAME_TUTORIAL_DONE:
                    eventToFire = Constants.TUTORIAL_PASS_EVENT;
                    break;
            }
            super.fireEvent(eventToFire);
        }
    }
    
    export class Practice extends Core {
        constructor(game: Common.AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.GAME_PRACTISE_DONE);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            var eventToFire;
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    eventToFire = Constants.PRACTICE_STEP_EVENT;
                    break;
                case Events.GAME_PRACTISE_DONE:
                    eventToFire = Constants.PRACTICE_PASS_EVENT;
                    break;
            }
            super.fireEvent(eventToFire);
        }
    }
    
    export class Exam extends Core {
        constructor(game: Common.AlgoGame) {
            super(game);
        }
        
        protected initEventListners(): void {
            super.initEventListners();
            this.addEventListener(Events.GAME_CORRECT_STEP_DONE);
            this.addEventListener(Events.GAME_EXAM_DONE);
        }
        
        dispatchEvent(event: any, param1: any) {
            super.dispatchEvent(event, param1);
            var eventToFire;
            switch(event.type) {
                case Events.GAME_CORRECT_STEP_DONE:
                    eventToFire = Constants.EXAM_STEP_EVENT;
                    break;
                case Events.GAME_EXAM_DONE:
                    eventToFire = Constants.EXAM_PASS_EVENT;
                    this.checkLastLevelAndFireEvent();
                    break;
            }
            super.fireEvent(eventToFire);
        };
        
        private checkLastLevelAndFireEvent() {
            switch(this._game.currentState._stateConfig.stageName) {
                case Constants.LAST_SEARCH_LEVEL:
                    super.fireEvent(Constants.ALL_SEARCH_LEVELS_PASSED);
                    break;
                case Constants.LAST_SORT_LEVEL:
                    super.fireEvent(Constants.ALL_SORT_LEVELS_PASSED);
                    break;
                case Constants.LAST_GRAPH_LEVEL:
                    super.fireEvent(Constants.ALL_GRAPH_LEVELS_PASSED);
                    break;
            }
        }
    }
}
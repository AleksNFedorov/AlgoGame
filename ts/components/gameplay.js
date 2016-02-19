/// <reference path="./common.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common;
(function (Common) {
    (function (FlagPosition) {
        FlagPosition[FlagPosition["CENTER"] = 0] = "CENTER";
        FlagPosition[FlagPosition["LEFT"] = 1] = "LEFT";
        FlagPosition[FlagPosition["RIGHT"] = 2] = "RIGHT";
    })(Common.FlagPosition || (Common.FlagPosition = {}));
    var FlagPosition = Common.FlagPosition;
    ;
    (function (FlagLevel) {
        FlagLevel[FlagLevel["TOP"] = 0] = "TOP";
        FlagLevel[FlagLevel["MIDDLE"] = 1] = "MIDDLE";
        FlagLevel[FlagLevel["BOTTOM"] = 2] = "BOTTOM";
    })(Common.FlagLevel || (Common.FlagLevel = {}));
    var FlagLevel = Common.FlagLevel;
    ;
    // Abstract algorithm step, represents single step of given algorithm.
    // Particular algorithm should use it of extend.
    var AlgorithmStep = (function () {
        function AlgorithmStep(isLast, stepNumber) {
            this.messageKeys = [];
            this.isLast = isLast;
            this.stepNumber = stepNumber;
        }
        AlgorithmStep.prototype.setIsLast = function () {
            this.isLast = true;
        };
        return AlgorithmStep;
    })();
    Common.AlgorithmStep = AlgorithmStep;
    var Algorithm = (function () {
        function Algorithm(config) {
            this._steps = [];
            this._lastRequestedStepNumber = -1;
            this.config = config;
            this._sequence = this.generateSeqeunce(config);
            this._steps = this.runAlgorithm();
            this.updateLastStep();
        }
        Algorithm.prototype.runAlgorithm = function () {
            return [];
        };
        Algorithm.prototype.getNextStep = function () {
            this._lastRequestedStepNumber = Math.min(this._lastRequestedStepNumber + 1, this._steps.length - 1);
            return this._steps[this._lastRequestedStepNumber];
        };
        Algorithm.prototype.updateLastStep = function () {
            this._steps[this._steps.length - 1].setIsLast();
        };
        Algorithm.prototype.generateSeqeunce = function (config) {
            var varElements = config.maxElementsInSeq - config.minElementsInSeq;
            var count = config.minElementsInSeq + Algorithm.getRandomInteger(0, varElements);
            var newGeneratedArray = [];
            for (var i = 0; i < count; i++) {
                var y = this.getRandomSeqNumber();
                newGeneratedArray.push(y);
                console.log("New element created " + y);
            }
            if (config.sorted) {
                console.log("Sorting array");
                newGeneratedArray.sort(function (a, b) { return a - b; });
            }
            return newGeneratedArray;
        };
        Algorithm.prototype.getRandomSeqNumber = function () {
            return Algorithm.getRandomInteger(this.config.minSeqNumber, this.config.maxSeqNumber);
        };
        Algorithm.getRandomInteger = function (from, to) {
            return Math.floor(Math.random() * (to - from) + from);
        };
        Object.defineProperty(Algorithm.prototype, "sequence", {
            get: function () {
                return this._sequence;
            },
            enumerable: true,
            configurable: true
        });
        return Algorithm;
    })();
    Common.Algorithm = Algorithm;
    // contains location info for given flag, used to show on game arena as helpers
    var FlagLocationInfo = (function () {
        function FlagLocationInfo(index, position, level) {
            this.index = index;
            this.position = position;
            this.level = level;
        }
        ;
        return FlagLocationInfo;
    })();
    Common.FlagLocationInfo = FlagLocationInfo;
    (function (BoxState) {
        BoxState[BoxState["ACTIVE"] = 0] = "ACTIVE";
        BoxState[BoxState["SELECTED_BLUE"] = 1] = "SELECTED_BLUE";
        BoxState[BoxState["SELECTED_GREEN"] = 2] = "SELECTED_GREEN";
        BoxState[BoxState["SELECTED_ORANGE"] = 3] = "SELECTED_ORANGE";
        BoxState[BoxState["DISABLED"] = 4] = "DISABLED";
    })(Common.BoxState || (Common.BoxState = {}));
    var BoxState = Common.BoxState;
    var BoxContainer = (function (_super) {
        __extends(BoxContainer, _super);
        function BoxContainer(game, boxValue, pressCallback, releaseCallback) {
            _super.call(this, game);
            this._pressCallback = pressCallback;
            this._releaseCallback = releaseCallback;
            this.initBox(game, boxValue);
            this._state = BoxState.ACTIVE;
            game.add.existing(this);
        }
        BoxContainer.prototype.initBox = function (game, value) {
            var box = game.add.sprite(0, 0, Constants.GAME_GENERAL_ATTLAS, "Active.png");
            var boxKeyText = game.add.text(box.height / 2, box.width / 2, "" + value, JSON.parse(JSON.stringify(Constants.CONTROL_PANEL_MESSAGE_STYLE)));
            boxKeyText.anchor.x = 0.6;
            boxKeyText.anchor.y = 0.5;
            box.inputEnabled = true;
            boxKeyText.inputEnabled = true;
            if (this._pressCallback != null) {
                box.events.onInputDown.add(this.onInputDown.bind(this));
                boxKeyText.events.onInputDown.add(this.onInputDown.bind(this));
            }
            if (this._releaseCallback != null) {
                box.events.onInputUp.add(this.onInputUp.bind(this));
                boxKeyText.events.onInputUp.add(this.onInputUp.bind(this));
            }
            this.add(box);
            this.add(boxKeyText);
            this._box = box;
            this._boxText = boxKeyText;
        };
        BoxContainer.prototype.setState = function (newState) {
            if (this._state === BoxState.DISABLED) {
                return;
            }
            this._boxText.fill = Constants.MENU_LEVEL_TEXT_ENABLED;
            this._state = newState;
            switch (newState) {
                case BoxState.ACTIVE:
                    this._box.frameName = "Active.png";
                    break;
                case BoxState.SELECTED_BLUE:
                    this._box.frameName = "Selected_blue.png";
                    break;
                case BoxState.SELECTED_ORANGE:
                    this._box.frameName = "Selected_orange.png";
                    break;
                case BoxState.SELECTED_GREEN:
                    this._box.frameName = "Selected_green.png";
                    break;
                case BoxState.DISABLED:
                    this._box.frameName = "Disabled.png";
                    this._boxText.fill = Constants.MENU_LEVEL_STATS_TEXT_DISABLED;
                    break;
            }
        };
        BoxContainer.prototype.setBoxIndex = function (boxIndex) {
            this._boxIndex = boxIndex;
        };
        BoxContainer.prototype.onInputDown = function () {
            this._pressCallback(this._boxIndex);
        };
        BoxContainer.prototype.onInputUp = function () {
            this._releaseCallback(this._boxIndex);
        };
        return BoxContainer;
    })(Phaser.Group);
    Common.BoxContainer = BoxContainer;
    var LineGameArena = (function () {
        function LineGameArena(game, boxClickedCallback, sequence) {
            this._boxes = [];
            this._boxIndexes = [];
            this._flags = [];
            this._boxSpace = 20;
            this._game = game;
            this._boxClickedCallback = boxClickedCallback;
            this.init(sequence);
        }
        LineGameArena.prototype.init = function (seqeunce) {
            this._boxLine = this._game.add.group();
            this._boxes = this.createBoxes(seqeunce);
            this._boxLine.x = Constants.GAME_AREA_X;
            this._boxLine.y = Constants.GAME_AREA_LINE_Y;
        };
        LineGameArena.prototype.createBoxes = function (seqeunce) {
            var boxes = [];
            var boxInterval = (this._game.width - Constants.GAME_AREA_MARGIN * 2 - Constants.GAME_AREA_BOX_WIDTH) / (seqeunce.length - 1);
            for (var index = 0; index < seqeunce.length; ++index) {
                var boxContainer = this.createBox(index, seqeunce[index]);
                this._boxLine.add(boxContainer);
                boxContainer.x = boxInterval * index + Constants.GAME_AREA_MARGIN;
                boxContainer.y = 0;
                boxes.push(boxContainer);
                var boxIndexText = this._game.add.text(boxContainer.x + boxContainer.width / 2, boxContainer.y + boxContainer.height + 10, "" + (index + 1), Constants.GAME_AREA_INDEX_TEXT);
                boxIndexText.anchor.x = 0.7;
                this._boxLine.add(boxIndexText);
                this._boxIndexes.push(boxIndexText);
            }
            return boxes;
        };
        LineGameArena.prototype.createBox = function (index, value) {
            var boxContainer = new BoxContainer(this._game, value, this.onBoxClickPressed.bind(this), this.onBoxClickReleased.bind(this));
            boxContainer.setBoxIndex(index);
            return boxContainer;
        };
        LineGameArena.prototype.onBoxClickPressed = function (index) {
        };
        LineGameArena.prototype.onBoxClickReleased = function (index) {
        };
        LineGameArena.prototype.onAction = function (action) {
            this._boxClickedCallback(action);
        };
        LineGameArena.prototype.selectBox = function (boxIndex, selectType) {
            if (selectType === void 0) { selectType = BoxState.SELECTED_ORANGE; }
            var boxContainer = this._boxes[boxIndex];
            boxContainer.setState(selectType);
        };
        LineGameArena.prototype.hideBoxesOutOf = function (from, to) {
            for (var i = 0; i < this._boxes.length; ++i) {
                if (i < from || i > to) {
                    this._boxes[i].setState(BoxState.DISABLED);
                }
            }
        };
        LineGameArena.prototype.hideBoxesIn = function (from, to) {
            for (var i = 0; i < this._boxes.length; ++i) {
                if (i >= from && i <= to) {
                    this._boxes[i].setState(BoxState.DISABLED);
                }
            }
        };
        LineGameArena.prototype.clearFlags = function () {
            for (var _i = 0, _a = this._flags; _i < _a.length; _i++) {
                var flag = _a[_i];
                flag.destroy();
            }
            this._flags = [];
        };
        LineGameArena.prototype.showFlags = function (flags) {
            for (var _i = 0; _i < flags.length; _i++) {
                var flag = flags[_i];
                var flagSprite = this.createSpriteForFlag(flag.position, flag.level);
                var anchor = this._boxIndexes[flag.index];
                flagSprite.x = this.getXPosition(anchor, flag.position);
                flagSprite.y = this.getYPosition(anchor, flag.level);
                this._flags.push(flagSprite);
            }
        };
        LineGameArena.prototype.getXPosition = function (anchor, position) {
            switch (position) {
                case FlagPosition.CENTER:
                    return anchor.x + anchor.width / 2 + this._boxLine.x - 13;
                case FlagPosition.LEFT:
                    return anchor.x - this._boxSpace / 2 + this._boxLine.x - 20;
                case FlagPosition.RIGHT:
                    return anchor.x + anchor.width + this._boxSpace / 2 + this._boxLine.x;
            }
            throw "Unknown position for flag [" + position + "]";
        };
        LineGameArena.prototype.getYPosition = function (anchor, level) {
            switch (level) {
                case FlagLevel.TOP:
                case FlagLevel.MIDDLE:
                    return anchor.y + anchor.width + 20 + this._boxLine.y;
                case FlagLevel.BOTTOM:
                    return anchor.y + anchor.width + 50 + this._boxLine.y;
            }
            throw "Unknown level for flag [" + level + "]";
        };
        LineGameArena.prototype.createSpriteForFlag = function (position, level) {
            var flagSprite = this.getFlagSpriteByLevel(level);
            var box = this._game.add.sprite(0, 0, Constants.GAME_GENERAL_ATTLAS, flagSprite);
            box.scale.setTo(0.2);
            return box;
        };
        LineGameArena.prototype.getFlagSpriteByLevel = function (level) {
            switch (level) {
                case FlagLevel.TOP:
                    return "Selected_orange.png";
                case FlagLevel.MIDDLE:
                    return "Selected_green.png";
                case FlagLevel.BOTTOM:
                    return "Selected_blue.png";
            }
        };
        LineGameArena.prototype.destroy = function () {
            for (var _i = 0, _a = this._boxes; _i < _a.length; _i++) {
                var box = _a[_i];
                box.destroy();
            }
            for (var _b = 0, _c = this._boxIndexes; _b < _c.length; _b++) {
                var boxIndex = _c[_b];
                boxIndex.destroy();
            }
            this.clearFlags();
            this._boxLine.destroy();
            this._boxes = null;
            this._boxIndexes = null;
        };
        return LineGameArena;
    })();
    Common.LineGameArena = LineGameArena;
    var CoreGamePlay = (function (_super) {
        __extends(CoreGamePlay, _super);
        function CoreGamePlay(game) {
            _super.call(this, game);
        }
        CoreGamePlay.prototype.initEventListners = function () {
            _super.prototype.initEventListners.call(this);
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
        };
        CoreGamePlay.prototype.dispatchEvent = function (event, param1) {
            _super.prototype.dispatchEvent.call(this, event, param1);
            switch (event.type) {
                case Events.STAGE_INITIALIZED:
                    this.initGame(true);
                    this.checkPractiseDone();
                    break;
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    if (this.isNotCurrentState(Common.LevelStageState.PAUSED)) {
                        if (this.isNotCurrentState(Common.LevelStageState.CREATED)) {
                            //non-first iteration
                            this.initGame(false);
                        }
                        this.startGame();
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    this.onLastStep(false);
                    this._game.dispatch(Events.CONTROL_PANEL_EVENT_PLAY, this, this.createGamePlayInfo());
                    break;
            }
        };
        CoreGamePlay.prototype.initGame = function (isGameCreate) {
            this.destroyTempObjects();
            this._algorithm = this.createAlgorithm(this.stateConfig.gamePlay);
            this.onInit();
            if (isGameCreate) {
                this._game.dispatch(Events.GAME_CREATED, this, this.createGamePlayInfo());
            }
        };
        CoreGamePlay.prototype.createAlgorithm = function (config) {
            return null;
        };
        CoreGamePlay.prototype.onInit = function () {
        };
        CoreGamePlay.prototype.createGamePlayInfo = function () {
            return new Common.GamePlayInfo(this.stateConfig.stepTime, this.stateConfig.stepsToPass, this.getStageDone());
        };
        CoreGamePlay.prototype.startGame = function () {
            this.onNewStep();
            this._game.dispatch(Events.GAME_STARTED, this, this.getStageDone());
        };
        CoreGamePlay.prototype.boxClicked = function (action, isUser) {
            if (isUser === void 0) { isUser = true; }
            if (!this.checkStepAllowed(isUser)) {
                return;
            }
            var step = this._algorithmStep;
            if (this.isCorrectStep(action)) {
                this.updateGameStatistics(isUser);
                this.onCorrectAction(isUser);
                if (step.isLast) {
                    this.onLastStep(isUser);
                }
                else {
                    this.onNewStep();
                }
                this.checkPractiseDone();
            }
            else {
                this.onWrongStep(isUser);
            }
        };
        CoreGamePlay.prototype.onWrongStep = function (isUser) {
            if (isUser === void 0) { isUser = true; }
            this._game.dispatch(Events.GAME_WRONG_STEP_DONE, this, isUser);
        };
        CoreGamePlay.prototype.checkStepAllowed = function (isUser) {
            return true;
        };
        CoreGamePlay.prototype.onNewStep = function () {
            this._algorithmStep = this._algorithm.getNextStep();
            for (var _i = 0, _a = this._algorithmStep.messageKeys; _i < _a.length; _i++) {
                var messageKey = _a[_i];
                this._game.dispatch(Events.GAME_SHOW_MESSAGE, messageKey, this);
            }
        };
        ;
        CoreGamePlay.prototype.onCorrectAction = function (isUser) {
            this._game.dispatch(Events.GAME_CORRECT_STEP_DONE, this, [this.getStageDone(), isUser]);
        };
        CoreGamePlay.prototype.isCorrectStep = function (action) {
            throw "Method is not implemented yet [isCorrectStep]";
        };
        CoreGamePlay.prototype.updateGameStatistics = function (isUser) {
            this.setStageDone(this.getStageDone() + 1);
            this.saveState();
        };
        CoreGamePlay.prototype.onLastStep = function (isUser) {
            this._game.dispatch(Events.GAME_END, this, [this.getStageDone(), isUser]);
            console.log("Game finished");
        };
        // True when practise done because of user actions during this game
        CoreGamePlay.prototype.checkPractiseDone = function () {
            if (this.stateConfig.stepsToPass <= this.getStageDone()) {
                if (!this.getStagePassed()) {
                    this.setStagePassed(true);
                    this._game.dispatch(this.getStagePassEvent(), this, this.getStagePassed());
                }
                this.saveState();
            }
        };
        CoreGamePlay.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.destroyTempObjects();
        };
        CoreGamePlay.prototype.destroyTempObjects = function () {
            this._algorithm = null;
        };
        CoreGamePlay.prototype.getStagePassEvent = function () {
            throw "Method not implemented [getStagePassEvent]";
        };
        CoreGamePlay.prototype.getStageDone = function () {
            throw "Method not implemented [getStageDone]";
        };
        CoreGamePlay.prototype.setStageDone = function (val) {
            throw "Method not implemented [setStageDone]";
        };
        CoreGamePlay.prototype.getStagePassed = function () {
            throw "Method not implemented [getStagePassed]";
        };
        CoreGamePlay.prototype.setStagePassed = function (passed) {
            throw "Method not implemented [getStagePassed]";
        };
        return CoreGamePlay;
    })(Common.GameComponentContainer);
    Common.CoreGamePlay = CoreGamePlay;
    var TutorialGamePlay = (function (_super) {
        __extends(TutorialGamePlay, _super);
        function TutorialGamePlay() {
            _super.apply(this, arguments);
        }
        TutorialGamePlay.prototype.getStagePassEvent = function () {
            return Events.GAME_TUTORIAL_DONE;
        };
        TutorialGamePlay.prototype.getStageDone = function () {
            return this.levelSave.tutorialDone;
        };
        TutorialGamePlay.prototype.setStageDone = function (val) {
            this.levelSave.tutorialDone = val;
        };
        TutorialGamePlay.prototype.getStagePassed = function () {
            return this.levelSave.tutorialPassed;
        };
        TutorialGamePlay.prototype.setStagePassed = function (passed) {
            this.levelSave.tutorialPassed = passed;
        };
        return TutorialGamePlay;
    })(CoreGamePlay);
    Common.TutorialGamePlay = TutorialGamePlay;
    var PractiseGamePlay = (function (_super) {
        __extends(PractiseGamePlay, _super);
        function PractiseGamePlay(game) {
            _super.call(this, game);
            this._stepPerformed = false;
            this._gameStepTimer = this._game.time.create(false);
            this._gameStepTimer.start();
        }
        PractiseGamePlay.prototype.initEventListners = function () {
            _super.prototype.initEventListners.call(this);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PLAY);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_PAUSE);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_REPLAY);
        };
        PractiseGamePlay.prototype.dispatchEvent = function (event, param1) {
            _super.prototype.dispatchEvent.call(this, event, param1);
            switch (event.type) {
                case Events.CONTROL_PANEL_EVENT_PLAY:
                    console.log("Play event received");
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    }
                    break;
                case Events.CONTROL_PANEL_EVENT_PAUSE:
                    this._gameStepTimer.pause();
                    break;
                case Events.CONTROL_PANEL_EVENT_REPLAY:
                    if (this.isCurrentState(Common.LevelStageState.PAUSED)) {
                        //mid-game pause
                        this._gameStepTimer.resume();
                    }
                    break;
            }
        };
        PractiseGamePlay.prototype.clickBox = function () {
        };
        PractiseGamePlay.prototype.checkStepAllowed = function (isUser) {
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            if (isUser && this._stepPerformed) {
                console.log("Unable to make a second step");
                this._game.dispatch(Events.GAME_MULTI_STEP_DONE, this);
                return false;
            }
            this._stepPerformed = true;
            return true;
        };
        PractiseGamePlay.prototype.onNewStep = function () {
            _super.prototype.onNewStep.call(this);
            this.addTimerEvents();
        };
        ;
        PractiseGamePlay.prototype.updateGameStatistics = function (isUser) {
            if (!isUser)
                return;
            _super.prototype.updateGameStatistics.call(this, isUser);
        };
        PractiseGamePlay.prototype.onLastStep = function (isUser) {
            this._gameStepTimer.removeAll();
            _super.prototype.onLastStep.call(this, isUser);
        };
        // True when practise done because of user actions during this game
        PractiseGamePlay.prototype.checkPractiseDone = function () {
            _super.prototype.checkPractiseDone.call(this);
            this._stepPerformed = false;
        };
        PractiseGamePlay.prototype.addTimerEvents = function () {
            this._gameStepTimer.removeAll();
            this._gameStepTimer.repeat(this.stateConfig.stepTime, 0, this.clickBox, this);
        };
        PractiseGamePlay.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._gameStepTimer.destroy();
        };
        PractiseGamePlay.prototype.destroyTempObjects = function () {
            this._algorithm = null;
        };
        PractiseGamePlay.prototype.getStagePassEvent = function () {
            return Events.GAME_PRACTISE_DONE;
        };
        PractiseGamePlay.prototype.getStageDone = function () {
            return this.levelSave.practiseDone;
        };
        PractiseGamePlay.prototype.setStageDone = function (val) {
            this.levelSave.practiseDone = val;
        };
        PractiseGamePlay.prototype.getStagePassed = function () {
            return this.levelSave.practisePassed;
        };
        PractiseGamePlay.prototype.setStagePassed = function (passed) {
            this.levelSave.practisePassed = passed;
        };
        return PractiseGamePlay;
    })(CoreGamePlay);
    Common.PractiseGamePlay = PractiseGamePlay;
    var ExamGamePlay = (function (_super) {
        __extends(ExamGamePlay, _super);
        function ExamGamePlay(game) {
            _super.call(this, game);
        }
        ExamGamePlay.prototype.initEventListners = function () {
            _super.prototype.initEventListners.call(this);
            this.addEventListener(Events.STAGE_INITIALIZED);
            this.addEventListener(Events.CONTROL_PANEL_EVENT_STOP);
        };
        ExamGamePlay.prototype.dispatchEvent = function (event, param1) {
            _super.prototype.dispatchEvent.call(this, event, param1);
            switch (event.type) {
                case Events.STAGE_INITIALIZED:
                    this.flushProgress();
                    break;
                case Events.CONTROL_PANEL_EVENT_STOP:
                    this.clickBox();
                    break;
            }
        };
        ExamGamePlay.prototype.clickBox = function () {
            throw "No implementation for method [clickBox]";
        };
        ExamGamePlay.prototype.checkStepAllowed = function (isUser) {
            if (this.isNotCurrentState(Common.LevelStageState.RUNNING)) {
                this._game.dispatch(Events.GAME_STEP_ON_PAUSE, this);
                return false;
            }
            return true;
        };
        ExamGamePlay.prototype.updateGameStatistics = function (isUser) {
            //In exam mode updates per iteration, not player action
        };
        ExamGamePlay.prototype.onWrongStep = function (isUser) {
            _super.prototype.onWrongStep.call(this, isUser);
            this._game.dispatch(Events.GAME_EXAM_FAILED, this);
            this.flushProgress();
            _super.prototype.onLastStep.call(this, isUser);
        };
        ExamGamePlay.prototype.flushProgress = function () {
            if (!this.levelSave.examPassed) {
                this.levelSave.examDone = 0;
                this.saveState();
            }
        };
        ExamGamePlay.prototype.onLastStep = function (isUser) {
            if (isUser) {
                this.levelSave.examDone += 1;
            }
            _super.prototype.onLastStep.call(this, isUser);
            if (this.levelSave.examPassed) {
                this.saveState();
            }
        };
        ExamGamePlay.prototype.getStagePassEvent = function () {
            return Events.GAME_EXAM_DONE;
        };
        ExamGamePlay.prototype.getStageDone = function () {
            return this.levelSave.examDone;
        };
        ExamGamePlay.prototype.setStageDone = function (val) {
            this.levelSave.examDone = val;
        };
        ExamGamePlay.prototype.getStagePassed = function () {
            return this.levelSave.examPassed;
        };
        ExamGamePlay.prototype.setStagePassed = function (passed) {
            this.levelSave.examPassed = passed;
        };
        return ExamGamePlay;
    })(PractiseGamePlay);
    Common.ExamGamePlay = ExamGamePlay;
})(Common || (Common = {}));

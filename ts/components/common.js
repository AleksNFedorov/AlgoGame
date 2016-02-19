/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/gameconfig.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common;
(function (Common) {
    (function (LevelStageState) {
        LevelStageState[LevelStageState["PAUSED"] = 0] = "PAUSED";
        LevelStageState[LevelStageState["RUNNING"] = 1] = "RUNNING";
        LevelStageState[LevelStageState["CREATED"] = 2] = "CREATED";
        LevelStageState[LevelStageState["END"] = 3] = "END";
        LevelStageState[LevelStageState["UNKNOWN"] = 4] = "UNKNOWN";
    })(Common.LevelStageState || (Common.LevelStageState = {}));
    var LevelStageState = Common.LevelStageState;
    (function (MessageType) {
        MessageType[MessageType["INFO"] = 0] = "INFO";
        MessageType[MessageType["FAIL"] = 1] = "FAIL";
        MessageType[MessageType["SUCCESS"] = 2] = "SUCCESS";
    })(Common.MessageType || (Common.MessageType = {}));
    var MessageType = Common.MessageType;
    ;
    /*
        All game elements, element id should be here to show description info for it.
    */
    (function (GameElements) {
        GameElements[GameElements["MenuButtonMenu"] = 0] = "MenuButtonMenu";
        GameElements[GameElements["MenuButtonDescription"] = 1] = "MenuButtonDescription";
        GameElements[GameElements["MenuButtonObjectives"] = 2] = "MenuButtonObjectives";
        GameElements[GameElements["MenuButtonPractise"] = 3] = "MenuButtonPractise";
        GameElements[GameElements["MenuButtonExam"] = 4] = "MenuButtonExam";
        GameElements[GameElements["ProgressBarStep"] = 5] = "ProgressBarStep";
        GameElements[GameElements["ProgressBarComplete"] = 6] = "ProgressBarComplete";
        GameElements[GameElements["ControlPanelButtonPlay"] = 7] = "ControlPanelButtonPlay";
        GameElements[GameElements["ControlPanelButtonPause"] = 8] = "ControlPanelButtonPause";
        GameElements[GameElements["ControlPanelButtonStop"] = 9] = "ControlPanelButtonStop";
        GameElements[GameElements["ControlPanelButtonReplay"] = 10] = "ControlPanelButtonReplay";
        GameElements[GameElements["ControlPanelButtonAutoStart"] = 11] = "ControlPanelButtonAutoStart";
        GameElements[GameElements["ControlPanelText"] = 12] = "ControlPanelText";
        GameElements[GameElements["GameArea"] = 13] = "GameArea";
        GameElements[GameElements["LevelButton"] = 14] = "LevelButton";
    })(Common.GameElements || (Common.GameElements = {}));
    var GameElements = Common.GameElements;
    //Key info stored on borwser local store
    var LevelSave = (function () {
        function LevelSave() {
            this.tutorialDone = 0;
            this.tutorialPassed = false;
            this.practiseDone = 0;
            this.practisePassed = false;
            this.examDone = 0;
            this.examPassed = false;
            this.autoStart = true;
        }
        return LevelSave;
    })();
    Common.LevelSave = LevelSave;
    var SecureSaver = (function () {
        function SecureSaver() {
        }
        SecureSaver.prototype.set = function (key, value) {
            value.hash = this.hashLevelSave(value);
            store.set(key, value);
        };
        SecureSaver.prototype.get = function (key) {
            var value = store.get(key) || {};
            if (value.hash) {
                var saveHash = value.hash;
                var actualHash = this.hashLevelSave(value);
                if (JSON.stringify(saveHash) ===
                    JSON.stringify(actualHash)) {
                    console.log("Level hash missmach " + key);
                    return value;
                }
            }
            return null;
        };
        SecureSaver.prototype.hashLevelSave = function (value) {
            value.hash = null;
            return CryptoJS.MD5(JSON.stringify(value));
        };
        return SecureSaver;
    })();
    //Info to distirbute across game components when level type (practise, exam) initialized.
    //Used to sync all parts with key game values like steps count, step wait interval.
    var GamePlayInfo = (function () {
        function GamePlayInfo(stepWaitTime, totalIterations, doneIterations) {
            this._stepWaitTime = stepWaitTime;
            this._totalItertions = totalIterations;
            this._doneIterations = doneIterations;
        }
        Object.defineProperty(GamePlayInfo.prototype, "stepWaitTime", {
            get: function () {
                return this._stepWaitTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamePlayInfo.prototype, "totalItertions", {
            get: function () {
                return this._totalItertions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamePlayInfo.prototype, "doneIterations", {
            get: function () {
                return this._doneIterations;
            },
            enumerable: true,
            configurable: true
        });
        return GamePlayInfo;
    })();
    Common.GamePlayInfo = GamePlayInfo;
    //Event generated by some component and processed by another,
    //just a wrapper around key EventBus parameters
    var GameEvent = (function () {
        function GameEvent(eventId, caller, param) {
            this.eventId = eventId;
            this.caller = caller;
            this.param = param;
        }
        return GameEvent;
    })();
    Common.GameEvent = GameEvent;
    var GroupWrapper = (function (_super) {
        __extends(GroupWrapper, _super);
        function GroupWrapper(game, x, y) {
            _super.call(this, game);
            this.x = x;
            this.y = y;
        }
        GroupWrapper.prototype.saveStateAndDisable = function () { };
        ;
        GroupWrapper.prototype.restoreState = function () { };
        ;
        return GroupWrapper;
    })(Phaser.Group);
    Common.GroupWrapper = GroupWrapper;
    var AlgoGame = (function (_super) {
        __extends(AlgoGame, _super);
        function AlgoGame(gameWidth, gameHeight, mode, tag) {
            _super.call(this, gameWidth, gameHeight, mode, tag, null, false, true);
            this._store = new SecureSaver();
            this._config = globalConfig;
            this._eventBus = new EventBusClass();
        }
        AlgoGame.prototype.dispatch = function (eventId, caller, param) {
            var state = this.currentState;
            state.dispatch(eventId, caller, param);
        };
        Object.defineProperty(AlgoGame.prototype, "store", {
            get: function () {
                return this._store;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlgoGame.prototype, "eventBus", {
            get: function () {
                return this._eventBus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlgoGame.prototype, "config", {
            get: function () {
                return this._config;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlgoGame.prototype, "levelStageState", {
            get: function () {
                var state = this.currentState;
                return state.levelStageState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlgoGame.prototype, "currentState", {
            get: function () {
                return this.state.states[this.state.current];
            },
            enumerable: true,
            configurable: true
        });
        return AlgoGame;
    })(Phaser.Game);
    Common.AlgoGame = AlgoGame;
    //Core class for all componets who need listen to events and generate own.
    var GameEventComponent = (function () {
        function GameEventComponent(game) {
            this._listeners = new Phaser.ArraySet([]);
            this._game = game;
            this.initEventListners();
        }
        GameEventComponent.prototype.initEventListners = function () { };
        GameEventComponent.prototype.dispatchEvent = function (event, param1) { };
        GameEventComponent.prototype.addEventListener = function (eventId) {
            if (!this._listeners.exists(eventId)) {
                this._game.eventBus.addEventListener(eventId, this.dispatchEvent, this);
                this._listeners.add(eventId);
            }
            else {
                console.log("Event listener exists [" + eventId + "] ");
            }
        };
        GameEventComponent.prototype.removeEventListener = function (eventId) {
            this._game.eventBus.removeEventListener(eventId, this.dispatchEvent, this);
        };
        GameEventComponent.prototype.destroy = function () {
            for (var _i = 0, _a = this._listeners.list; _i < _a.length; _i++) {
                var eventId = _a[_i];
                this.removeEventListener(eventId);
            }
        };
        GameEventComponent.prototype.getCallbackForEventId = function (eventId, param) {
            return function () {
                console.log("Event created " + eventId);
                this._game.dispatch(eventId, this, param);
            }.bind(this);
        };
        return GameEventComponent;
    })();
    Common.GameEventComponent = GameEventComponent;
    //Core class for composite elements - containers, 
    // dispatches enable, disable and show info game events
    var GameComponentContainer = (function (_super) {
        __extends(GameComponentContainer, _super);
        function GameComponentContainer(game) {
            _super.call(this, game);
            this._componentElements = [];
        }
        GameComponentContainer.prototype.initEventListners = function () {
            this.addEventListener(Events.STAGE_INFO_SHOW);
            this.addEventListener(Events.GAME_DISABLE_ALL);
            this.addEventListener(Events.GAME_ENABLE_ALL);
            this.addEventListener(Events.STAGE_INITIALIZED);
        };
        GameComponentContainer.prototype.addGameElement = function (elementId, element) {
            this._componentElements[elementId] = element;
        };
        GameComponentContainer.prototype.isCurrentState = function (state) {
            return this._game.levelStageState === state;
        };
        GameComponentContainer.prototype.isNotCurrentState = function (state) {
            return this._game.levelStageState != state;
        };
        Object.defineProperty(GameComponentContainer.prototype, "stateConfig", {
            get: function () {
                return this._game.currentState.stateConfig;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameComponentContainer.prototype, "levelSave", {
            get: function () {
                return this._game.currentState.levelSave;
            },
            enumerable: true,
            configurable: true
        });
        GameComponentContainer.prototype.saveState = function () {
            this._game.currentState.saveState();
        };
        GameComponentContainer.prototype.dispatchEvent = function (event, param1) {
            switch (event.type) {
                case Events.GAME_DISABLE_ALL:
                    for (var uiElementIndex in this._componentElements) {
                        var uiElement = this._componentElements[uiElementIndex];
                        uiElement.saveStateAndDisable();
                    }
                    break;
                case Events.GAME_ENABLE_ALL:
                    for (var uiElementIndex in this._componentElements) {
                        var uiElement = this._componentElements[uiElementIndex];
                        uiElement.restoreState();
                    }
                    break;
                case Events.STAGE_INFO_SHOW:
                    var infoWidget = param1;
                    var element = this._componentElements[infoWidget.getElementId()];
                    if (element != null) {
                        infoWidget.showFor(element);
                    }
                    break;
            }
        };
        GameComponentContainer.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            for (var key in this._componentElements) {
                var value = this._componentElements[key];
                value.destroy();
            }
        };
        return GameComponentContainer;
    })(GameEventComponent);
    Common.GameComponentContainer = GameComponentContainer;
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(game, x, y, text, fontSettings) {
            _super.call(this, game, x, y, text, fontSettings);
        }
        Text.prototype.saveStateAndDisable = function () { };
        ;
        Text.prototype.restoreState = function () { };
        ;
        return Text;
    })(Phaser.Text);
    Common.Text = Text;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(game, frames, atlasName) {
            if (atlasName === void 0) { atlasName = Constants.GAME_GENERAL_ATTLAS; }
            _super.call(this, game, 0, 0, atlasName, this.onButtonDown, this, frames[0], frames[1], frames[2], frames[3]);
            this._activeFrames = frames;
            this._inactiveFrame = frames[4];
        }
        Button.prototype.activate = function () {
            this.input.enabled = true;
            this.setFrames(this._activeFrames[0], this._activeFrames[1], this._activeFrames[2], this._activeFrames[3]);
        };
        Button.prototype.deactivate = function () {
            this.input.enabled = false;
            this.setFrames(this._inactiveFrame, this._inactiveFrame, this._inactiveFrame, this._inactiveFrame);
        };
        Button.prototype.saveStateAndDisable = function () {
            this._savedEnabled = this.input.enabled;
            this.deactivate();
        };
        Button.prototype.restoreState = function () {
            if (this._savedEnabled) {
                this.activate();
            }
        };
        Button.prototype.onButtonDown = function () {
            this._callback();
        };
        Object.defineProperty(Button.prototype, "callback", {
            set: function (callback) {
                this._callback = callback;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    })(Phaser.Button);
    Common.Button = Button;
})(Common || (Common = {}));


class Events {
    
    private static _allGameEvents: Phaser.ArraySet = new Phaser.ArraySet([]);
    
    //Global events
    //Fires when all stage components/controls initalized.
    static STAGE_INITIALIZED = Events.createEvent("StageInit");
    
    //Menu events
    static MENU_EVENT_GO_MENU = Events.createEvent("MenuGoMenu");
    static MENU_EVENT_OPEN_ALGO_DESCR = Events.createEvent("MenuOpenAlgorithm");
    static MENU_EVENT_SHOW_LEVEL_OBJECT = Events.createEvent("MenuShowLevelObjectives");
    static MENU_EVENT_GO_PRACTISE = Events.createEvent("MenuGoPractise");
    static MENU_EVENT_GO_EXAM = Events.createEvent("MenuGoExam");
    
    //Control panel events
    static CONTROL_PANEL_EVENT_PLAY = Events.createEvent("cpPlay");
    static CONTROL_PANEL_EVENT_PAUSE = Events.createEvent("cpPause");
    static CONTROL_PANEL_EVENT_STOP = Events.createEvent("cpStop");

    //Modal window events
    static MODAL_WINDOW_DISPLAYING = Events.createEvent("ModalWindowDispl");
    static MODAL_WINDOW_HIDE = Events.createEvent("ModalWindowHide");
    
    //General game play events
    static GAME_CREATED = Events.createEvent("GameCreated");
    static GAME_STARTED = Events.createEvent("GameStarted");
    static GAME_END = Events.createEvent("GameEnd");
    static GAME_CORRECT_STEP_DONE = Events.createEvent("GameCorrectStepDone");
    static GAME_WRONG_STEP_DONE = Events.createEvent("GameWrongStepDone");
    //when player attempts to make second step during one step iteration
    static GAME_MULTI_STEP_DONE = Events.createEvent("GameMultiStepDone");
    //on attempt of making step during pause
    static GAME_STEP_ON_PAUSE = Events.createEvent("GameStepOnPause");
    static GAME_PRACTISE_DONE = Events.createEvent("GamePractiseDone");

    static GAME_EXAM_FAILED = Events.createEvent("GameExamFailed");
    static GAME_EXAM_DONE = Events.createEvent("GameExamDone");
    
    static GAME_DISABLE_ALL = Events.createEvent("DisableAll");
    static GAME_ENABLE_ALL = Events.createEvent("EnableAll");
    
    //Stage info manager events
    static STAGE_INFO_SHOW = Events.createEvent("ShowStageInfo");
    
    private static createEvent(eventId: string): string {
        if (!eventId || 0 === eventId.length) {
            throw "Empty event id";
        } else if (this._allGameEvents.exists(eventId)) {
            throw "Event type already registered [" + eventId + "]";
        }
        
        this._allGameEvents.add(eventId);
        return eventId;
    }
    
    public static getAllEvents(): string[] {
        return this._allGameEvents.list;
    }
    
}
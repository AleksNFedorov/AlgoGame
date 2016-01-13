
class Events {
    
    //Global events
    //Fires when all stage components/controls initalized.
    static STAGE_INITIALIZED = "StageInit";
    
    //Menu events
    static MENU_EVENT_GO_MENU = "MenuGoMenu";
    static MENU_EVENT_OPEN_ALGO_DESCR = "MenuOpenAlgorithm";
    static MENU_EVENT_SHOW_LEVEL_OBJECT = "MenuShowLevelObjectives";
    static MENU_EVENT_GO_PRACTISE = "MenuGoPractise";
    static MENU_EVENT_GO_EXAM = "MenuGoExam";
    
    //Control panel events
    static CONTROL_PANEL_EVENT_PLAY = "cpPlay";
    static CONTROL_PANEL_EVENT_PAUSE = "cpPause";
    static CONTROL_PANEL_EVENT_STOP = "cpStop";
    static CONTROL_PANEL_SHOW_TEXT = "cpShowText";
    
    //Modal window events
    static MODAL_WINDOW_DISPLAYING = "ModalWindowDispl";
    static MODAL_WINDOW_HIDE = "ModalWindowHide";
    
    //General game play events
    static GAME_CREATED = "GameCreated";
    static GAME_STARTED = "GameStarted";
    static GAME_END = "GameEnd";
    static GAME_CORRECT_STEP_DONE = "GameCorrectStepDone";
    static GAME_WRONG_STEP_DONE = "GameWrongStepDone";
    //when player attempts to make second step during one step iteration
    static GAME_MULTI_STEP_DONE = "GameMultiStepDone";
    //on attempt of making step during pause
    static GAME_STEP_ON_PAUSE = "GameStepOnPause";
    static GAME_PRACTISE_DONE = "GamePractiseDone";

    static GAME_EXAM_FAILED = "GameExamFailed";
    static GAME_EXAM_DONE = "GameExamDone";
    
    static GAME_DISABLE_ALL = "DisableAll";
    static GAME_ENABLE_ALL = "EnableAll";
    
    //Stage info manager events
    static STAGE_INFO_SHOW = "ShowStageInfo";
}
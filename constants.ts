class Constants {
    
    //Game general 
    static GAME_WIDTH: number = 1024;
    static GAME_HEIGHT: number = 768;
    static GAME_BACKGROUND: string = "#483D8B";
    static GAME_TIME_PROGRESS_UPDATE_INTERVAL = 300;
    static GAME_AUTOSTART_INTERVAL = 3000;
    static GAME_SHOW_INFO_SAVE_ID = "showInfo";
    
    //Game Menu
    static MENU_POSITION_X = 0;
    static MENU_POSITION_Y = 0;
    
    //Game Progress Bar
    static PROGRESS_BAR_POSITION_X = 800;
    static PROGRESS_BAR_POSITION_Y = 100;
    
    
    //State names
    static STATE_BOOT = "boot";
    static STATE_PRELOAD = "preload";
    static STATE_MENU = "menu";
    static STATE_SEARCH_BINARY_SEARCH_P = "bsp";
    static STATE_SEARCH_BINARY_SEARCH_T = "bst";

    //Assets
    static MENU_BUTTON_ATTLAS = "menuButtons";
    static PROGRESS_BARS_ATTLAS = "progressBars";
    
    //Text
    static CONTROL_PANEL_MESSAGE_STYLE = { 
        font: "16px Arial", 
        boundsAlignH: "center", 
        boundsAlignV: "middle" 
    }
    
    static BS_BOX_HILIGHT_INTERVAL = 300;
    static BS_PR_STEP_TIME = 4000;
    
    //Binary search 
    static BS_MIN_SEQ_NUMBER = 1;
    static BS_MAX_SEQ_NUMBER = 100;
    static BS_MAX_ELEMENTS_IN_SEQ = 20;
    static BS_PRACTISE_TO_OPEN_TEST = 100;
    
}

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
    
    //Banners
    static BANNER_SHOW_TIME = 2000;
    
    //Assets
    static GAME_ASSETS_PATH = "/assets/images/";
    static MENU_BUTTON_ATTLAS = "menuButtons";
    static PROGRESS_BARS_ATTLAS = "progressBars";
    static BANNERS_ATTLAS = "banners";
    static BANNERS_AMOUNT = 4;
    static LEVEL_ASSETS_AMOUNT = 2;
    
    //Text
    static CONTROL_PANEL_MESSAGE_STYLE = { 
        font: "16px Arial", 
        boundsAlignH: "center", 
        boundsAlignV: "middle" 
    }
    
    static CONTROL_PANEL_MESSAGES_HISTORY_SIZE = 3;
    
    static STEP_TIME = 4000;
}

class Constants {
    
    //Game general 
    static GAME_WIDTH: number = 1024;
    static GAME_HEIGHT: number = 768;
    static GAME_BACKGROUND: string = "#32303d";
    static GAME_BACKGROUND_SEPARATOR: number = 0x3e3c4b;
    
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
    static MAIN_MENU_ATTLAS = "mainMenu";
    static PROGRESS_BARS_ATTLAS = "progressBars";
    
    static GAME_ASSETS_PATH = "/assets/images/";
    static MENU_BUTTON_ATTLAS = "menuButtons";
    static BANNERS_ATTLAS = "banners";
    static BANNERS_AMOUNT = 4;
    static LEVEL_ASSETS_AMOUNT = 2;
    
    //Text
    static CONTROL_PANEL_MESSAGE_STYLE = { 
        font: "bold 24px Open Sans", 
        fill: "white",
        boundsAlignH: "center", 
        boundsAlignV: "middle" 
    }
    
    //Prgoress bars
    static PROGRESS_BAR_BIG_TEXT = { 
        font: "bold 24px Open Sans", 
        fill: "white",
    }

    static PROGRESS_BAR_TEXT = { 
        font: "bold 14px Open Sans", 
        fill: "white",
    }

    //Main Menu
    //Level name
    
    static MENU_LEVEL_TEXT_ENABLED = "white";
    static MENU_LEVEL_STATS_TEXT_ENABLED = "orange";
    static MENU_LEVEL_STATS_TEXT_PRACTISE_PASSED = "yellow";
    static MENU_LEVEL_STATS_TEXT_EXAM_PASSED = "#10b966";
    static MENU_LEVEL_STATS_TEXT_DISABLED = "#32303d";
    
    // Level type header
    static MENU_HEADER_TEXT_STYLE = { 
        font: "bold 36px Open Sans",
        fill: Constants.MENU_LEVEL_TEXT_ENABLED,
    }

    // Level name
    static MENU_LEVEL_TEXT_STYLE = { 
        font: "bold 24px Open Sans"
    }

    //Level stats
    static MENU_LEVEL_STATS_TEXT_STYLE = { 
        font: "bold 18px Open Sans"
    }
    
    /// Main menu end

    static CONTROL_PANEL_MESSAGES_HISTORY_SIZE = 3;
    
    static STEP_TIME = 4000;
}

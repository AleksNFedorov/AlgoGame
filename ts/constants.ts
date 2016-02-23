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
    static PROGRESS_BAR_POSITION_X = 0;
    static PROGRESS_BAR_POSITION_Y = 110;
    
    //Game Progress Bar
    static CONTROL_PANEL_POSITION_X = 0;
    static CONTROL_PANEL_POSITION_Y = 615;
    static CONTROL_PANEL_MESSAGE_X = 390;
    static CONTROL_PANEL_FIRST_BUTTON_X = 50;
    static CONTROL_PANEL_SECOND_BUTTON_X = 170;
    static CONTROL_PANEL_AUTOSTART_X = 190;
    static CONTROL_PANEL_AUTOSTART_Y = 110;

    //Game Menu
    static GAME_AREA_BOX_WIDTH = 53;
    static GAME_AREA_MARGIN = 40;
    static GAME_AREA_X = 0;
    static GAME_AREA_Y = 150;
    static GAME_AREA_LINE_Y = 480;

    //Banners
    static BANNER_SHOW_TIME = 2000;
    
    //Assets
    static MAIN_MENU_ATTLAS = "mainMenu";
    static GAME_GENERAL_ATTLAS = "gameGeneral";
    static GAME_EXAM_BANNERS_ATLAS = "examBanners";
    
    static GAME_ASSETS_PATH = "{CDN}assets/images/";
    static MENU_BUTTON_ATTLAS = "menuButtons";
    static BANNERS_ATTLAS = "banners";
    static BANNERS_AMOUNT = 1;
    static LEVEL_ASSETS_AMOUNT = 2;
    
    //Tutorial 
    static EXTRA_HELP_SHOW_INTERVAL = 10000;
    static EXTRA_HELP_MESSAGE_KEY = "tutorialExtraHelp";
    
    
    //Game area
    static GAME_AREA_TEXT = { 
        font: "bold 20px Open Sans", 
        fill: "white"
    }

    static GAME_AREA_INDEX_TEXT = { 
        font: "bold 18px Open Sans", 
        fill: "#95A5A6"
    }

    static GAME_AREA_GRAPH_WEIGHT_TEXT = { 
        font: "bold 14px Open Sans", 
        fill: "#95A5A6"
    }

    //Text
    static CONTROL_PANEL_MESSAGE_STYLE = { 
        font: "bold 24px Open Sans", 
        fill: "white",
        boundsAlignH: "center", 
        boundsAlignV: "middle" 
    }
    
    //Control panel
    static MESSAGE_INFO_TEXT = { 
        font: "bold 20px Open Sans", 
        fill: "#66b0fe",
    }

    static MESSAGE_SUCCESS_TEXT = { 
        font: "bold 20px Open Sans", 
        fill: "#94c949",
    }

    static MESSAGE_FAIL_TEXT = { 
        font: "bold 20px Open Sans", 
        fill: "#fb4c55",
    }

    //Progress bars
    static PROGRESS_BAR_BIG_TEXT = { 
        font: "bold 24px Open Sans", 
        fill: "white",
    }

    static PROGRESS_BAR_TEXT = { 
        font: "bold 18px Open Sans", 
        fill: "white",
    }

    //Main Menu
    //Level name
    
    static MENU_LEVEL_TEXT_ENABLED = "white";
    static MENU_LEVEL_STATS_TEXT_ENABLED = "#fd783e";
    static MENU_LEVEL_STATS_TEXT_TUTORIAL_PASSED = "#3498DB";
    static MENU_LEVEL_STATS_TEXT_PRACTISE_PASSED = "#fbb640";
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
    
    //UI Stuff
    static PLAY_BUTTON_FRAMES = [
        "Play-button_Mouse-over.png", 
        "Play-button_Enabled.png", 
        "Play-button_clicked.png", 
        "Play-button_Enabled.png", 
        "Play-button_Disabled.png"
    ];
    
    static PLAY_BUTTON_MID_FRAMES = [
        "Play-button_Mouse-over_med.png", 
        "Play-button_Enabled_med.png", 
        "Play-button_clicked_med.png", 
        "Play-button_Enabled_med.png", 
        "Play-button_Disabled_med.png"
    ];

    static AUTOSTART_FRAMES_OFF = [
        "AutoStart-toggle_off.png",
        "AutoStart-toggle_off.png",
        "AutoStart-toggle_off.png",
        "AutoStart-toggle_off.png",
        "AutoStart-toggle_off.png"
    ];
                
    static AUTOSTART_FRAMES_ON = [
        "AutoStart-toggle_on.png", 
        "AutoStart-toggle_on.png", 
        "AutoStart-toggle_on.png", 
        "AutoStart-toggle_on.png", 
        "AutoStart-toggle_off.png"
    ];
    
    static PAUSE_BUTTON_FRAMES = [
        "Pause-button_Mouse-over.png", 
        "Pause-button_Enabled.png", 
        "Pause-button_clicked.png", 
        "Pause-button_Enabled.png", 
        "Pause-button_Disabled.png"
    ];

    static REPLAY_BUTTON_FRAMES = [
        "Replay-button_Mouse-over.png", 
        "Replay-button_Enabled.png", 
        "Replay-button_clicked.png", 
        "Replay-button_Enabled.png", 
        "Replay-button_Disabled.png"
    ];
    
    static STOP_BUTTON_FRAMES = [
        "Stop-button_Mouse-over.png", 
        "Stop-button_Enabled.png", 
        "Stop-button_clicked.png", 
        "Stop-button_Enabled.png", 
        "Stop-button_Disabled.png"
    ];
    
    static MENU_BUTTON_FRAMES = [
        "Menu-button_Mouse-over.png",
        "Menu-button_Enabled.png",
        "Menu-button_Clicked.png",
        "Menu-button_Enabled.png",
        "Menu-button_disable.png"
    ];
    
    static ALGO_DESCR_FRAMES = [
        "Algorithm-description_Mouse-over.png",
        "Algorithm-description_Enabled.png",
        "Algorithm-description_Clicked.png",
        "Algorithm-description_Enabled.png",
        "Algorithm-description_disable.png"
    ];

    static LEVEL_OBJECTIVES_FRAMES = [
        "Level-Objectives_Mouse-over.png",
        "Level-Objectives_Enabled.png",
        "Level-Objectives_Clicked.png",
        "Level-Objectives_Enabled.png",
        "Level-Objectives_disable.png"
    ];

    static GO_TUTORIAL_FRAMES = [
        "Tutorial_Mouse-over.png",
        "Tutorial_Enabled.png",
        "Tutorial_Clicked.png",
        "Tutorial_Enabled.png",
        "Tutorial_disable.png"
    ];

    static GO_PRACTISE_FRAMES = [
        "Go-Practise_Enabled_Mouse-over.png",
        "Go-Practise_Enabled.png",
        "Go-Practise_Enabled_Clicked.png",
        "Go-Practise_Enabled.png",
        "Go-Practise_disable.png"
    ];

    static GO_EXAM_FRAMES = [
        "Go-Exam_Enabled_Mouse-over.png",
        "Go-Exam_Enabled.png",
        "Go-Exam_Enabled_Clicked.png",
        "Go-Exam_Enabled.png",
        "Go-Exam_disable.png"
    ];
    
    static CIRCLE_BOX_FRAMES = [
        "Active.png",
        "Selected_blue.png",
        "Selected_green.png",
        "Selected_orange.png",
        "Disabled.png"
    ];

    static SQUARE_BOX_FRAMES = [
        "Square_yellow.png",
        "Square_yellow.png",
        "Square_green.png",
        "Square_orange.png",
        "Square_gray.png"
    ];
}

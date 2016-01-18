
declare module GameConfig {

    //TODO refactor to Stage config
    export class StateConfig {
        level: string;
        stageName: string;
        stateType: string;
        menu: any;
        stepsToPass: number;
        gamePlay: any;
    }
    
    export class LevelConfig {
        dependsOn: string;
        PRACTISE: StateConfig;
        EXAM: StateConfig;
    }
    
    export class Config {
        levelConfigs:LevelConfig;
    }
}
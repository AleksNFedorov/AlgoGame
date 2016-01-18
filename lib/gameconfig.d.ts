
declare module GameConfig {

    export class StateConfig {
        level: string;
        stageName: string;
        stateType: string;
        menu: any;
        stepsToPass: number;
        gamePlay: any;
    }
    
    export class LevelConfig {
        practiseConfig: StateConfig;
        examConfig: StateConfig;
    }
    
    export class Config {
        levelConfigs:LevelConfig;
    }
}
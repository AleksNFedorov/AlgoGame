
declare module GameConfig {

    export class StateConfig {
        level: string;
        stageName: string;
        stateType: string;
        menu: any;
        stepsToPass: number;
        gamePlay: any;
    }
    
    export class Config {
        stateConfigs: StateConfig;
    }
    
}
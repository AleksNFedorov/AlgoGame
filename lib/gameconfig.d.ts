
declare module GameConfig {

    export class StateConfig {
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
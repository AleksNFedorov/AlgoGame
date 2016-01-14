
declare module GameConfig {

    export class StateConfig {
        stageName: string;
        stateType: string;
        gameElementData: any;
        stepsToPass: number;
        customData: any;
    }
    
    export class Config {
        stateConfigs: StateConfig;
    }
    
}
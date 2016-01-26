
declare module GameConfig {
    
    export class StageConfig {
        level: string;
        stageName: string;
        stateType: string;
        menu: any;
        stepsToPass: number;
        gamePlay: any;
    }
    
    export class LevelConfig {
        dependsOn: string;
        practise: StageConfig;
        exam: StageConfig;
    }
    
    export class Config {
        levelConfigs:LevelConfig;
    }
}
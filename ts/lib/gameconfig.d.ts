
declare module GameConfig {
    
    export class StageConfig {
        level: string;
        stageName: string;
        stepTime: number; //milliseconds
        menu: any;
        stepsToPass: number;
        gamePlay: any;
    }
    
    export class LevelConfig {
        dependsOn: string;
        freeToPlay: boolean;
        tutorial: StageConfig;
        practise: StageConfig;
        exam: StageConfig;
    }
    
    export class Config {
        levelConfigs:LevelConfig;
    }
}

declare class GameModal {
    constructor(game: Phaser.Game);
    createModal(options: any): void;
    updateModalValue(value: any, type: any, index: number, id:any): void;
    getModalItem(type: string, index: number): any;
    showModal(type: string): void;
    hideModal(type: string): void;
    destroyModal(type: string): void;
}
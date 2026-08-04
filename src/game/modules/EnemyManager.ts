import * as Phaser from "phaser";

import { EnemyCharacter } from "./EnemyCharacter";
import { PlayerCharacter } from "./PlayerCharacter";

export class EnemyManager
{
    private readonly scene: Phaser.Scene;
    private readonly playerCharacter: PlayerCharacter;

    private readonly enemies: EnemyCharacter[] = [];

    public constructor(scene: Phaser.Scene, playerCharacter: PlayerCharacter)
    {
        this.scene = scene;
        this.playerCharacter = playerCharacter;
    }

    public update(): void
    {
        const targetPosition = this.playerCharacter.position();
        for (const enemy of this.enemies)
            enemy.update(targetPosition);
    }

    public spawnEnemy(x: number, y: number): EnemyCharacter
    {
        const enemy = new EnemyCharacter(
            this.scene,
            x,
            y
        );
        this.enemies.push(enemy);
        return enemy;
    }

    public clearAll(): void
    {
        for (const enemy of this.enemies)
            enemy.destroy();
        
        this.enemies.length = 0;
    }

    public get count(): number
    {
        return this.enemies.length;
    }
}
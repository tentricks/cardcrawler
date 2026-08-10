import * as Phaser from "phaser";

import { EnemyCharacter } from "./EnemyCharacter";
import { PlayerCharacter } from "./PlayerCharacter";
import { CollisionSystem } from "./CollisionSystem";
import { CollisionChannel } from "./CollisionChannel";

export class EnemyManager
{
    private readonly scene: Phaser.Scene;
    private readonly playerCharacter: PlayerCharacter;

    private readonly activeEnemies: EnemyCharacter[] = [];
    private readonly collisionSystem: CollisionSystem;

    public constructor(
        scene: Phaser.Scene,
        playerCharacter: PlayerCharacter,
        collisionSystem: CollisionSystem)
    {
        this.scene = scene;
        this.playerCharacter = playerCharacter;
        this.collisionSystem = collisionSystem;
    }

    public update(): void
    {
        const targetPosition = this.playerCharacter.position;
        for (const enemy of this.activeEnemies)
            enemy.update(targetPosition);
    }

    public spawnEnemy(x: number, y: number): EnemyCharacter
    {
        const enemy = new EnemyCharacter(
            this.scene,
            x,
            y
        );
        this.activeEnemies.push(enemy);
        this.collisionSystem.register(CollisionChannel.Pawn, enemy);

        return enemy;
    }

    public removeEnemy(enemy: EnemyCharacter): boolean
    {
        const index = this.activeEnemies.indexOf(enemy);
        if (index === -1)
            return false;

        this.activeEnemies.splice(index, 1);
        this.collisionSystem.unregister(CollisionChannel.Pawn, enemy);

        enemy.destroy();

        return true;
    }

    public clearAll(): void
    {
        while (this.activeEnemies.length > 0)
        {
            const enemy = this.activeEnemies[this.activeEnemies.length - 1];
            this.removeEnemy(enemy);
        }
    }

    public get count(): number
    {
        return this.activeEnemies.length;
    }
}
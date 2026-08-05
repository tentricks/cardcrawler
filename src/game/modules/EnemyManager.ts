import * as Phaser from "phaser";

import { EnemyCharacter } from "./EnemyCharacter";
import { PlayerCharacter } from "./PlayerCharacter";

export class EnemyManager
{
    private readonly scene: Phaser.Scene;
    private readonly playerCharacter: PlayerCharacter;

    private readonly activeEnemies: EnemyCharacter[] = [];
    private readonly collisionGroup: Phaser.Physics.Arcade.Group;

    public constructor(scene: Phaser.Scene, playerCharacter: PlayerCharacter)
    {
        this.scene = scene;
        this.playerCharacter = playerCharacter;
        this.collisionGroup = scene.physics.add.group();
    }

    public update(): void
    {
        const targetPosition = this.playerCharacter.position();
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
        this.collisionGroup.add(enemy.gameObject);
        return enemy;
    }

    public removeEnemy(enemy: EnemyCharacter): boolean
    {
        const index = this.activeEnemies.indexOf(enemy);
        if (index === -1)
            return false;

        this.activeEnemies.splice(index, 1);
        this.collisionGroup.remove(
            enemy.gameObject,
            false,
            false
        );

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

    public get collisions(): Phaser.Physics.Arcade.Group
    {
        return this.collisionGroup;
    }
}
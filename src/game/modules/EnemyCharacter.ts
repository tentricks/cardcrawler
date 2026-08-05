import * as Phaser from "phaser";

export class EnemyCharacter
{
    private static readonly Speed = 90;
    private readonly view: Phaser.GameObjects.Rectangle;
    private readonly body: Phaser.Physics.Arcade.Body;

    public constructor(scene: Phaser.Scene, x: number, y: number)
    {
        this.view = scene.add.rectangle(
            x,
            y,
            28,
            28,
            0xff6262
        );

        scene.physics.add.existing(this.view);

        this.body = this.view.body as Phaser.Physics.Arcade.Body;
 
        this.body.setCollideWorldBounds(true);
    }

    public update(targetPosition: Phaser.Math.Vector2): void
    {
        const direction = targetPosition
                            .clone()
                            .subtract(this.position)
                            .normalize();

        if (direction.lengthSq() === 0)
        {
            this.body.setVelocity(0, 0);
            return;
        }

        this.body.setVelocity(
            direction.x * EnemyCharacter.Speed,
            direction.y * EnemyCharacter.Speed
        );
    }

    public get position(): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            this.view.x,
            this.view.y
        );
    }

    public get gameObject(): Phaser.GameObjects.Rectangle
    {
        return this.view;
    }

    public destroy(): void
    {
        this.view.destroy();
    }
}
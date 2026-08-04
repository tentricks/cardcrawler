import * as Phaser from "phaser"

export class PlayerCharacter
{
    private static readonly Speed = 220;

    private readonly view: Phaser.GameObjects.Rectangle;
    private readonly body: Phaser.Physics.Arcade.Body;
    
    private movementIntent = new Phaser.Math.Vector2;

    private readonly usePhysicsMovement = true;

    public constructor(scene: Phaser.Scene, spawnX: number, spawnY: number)
    {
        this.view = scene.add.rectangle(
            spawnX,
            spawnY,
            32,
            32,
            0x58c7ff
        );

        // initialize physics
        scene.physics.add.existing(this.view);
        this.body = this.view.body as Phaser.Physics.Arcade.Body;
        this.body.setCollideWorldBounds(true);
    }

    public update(delta: number): void
    {
        if (this.movementIntent.lengthSq() === 0)
        {
            this.body.setVelocity(0, 0);
            return;
        }

        const direction = this.movementIntent
                                .clone()
                                .normalize();

        if (this.usePhysicsMovement)
            this.applyPhysicsMovement(direction);
        else
            this.applyNonPhysicsMovement(delta, direction);
    }

    public position(): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(this.view.x, this.view.y);
    }

    public velocity(): Phaser.Math.Vector2
    {
        return this.body.velocity;
    }

    public setMovementIntent(direction: Phaser.Math.Vector2): void
    {
        this.movementIntent.copy(direction);
    }

    private applyPhysicsMovement(direction: Phaser.Math.Vector2): void
    {
        this.body.setVelocity(
            direction.x * PlayerCharacter.Speed,
            direction.y * PlayerCharacter.Speed
        );
    }

    private applyNonPhysicsMovement(delta: number, direction: Phaser.Math.Vector2): void
    {
        const elapsedSeconds = delta / 1000;
        const distance = PlayerCharacter.Speed * elapsedSeconds;
        this.view.x += direction.x * distance;
        this.view.y += direction.y * distance;
    }
}
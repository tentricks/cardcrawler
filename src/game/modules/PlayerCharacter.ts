import * as Phaser from "phaser"
import { Pawn } from "./Pawn";
import { Collider } from "./Collider";
import { CollisionChannel } from "./CollisionChannel";
import { CollisionSystem } from "./CollisionSystem";
import { Projectile } from "./Projectile";

export class PlayerCharacter implements Pawn, Collider
{
    private static readonly Speed = 220;

    private readonly scene: Phaser.Scene;
    private readonly collisionSystem: CollisionSystem;

    private readonly view: Phaser.GameObjects.Rectangle;
    private readonly body: Phaser.Physics.Arcade.Body;
    
    private movementIntent = new Phaser.Math.Vector2;

    private readonly usePhysicsMovement = true;

    public constructor(
        scene: Phaser.Scene,
        collisionSystem: CollisionSystem,
        x: number,
        y: number)
    {
        this.scene = scene;
        this.collisionSystem = collisionSystem;
        
        this.view = scene.add.rectangle(
            x,
            y,
            32,
            32,
            0x58c7ff
        );

        // initialize physics
        scene.physics.add.existing(this.view);
        this.body = this.view.body as Phaser.Physics.Arcade.Body;
        this.body.setCollideWorldBounds(true);
    }
    
    public handleCollision(
        other: Collider, otherChannel: CollisionChannel): void
    {

    }

    public handleOverlap(
        other: Collider, otherChannel: CollisionChannel): void
    {

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

    public get position(): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(this.view.x, this.view.y);
    }

    public get velocity(): Phaser.Math.Vector2
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

    public get gameObject(): Phaser.Types.Physics.Arcade.GameObjectWithBody
    {
        return this.view as Phaser.Types.Physics.Arcade.GameObjectWithBody;
    }

    public launchProjectile(targetPosition: Phaser.Math.Vector2): void
    {
        const direction = targetPosition
                            .clone()
                            .subtract(this.position);
        if (direction.lengthSq() === 0)
            return;

        const proj = new Projectile(
            this.scene,
            this.collisionSystem,
            this,
            this.position,
            direction);
    }
}
import * as Phaser from "phaser";

import { Collider } from "../collision/Collider";
import { CollisionChannel } from "../collision/CollisionChannel";
import { CollisionSystem } from "../collision/CollisionSystem";

export interface ProjectileSource
{
    readonly position: Phaser.Math.Vector2;
}

export class Projectile implements Collider
{
    private static readonly Speed = 420;
    private static readonly LifetimeMs = 2000;

    private readonly collisionSystem: CollisionSystem;
    private readonly source: ProjectileSource;

    private readonly view: Phaser.GameObjects.Ellipse;
    private readonly body: Phaser.Physics.Arcade.Body;

    private isDestroyed = false;

    public constructor(
        scene: Phaser.Scene,
        collisionSystem: CollisionSystem,
        source: ProjectileSource,
        origin: Phaser.Math.Vector2,
        direction: Phaser.Math.Vector2)
    {
        this.collisionSystem = collisionSystem;
        this.source = source;

        this.view = scene.add.ellipse(
            origin.x,
            origin.y,
            10,
            10,
            0xfff176);

        scene.physics.add.existing(this.view);

        this.body =
            this.view.body as Phaser.Physics.Arcade.Body;

        // registering to the collision system applies physics defaults
        // do this first before applying velocity
        this.collisionSystem.register(
            CollisionChannel.Projectile, this);

        const normalizedDirection = 
            direction.clone().normalize();

        this.body.setVelocity(
            normalizedDirection.x * Projectile.Speed,
            normalizedDirection.y * Projectile.Speed);

        console.log(`Projectile Velocity: ${this.body.velocity.x}, ${this.body.velocity.y}`);

        scene.time.delayedCall(Projectile.LifetimeMs, ()=>
            {
                this.destroy();
            });
    }

    public get gameObject(): Phaser.Types.Physics.Arcade.GameObjectWithBody
    {
        return this.view as Phaser.Types.Physics.Arcade.GameObjectWithBody
    }

    public get position(): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            this.view.x,
            this.view.y);
    }

    public destroy(): void
    {
        if (this.isDestroyed)
            return;

        this.collisionSystem.unregister(CollisionChannel.Projectile, this);
        this.view.destroy();
        this.isDestroyed = true;
    }

    public handleCollision(
        other: Collider, otherChannel: CollisionChannel): void
    {
    }

    public handleOverlap(
        other: Collider, otherChannel: CollisionChannel): void
    {
        if (this.isDestroyed)
            return;

        if (otherChannel !== CollisionChannel.Pawn)
            return;

        if (!this.canHit(other))
            return;

        console.log("Projectile hit!");
        this.destroy();
    }

    private canHit(other: Collider): boolean
    {
        return other !== this.source;
    }
}
import * as Phaser from "phaser";

import { Collider } from "./Collider";
import { CollisionChannel } from "./CollisionChannel";

type ArcadeCollisionObject =
    Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Physics.Arcade.Body
    | Phaser.Physics.Arcade.StaticBody
    | Phaser.Tilemaps.Tile;

interface RegisteredCollider
{
    collider: Collider;
    channel: CollisionChannel;
}

export class CollisionSystem
{
    private readonly scene: Phaser.Scene;

    private readonly groups =
        new Map<CollisionChannel, Phaser.Physics.Arcade.Group>;

    private readonly registeredObjects = new Map
        <Phaser.Types.Physics.Arcade.GameObjectWithBody, RegisteredCollider>;

    public constructor(scene: Phaser.Scene)
    {
        this.scene = scene;

        this.groups.set(
            CollisionChannel.Pawn,
            scene.physics.add.group());

        this.groups.set(
            CollisionChannel.Projectile,
            scene.physics.add.group());

        this.configureRelationships();
    }

    public register(channel: CollisionChannel, collider: Collider): void
    {
        this.getGroup(channel)
            .add(collider.gameObject);

        this.registeredObjects.set(
            collider.gameObject, { collider, channel });
    }

    public unregister(channel: CollisionChannel, collider: Collider): void
    {
        this.getGroup(channel)
            .remove(collider.gameObject, false, false);

        this.registeredObjects.delete(collider.gameObject);
    }

    // TODO: move this to a SpatialQuery system
    public findNearest(
        channel: CollisionChannel,
        origin: Phaser.Math.Vector2,
        maxDistance: number,
        predicate?: (collider: Collider) => boolean): Collider | null
    {
        let nearest: Collider | null = null;
        let nearestDistanceSquared = maxDistance * maxDistance;

        for (const registeredObject of this.registeredObjects.values())
        {
            if (registeredObject.channel !== channel)
                continue;

            const collider = registeredObject.collider;
            if (predicate !== undefined &&
                !predicate(collider))
                continue;

            const position = collider.position;
            const dx = position.x - origin.x;
            const dy = position.y - origin.y;
            const distanceSquared = (dx * dx) + (dy * dy);
            if (distanceSquared < nearestDistanceSquared)
            {
                nearestDistanceSquared = distanceSquared;
                nearest = collider;
            }
        }

        return nearest;
    }

    private configureRelationships(): void
    {
        const pawns = this.getGroup(CollisionChannel.Pawn);
        const projectiles = this.getGroup(CollisionChannel.Projectile);

        this.scene.physics.add.collider(
            pawns,
            pawns,
            this.handleCollision,
            undefined,
            this);

        this.scene.physics.add.overlap(
            projectiles,
            pawns,
            this.handleOverlap,
            undefined,
            this);
    }

    private getGroup(channel: CollisionChannel): Phaser.Physics.Arcade.Group
    {
        const group = this.groups.get(channel);
        if (group === undefined)
            throw new Error(`Collision category ${channel} has no group.`);

        return group;
    }

    private handleCollision(
        object1: ArcadeCollisionObject,
        object2: ArcadeCollisionObject): void
    {
        if (!this.isGameObjectWithBody(object1) ||
            !this.isGameObjectWithBody(object2))
            return;

        const collider1 = this.registeredObjects.get(object1);
        const collider2 = this.registeredObjects.get(object2);
        if (collider1 === undefined || collider2 == undefined)
            return;

        collider1.collider.handleCollision(
            collider2.collider,
            collider2.channel);
            
        collider2.collider.handleCollision(
            collider1.collider,
            collider1.channel);
    }

    private handleOverlap(
        object1: ArcadeCollisionObject,
        object2: ArcadeCollisionObject): void
    {
        if (!this.isGameObjectWithBody(object1) ||
            !this.isGameObjectWithBody(object2))
            return;

        const collider1 = this.registeredObjects.get(object1);
        const collider2 = this.registeredObjects.get(object2);
        if (collider1 === undefined || collider2 == undefined)
            return;

        collider1.collider.handleOverlap(
            collider2.collider,
            collider2.channel);
            
        collider2.collider.handleOverlap(
            collider1.collider,
            collider1.channel);
    }

    private isGameObjectWithBody(object:ArcadeCollisionObject):
        object is Phaser.Types.Physics.Arcade.GameObjectWithBody
    {
        return "body" in object
            && "scene" in object;
    }
}
import * as Phaser from "phaser";

import { CollisionChannel } from "./CollisionChannel";

export interface Collider
{
    readonly gameObject:
        Phaser.Types.Physics.Arcade.GameObjectWithBody;

    readonly position: Phaser.Math.Vector2;

    handleCollision(
        other: Collider,
        otherChannel: CollisionChannel): void;

    handleOverlap(
        other: Collider,
        otherChannel: CollisionChannel): void;
}
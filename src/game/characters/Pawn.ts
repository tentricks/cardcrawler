import * as Phaser from "phaser";

export interface Pawn
{
    readonly gameObject: Phaser.Types.Physics.Arcade.GameObjectWithBody;
    readonly position: Phaser.Math.Vector2;
}


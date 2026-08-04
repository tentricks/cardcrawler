import * as Phaser from "phaser"
import { PlayerCharacter } from "./PlayerCharacter"

interface MovementKeys
{
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
}

export class PlayerController
{
    private readonly character: PlayerCharacter;
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly movementKeys: MovementKeys;

    public constructor(scene: Phaser.Scene, character: PlayerCharacter)
    {
        this.character = character;

        const keyboard = scene.input.keyboard;
        if (keyboard === null)
            throw new Error("Keyboard input plugin is unavailable.");
        
        this.cursors = keyboard.createCursorKeys();
        this.movementKeys = keyboard.addKeys(
            {
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            }
        ) as MovementKeys;
    }

    public update(): void
    {
        const movement = this.readMovementIntent();
        this.character.setMovementIntent(movement);
    }

    private readMovementIntent(): Phaser.Math.Vector2
    {
        let x = 0;
        let y = 0;

        if (this.cursors.left.isDown || this.movementKeys.left.isDown)
            x -= 1;

        if (this.cursors.right.isDown || this.movementKeys.right.isDown)
            x += 1;

        if (this.cursors.up.isDown || this.movementKeys.up.isDown)
            y -= 1;

        if (this.cursors.down.isDown || this.movementKeys.down.isDown)
            y += 1;

        return new Phaser.Math.Vector2(x, y);
    }
}
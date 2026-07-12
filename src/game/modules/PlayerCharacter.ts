import * as Phaser from "phaser"

export class PlayerCharacter
{

    private static readonly Speed = 220;

    private readonly pawn: Phaser.GameObjects.Rectangle;
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly movementKeys: MovementKeys

    public constructor(scene: Phaser.Scene, spawnX: number, spawnY: number)
    {
        this.pawn = scene.add.rectangle(
            spawnX,
            spawnY,
            32,
            32,
            0x58c7ff
        );

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

    public update(delta: number): void
    {
        const direction = this.getMovementDirection();
        if (direction.lengthSq() === 0)
            return;

        const elapsedSeconds = delta / 1000;
        const distance = PlayerCharacter.Speed * elapsedSeconds;

        this.pawn.x += direction.x * distance;
        this.pawn.y += direction.y * distance;
    }

    public position(): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(this.pawn.x, this.pawn.y);
    }

    private getMovementDirection(): Phaser.Math.Vector2
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
        
        return new Phaser.Math.Vector2(x, y).normalize();
    }
}
    
type MovementKeys = 
{
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
};
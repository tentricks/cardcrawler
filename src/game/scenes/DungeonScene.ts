import * as Phaser from "phaser";
import { PlayerCharacter } from "../modules/PlayerCharacter";

export class DungeonScene extends Phaser.Scene
{
    private player!: PlayerCharacter
    private debugText!: Phaser.GameObjects.Text;

    public constructor()
    {
        super("DungeonScene");
    }

    public create(): void
    {
        this.cameras.main.setBackgroundColor(0x15151c);

        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        this.createBanner(screenWidth);
        this.createBackground(screenWidth, screenHeight);
        this.createPlayerCharacter(screenWidth, screenHeight);
        this.createDebugLog(screenHeight);
    }

    public update(): void
    {
        this.player.update();
        this.updateDebugLog();
    }

    private updateDebugLog()
    {
        const position = this.player.position();
        const velocity = this.player.velocity();
        this.debugText.setText(
        [
            `position: ${Math.round(position.x)}, ${Math.round(position.y)}`,
            `velocity: ${Math.round(velocity.x)}, ${Math.round(velocity.y)}`
        ]);
    }

    private createDebugLog(screenHeight: number) {
        this.debugText = this.add.text(
            16,
            screenHeight - 32,
            "",
            {
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#bbbbbb"
            }
        );
    }

    private createBanner(screenWidth: number): void
    {
        this.add.text(
            screenWidth / 2,
            24,
            "LOOTER PROTOTYPE",
            {
                fontFamily: "Helvetica",
                fontSize: "24px",
                color: "#ffffff"
            }
        ).setOrigin(0.5, 0);
    }

    private createBackground(screenWidth: number, screenHeight: number): void
    {
        this.add.rectangle(
            screenWidth / 2,
            screenHeight / 2,
            640,
            360,
            0x24242f)
            .setStrokeStyle(
                2,
                0x55556a);
    }

    private createPlayerCharacter(screenWidth: number, screenHeight: number)
    {
        this.player = new PlayerCharacter(
            this,
            this.scale.width / 2,
            this.scale.height / 2);
    }
}
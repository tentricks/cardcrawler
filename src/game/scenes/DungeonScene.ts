import * as Phaser from "phaser";
import { PlayerCharacter } from "../modules/PlayerCharacter";
import { PlayerController } from "../modules/PlayerController";
import { EnemyManager } from "../modules/EnemyManager";

type ArcadeCollisionObject = 
    Phaser.Types.Physics.Arcade.GameObjectWithBody |
    Phaser.Physics.Arcade.Body |
    Phaser.Physics.Arcade.StaticBody |
    Phaser.Tilemaps.Tile;

export class DungeonScene extends Phaser.Scene
{
    private playerController!: PlayerController
    private playerCharacter!: PlayerCharacter
    private debugText!: Phaser.GameObjects.Text;
    private enemyManager!: EnemyManager;

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
        this.createEnemySystem();
        this.createCollisionRelationships();
        this.createDebugLog(screenHeight);
        this.createDebugInputMapping();
    }

    public update(delta: number): void
    {
        this.playerController.update();
        this.playerCharacter.update(delta);
        this.enemyManager.update();

        this.updateDebugLog();
    }

    private updateDebugLog()
    {
        const position = this.playerCharacter.position();
        const velocity = this.playerCharacter.velocity();
        this.debugText.setText(
        [
            `position: ${Math.round(position.x)}, ${Math.round(position.y)}`,
            `velocity: ${Math.round(velocity.x)}, ${Math.round(velocity.y)}`,
            `Enemies: ${this.enemyManager.count}`
        ]);
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
        this.playerCharacter = new PlayerCharacter(
            this,
            this.scale.width / 2,
            this.scale.height / 2);

        this.playerController = new PlayerController(
            this,
            this.playerCharacter
        )
    }

    private createEnemySystem(): void
    {
        this.enemyManager = new EnemyManager(
            this,
            this.playerCharacter
        );

        this.enemyManager.spawnEnemy(180, 150);
        this.enemyManager.spawnEnemy(780, 150);
        this.enemyManager.spawnEnemy(180, 390);
        this.enemyManager.spawnEnemy(780, 390);
    }

    private handlePlayerEnemyCollision(
        _playerObject: ArcadeCollisionObject,
        _enemyObject: ArcadeCollisionObject)
    {
        console.log("Player touched an enemy")
    }

    private createCollisionRelationships(): void
    {
        // setup collision handling between player and enemies
        this.physics.add.collider(
            this.playerCharacter.gameObject,
            this.enemyManager.collisions,
            this.handlePlayerEnemyCollision,
            undefined,
            this
        );

        // setup collision handling between enemies
        this.physics.add.collider(
            this.enemyManager.collisions,
            this.enemyManager.collisions
        )
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

    private createDebugInputMapping(): void
    {
        this.input.keyboard?.once("keydown-C", ()=>
        {
            console.log("Clearing enemies");
            this.enemyManager.clearAll();
        });
    }
}
    
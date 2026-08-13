import * as Phaser from "phaser";
import { PlayerCharacter } from "../characters/PlayerCharacter";
import { PlayerController } from "../characters/PlayerController";
import { EnemyManager } from "../characters/EnemyManager";
import { CollisionSystem } from "../collision/CollisionSystem";
import { CollisionChannel } from "../collision/CollisionChannel";

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
    private collisionSystem: CollisionSystem

    private static readonly AttackIntervalMs = 1000;
    private static readonly AttackRange = 300;

    private nextAttackTime = 0;

    public constructor()
    {
        super("DungeonScene");
    }

    public create(): void
    {
        this.cameras.main.setBackgroundColor(0x15151c);

        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        this.createBackground(screenWidth, screenHeight);
        this.createBanner(screenWidth);
        this.createCollisionSystem();
        this.createPlayerCharacter();
        this.createEnemySystem();
        this.createDebugLog(screenHeight);
        this.createDebugInputMapping();
    }

    public update(delta: number): void
    {
        this.playerController.update();
        this.playerCharacter.update(delta);
        this.enemyManager.update();
        this.updateAutomaticAttack(delta);

        this.updateDebugLog();
    }

    private updateAutomaticAttack(delta: number): void
    {
        if (delta < this.nextAttackTime)
            return;

        const target = this.collisionSystem.findNearest(
            CollisionChannel.Pawn,
            this.playerCharacter.position,
            DungeonScene.AttackRange,
            collider => collider !== this.playerCharacter);

        if (target === null)
            return;

        this.playerCharacter.launchProjectile(target.position)
        this.nextAttackTime =
            delta + DungeonScene.AttackIntervalMs;
    }

    private updateDebugLog()
    {
        const position = this.playerCharacter.position;
        const velocity = this.playerCharacter.velocity;
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

    private createPlayerCharacter()
    {
        this.playerCharacter = new PlayerCharacter(
            this,
            this.collisionSystem,
            this.scale.width / 2,
            this.scale.height / 2);

        this.playerController = new PlayerController(
            this,
            this.playerCharacter);
        
        this.collisionSystem.register(
            CollisionChannel.Pawn, this.playerCharacter);
    }

    private createEnemySystem(): void
    {
        this.enemyManager = new EnemyManager(
            this,
            this.playerCharacter,
            this.collisionSystem
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

    private createCollisionSystem(): void
    {
        this.collisionSystem = new CollisionSystem(this);
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
    
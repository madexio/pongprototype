@namespace
class SpriteKind:
    Collider = SpriteKind.create()
# collision checks, reverses the ball and plays a small particle effect

def on_on_overlap(sprite, otherSprite):
    Ball.set_velocity(max(0 - Ball.vx * 1.5, -100),
        Ball.vy * ballAccelerationRate + randint(-50, 50))
    EnemyPaddle.start_effect(effects.spray, 200)
    scene.camera_shake(4, 200)
sprites.on_overlap(SpriteKind.enemy, SpriteKind.projectile, on_on_overlap)

def on_on_overlap2(sprite2, otherSprite2):
    effects.confetti.start_screen_effect(1000)
    scene.camera_shake(8, 1000)
    if Ball.overlaps_with(leftNet):
        info.player2.change_score_by(1)
        ballReset()
    elif Ball.overlaps_with(rightNet):
        info.change_score_by(1)
        ballReset()
sprites.on_overlap(SpriteKind.projectile, SpriteKind.Collider, on_on_overlap2)

# checks if player scores and hits 10 sets state to win

def on_on_score():
    game.game_over(True)
info.on_score(10, on_on_score)

# initializes ball information and variable
def ballSetup():
    global Ball
    Ball = sprites.create(assets.image("""
        BallSprite
    """), SpriteKind.projectile)
    Ball.set_bounce_on_wall(True)
    ballReset()
# makes the enemy paddle follow the ball based on the vertical difference
def enemyLogic():
    EnemyPaddle.vy = (Ball.y - EnemyPaddle.y) * 10
# checks if opponent scored 10 and sets state to game over

def on_player2_score():
    game.game_over(False)
info.player2.on_score(10, on_player2_score)

# sets up the player variable and score related stuff
def playerSetup():
    global PlayerPaddle
    info.set_score(0)
    PlayerPaddle = sprites.create(assets.image("""
        PlayerPaddle
    """), SpriteKind.player)
    PlayerPaddle.set_position(10, 60)
    controller.move_sprite(PlayerPaddle, 0, 100)
    PlayerPaddle.set_stay_in_screen(True)

def on_on_overlap3(sprite22, otherSprite22):
    Ball.set_velocity(min(0 - Ball.vx * 1.5, 100),
        Ball.vy * ballAccelerationRate + randint(-50, 50))
    PlayerPaddle.start_effect(effects.spray, 200)
    scene.camera_shake(4, 200)
sprites.on_overlap(SpriteKind.player, SpriteKind.projectile, on_on_overlap3)

def netSetup():
    global leftNet, rightNet
    leftNet = sprites.create(assets.image("""
        net
    """), SpriteKind.Collider)
    leftNet.set_position(2, 60)
    rightNet = sprites.create(assets.image("""
        net
    """), SpriteKind.Collider)
    rightNet.set_position(158, 60)
# sets up the enemy and the enemies score
def enemySetup():
    global EnemyPaddle
    info.player2.set_score(0)
    EnemyPaddle = sprites.create(assets.image("""
            EnemyPaddleSprite
        """),
        SpriteKind.enemy)
    EnemyPaddle.set_position(150, 60)
    EnemyPaddle.set_stay_in_screen(True)
# resets the ball and adds confetti when scoring
def ballReset():
    Ball.set_position(80, 60)
    Ball.set_velocity(0, 0)
    pause(1000)
    # set ball to go in one direction
    Ball.set_velocity(randint(-50, 50), randint(-50, 50))
    if Ball.vx < 0 and Ball.vx > -20:
        Ball.vx = -20
    elif Ball.vx > 0 and Ball.vx < 20:
        Ball.vx = 20
PlayerPaddle: Sprite = None
rightNet: Sprite = None
leftNet: Sprite = None
EnemyPaddle: Sprite = None
Ball: Sprite = None
ballAccelerationRate = 0
ballAccelerationRate = 1.2
playerSetup()
enemySetup()
netSetup()
ballSetup()

def on_forever():
    music.play(music.create_sound_effect(WaveShape.SINE,
            5000,
            0,
            255,
            0,
            500,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LINEAR),
        music.PlaybackMode.IN_BACKGROUND)
    enemyLogic()
    Ball.start_effect(effects.trail, 50)
forever(on_forever)

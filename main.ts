namespace SpriteKind {
    export const Collider = SpriteKind.create()
}
// collision checks, reverses the ball and plays a small particle effect
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    Ball.setVelocity(Math.max(0 - Ball.vx * 1.5, -100), Ball.vy * ballAccelerationRate + randint(-50, 50))
    EnemyPaddle.startEffect(effects.spray, 200)
    scene.cameraShake(4, 200)
    music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
})
// checks if player scores and hits 10 sets state to win
info.onScore(10, function () {
    game.gameOver(true)
})
// initializes ball information and variable
function ballSetup () {
    Ball = sprites.create(assets.image`BallSprite`, SpriteKind.Projectile)
    Ball.setBounceOnWall(true)
    ballReset()
}
// makes the enemy paddle follow the ball based on the vertical difference
function enemyLogic () {
    EnemyPaddle.vy = (Ball.y - EnemyPaddle.y) * 10
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite22, otherSprite22) {
    Ball.setVelocity(Math.min(0 - Ball.vx * 1.5, 100), Ball.vy * ballAccelerationRate + randint(-50, 50))
    PlayerPaddle.startEffect(effects.spray, 200)
    scene.cameraShake(4, 200)
    music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
})
// checks if opponent scored 10 and sets state to game over
info.player2.onScore(10, function () {
    game.gameOver(false)
})
// sets up the player variable and score related stuff
function playerSetup () {
    info.setScore(0)
    PlayerPaddle = sprites.create(assets.image`PlayerPaddle`, SpriteKind.Player)
    PlayerPaddle.setPosition(10, 60)
    controller.moveSprite(PlayerPaddle, 0, 100)
    PlayerPaddle.setStayInScreen(true)
}
function netSetup () {
    leftNet = sprites.create(assets.image`net`, SpriteKind.Collider)
    leftNet.setPosition(2, 60)
    rightNet = sprites.create(assets.image`net`, SpriteKind.Collider)
    rightNet.setPosition(158, 60)
}
// sets up the enemy and the enemies score
function enemySetup () {
    info.player2.setScore(0)
    EnemyPaddle = sprites.create(assets.image`EnemyPaddleSprite`, SpriteKind.Enemy)
    EnemyPaddle.setPosition(150, 60)
    EnemyPaddle.setStayInScreen(true)
}
// resets the ball and adds confetti when scoring
function ballReset () {
    Ball.setPosition(80, 60)
    Ball.setVelocity(0, 0)
    pause(500)
    // set ball to go in one direction
    Ball.setVelocity(randint(-50, 50), randint(-50, 50))
    if (Ball.vx < 0 && Ball.vx > -20) {
        Ball.vx = -20
    } else if (Ball.vx > 0 && Ball.vx < 20) {
        Ball.vx = 20
    }
    console.log(Ball.vx)
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Collider, function (sprite2, otherSprite2) {
    effects.confetti.startScreenEffect(2000)
    scene.cameraShake(8, 1000)
    if (Ball.overlapsWith(leftNet)) {
        info.player2.changeScoreBy(1)
        ballReset()
    } else if (Ball.overlapsWith(rightNet)) {
        info.changeScoreBy(1)
        ballReset()
    }
})
let rightNet: Sprite = null
let leftNet: Sprite = null
let PlayerPaddle: Sprite = null
let EnemyPaddle: Sprite = null
let Ball: Sprite = null
let ballAccelerationRate = 0
ballAccelerationRate = 1.2
music.play(music.createSong(hex`00780004080200`), music.PlaybackMode.UntilDone)
playerSetup()
enemySetup()
netSetup()
ballSetup()
forever(function () {
    enemyLogic()
    Ball.startEffect(effects.trail, 50)
})

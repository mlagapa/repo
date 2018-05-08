// New Branch Version

var game = new Phaser.Game(550, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }); //  vertical aspect ratio

function preload() {
	// preload assets
    game.load.image('sky', 'assets/img/sky.png');
    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('star', 'assets/img/star.png');
    game.load.image('diamond', 'assets/img/diamond.png');
    game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32); //  dude is replaced with baddie sprite

}

// global variables

var platforms;
var player;
var score = 1;
var scoreText;

function create() {

    //  provides Phaser's arcade physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  loads in background sprite, using preloaded 'sky' png
    game.add.sprite(0, 0, 'sky');

    //  creates a game group for the ground and platforms
    platforms = game.add.group();

    //  allows platform group to use physics engine enabled in first line of create function
    platforms.enableBody = true;

    // creates the ground accounting for the size of the ground sprite, hence the world height - 64
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  scales the ground to fit the game screen
    ground.scale.setTo(2, 2);

    //  keeps ground locked in place, even when character jumps
    ground.body.immovable = true;

    //  creates ledges (x, y, sprite from preload)
    var ledge = platforms.create(400, 400, 'ground');

    //  keeps ledges from moving under any circumstance, next four ledges underneath follow
    //  the same code as this and the line above
    ledge.body.immovable = true;
    
    ledge = platforms.create(70, 250, 'ground');

    ledge.body.immovable = true;
    
    ledge = platforms.create(400, 75, 'ground');

    ledge.body.immovable = true;
    
    ledge = platforms.create(-150, 400, 'ground');

    ledge.body.immovable = true;
    
    ledge = platforms.create(-275, 75, 'ground');

    ledge.body.immovable = true;
    
    // creates player character, accounting for the ground height
    player = game.add.sprite(32, game.world.height - 150, 'baddie');

    //  applies physics to player character
    game.physics.arcade.enable(player);

    //  gives player a bounce when hitting the ground, makes the player affected by gravity, and allows for player collision
    player.body.bounce.y = 0.6;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  player walking animations, accounting for baddie sprite
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2, 3], 10, true);
    
    //  creates a game group for stars
    stars = game.add.group();

    //  allows stars to utilize physics engine
    stars.enableBody = true;

    //  for loop spacing stars evenly horizontally across game screen
    for (var i = 0; i < 8; i++)
    {
        //  adds a stars to star group
        var star = stars.create(i * 70, 0, 'star');

        //  applies gravity to stars
        star.body.gravity.y = 6;

        //  gives each star a random bounce similar to player
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
    
    //  creates a game group for diamonds
    diamonds = game.add.group();
    
    //  allows diamonds to utilize physics engine
    diamonds.enableBody = true;
    
    //  places diamond in a random location anywhere between the vertical position of 200 and pixels from the top
    //  so as to avoid overlapping with platforms
    var diamond = diamonds.create(Math.floor(Math.random() * 550), Math.floor(Math.random() * (200-100) + 100), 'diamond');


    //  creates score counter in top left hand corner of game screen
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}



function update() {
	// run game loop
    
    //  allows collision between the player and platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    
    //  alternative way to enable arrow keys for movement, instead of utilizing key pressed methods
    cursors = game.input.keyboard.createCursorKeys();
    
    //  sets player movement to 0
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  moves the player left
        player.body.velocity.x = -150;

        //  utilizes left animation from the create function
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  moves the player right
        player.body.velocity.x = 150;

        // utilizes right animation from the create funciton
        player.animations.play('right');
    }
    else
    {
        //  if the player isn't moving
        player.animations.stop();

        //  since the baddie has no screen facing frame, I picked the right facing frame to be used when the player is still
        player.frame = 2;
    }

    //  allows player to jump only if the player is on the ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
    
    //  checks for collision between the player, stars, and platforms
    game.physics.arcade.collide(stars, platforms);
    
    //  checks for when the player takes up the same space as a star or diamond 
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
}

function collectStar (player, star) {

    // gets rid of stars upon collection
    star.kill();

    //  adds 10 points to the score when collected
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function collectDiamond (player, diamond) {
    
    // gets rid of diamond upon collection
    diamond.kill();
    
    // adds 25 points ot the score when collected
    score += 25;
    scoreText.text = 'Score: ' + score;
}

function setVars() {
    setTiles();
    playerTexture = getImgFromName("player_face_camera")
    playerSideTexture = getImgFromName("player_face_right")
    selectorImg = getImgFromName("player_face_right")
    settings.zoom = 32;
}


function load() {
    setVars();
    
    canvas = document.getElementById("game_canvas");
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    document.addEventListener("keydown", function onEvent(event) {
        if (!keys.includes(event.key)) {
            keys.push(event.key);
        }
    });
    document.addEventListener("keyup", function onEvent(event) {
        if (keys.includes(event.key)) {
            let idx = keys.indexOf(event.key);
            keys.splice(idx, 1);
        }
    });
    canvas.addEventListener("mousemove", function onEvent(event) {
        mouseX = event.x;
        mouseY = event.y;
    });

    
    startGame();
}

function createWorld(dimention, height, width) {
    world[dimention] = {"height":height, "width":width, "tiles":[]}
    for (let i = 0; i < width; i++) {
        world[dimention].tiles.push([])
        for (let i2 = 0; i2 < height; i2++) {
            let tile;
            if (Math.random() > 0.01) {
                tile = new tileInastance(tiles.grass, i, i2, dimention);
            } else {
                tile = new tileInastance(tiles.rock, i, i2, dimention);
            }
            world[dimention].tiles[i].push(tile);
            if (Math.random() < 0.0025) {
                world[dimention].tiles[i][i2].changeTo(tiles.water);
                if (Math.random() > 0.5) {
                    if (i > 1 && i2 > 1) {
                        world[dimention].tiles[i-1][i2].changeTo(tiles.water);
                        world[dimention].tiles[i-1][i2-1].changeTo(tiles.water);
                        world[dimention].tiles[i][i2-1].changeTo(tiles.water);
                    }
                }
            }
        }
    }
    world[dimention].tiles.push([]);
    for (let i = 0; i < height; i++) {
        world[dimention].tiles.at(-1).push(new tileInastance(tiles.sand, width - 1, i, dimention));
    }

    world[dimention].tiles.forEach(i => {
        i.forEach(i2 => {
            let pos = i2.pos;
            let list = findSurroundingInstance(pos.dimention, pos.x, pos.y, true);
            if (list.includes(tiles.water) && [tiles.rock, tiles.grass].includes(i2.tileType)) {
                i2.changeTo(tiles.sand);
            }
        });
    });
}

function startGame() {
    createWorld("layer0", 1000, 1000)
    gameTickCount = 0;
    scrollX = 0;
    scrollY = 0;
    playerX = 100;
    playerY = 100;
    setTimeout(gameTick, 100);
}

function movePlayer() {
    playerXVel = (keys.includes("ArrowRight") || keys.includes("d")) - (keys.includes("ArrowLeft") || keys.includes("a"));
    playerYVel = (keys.includes("ArrowDown") || keys.includes("s")) - (keys.includes("ArrowUp") || keys.includes("w"));
    
    playerX += playerXVel * 0.1
    if (checkSolidInHitbox("layer0", playerX + 3/8, playerY + 0.1, playerX + 5/8, playerY + 0.9)) {
        playerX += playerXVel * -0.1
    }
    playerY += playerYVel * 0.1
    if (checkSolidInHitbox("layer0", playerX + 3/8, playerY + 0.1, playerX + 5/8, playerY + 0.9)) {
        playerY += playerYVel * -0.1
    }
    scrollX += (playerX - gridWidth/2 - scrollX) * 0.4
    scrollY += (playerY - gridHeight/2 - scrollY) * 0.4
}

function renderPlayer() {
    
    function draw(texture, dir) {
        ctx.drawImage(texture, (playerX - scrollX - 2 + ((-dir + 1) / 2)) * settings.zoom * dir, (playerY - scrollY - 2) * settings.zoom, settings.zoom, settings.zoom);
    }
    
    if (playerXVel > 0.0001) {
        draw(playerSideTexture, 1);
    } else if (playerXVel < -0.0001) {
        ctx.scale(-1, 1);
        draw(playerSideTexture, -1);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
        draw(playerTexture, 1)
    }
}

function renderTiles() {
    let offX = Math.floor(scrollX) - scrollX - 1
    let offY = Math.floor(scrollY) - scrollY - 1
    for (let i2 = 0; i2 < gridHeight; i2++) {
        for (let i = 0; i < gridWidth; i++) {
            let tileX = i - Math.floor(-scrollX);
            let tileY = i2 - Math.floor(-scrollY);

            tile = getTileInstanceFromPos("layer0", tileX, tileY);
            ctx.drawImage(tile.getImg(), (i + offX) * settings.zoom, (i2 + offY) * settings.zoom, settings.zoom, settings.zoom);
            if (tile == selectedInstance) {
                ctx.drawImage(selectorImg, (i + offX) * settings.zoom, (i2 + offY) * settings.zoom, settings.zoom, settings.zoom);
            }
        }
    }
}

function gameTick() {
    gridWidth = Math.ceil(canvas.width / settings.zoom) + 2;
    gridHeight = Math.ceil(canvas.height / settings.zoom) + 2;
    
    selectedInstance = getTileInstanceFromPos("layer0", Math.floor((mouseX) / settings.zoom + scrollX) + 2, Math.floor((mouseY) / settings.zoom + scrollY) + 2)
    
    movePlayer();
    renderTiles();
    renderPlayer();
    
    gameTickCount++
    setTimeout(gameTick, 1000 / 60)
}




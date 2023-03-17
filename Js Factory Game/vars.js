var tiles = {}
var canvas;
var ctx;
var settings = {}
var gameTickCount = 0;
var scrollX = 0;
var scrollY = 0;
var playerX = 0;
var playerY = 0;
var world = {}
var keys = []
var playerTexture;
var playerSideTexture;
var selectedInstance;
var gridWidth;
var gridHeight;
var mouseX = 0;
var mouseY = 0;
var playerXVel = 0;
var playerYVel = 0;
var selectorImg;

function getImgFromName(name) {
    let img = new Image();
    img.src = "textures/" + name + ".png";
    return img
}

class tileType {
    constructor(name, imageFileName=name) {
        this.name = name;
        let img = getImgFromName(imageFileName)
        this.mainImage = img;
        this.solid = false;
    }
    getImg(tileInstance) {
        return this.mainImage;
    }
    customImg(code) {
        this.getImg = code;
        return this;
    }
    isSolid() {
        return this.solid;
    }
    solidify(bool) {
        this.solid = bool;
        return this;
    }
}

class tileInastance {
    constructor(tileType, x, y, dimention) {
        this.tileType = tileType;
        this.pos = {};
        this.pos.x = x;
        this.pos.y = y;
        this.pos.dimention = dimention;
    }
    changeTo(tileType) {
        this.tileType = tileType;
    }
    getImg() {
        return this.tileType.getImg(this)
    }
}

function getTileInstanceFromPos(dimention, x, y) {
    let tile;
    tileRow = world[dimention].tiles[x];
    if (tileRow == undefined) {
        tile = new tileInastance(tiles.water, x, y, dimention);
    } else {
        tile = tileRow[y];
        if (tile == undefined) {
            tile = new tileInastance(tiles.water, x, y, dimention);
        }
    }
    return tile
}

function findSurroundingInstance(dimention, x, y, tileType) {
    let out = [getTileInstanceFromPos(dimention, x, y - 1), getTileInstanceFromPos(dimention, x + 1, y), getTileInstanceFromPos(dimention, x, y + 1), getTileInstanceFromPos(dimention, x - 1, y)];
    if (tileType) {
        let out2 = [];
        out.forEach(i => {
            out2.push(i.tileType)
        });
        return out2
    }
    return out
}

function checkIfSolid(dimention, x, y) {
    return getTileInstanceFromPos(dimention, Math.floor(x), Math.floor(y)).tileType.isSolid();
}

function checkSolidInHitbox(dimention, x1, y1, x2, y2) {
    let solid = false;
    for (let x = x1; x < Math.ceil(x2); x++) {
        for (let y = y1; y < Math.ceil(y2); y++) {
            if (checkIfSolid(dimention, x, y)) {
                solid = true;
            }
        }
    }
    return solid;
}


function setTiles() {
    tiles.grass = new tileType("grass");
    tiles.water = new tileType("water");
    tiles.rock = new tileType("rock").solidify(true);
    tiles.sand = new tileType("sand", "sand_1111");
    tiles.sand.imgs = [getImgFromName("sand_1111")];
    
    for (let i = 1; i < 16; i++) {
        tiles.sand.imgs.push(getImgFromName("sand_" + (i >>> 0).toString(2)));
    }
    tiles.sand.customImg((tileInstance) => {
        let pos = tileInstance.pos
        //let num = (getTileInstanceFromPos(tileInstance.pos.dimention, tileInstance.pos.x, tileInstance.pos.y - 1).tileType == tiles.water) + ((getTileInstanceFromPos(pos.dimention, pos.x + 1, pos.y).tileType == tiles.water) * 2) + ((getTileInstanceFromPos(pos.dimention, pos.x, pos.y + 1).tileType == tiles.water) * 4) + ((getTileInstanceFromPos(pos.dimention, pos.x - 1, pos.y).tileType == tiles.water) * 8);
        let num = 0;
        let list = findSurroundingInstance(pos.dimention, pos.x, pos.y, true);
        let multiplyer = 1
        list.forEach(i => {
            num += ((i == tiles.water) * multiplyer);
            multiplyer *= 2;
        });
        let out = tiles.sand.imgs[num];
        return out;
    });

    
}

const BitmapMixin = {
    BitmapMixin(obj) {
    },
    async loadSheet(jpg, w, h) {
        let image = new Image();
        // Wait for the sprite sheet to load
        image.onload = function () {
            let promises = [];
            let h = image.height / 3;
            let w = image.width / 5;
            for (let row = 0; row < image.height; row += h) {
                for (let col = 0; col < image.width; col += w) {
                    promises.push(createImageBitmap(image, col, row, w, h))
                }
            }
            Promise.all(promises).then(function (sprites) {
                let i = 0;
                for (let sprite of sprites) {
                    if (i < 13) {
                        let parms = { bitmap: sprite, suit: SUITS[n], face: FACES[i], value: VALUES[i] };
                        let card = Card.factory(parms);
                        that._parent.addObject(card);
                        that.cards.push(card);
                    }
                    i++;
                }
            });
        }

        // Load the sprite sheet from an image file
        image.src = jpg;
    },
    async createImageBitmap$(image, x, y, w, h) {
        let bitmap = await createImageBitmap(image, x || 0, y || 0, w || image.width, h || image.height);
        return bitmap;
    },
    async loadImage$(url) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = url;
        });
    },
    async loadImageBitmap$(url, x, y, w, h) {
        let image = await this.loadImage$(url);
        let bitmap = await this.createImageBitmap$(image, x, y, w, h);
        return bitmap;
    },
    async splitBitmap$(bitmap, nrows, ncols) {
        let rows = [];
        let w = bitmap.width / ncols;
        let h = bitmap.height / nrows;
        for (let y = 0; y < bitmap.height; y += h) {
            let cols = [];
            for (let x = 0; x < bitmap.width; x += w) {
                let newBitmap = await this.createImageBitmap$(bitmap, x, y, w, h);
                cols.push(newBitmap);
            }
            rows.push(cols)
        }
        return rows;
    }
}
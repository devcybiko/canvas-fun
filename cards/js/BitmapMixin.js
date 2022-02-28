const BitmapMixin = {
    BitmapMixin(obj) {
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
class GArrays {
    static ensureArray(arr) {
        if (!Array.isArray(arr)) {
            arr = [arr];
        }
        return arr;
    }
    static isCoherent(arr, type) {
        for(let el of arr) if (typeof el !== type) return false;
        return true;
    }
    static init(n, deflt) {
        let arr = new Array(n);
        console.log(arr.length);
        for(let i=0; i<arr.length; i++) arr[i] = deflt;
        return arr;
    }
    static matrix(dims, deflt) {
        if (!Array.isArray(arr) || !this.isCoherent(dims, "number")) throw new Error("arr should be a list of numbers");
        let arr = this.init(dims[0], deflt);
        if (dims.length > 1) {
            for(let i=0; i<arr.length; i++) arr[i] = this.matrix(dims.slice(1), deflt);
        }
        return arr;
    }
}

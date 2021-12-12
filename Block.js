class Block {
    constructor(
        data,
        prevHash,
        hash,
        index,
        timestamp,
        nonce
    ) {
        this.data = data
        this.prevHash = prevHash
        this.hash = hash
        this.index = index
        this.timestamp = timestamp
        this.nonce = nonce
    }
    //static methods called by Blockchain class, instead of creating new instances of Block class
    static newTimestamp() {
        this.timestamp = new Date().toGMTString()
        return this.timestamp
    };

    static genesisBlock(data, hash, nonce) {
        return new Block (
            data,
            "0",
            hash,
            0,
            this.newTimestamp(),
            nonce,
        )
    }
}

// module.exports = Block
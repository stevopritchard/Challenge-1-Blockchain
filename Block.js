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
    
    static newTimestamp() {
        this.timestamp = new Date().getTime()
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

module.exports = Block
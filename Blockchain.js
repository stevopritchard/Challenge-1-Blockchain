class Blockchain {
    constructor() {
        this.chain = [
            Block.genesisBlock(
                "Welcome to your Blockchain!",
                Blockchain.genHash(),
                0
            )
        ]
        this.difficulty = 3;
        //don't assign 'magic' numbers to 'difficulty
    }

    newHash(data, prevHash, index, timestamp, nonce) {
        return sha256((timestamp+data+prevHash+index+nonce))
    }

    static genHash() { //static method is available to the constructor
        return sha256((Block.newTimestamp()+"Welcome to your Blockchain!"+"0"+0+0).toString())
    }
    
    validHash(block){
        //this will update the hash of the current block if any of the block's values are changed
        let {data, prevHash, hash, index, timestamp, nonce} = block;
        while (hash.substr(0, this.difficulty) !== "000") //this needs to be a variable length string
        {
            hash = this.newHash(data, prevHash, index, timestamp, nonce)
            nonce++
            block.hash = hash
            block.nonce = nonce
        }
        return block
    }

    correctHash(chain) {
        chain.forEach(this.validHash.bind(this));
        return chain
    }

    refreshHash(index, newData) {
        let excisedChain = this.chain.slice(index, this.chain.length)
        let badHash
        excisedChain.forEach((block, i) => {
            let {prevHash, index, timestamp, nonce} = block
            badHash = this.newHash(newData, prevHash, index, timestamp, nonce)
            block.hash = badHash
            if (excisedChain[i+1] !== undefined) {
                excisedChain[i+1].prevHash = badHash
            }
        });

        console.log(excisedChain)
        return excisedChain
    }

    get getChain() {
        return this.chain
    }

    get nextBlock() { //consider making this a static function
        // this.correctHash(this.chain)
        let lastBlock = this.chain[this.chain.length-1];
        let newBlock = new Block (
                            "",
                            lastBlock.hash,
                            "",
                            this.chain[this.chain.length-1].index+1,
                            Block.newTimestamp(),
                            0
                        )
        this.chain.push(this.validHash(newBlock));
        return this.chain
    }
}

// console.log(new Blockchain().chain)
// console.log(new Blockchain().nextBlock)
// console.log(new Blockchain().getChain)
// console.log(new Blockchain().refreshHash())
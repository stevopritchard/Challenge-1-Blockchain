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
    }

    newHash(data, prevHash, index, timestamp, nonce) {
        return sha256((timestamp+data+prevHash+index+nonce))
    }

    static genHash() { //static method is available to the constructor
        return sha256((Block.newTimestamp()+"Welcome to your Blockchain!"+"0"+0+0).toString())
    }
    
    validHash(block){
        //available to update the hash of the current block if any of the block's values are changed
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

    correctHashes(blockIndex) {
        //retrieve a shallow copy of a portion of the chain from the index recieved as an argument
        let excisedChain = this.chain.slice(blockIndex, this.chain.length)
        console.log("before: ",excisedChain)
        //replace the hash of the first block from the excerpt
        this.validHash(excisedChain[0])
        let newHash
        for (let i = 1; i < excisedChain.length; i++) {
            //'blockIndex+i' is passed to matchPrevHash because the invoked function references 
            //the instance of Blockchain to find the appropriate preceding hash
            //Note: even though we are working with a copy of the excised chain in THIS
            //method, the changes to this copy are available in the instance of Blockchain too
            //HOWEVER in hindsight I'm not sure that s
            excisedChain[i].prevHash = this.matchPrevHash(blockIndex+i)
            let {data, prevHash, index, timestamp, nonce} = excisedChain[i]
            //replace the bad has with a new correct hash
            newHash = this.newHash(data, prevHash, index, timestamp, nonce)
            excisedChain[i].hash = newHash
        }
        console.log("after: ",excisedChain)
        console.log(this.chain)
        return excisedChain
    }

    matchPrevHash(index) {
        //sets the 'prevHash' property of the indexed block equal to the hash of the previous block
        if (this.chain[index].index !== 0) {
            console.log(index, this.chain[index-1].hash)
            this.chain[index].prevHash = this.chain[index-1].hash
        }
        return this.chain[index].prevHash
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
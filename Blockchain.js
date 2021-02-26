// const Block = require('./Block') 
// const crypto = require('crypto')

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
        let {data, prevHash, hash, index, timestamp, nonce} = block
        while (hash.substr(0,this.difficulty) !== "000") //this needs to be a variable length string
        {
            hash = this.newHash(data, prevHash, index, timestamp, nonce)
            nonce++
            block.hash = hash
            block.nonce = nonce
        }
        return block
    }

    refreshHash() {
        this.chain.forEach(block => {
            let {data, prevHash, hash, index, timestamp, nonce} = block
            while (hash.substr(0, this.difficulty) !== "000")
            {
                hash = sha256((data+prevHash+index+timestamp+nonce).toString())
                nonce++
                block.hash = hash
                block.nonce = nonce
            }
            return block
        });
        return this.chain
    }

    get getChain() {
        return this.chain
    }

    get nextBlock() { //consider making this a static function
        this.refreshHash()
        let lastBlock = this.chain[this.chain.length-1];
        let newBlock = new Block (
                            "",
                            lastBlock.prevHash,
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
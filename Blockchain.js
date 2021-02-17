const Block = require('./Block') 
const crypto = require('crypto')

class Blockchain {
    constructor() {
        this.chain = [
            Block.genesisBlock(
                "Welcome to your Blockchain!",
                crypto.createHash('SHA256').update(Block.newTimestamp()+"Welcome to your Blockchain!"+"0"+0+0).digest('hex'),
                0
            )
        ] //need to provide valid hash to genesis block
        this.difficulty = 3;
        //don't assign 'magic' numbers to 'difficulty
    }

    static newHash(data, prevHash, index, timestamp, nonce) {
        return crypto
        .createHash('SHA256')
        .update(timestamp+data+prevHash+index+nonce)
        .digest('hex');
    }
    
    validHash(block){
        //this will update the hash of the current block if any of the block's values are changed
        let {data, prevHash, hash, index, timestamp, nonce} = block
        while (hash.substr(0,this.difficulty) !== "000") //this needs to be a variable length string
        {
            hash = Blockchain.newHash(data, prevHash, index, timestamp, nonce)
            nonce++
            // console.log(`Hash: ${hash}, \nNonce: ${nonce}`)
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
                hash = Blockchain.newHash(data, prevHash, index, timestamp, nonce)
                nonce++
                // console.log(`Hash: ${hash}, \nNonce: ${nonce}`)
                block.hash = hash
                block.nonce = nonce
            }
            return block
        });
        return this.chain
    }

    get nextBlock() {
        this.refreshHash()
        let lastBlock = this.chain[this.chain.length-1];
        let newBlock = new Block (
                            this.chain[this.chain.length-1].data,
                            lastBlock.prevHash,
                            Blockchain.newHash(Block.newTimestamp,),
                            this.chain[this.chain.length-1].index+1,
                            Block.newTimestamp(),
                            0
                        )

        this.chain.push(this.validHash(newBlock));
        return this.chain
    }
}

console.log(new Blockchain().nextBlock)

// console.log(new Blockchain().refreshHash())
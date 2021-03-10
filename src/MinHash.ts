type MinHashConfig = {
    prime: number
    maxHash: number
    numPerm: number
    seed: number
}

const defaultConfig: MinHashConfig = {
    prime: 4294967311,
    maxHash: Math.pow(2, 32) - 1,
    numPerm: 128,
    seed: 1,
}

type UsedNums = Record<number, boolean>

/**
 * Minhash class - generates minhash signatures for set
 */
class MinHash {
    config: MinHashConfig
    hashValues: number[]
    permA: number[]
    permB: number[]
    hashBands: string[]

    constructor(config: MinHashConfig) {
        this.config = {...defaultConfig, ...config}

        this.hashValues = [];
        this.permA = [];
        this.permB = [];

        this.initHashValues();
        this.initPermutations();
    }

    initHashValues(): void {
        this.hashValues.fill(this.config.maxHash)
    }

    randInt(): number {
        const x = Math.sin(this.config.seed++) * this.config.maxHash;
        return Math.floor((x - Math.floor(x)) * this.config.maxHash);
    }

    initPermutations(): void {
        const used = this.initPerm(false)
        this.initPerm(true, used)
    }

    initPerm(whichPerm: boolean, used: UsedNums = {}): UsedNums {
        const perms = []
        for (let j = 0; j < this.config.numPerm; j++) {
            let rand = this.randInt()
            while (used[rand]) {
                rand = this.randInt()
            }
            perms.push(rand)
            used[rand] = true
        }

        if (whichPerm) {
            this.permB = perms
        } else {
            this.permA = perms
        }

        return used
    }

    update(word: string) {
        for (let i = 0; i < this.hashValues.length; i++) {
            const APerm = this.permA[i]
            const BPerm = this.permB[i]
            const hash = (APerm * this.hash(word) + BPerm) % this.config.prime
            if (hash < this.hashValues[i]) {
                this.hashValues[i] = hash
            }
        }
    }

    hash(str: string) {
        let hash = 0
        if (!str.length) {
            return hash + this.config.maxHash
        }

        for (const char of str) {
            const code = char.charCodeAt(0)
            hash = ((hash << 5) - hash) + code
            hash &= hash
        }

        return hash + this.config.maxHash
    }

    jaccard(other: MinHash) {
        if (this.hashValues.length != other.hashValues.length) {
            throw new Error('Cannot apply jaccard similarity to MinHashes with different count of hashValues')
        }
        if (this.config.seed != other.config.seed) {
            throw new Error('Cannot apply jaccard similarity to MinHashes with different seeds')
        }

        const shared = this.hashValues.reduce((acc, val, i) => val === other.hashValues[i] && ++acc, 0)
        return shared / this.hashValues.length
    }

}

export default MinHash

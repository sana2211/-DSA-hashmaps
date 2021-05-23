
class ChainingHashMap {
    constructor(initialCapacity = 8, SIZE_RATIO=3, MAX_LOAD_RATIO=0.5){
        this.length = 0;
        this._hashTable = [];
        this._capacity = initialCapacity;
        this._deleted = 0;
        this._SIZE_RATIO = SIZE_RATIO;
        this._MAX_LOAD_RATIO = MAX_LOAD_RATIO;
    }
    static _hashString(string){
        let hash = 5381;
        for(let i = 0; i < string.length; i++){
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        }
        return hash >>> 0;
    }

    set(key, value){
        const loadRatio = (this.length + this._deleted +1) / this._capacity;
        if( loadRatio > ChainingHashMap.MAX_LOAD_RATIO){
            this._resize(this._capacity * ChainingHashMap.SIZE_RATIO);
        }
        // Find the slot where this key should be in.
        const index = this._findSlot(key);
        if(!this._hashTable[index]){
            this.length++;
        }
        this._hashTable[index] = [{
            key,
            value,
            DELETED: false
        }];
    }
    get(key){
        const index = this._findSlot(key);
        if(this._hashTable[index] === undefined){
            throw new Error('Key Error');
        }
        return this._hashTable[index].value;
    }

    _findSlot(key){
        const hash = ChainingHashMap._hashString(key);
        const start = hash % this._capacity;

        for(let i = 0; i < start + this._capacity; i++){
            const index = i % this._capacity;
            const slot = this._hashTable[index];
            if(!this._hashTable[index]){
                this._hashTable[index] = [];
            }
            if(slot === undefined || (slot.key === key &&!slot.DELETED)){
                return index;
            }  
    }
}

    _resize(size){
        const oldSlots = this._hashTable.length;
        this._capacity = size;
        // Reset the length - it will get rebuilt as you add the items back
        this.length = 0;
        this._hashTable = [];

        for(const slot of oldSlots){
            if(slot !== undefined){
                this.set(slot.key, slot.value);
            }
        }
    }

    delete(key) {
        const index = this._findSlot(key);
        const slot = this._hashTable[index];
        if(slot === undefined){
            throw new Error('Key Error');
        }
        slot.DELETED = true;
        this.length--;
        this._deleted++;
    }
}

module.exports = ChainingHashMap;

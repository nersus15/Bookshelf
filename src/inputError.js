class InvalidInput extends Error{
    constructor(message){
        super(message)
        this.name = 'InvalidInput';
    }
}

module.exports = InvalidInput;
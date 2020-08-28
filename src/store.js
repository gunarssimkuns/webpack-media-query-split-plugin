class Store {
    constructor() {
        this.options = {}
        this.compilation = null // will be set when plugin is loaded
    }
}

module.exports = new Store()
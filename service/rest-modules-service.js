class RestModulesService {
    get express() {
        return require('express');
    }

    get bodyParser() {
        return require('body-parser');
    }
}

module.exports = RestModulesService
const database = require('./database')
const restAPI = require('./api/rest/index')

const runApp = async () => {
    await database();
    restAPI();
}
runApp()


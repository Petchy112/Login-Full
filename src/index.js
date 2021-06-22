const database = require('./database')
const config = require('./config')
const restAPI = require('./api/rest/index')

const start = async () => {
    await database()
    restAPI()
}
start()


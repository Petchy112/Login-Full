const mongoose = require('mongoose')

module.exports = async () => {
    let connectionValue;
    try {
        connectionValue = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.host}/${config.database.database}`
        await mongoose.connect(connectionValue, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database Connected.')
    }
    catch (err) {
        console.log('Database could not connect.')
    }

}
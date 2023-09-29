const connectDB = require('../db/connect');
const roleSeed = require('./roleSeeder');
const userSeed = require('./userSeeder');
require('dotenv').config();

const main = async () => {
    await connectDB(process.env.MONGO_URI)
    await roleSeed()
    await userSeed()
    process.exit(0)
}

main()

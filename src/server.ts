import mongoose from "mongoose"
import config from "./app/config"
import app from "./app"
import seedAdmin from "./app/DB"
import { Server } from 'http'
let server: Server;

const main = async () => {
    try {
        await mongoose.connect(config.database_url as string)
        seedAdmin()
        server = app.listen(config.port, () => {
            console.log('Bi_Cycle server is running on port' + ' ' + config.port);
          });
    } catch (error) {
        console.log(error);

    }
}
main()

process.on('unhandledRejection', () => {
    console.log('unhandled rejection is Detected. shutting down the server...');

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// process.on('uncaughtException', ()=> {
//   console.log('uncaught exception is Detected. shutting down the server...');
//   process.exit(1)
// })
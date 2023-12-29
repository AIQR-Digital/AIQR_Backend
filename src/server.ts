import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app";
import logger from "./utils/logger";

dotenv.config();

const log = logger(__filename);

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

// Function to gracefully shut down the Mongoose connection
const gracefulShutdown = (msg: string, callback: () => void) => {
    mongoose.connection.close().then(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    }).catch(error => {
        log.error("Something went wrong, while shutting app", error.message);
        process.exit(1);
    });
};


let DB_URI: string;
if (process.env.DATABASE && process.env.DATABASE_USERNAME && process.env.DATABASE_PASSWORD && process.env.DATABASE_NAME && process.env.PORT) {
    DB_URI = process.env.DATABASE.replace("<USERNAME>", process.env.DATABASE_USERNAME).replace("<PASSWORD>", process.env.DATABASE_PASSWORD).replace("<DATABASE_NAME>", process.env.DATABASE_NAME);
    const port = Number(process.env.PORT);

    // TO INSTALL DEPS "npm install" in the project folder
    // RUN "npm run check" for local server
    mongoose.connect(DB_URI)
        .then(() => {
            log.info('DB connection successful!');
            app.listen(port, () => {
                log.info(`App Running on Port ${port}....`);

            });
        })
        .catch(error => {
            log.error("DB Connection Failed");
            log.error(error.toString());
        });


} else {
    log.error("Database Credentials Not Found! 💥 Shutting down...");
    process.exit(1);
}


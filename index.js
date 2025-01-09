const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const { StatusCodes } = require("http-status-codes");
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');

const RedisStore = require("connect-redis").default;

const redisClient = redis.createClient({
    socket: {
        host: REDIS_URL,  // Should match REDIS_URL in your config
        port: REDIS_PORT,  // Should match REDIS_PORT in your config
        tls: false
    }
});
redisClient.connect().catch(console.error);


const app = express();
const port = process.env.PORT || 3000;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

mongoose.connect(mongoURL)
 .then(() => console.log("Connected to DB"))
 .catch((e) => console.log("Failed to connect to DB:\n"+e));

app.get("/api/v1", (req, res) => {
    res.send("<h1>Hi HERE!!!<h1>");
    console.log("Hi HERE!!!");
});

app.enable("trust proxy");
app.use(cors({}));
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,  // Set to `true` if using HTTPS
        httpOnly: true,
        maxAge: 60000,  // Cookie expiration time in milliseconds
    },
}));


app.use(express.json());
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong.";
    res.status(statusCode).json({ message });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
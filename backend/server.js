const http = require("http");

const app = require("./src/app");

const connectDB = require("./src/config/database");

const initializeSocket = require("./src/socket/socket");

require("dotenv").config();

connectDB();

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

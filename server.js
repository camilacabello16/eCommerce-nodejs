const app = require("./src/app");

const PORT = 2001;

const server = app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit server express'));
})
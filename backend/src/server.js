import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db';
import routes from './routes/index';

const app = express();

// Parses the text as JSON and exposes the resulting 
// object on req.body.
app.use(bodyParser.json());
// init middleware
if (process.env.NODE_ENV === "development") {
    app.use(cors());
}
// define routes
app.get("/api", (req, res) => {
    // send the request back to the client
    console.log("GET /api");
    res.send({ message: "Hello from the server!" }).status(200);
});

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}
app.use(express.json())

app.use('/', routes);
db.connect();

// define server
const port = process.env.PORT || 4000;
app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);
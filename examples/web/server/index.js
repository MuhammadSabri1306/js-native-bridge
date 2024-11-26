import path from "path";
import dotenv from "dotenv";
import express from "express";
import viewRouter from "./view-router.js";
import assetRouter from "./asset-router.js";
import apiRouter from "./api-router.js";

dotenv.config({ path: path.join(path.resolve(), ".env") });

const port = process.env.PORT || 3000;
const publicPath = path.join(path.resolve(), "public");
const distPath = path.join(path.resolve(), "dist");
const app = express();

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use("/api", apiRouter);

if(process.env.NODE_ENV === "production") {
    app.use("/", express.static(distPath));
} else {
    app.use("/", express.static(publicPath));
    app.use("/src", assetRouter);
}

app.use(viewRouter);

app.listen(port, () => {
    console.log(`Server hosted on http://localhost:${ port }`);
});
import fs from "fs/promises";
import path from "path";
import express from "express";

const environment = process.env.NODE_ENV;
const parseManifest = async () => {
    if(environment !== "production")
        return {};

    const manifestPath = path.join(path.resolve(), "dist/.vite", "manifest.json");
    const manifestFile = await fs.readFile(manifestPath);
    return JSON.parse(manifestFile);
};

const viewRouter = express.Router();
viewRouter.get("/*", async (_, res) => {
    const manifest = await parseManifest();
    res.render("index.html.ejs", { environment, manifest });
});

export default viewRouter;
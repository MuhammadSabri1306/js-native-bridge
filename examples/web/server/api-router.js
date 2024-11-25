import express from "express";

const apiV1Router = express.Router();

apiV1Router.get("/hello", (_, res) => {
    res.json({ success: true, message: "Hello, world!" });
});

apiV1Router.post("/native-client/validate", (req, res) => {
    const exampleNativeClients = [
        { name: "Android KOTLIN V1", key: "$2y$10$mDyRcX.gD446LpgEmIbyauHa41Umj3IWAO1tYYLj6sMvPJfbQKsyy" }
    ];

    const clientKey = req.body?.clientKey;
    if(!clientKey) {
        return res.status(400).json({
            success: false,
            error: "invalid request"
        });
    }

    const nativeClient = exampleNativeClients.find(({ key }) => key == clientKey);
    if(!nativeClient) {
        return res.status(400).json({
            success: false,
            error: "invalid client key"
        });
    }

    const expiredAt = Math.floor(Date.now() + (3600 * 24 * 30));
    let credentials = { ...nativeClient, expiredAt };
    credentials = Buffer.from( JSON.stringify(credentials) ).toString("base64");

    res.json({
        success: true,
        nativeClient,
        credentialName: process.env.JSNATIVEBRIDGE_COOKIE_NAME,
        credentials,
    });
});

const apiRouter = express.Router();
apiRouter.use("/v1", apiV1Router);

export default apiRouter;
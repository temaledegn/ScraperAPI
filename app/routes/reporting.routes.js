const express = require("express");
const cors = require("cors");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/reporting.controller");

const app = express();
app.use(express.json());
app.use(cors());

module.exports = function (app) {

    // app.get("/reporting/facebook/user/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserGet);
    // app.post("/reporting/facebook/user/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserAdd);
    // app.post("/reporting/facebook/user/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserDelete);

    app.get("/reporting/facebook/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbGet);
    app.post("/reporting/facebook/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbAdd);
    app.post("/reporting/facebook/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbDelete);


    app.get("/reporting/twitter/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterGet);
    app.post("/reporting/twitter/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterAdd);
    app.post("/reporting/twitter/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterDelete);


    //   app.get("/reporting/telegram/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgGet);

    //   app.post("/reporting/telegram/channel/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgChannelAdd);
    //   app.post("/reporting/telegram/channel/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgChannelDelete);

    //   app.post("/reporting/telegram/group/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgGroupAdd);
    //   app.post("/reporting/telegram/group/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgGroupDelete);


    //   app.get("/reporting/linkedin/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinGet);
    //   app.post("/reporting/linkedin/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinAdd);
    //   app.post("/reporting/linkedin/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinDelete);

}


const express = require("express");
const cors = require("cors");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/scraper.request.controller");

const app = express();
app.use(express.json());
app.use(cors());

module.exports = function (app) {

  app.get("/scraping/facebook/user/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserGet);
  app.post("/scraping/facebook/user/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserAdd);
  app.post("/scraping/facebook/user/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserDelete);

  app.get("/scraping/facebook/page/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPageGet);
  app.post("/scraping/facebook/page/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPageAdd);
  app.post("/scraping/facebook/page/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPageDelete);


  app.get("/scraping/twitter/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterGet);
  app.post("/scraping/twitter/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterAdd);
  app.post("/scraping/twitter/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterDelete);


  app.get("/scraping/telegram/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgGet);

  app.post("/scraping/telegram/channel/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgChannelAdd);
  app.post("/scraping/telegram/channel/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgChannelDelete);

  app.post("/scraping/telegram/group/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgGroupAdd);
  app.post("/scraping/telegram/group/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.tgGroupDelete);


  app.get("/scraping/linkedin/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinGet);
  app.post("/scraping/linkedin/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinAdd);
  app.post("/scraping/linkedin/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinDelete);



  app.get("/scraping/youtube/get", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.youtubeGet);
  app.post("/scraping/youtube/add", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.youtubeAdd);
  app.post("/scraping/youtube/delete", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.youtubeDelete);



  // app.get("/scraping/twitter/start-now", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterStartNow);
  // app.post("/scraping/facebook/user/start-now", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.facebookUserStartNow);
  // app.post("/scraping/facebook/page/start-now", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.facebookPageStartNow);
}


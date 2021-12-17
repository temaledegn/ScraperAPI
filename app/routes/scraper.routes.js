const express = require("express");
const cors = require("cors");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/scraper.controller");

const app = express();
app.use(express.json());
app.use(cors());

/* ************************************* */
/* **********   TWITTER      *********** */
/* ************************************* */

module.exports = function (app) {

  app.get("/twitter/user-info/:username", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterUserInfo);


  app.get("/twitter/all-users/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterAllUsers);


  app.get("/twitter/tweets/:doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterTweets);


  app.get("/twitter/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterSearch);

  /* ************************************* */
  /* **********   TELEGRAM     *********** */
  /* ************************************* */


  app.get("/telegram/channel/all-scraped/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramChannelAllScraped);


  app.get("/telegram/group/all-scraped/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramGroupAllScraped);


  app.get("/telegram/telegram-posts/:type/:doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramPosts);

  /* ************************************* */
  /* **********   LINKEDIN     *********** */
  /* ************************************* */

  app.get("/linkedin/all-scraped/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinAllScraped);

}



// app.listen(3001, '0.0.0.0', () => console.log("Server running on port 3001!"));

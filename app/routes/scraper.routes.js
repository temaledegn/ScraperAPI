const express = require("express");
const cors = require("cors");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/scraper.controller");

const app = express();
app.use(express.json());
app.use(cors());


module.exports = function (app) {

  //ACTION
  app.get("/action", [cors()], controller.actionRequest);

  //END ACTION


  /* ************************************* */
  /* **********   FACEBOOK      *********** */
  /* ************************************* */

  app.get("/facebook/user/dates", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserDates);


  app.get("/facebook/user/users/:date_doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserUsers);


  app.get("/facebook/user/posts/:date_doc_id/:user_doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserPosts);


  // app.get("/facebook/user/comments/:date_doc_id/:user_doc_id/:post_doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserComments);


  app.get("/facebook/page/dates", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPageDates);


  app.get("/facebook/page/pages/:date_doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPagePages);
  

  app.get("/facebook/page/posts/:date_doc_id/:page_doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPagePosts);

  app.get("/facebook/page/all-posts", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPageAllPosts);
  app.get("/facebook/user/all-posts", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbUserAllPosts);

  app.get("/facebook/live-search", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.facebookLiveSearch);


  app.get("/facebook/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.facebookSearch);

  // app.get("/facebook/page/comments/:date_doc_id/:user_doc_id/:post_doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.fbPageComments);



  /* ************************************* */
  /* **********   TWITTER      *********** */
  /* ************************************* */

  app.get("/twitter/user-info/:username", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterUserInfo);


  app.get("/twitter/all-users/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterAllUsers);


  app.get("/twitter/tweets/:doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterTweets);


  app.get("/twitter/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterSearch);

  app.get("/twitter/live-search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterLiveSearch);

  /* ************************************* */
  /* **********   TELEGRAM     *********** */
  /* ************************************* */


  app.get("/telegram/channel/all-scraped/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramChannelAllScraped);


  app.get("/telegram/group/all-scraped/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramGroupAllScraped);


  app.get("/telegram/telegram-posts/:type/:doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramPosts);

  app.get("/telegram/channel/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramChannelSearch);

  app.get("/telegram/group/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.telegramGroupSearch);

  /* ************************************* */
  /* **********   LINKEDIN     *********** */
  /* ************************************* */

  app.get("/linkedin/all-scraped/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.linkedinAllScraped);


  /* ************************************* */
  /* **********   YOUTUBE     *********** */
  /* ************************************* */
  app.get("/youtube/all-videos/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.youtubeAllVideos);


  app.get("/youtube/comments/:doc_id", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.youtubeComments);


  // app.get("/youtube/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.youtubeSearch);


  /* ************************************* */
  /* **********   GLOBAL     ************* */
  /* ************************************* */

  app.post("/common/keyword/facebook-live-search/", [cors()], controller.facebookLiveSearch); 


  // app.get("/common/keyword/search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.globalKeywordSearch); 
  
  app.post("/common/keyword/twitter-live-search/", [cors(), authJwt.verifyToken, authJwt.isAdmin], controller.twitterLiveSearch);


}



// app.listen(3001, '0.0.0.0', () => console.log("Server running on port 3001!"));

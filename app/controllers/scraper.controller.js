const MongoClient = require("mongodb");
const { exec } = require('child_process');
const homeDir = require('os').homedir();


const { spawnSync } = require( 'child_process' );

var request = require('request');

const winston =  require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'logs/server.log'
        })
    ]
};

const logger = winston.createLogger(logConfiguration);

const uri =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

// Action Request

exports.actionRequest = (req, res) => {
    res.send('No Action');
}

// End Action Request



/* ************************************* */
/* **********   TWITTER      *********** */
/* ************************************* */

/**
 * Returns response containing information about the given username if found
 * @param {Request} req The request object which should contain the twitter username
 * @param {Response} res Response object for the request
 */
exports.twitterUserInfo = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { "UserName": '@' + req.params.username },
                { projection: { tweets: 0 } },
                function (err, result) {
                    if (err) {
                        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        throw err;
                    }
                    res.send(result);
                    db.close();
                }
            );
    });
}

/**
 * Returns all the available users scraped from the twitter platform
 * @param {Request} req A request object
 * @param {Response} res A response object
 */
exports.twitterAllUsers = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .find({}, { projection: { tweets: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
}

/**
 * Returns all the available tweets using the specified document ID
 * @param {Request} req A request object containing document id
 * @param {Response} res A response object containing the tweets
 */
exports.twitterTweets = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { tweets: 1 } },
                function (err, result) {
                     if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                    res.send(result);
                    db.close();
                }
            );
    });
}

/**
 * Performs search based on search parameter in the request object and returns matching posts if any
 * 
 * Search query types: 
 * 
 * Raw alphanumeric string eg. hello : searches posts containing the word hello
 * 
 * Start with @: eg. @username: searches all the posts from the user with usename 'username'
 * 
 * Enclose in quotations: eg. "@username": earches posts containing the word '@username', useful for mentions
 * @param {Request} req A request object contining the search parameter
 * @param {Response} res A response object containing tweets matching the search query
 */
exports.twitterSearch = (req, res) => {
    const sq = req.query.q;
    if (sq == undefined){
        logger.warn(`${500} - ${'Search Query Not Specified'} - - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.send('Search Query Not Specified')
    }
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    } else if (sq.startsWith("@")) {
        MongoClient.connect(uri, function (err, db) {
            if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .findOne({ UserName: sq },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    }
};

/* ************************************* */
/* *********  END TWITTER      ********* */
/* ************************************* */


/* ************************************* */
/* **********   TELEGRAM      ********** */
/* ************************************* */


exports.telegramChannelAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
        var dbo = db.db("telegram-data");
        dbo
            .collection("channels")
            .find({}, { projection: { data: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
};


exports.telegramGroupAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("telegram-data");
        dbo
            .collection("groups")
            .find({}, { projection: { group_data: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
};

/**
 * Returns telegram posts based on the request type
 * @param {Request} req Request object containing the type of telegram media (channel/group)
 * @param {Response} res Response object containing the telegram posts
 */
exports.telegramPosts = (req, res) => {
    if (req.params.type == 'group') {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send(result);
                        db.close();
                    }
                );
        });
    } else if (req.params.type == 'channel') {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send(result);
                        db.close();
                    }
                );
        });
    }

};


exports.telegramChannelSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .aggregate([
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$data",
                                    as: "data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$data.Message",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    } else if (sq.startsWith("@")) {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne({ channel_username: sq.substring(1) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .aggregate([
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$data",
                                    as: "data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$data.Message",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    }
};


exports.telegramGroupSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .aggregate([
                    {
                        $project: {
                            group_data: {
                                $filter: {
                                    input: "$group_data",
                                    as: "group_data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$group_data.Message",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    } else if (sq.startsWith("@")) {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne({ group_username: sq.substring(1) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .aggregate([
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$group_data",
                                    as: "group_data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$group_data.Message",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    }
};
/* ************************************* */
/* *********  END TELEGRAM      ******** */
/* ************************************* */

/* ************************************* */
/* **********   LINKEDIN      ********** */
/* ************************************* */



exports.linkedinAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("linkedin-data");
        dbo
            .collection("profile")
            .find({})
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
};


/* ************************************* */
/* *********  END LINKEDIN      ******** */
/* ************************************* */




/* ************************************* */
/* **********   YOUTUBE      *********** */
/* ************************************* */

exports.youtubeAllVideos = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("youtube-data");
        dbo
            .collection("youtube")
            .find({}, { projection: { 'comments': 0, comment: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
}

exports.youtubeComments = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("youtube-data");
        dbo
            .collection("youtube")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { "comments": 1 } },
                function (err, result) {
                     if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                    res.send(result);
                    db.close();
                }
            );
    });
}

// exports.youtubeSearch = (req, res) => {
//     const sq = req.query.q;
//     if (sq[0] === '"' && sq[sq.length - 1] === '"') {
//         let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
//         MongoClient.connect(uri, function (err, db) {
//              if (err) {
                // logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                // throw err;
            // }
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .aggregate([
//                     {
//                         $project: {
//                             tweets: {
//                                 $filter: {
//                                     input: "$tweets",
//                                     as: "tweets",
//                                     cond: {
//                                         $regexMatch: {
//                                             input: "$$tweets.tweet",
//                                             regex: re,
//                                         },
//                                     },
//                                 },
//                             },
//                             // Fullname: 1,
//                             // UserName: 1,
//                         },
//                     },
//                 ])
//                 .toArray()
//                 .then((items) => {
//                     res.send(items);
//                     db.close();
//                 });
//         });
//     } else if (sq.startsWith("@")) {
//         MongoClient.connect(uri, function (err, db) {
//              if (err) {
            //     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //     throw err;
            // }
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .findOne({ UserName: sq },
//                     function (err, result) {
//                          if (err) {
            //     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //     throw err;
            // }
//                         res.send([result]);
//                         db.close();
//                     });
//         });
//     } else {
//         let re = new RegExp(".*" + sq + ".*", "i");
//         MongoClient.connect(uri, function (err, db) {
//              if (err) {
            //     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //     throw err;
            // }
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .aggregate([
//                     {
//                         $project: {
//                             tweets: {
//                                 $filter: {
//                                     input: "$tweets",
//                                     as: "tweets",
//                                     cond: {
//                                         $regexMatch: {
//                                             input: "$$tweets.tweet",
//                                             regex: re,
//                                         },
//                                     },
//                                 },
//                             },
//                             // Fullname: 1,
//                             // UserName: 1,
//                         },
//                     },
//                 ])
//                 .toArray()
//                 .then((items) => {
//                     res.send(items);
//                     db.close();
//                 });
//         });
//     }
// };

/* ************************************* */
/* *********  END YOUTUBE      ********* */
/* ************************************* */





/* ************************************* */
/* ************  COMMON     ************ */
/* ************************************* */
 
exports.globalKeywordSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    } else if (sq.startsWith("@")) {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .findOne({ UserName: sq },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    }
};


function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
           exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
           });
       })
   }
}


exports.globalKeywordLiveSearch = (req, res) => {

    const twitterScriptPath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Scraper/index_keyword.py'
    
    var query = req.body.keyword;
    var responseContent = [];
    if (req.body.twitterEnabled == 'true'){
        var startTimestamp = new Date();
        startTimestamp.setTime(startTimestamp.getTime()+3*3600*1000);
        var os = new os_func();

        // os.execCommand('ls').then(resp=> {
            os.execCommand('/usr/bin/python3 '+twitterScriptPath+' "'+query+'"').then(resp=> {
                MongoClient.connect(uri, function (err, db) {
                     if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                    var dbo = db.db("twitter-data");
                    dbo
                        .collection("twitter")
                        .find({ Date_of_Scraping: {$gt : startTimestamp}, Scraped_From :'key word', 'Keyword used':query})
                        .toArray()
                        .then((items) => {
                            res.send(items);
                            db.close();
                        });
                });
        }).catch(err=> {
            console.log("os >>>", err);
        })

    }
    
};


exports.facebookKeywordSearch = (req, res) => {
    var query = req.body.id;
    request({
        url: "http://172.20.70.64:3555/api/post",
        method: "POST",
        json: true,
        body: {"id":query}
    }, function (error, response, body){
        res.send(response);
    });
};





/* ************************************* */
/* ************  COMMON     ************ */
/* ************************************* */
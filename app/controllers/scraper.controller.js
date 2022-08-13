const MongoClient = require("mongodb");
const { exec } = require('child_process');
const homeDir = require('os').homedir();


const { spawnSync } = require( 'child_process' );

var request = require('request');

const uri =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";





// Action Request

exports.actionRequest = (req, res) => {
    res.send('No Action');

    // MongoClient.connect(uri, function (err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("twitter-data");


    //     for (var i = 0; i < 200; i++) {
    //         var newVal = {};
    //         newVal[`tweets.${i.toString()}.reporting`] = {
    //             "is_reported": null,
    //             "reporting_date": null,
    //             "reported_by": null,
    //             "report_count": 0
    //         };
    //         try {
    //             dbo
    //                 .collection("twitter")
    //                 .updateMany(
    //                     {},
    //                     {
    //                         '$set': newVal
    //                     },
    //                     function (err, result) {
    //                         if (err) throw err;
    //                         res.send('OK');
    //                         db.close();
    //                     }
    //                 )
    //         } catch (e) {

    //         }

    //     }

    // });


}

// End Action Request



/* ************************************* */
/* **********   TWITTER      *********** */
/* ************************************* */

exports.twitterUserInfo = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { "UserName": '@' + req.params.username },
                { projection: { tweets: 0 } },
                function (err, result) {
                    if (err) throw err;
                    res.send(result);
                    db.close();
                }
            );
    });
}

exports.twitterAllUsers = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
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

exports.twitterTweets = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { tweets: 1 } },
                function (err, result) {
                    if (err) throw err;
                    res.send(result);
                    db.close();
                }
            );
    });
}

exports.twitterSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
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
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .findOne({ UserName: sq },
                    function (err, result) {
                        if (err) throw err;
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
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
        if (err) throw err;
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
        if (err) throw err;
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


exports.telegramPosts = (req, res) => {
    if (req.params.type == 'group') {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                        if (err) throw err;
                        res.send(result);
                        db.close();
                    }
                );
        });
    } else if (req.params.type == 'channel') {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                        if (err) throw err;
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
            if (err) throw err;
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
            if (err) throw err;
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne({ channel_username: sq.substring(1) },
                    function (err, result) {
                        if (err) throw err;
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
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
            if (err) throw err;
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
            if (err) throw err;
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne({ group_username: sq.substring(1) },
                    function (err, result) {
                        if (err) throw err;
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
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
        if (err) throw err;
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
        if (err) throw err;
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
        if (err) throw err;
        var dbo = db.db("youtube-data");
        dbo
            .collection("youtube")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { "comments": 1 } },
                function (err, result) {
                    if (err) throw err;
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
//             if (err) throw err;
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
//             if (err) throw err;
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .findOne({ UserName: sq },
//                     function (err, result) {
//                         if (err) throw err;
//                         res.send([result]);
//                         db.close();
//                     });
//         });
//     } else {
//         let re = new RegExp(".*" + sq + ".*", "i");
//         MongoClient.connect(uri, function (err, db) {
//             if (err) throw err;
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
            if (err) throw err;
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
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .findOne({ UserName: sq },
                    function (err, result) {
                        if (err) throw err;
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
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
        var os = new os_func();

        os.execCommand('/usr/bin/python3 '+twitterScriptPath+' "'+query+'"').then(resp=> {
            console.log('sending request');
            res.send(resp);

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
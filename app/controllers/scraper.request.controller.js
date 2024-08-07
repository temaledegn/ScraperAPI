const homeDir = require('os').homedir();
const fs = require('fs');
const { type } = require('os');
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const secretKey = 'scraper-secret-key';

const winston =  require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'logs/server.log'
        })
    ]
};

const logger = winston.createLogger(logConfiguration);


const telegramPath = homeDir + '/Desktop/osint/Telegram/Telegram/data.json'
// const fbPagePath = homeDir + '/Desktop/osint/Facebook/facebook-posts/target.txt'
const fbPagePath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/facebook/list_post.txt'
const fbUserPath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/facebook/list_user.txt'
const twitterPath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Authentication/Document.txt'
const linkedinPath = homeDir + '/Desktop/osint/LinkedIn/datarequ.txt'
const youtubePath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/YouTube/url.txt'


// const fbPageKeywordsPath = homeDir + '/Desktop/osint/Facebook/faceboook-scraper-backend/targetKeywords.txt'
// const fbUserKeywordsPath = homeDir + '/Desktop/osint/Facebook/facebook-scraper-backend-profile/targetKeywords.txt'
// const twitterKeywordsPath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Authentication/DocumentKeywords.txt'

const twitterScraperScriptPath = '/Desktop/osint/Twitter/twitter-scraper/scraper/index.py'
const twitterCurrentlyScrapingKeywordPath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/currentlyScrapingKeyword.txt'

//*************** FACEBOOK  ******************/

/**
 * Returns facebook user links that are being scraped continuously
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.fbUserGet = (req, res) => {
    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let _type = req.query.type;
        fs.readFile(fbUserPath, 'utf8', (err, data) => {
            if (err) { 
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send([])
            } else {
                res.send(data.split('\n').filter((item) => item.includes(user.id)).map((item) => item.split(' ')[0]));
            }

        });

    });


   
}

/**
 * Adds new user link to the scraping queue
 * @param {Request} req The request object containing the new user link that is gonna be added
 * @param {Response} res The response object
 */
exports.fbUserAdd = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;


        let _type = req.body.type;
        let entry = _type == 'link' ? (req.body.link + ' ' + user.id) :(req.body.keyword + ' ' + user.id);
        fs.readFile(fbUserPath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {

                let usernames = data.split('\n');
                if (usernames.includes(entry)) {
                    res.send({ 'type': 'warning', 'message': 'already added' })
                } else {
                    fs.appendFile(fbUserPath, '\n' + entry, function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant append' })
                        } else {
                            res.send({ 'type': 'success', 'message': _type+' added' })
                        }
                    });
                }
            }
        });

    });



    
}

/**
 * Deletes existing user link from to the scraping queue
 * @param {Request} req The request object containing the existing user link that is gonna be deleted
 * @param {Response} res The response object
 */
exports.fbUserDelete = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let _type = req.body.type;
        let entry = _type == 'link' ? (req.body.link + ' '+ user.id):(req.body.keyword + ' ' + user.id);
        fs.readFile(fbUserPath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {
                let usernames = data.split('\n');
                if (usernames.includes(entry)) {
                    const index = usernames.indexOf(entry);
                    if (index > -1) {
                        usernames.splice(index, 1);
                    }
                    fs.writeFile(fbUserPath, usernames.join('\n'), function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant delete' });
                        } else {
                            res.send({ 'type': 'success', 'message': 'username removed' });
                        }

                    });
                } else {
                    res.send({ 'type': 'error', 'message': 'username not found' });
                }
            }

        });

    });


    
}

/**
 * Returns facebook page/group links that are being scraped continuously
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.fbPageGet = (req, res) => {
    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let _type = req.query.type;
        fs.readFile(fbPagePath, 'utf8', (err, data) => {
            if (err) { 
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send([])
            } else {
                res.send(data.split('\n').filter((item) => item.includes(user.id)).map((item) => item.split(' ')[0]));
            }

        });

    });


   
}

/**
 * Adds new page/group link to the scraping queue
 * @param {Request} req The request object containing the new page/group link that is gonna be added
 * @param {Response} res The response object
 */
exports.fbPageAdd = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;


        let _type = req.body.type;
        let entry = _type == 'link' ? (req.body.link + ' ' + user.id) :(req.body.keyword + ' ' + user.id);
        fs.readFile(fbPagePath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {

                let usernames = data.split('\n');
                if (usernames.includes(entry)) {
                    res.send({ 'type': 'warning', 'message': 'already added' })
                } else {
                    fs.appendFile(fbPagePath, '\n' + entry, function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant append' })
                        } else {
                            res.send({ 'type': 'success', 'message': _type+' added' })
                        }
                    });
                }
            }
        });

    });



    
}
/**
 * Deletes existing page/group link from to the scraping queue
 * @param {Request} req The request object containing the existing page/group link that is gonna be deleted
 * @param {Response} res The response object
 */
exports.fbPageDelete = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let _type = req.body.type;
        let entry = _type == 'link' ? (req.body.link + ' '+ user.id):(req.body.keyword + ' ' + user.id);
        fs.readFile(fbPagePath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {
                let usernames = data.split('\n');
                if (usernames.includes(entry)) {
                    const index = usernames.indexOf(entry);
                    if (index > -1) {
                        usernames.splice(index, 1);
                    }
                    fs.writeFile(fbPagePath, usernames.join('\n'), function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant delete' });
                        } else {
                            res.send({ 'type': 'success', 'message': 'username removed' });
                        }

                    });
                } else {
                    res.send({ 'type': 'error', 'message': 'username not found' });
                }
            }

        });

    });


    
}

//************** END FACEBOOK  ****************/


//*************** TWITTER  ******************/

/**
 * Returns twitter usernames that are being scraped continuously
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.twitterGet = (req, res) => {
    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let _type = req.query.type;
        fs.readFile(twitterPath, 'utf8', (err, data) => {
            if (err) { 
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send([])
            } else {
                res.send(data.split('\n').filter((item) => item.includes(user.id)).map((item) => item.split(' ')[0]));
            }

        });

    });


   
}
/**
 * Adds new twitter username to the scraping queue
 * @param {Request} req The request object containing the new username that is gonna be added
 * @param {Response} res The response object
 */
exports.twitterAdd = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;


        let _type = req.body.type;
        let entry = _type == 'username' ? (req.body.username + ' ' + user.id) :(req.body.keyword + ' ' + user.id);
        fs.readFile(twitterPath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {

                let usernames = data.split('\n');
                if (usernames.includes(entry)) {
                    res.send({ 'type': 'warning', 'message': 'already added' })
                } else {
                    fs.appendFile(twitterPath, '\n' + entry, function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant append' })
                        } else {
                            res.send({ 'type': 'success', 'message': _type+' added' })
                        }
                    });
                }
            }
        });

    });



    
}

/**
 * Deletes existing twitter username from the scraping queue
 * @param {Request} req The request object containing the existing twitter username that is gonna be deleted
 * @param {Response} res The response object
 */
exports.twitterDelete = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let _type = req.body.type;
        let entry = _type == 'username' ? (req.body.username + ' '+ user.id):(req.body.keyword + ' ' + user.id);
        fs.readFile(twitterPath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {
                let usernames = data.split('\n');
                if (usernames.includes(entry)) {
                    const index = usernames.indexOf(entry);
                    if (index > -1) {
                        usernames.splice(index, 1);
                    }
                    fs.writeFile(twitterPath, usernames.join('\n'), function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant delete' });
                        } else {
                            res.send({ 'type': 'success', 'message': 'username removed' });
                        }

                    });
                } else {
                    res.send({ 'type': 'error', 'message': 'username not found' });
                }
            }

        });

    });


    
}

//*************** END TWITTER  ******************/

//*************** TELEGRAM  ******************/

/**
 * Returns twitter channel and group usernames that are being scraped continuously
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.tgGet = (req, res) => {
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send({ 'type': 'error', })
        } else {
            res.send(JSON.parse(data));
        }

    });
}
/**
 * Adds new telegram channel username to the scraping queue
 * @param {Request} req The request object containing the new username that is gonna be added
 * @param {Response} res The response object
 */
exports.tgChannelAdd = (req, res) => {
    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        let username = {'requested_by': user.id, 'username': req.body.username};
        fs.readFile(telegramPath, 'utf8', (err, data) => {
            if (err) { 
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    res.send({ 'type': 'error', 'message': 'cant read' })
                } else {
                    let usernames = JSON.parse(data);
                    if (usernames.channel_username.includes(username)) {
                        res.send({ 'type': 'warning', 'message': 'already added' });
                    } else {
                        usernames.channel_username.push(username);
                        fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                            if (err) { 
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                res.send({ 'type': 'error', 'message': 'cant add' });
                            } else {
                                res.send({ 'type': 'success', 'message': 'username added' });
                            }
        
                        });
                    }
                }
        
            });

    });


    
}

/**
 * Deletes existing telegram channel username from the scraping queue
 * @param {Request} req The request object containing the existing telegram channel username that is gonna be deleted
 * @param {Response} res The response object
 */
exports.tgChannelDelete = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        
        let username = req.body.username;

        fs.readFile(telegramPath, 'utf8', (err, data) => {
            if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {
                let usernames = JSON.parse(data);
                
                if (usernames.channel_username.map(item => item.username).includes(username)) {
                    
                    const index = usernames.channel_username.map(item => item.username).indexOf(username);
                    if (index > -1) {
                        usernames.channel_username.splice(index, 1);
                    }
                    fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                        if (err) { 
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant delete' });
                        } else {
                            res.send({ 'type': 'success', 'message': 'username removed' });
                        }

                    });
                } else {
                    res.send({ 'type': 'error', 'message': 'username not found' });
                }
            }

        });

    });

    
}

/**
 * Adds new telegram group username to the scraping queue
 * @param {Request} req The request object containing the new username that is gonna be added
 * @param {Response} res The response object
 */
exports.tgGroupAdd = (req, res) => {

    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        let username = {'requested_by': user.id, 'username': req.body.username};
        fs.readFile(telegramPath, 'utf8', (err, data) => {
            if (err) { 
      logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                res.send({ 'type': 'error', 'message': 'cant read' })
            } else {
                let usernames = JSON.parse(data);
                if (usernames.group_username.includes(username)) {
                    res.send({ 'type': 'warning', 'message': 'already added' });
                } else {
                    usernames.group_username.push(username);
                    fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                        if (err) { 
      logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            res.send({ 'type': 'error', 'message': 'cant add' });
                        }
                        res.send({ 'type': 'success', 'message': 'username added' });
                    });
                }
    
            }
    
        });
        

    });



    
}

/**
 * Deletes existing telegram group username from the scraping queue
 * @param {Request} req The request object containing the existing telegram group username that is gonna be deleted
 * @param {Response} res The response object
 */
exports.tgGroupDelete = (req, res) => {
    let username = req.body.username;

    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let usernames = JSON.parse(data);
            if (usernames.group_username.map(item => item.username).includes(username)) {
                const index = usernames.group_username.map(item => item.username).indexOf(username);
                if (index > -1) {
                    usernames.group_username.splice(index, 1);
                }
                fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                    if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    }
                    res.send({ 'type': 'success', 'message': 'username removed' });
                });
            } else {
                res.send({ 'type': 'error', 'message': 'username not found' });
            }
        }

    });
}



//*************** END TELEGRAM  ******************/


//***************** LINKEDIN  ********************/

/**
 * Returns linkedin profile links that are being scraped continuously
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.linkedinGet = (req, res) => {
    fs.readFile(linkedinPath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send([])
        } else {
            res.send(data.split('\n'));
        }

    });
}
/**
 * Adds new linkedin profile link to the scraping queue
 * @param {Request} req The request object containing the new link that is gonna be added
 * @param {Response} res The response object
 */
exports.linkedinAdd = (req, res) => {
    let link = req.body.link;

    fs.readFile(linkedinPath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(link)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(linkedinPath, '\n' + link, function (err) {
                    if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'appended' })
                    }
                });
            }
        }

    });
}

/**
 * Deletes existing linkedin profile link from the scraping queue
 * @param {Request} req The request object containing the existing linkedin profile link that is gonna be deleted
 * @param {Response} res The response object
 */
exports.linkedinDelete = (req, res) => {
    let link = req.body.link;

    fs.readFile(linkedinPath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(link)) {
                const index = links.indexOf(link);
                if (index > -1) {
                    links.splice(index, 1);
                }
                fs.writeFile(linkedinPath, links.join('\n'), function (err) {
                    if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    }
                    res.send({ 'type': 'success', 'message': 'link removed' });
                });
            } else {
                res.send({ 'type': 'warning', 'message': 'link not found' });
            }
        }

    });
}


//*************** END LINKEDIN  ******************/


//***************** YOUTUBE  ********************/

/**
 * Returns youtube video links that are being scraped continuously
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.youtubeGet = (req, res) => {
    fs.readFile(youtubePath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send([])
        } else {
            res.send(data.split('\n'));
        }

    });
}

/**
 * Adds new youtube video link the scraping queue
 * @param {Request} req The request object containing the youtube video link that is gonna be added
 * @param {Response} res The response object
 */
exports.youtubeAdd = (req, res) => {
    let link = req.body.link;

    fs.readFile(youtubePath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(link)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(youtubePath, '\n' + link, function (err) {
                    if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'appended' })
                    }
                });
            }
        }

    });
}

/**
 * Deletes existing youtube video link from the scraping queue
 * @param {Request} req The request object containing the existing youtube video link that is gonna be deleted
 * @param {Response} res The response object
 */
exports.youtubeDelete = (req, res) => {
    let link = req.body.link;

    fs.readFile(youtubePath, 'utf8', (err, data) => {
        if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(link)) {
                const index = links.indexOf(link);
                if (index > -1) {
                    links.splice(index, 1);
                }
                fs.writeFile(youtubePath, links.join('\n'), function (err) {
                    if (err) { 
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    }
                    res.send({ 'type': 'success', 'message': 'link removed' });
                });
            } else {
                res.send({ 'type': 'warning', 'message': 'link not found' });
            }
        }

    });
}


//*************** END YOUTUBE  ******************/




// exports.twitterStartNow = (req, res) => {
//     let keyword = req.body.keyword;
//     exec('python3 '+twitterScraperScriptPath + ' ' + keyword, (err, stdout, stderr) => {
//         if (err) { 
//   logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
//             res.send({ 'type': 'error', 'message': 'Can not start at the moment!' });
//             return;
//         }
//         res.send({ 'type': 'success', 'message': 'Scraping Started!' });
//       });
// }


// exports.facebookUserStartNow = (req, res) => {
//     let keyword = req.body.keyword;

//     exec('cat *.js bad_file | wc -l', (err, stdout, stderr) => {
//         if (err) { 
//   logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
//             res.send({ 'type': 'error', 'message': 'Can not start at the moment!' });
//             return;
//         }
//         res.send({ 'type': 'success', 'message': 'Scraping Started!' });

//       });
// }


// exports.facebookPageStartNow = (req, res) => {
//     let keyword = req.body.keyword;
//     res.send({ 'type': 'error', 'message': 'cant read' });
 
// }
const homeDir = require('os').homedir();
const fs = require('fs');
const { type } = require('os');
const { exec } = require('child_process');


const telegramPath = homeDir + '/Desktop/OSINT/Telegram/Telegram/data.json'
const fbPagePath = homeDir + '/Desktop/OSINT/Facebook/faceboook-scraper-backend/target.txt'
const fbUserPath = homeDir + '/Desktop/OSINT/Facebook/facebook-scraper-backend-profile/target.txt'
const twitterPath = homeDir + '/Desktop/OSINT/Twitter/twitter-scraper/Authentication/Document.txt'
const linkedinPath = homeDir + '/Desktop/OSINT/LinkedIn/datarequ.txt'
const youtubePath = homeDir + '/Desktop/OSINT/YouTube/youtube_Scrape_/url.txt'


const fbPageKeywordsPath = homeDir + '/Desktop/OSINT/Facebook/faceboook-scraper-backend/targetKeywords.txt'
const fbUserKeywordsPath = homeDir + '/Desktop/OSINT/Facebook/facebook-scraper-backend-profile/targetKeywords.txt'
const twitterKeywordsPath = homeDir + '/Desktop/OSINT/Twitter/twitter-scraper/Authentication/DocumentKeywords.txt'

const twitterScraperScriptPath = '/Desktop/OSINT/Twitter/twitter-scraper/scraper/index.py'
const twitterCurrentlyScrapingKeywordPath = homeDir + '/Desktop/OSINT/Twitter/twitter-scraper/currentlyScrapingKeyword.txt'

//*************** FACEBOOK  ******************/

exports.fbUserGet = (req, res) => {
    let _type = req.query.type;
    fs.readFile(_type == 'link' ? fbUserPath:fbUserKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        } else {
            res.send(data.split('\n'));
        }

    });
}

exports.fbUserAdd = (req, res) => {
    let _type = req.body.type;
    let entry =  _type == 'link' ? req.body.link:req.body.keyword;
    
    fs.readFile(_type == 'link' ? fbUserPath:fbUserKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(entry)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(_type == 'link' ? fbUserPath:fbUserKeywordsPath, entry + '\n', function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'appended' })
                    }
                });
            }
        }

    });
}

exports.fbUserDelete = (req, res) => {
    let _type = req.body.type;
    let entry =  _type == 'link' ? req.body.link:req.body.keyword;

    fs.readFile(_type == 'link' ? fbUserPath:fbUserKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(entry)) {
                const index = links.indexOf(entry);
                if (index > -1) {
                    links.splice(index, 1);
                }
                fs.writeFile(_type == 'link' ? fbUserPath:fbUserKeywordsPath, links.join('\n'), function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    } else {
                        res.send({ 'type': 'success', 'message': 'link removed' });
                    }

                });
            } else {
                res.send({ 'type': 'warning', 'message': 'link not found' });
            }
        }

    });
}

exports.fbPageGet = (req, res) => {
    let _type = req.query.type;
    fs.readFile(_type == 'link' ? fbPagePath : fbPageKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        } else {

            res.send(data.split('\n'));
        }
    });
}

exports.fbPageAdd = (req, res) => {
    let _type = req.body.type;
    let entry = _type == 'link' ? req.body.link : req.body.keyword;
    fs.readFile(_type == 'link' ? fbPagePath : fbPageKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(entry)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(_type == 'link' ? fbPagePath : fbPageKeywordsPath, '\n' + entry, function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': _type+' Added' })
                    }
                });
            }
        }

    });
}

exports.fbPageDelete = (req, res) => {
    let _type = req.body.type;
    let entry = _type == 'link' ? req.body.link : req.body.keyword;
    
    fs.readFile(_type == 'link' ? fbPagePath : fbPageKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(entry)) {
                const index = links.indexOf(entry);
                if (index > -1) {
                    links.splice(index, 1);
                }
                fs.writeFile(_type == 'link' ? fbPagePath : fbPageKeywordsPath, links.join('\n'), function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    } else {
                        res.send({ 'type': 'success', 'message': _type+' removed' });
                    }

                });
            } else {
                res.send({ 'type': 'warning', 'message': _type+' not found' });
            }
        }

    });
}

//************** END FACEBOOK  ****************/


//*************** TWITTER  ******************/

exports.twitterGet = (req, res) => {
    let _type = req.query.type;
    fs.readFile(_type == 'username'? twitterPath:twitterKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        } else {
            res.send(data.split('\n'));
        }

    });
}

exports.twitterAdd = (req, res) => {
    let _type = req.body.type;
    let entry = _type == 'username' ? req.body.username:req.body.keyword;
    fs.readFile(_type == 'username'? twitterPath:twitterKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {

            let usernames = data.split('\n');
            if (usernames.includes(entry)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(_type == 'username'? twitterPath:twitterKeywordsPath, '\n' + entry, function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': _type+' added' })
                    }
                });
            }
        }
    });
}

exports.twitterDelete = (req, res) => {
    let _type = req.body.type;
    let entry = _type == 'username' ? req.body.username:req.body.keyword;
    fs.readFile(_type == 'username'? twitterPath:twitterKeywordsPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let usernames = data.split('\n');
            if (usernames.includes(entry)) {
                const index = usernames.indexOf(entry);
                if (index > -1) {
                    usernames.splice(index, 1);
                }
                fs.writeFile(_type == 'username'? twitterPath:twitterKeywordsPath, usernames.join('\n'), function (err) {
                    if (err) {
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
}

//*************** END TWITTER  ******************/

//*************** TELEGRAM  ******************/


exports.tgGet = (req, res) => {
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', })
        } else {
            res.send(JSON.parse(data));
        }

    });
}

exports.tgChannelAdd = (req, res) => {
    let username = req.body.username;
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let usernames = JSON.parse(data);
            if (usernames.channel_username.includes(username)) {
                res.send({ 'type': 'warning', 'message': 'already added' });
            } else {
                usernames.channel_username.push(username);
                fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant add' });
                    } else {
                        res.send({ 'type': 'success', 'message': 'username added' });
                    }

                });
            }
        }

    });
}

exports.tgChannelDelete = (req, res) => {
    let username = req.body.username;

    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let usernames = JSON.parse(data);
            if (usernames.channel_username.includes(username)) {
                const index = usernames.channel_username.indexOf(username);
                if (index > -1) {
                    usernames.channel_username.splice(index, 1);
                }
                fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                    if (err) {
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
}

exports.tgGroupAdd = (req, res) => {
    let username = req.body.username;
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let usernames = JSON.parse(data);
            if (usernames.group_username.includes(username)) {
                res.send({ 'type': 'warning', 'message': 'already added' });
            } else {
                usernames.group_username.push(username);
                fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant add' });
                    }
                    res.send({ 'type': 'success', 'message': 'username added' });
                });
            }

        }

    });
}

exports.tgGroupDelete = (req, res) => {
    let username = req.body.username;

    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let usernames = JSON.parse(data);
            if (usernames.group_username.includes(username)) {
                const index = usernames.group_username.indexOf(username);
                if (index > -1) {
                    usernames.group_username.splice(index, 1);
                }
                fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                    if (err) {
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


exports.linkedinGet = (req, res) => {
    fs.readFile(linkedinPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        } else {
            res.send(data.split('\n'));
        }

    });
}

exports.linkedinAdd = (req, res) => {
    let link = req.body.link;

    fs.readFile(linkedinPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(link)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(linkedinPath, '\n' + link, function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'appended' })
                    }
                });
            }
        }

    });
}

exports.linkedinDelete = (req, res) => {
    let link = req.body.link;

    fs.readFile(linkedinPath, 'utf8', (err, data) => {
        if (err) {
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


exports.youtubeGet = (req, res) => {
    fs.readFile(youtubePath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        } else {
            res.send(data.split('\n'));
        }

    });
}

exports.youtubeAdd = (req, res) => {
    let link = req.body.link;

    fs.readFile(youtubePath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        } else {
            let links = data.split('\n');
            if (links.includes(link)) {
                res.send({ 'type': 'warning', 'message': 'already added' })
            } else {
                fs.appendFile(youtubePath, '\n' + link, function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'appended' })
                    }
                });
            }
        }

    });
}

exports.youtubeDelete = (req, res) => {
    let link = req.body.link;

    fs.readFile(youtubePath, 'utf8', (err, data) => {
        if (err) {
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




exports.twitterStartNow = (req, res) => {
    let keyword = req.body.keyword;
    exec('python3 '+twitterScraperScriptPath + ' ' + keyword, (err, stdout, stderr) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'Can not start at the moment!' });
            return;
        }
        res.send({ 'type': 'success', 'message': 'Scraping Started!' });
      });
}


exports.facebookUserStartNow = (req, res) => {
    let keyword = req.body.keyword;

    exec('cat *.js bad_file | wc -l', (err, stdout, stderr) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'Can not start at the moment!' });
            return;
        }
        res.send({ 'type': 'success', 'message': 'Scraping Started!' });

      });
}


exports.facebookPageStartNow = (req, res) => {
    let keyword = req.body.keyword;
    res.send({ 'type': 'error', 'message': 'cant read' });
 
}
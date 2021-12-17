

const homeDir = require('os').homedir();
const fs = require('fs');


const telegramPath = homeDir + '/Desktop/OSINT/Telegram/data.json'
const fbPagePath = homeDir + '/Desktop/OSINT/facebook/faceboook-scraper-backend/target.txt'
const fbUserPath = homeDir + '/Desktop/OSINT/facebook/facebook-scraper-backend-profile/target.txt'
const twitterPath = homeDir + '/Desktop/OSINT/Twitter/twitterScraper/Authentication/Document.txt'

//*************** FACEBOOK  ******************/

exports.fbUserGet = (req, res) => {
    fs.readFile(fbUserPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        }
        res.send(data.split('\n'));
    });
}

exports.fbUserAdd = (req, res) => {
    let link = req.body.link;

    fs.readFile(fbUserPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let links = data.split('\n');
        if (links.includes(link)) {
            res.send({ 'type': 'warning', 'message': 'already added' })
        } else {
            fs.appendFile(fbUserPath, '\n' + link, function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant append' })
                } else {``
                    res.send({ 'type': 'success', 'message': 'appended' })
                }
            });
        }
    });
}

exports.fbUserDelete = (req, res) => {
    let link = req.body.link;

    fs.readFile(fbUserPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let links = data.split('\n');
        if (links.includes(link)) {
            const index = links.indexOf(link);
            if (index > -1) {
                links.splice(index, 1);
            }
            fs.writeFile(fbUserPath, links.join('\n'), function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant delete' });
                }
                res.send({ 'type': 'success', 'message': 'link removed' });
            });
        } else {
            res.send({ 'type': 'warning', 'message': 'link not found' });
        }
    });
}


exports.fbPageGet = (req, res) => {
    fs.readFile(fbPagePath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        }
        res.send(data.split('\n'));
    });
}


exports.fbPageAdd = (req, res) => {
    let link = req.body.link;

    fs.readFile(fbPagePath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let links = data.split('\n');
        if (links.includes(link)) {
            res.send({ 'type': 'warning', 'message': 'already added' })
        } else {
            fs.appendFile(fbPagePath, '\n' + link, function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant append' })
                } else {
                    res.send({ 'type': 'success', 'message': 'Link Added' })
                }
            });
        }
    });
}

exports.fbPageDelete = (req, res) => {
    let link = req.body.link;

    fs.readFile(fbPagePath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let links = data.split('\n');
        if (links.includes(link)) {
            const index = links.indexOf(link);
            if (index > -1) {
                links.splice(index, 1);
            }
            fs.writeFile(fbPagePath, links.join('\n'), function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant delete' });
                }
                res.send({ 'type': 'success', 'message': 'link removed' });
            });
        } else {
            res.send({ 'type': 'warning', 'message': 'link not found' });
        }
    });
}



//************** END FACEBOOK  ****************/


//*************** TWITTER  ******************/

exports.twitterGet = (req, res) => {
    fs.readFile(twitterPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        }
        res.send(data.split('\n'));
    });
}


exports.twitterAdd = (req, res) => {
    let username = req.body.username;

    fs.readFile(twitterPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let usernames = data.split('\n');
        if (usernames.includes(username)) {
            res.send({ 'type': 'warning', 'message': 'already added' })
        } else {
            fs.appendFile(twitterPath, '\n' + username, function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant append' })
                } else {
                    res.send({ 'type': 'success', 'message': 'Username Added' })
                }
            });
        }
    });
}

exports.twitterDelete = (req, res) => {
    let username = req.body.username;

    fs.readFile(twitterPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let usernames = data.split('\n');
        if (usernames.includes(username)) {
            const index = usernames.indexOf(username);
            if (index > -1) {
                usernames.splice(index, 1);
            }
            fs.writeFile(twitterPath, usernames.join('\n'), function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant delete' });
                }
                res.send({ 'type': 'success', 'message': 'username removed' });
            });
        } else {
            res.send({ 'type': 'error', 'message': 'username not found' });
        }
    });
}

//*************** END TWITTER  ******************/

//*************** TELEGRAM  ******************/


exports.tgGet = (req, res) => {
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', })
        }
        res.send(JSON.parse(data));
    });
}



exports.tgChannelAdd = (req, res) => {
    let username = req.body.username;
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let usernames = JSON.parse(data);
        if (usernames.channel_username.includes(username)) {
            res.send({ 'type': 'warning', 'message': 'already added' });
        } else {
            usernames.channel_username.push(username);
            fs.writeFile(telegramPath, JSON.stringify(usernames), function (err) {
                if (err) {
                    res.send({ 'type': 'error', 'message': 'cant add' });
                }
                res.send({ 'type': 'success', 'message': 'username added' });
            });
        }
    });
}


exports.tgChannelDelete = (req, res) => {
    let username = req.body.username;

    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
        let usernames = JSON.parse(data);
        if (usernames.channel_username.includes(username)) {
            const index = usernames.channel_username.indexOf(username);
            if (index > -1) {
                usernames.channel_username.splice(index, 1);
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
    });
}




exports.tgGroupAdd = (req, res) => {
    let username = req.body.username;
    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
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
    });
}




exports.tgGroupDelete = (req, res) => {
    let username = req.body.username;

    fs.readFile(telegramPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }
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
    });
}



//*************** END TELEGRAM  ******************/


const homeDir = require('os').homedir();
const fs = require('fs');


const twitterPath = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Authentication/twitter_reporting_ids.txt'
// const telegramPath = homeDir + '/Desktop/OSINT/Telegram/data.json'
const fbPath = homeDir + '/Desktop/osint/Facebook/reporting/fb_reporting_ids.txt'
// const fbUserPath = homeDir + '/Desktop/OSINT/facebook/facebook-scraper-backend-profile/target.txt'
// const linkedinPath = homeDir + '/Desktop/OSINT/linkedin/datarequ.txt'

//*************** FACEBOOK  ******************/

/**
 * Returns the posts the facebook reporter is working on reporting
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.fbGet = (req, res) => {
    fs.readFile(fbPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        }else{
            if (data === undefined){
                data = '';
            }
            let response = data.split('\n');
            // if(response.lengt)
            
            var i = 0;
            while (i < response.length) {
              if (response[i] === '') {
                response.splice(i, 1);
              } else {
                ++i;
              }
            }
            res.send(response);
        }
        
    });
}

/**
 * Adds new post to be reported to the queue
 * @param {Request} req The request object, it should contain reporting_data in its body
 * @param {Response} res The response object
 */
exports.fbAdd = (req, res) => {
    let reporting_data = req.body.reporting_data;

    fs.readFile(fbPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read file' })
        }else{
            let reporting_datas = data.split('\n');
            if (reporting_datas.includes(reporting_data)) {
                res.send({ 'type': 'warning', 'message': 'already added to queue' })
            } else {
                fs.appendFile(fbPath, reporting_data + '\n', function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'Added' })
                    }
                });
            }
        }
       
    });
}

/**
 * Deletes existing post to be reported from the queue
 * @param {Request} req The request object, it should contain reporting_data in its body
 * @param {Response} res The response object
 */
exports.fbDelete = (req, res) => {
    let reporting_data = req.body.reporting_data;

    fs.readFile(fbPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }else{
            let reporting_datas = data.split('\n');
            if (reporting_datas.includes(reporting_data)) {
                const index = reporting_datas.indexOf(reporting_data);
                if (index > -1) {
                    reporting_datas.splice(index, 1);
                }
                fs.writeFile(fbPath, reporting_datas.join('\n'), function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    }
                    res.send({ 'type': 'success', 'message': 'reporting removed' });
                });
            } else {
                res.send({ 'type': 'error', 'message': 'data not found' });
            }
        }
      
    });
}

//************** END FACEBOOK  ****************/


//*************** TWITTER  ******************/


/**
 * Returns the posts the twitter reporter is working on reporting
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.twitterGet = (req, res) => {
    fs.readFile(twitterPath, 'utf8', (err, data) => {
        if (err) {
            res.send([])
        }else{
            if (data === undefined){
                data = '';
            }
            let response = data.split('\n');
            // if(response.lengt)
            
            var i = 0;
            while (i < response.length) {
              if (response[i] === '') {
                response.splice(i, 1);
              } else {
                ++i;
              }
            }


            res.send(response);
        }
        
    });
}

/**
 * Adds new post to be reported to the queue
 * @param {Request} req The request object, it should contain reporting_data in its body
 * @param {Response} res The response object
 */
exports.twitterAdd = (req, res) => {
    let reporting_data = req.body.reporting_data;

    fs.readFile(twitterPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read file' })
        }else{
            let reporting_datas = data.split('\n');
            if (reporting_datas.includes(reporting_data)) {
                res.send({ 'type': 'warning', 'message': 'already added to queue' })
            } else {
                fs.appendFile(twitterPath, reporting_data + '\n', function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant append' })
                    } else {
                        res.send({ 'type': 'success', 'message': 'Added' })
                    }
                });
            }
        }
       
    });
}

/**
 * Deletes existing post to be reported from the queue
 * @param {Request} req The request object, it should contain reporting_data in its body
 * @param {Response} res The response object
 */
exports.twitterDelete = (req, res) => {
    let reporting_data = req.body.reporting_data;

    fs.readFile(twitterPath, 'utf8', (err, data) => {
        if (err) {
            res.send({ 'type': 'error', 'message': 'cant read' })
        }else{
            let reporting_datas = data.split('\n');
            if (reporting_datas.includes(reporting_data)) {
                const index = reporting_datas.indexOf(reporting_data);
                if (index > -1) {
                    reporting_datas.splice(index, 1);
                }
                fs.writeFile(twitterPath, reporting_datas.join('\n'), function (err) {
                    if (err) {
                        res.send({ 'type': 'error', 'message': 'cant delete' });
                    }
                    res.send({ 'type': 'success', 'message': 'reporting removed' });
                });
            } else {
                res.send({ 'type': 'error', 'message': 'data not found' });
            }
        }
      
    });
}

//*************** END TWITTER  ******************/


//*************** TELEGRAM  ******************/

 

//*************** END TELEGRAM  ******************/

//***************** LINKEDIN  ********************/


 
//*************** END LINKEDIN  ******************/
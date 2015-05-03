/**
 * Created by lsd on 27/04/15.
 */
var OKCupid = require('okcupidjs');
var Q = require('q');
var privateConf = require('./config/private');

var girl = new OKCupid();

console.log("Welcome..");
girl.login(privateConf.username, privateConf.password)
    .then(function() {
        console.log("logged in");
        girl.loadAccessToken().then(function() {
            console.log("Loaded access token");
            forwardNewMessages(girl);
        }, function(error) {
            console.log("couldn't get conversations, error: " + error );
        });
    }, function(error) {
        console.log("couldn't login, error: " + error);
    });

function forwardNewMessages(cupidAccount) {
    var conversation = "9945336917231285831";
    cupidAccount.getConversation(conversation)
        .then(function(data) {
            if (data.body && data.body.messages && data.body.messages.length > 0) {
                console.log("Got messages");

                cupidAccount.deleteConversation(conversation)
                    .then(function () {
                        console.log("and deleted the conversation");
                        var sendingMessagePromises = [];
                        data.body.messages.reverse().forEach(function (message) {
                            if(!message.from_me) {
                                sendingMessagePromises.push(cupidAccount.sendMessage(message.senderid, conversation, message.body));
                            }
                        });

                        Q.all(sendingMessagePromises)
                            .then(function() {
                                setTimeout(forwardNewMessages.bind(this, cupidAccount), 5000);
                            });

                    });

            }
            else {
                console.log("no new messages");
                setTimeout(forwardNewMessages.bind(this, cupidAccount), 5000);
            }
        }, function(error) {
            console.log("couldn't get conversation, error: " + error)
        });
}
/**
 * Created by lsd on 27/04/15.
 */
var OKCupid = require('okcupidjs');
var Q = require('q');
var privateConf = require('./config/private');
var DB = new (require('./lib/db'))();

var accounts = {
    boy:  new OKCupid(),
    girl: new OKCupid()
};

Q.all([
    accounts.boy.login(privateConf.femaleAccount.username, privateConf.femaleAccount.password),
    accounts.girl.login(privateConf.femaleAccount.username, privateConf.femaleAccount.password)
]).then(function() {
    return Q.all([accounts.boy.loadAccessToken(), accounts.girl.loadAccessToken()]); // Load boy's and girl's access token
}).then(function() {
    console.log("[+] All set, acting as proxy");
    // Start forwarding messages for both sides
    //                 myReceiver      mySender       remoteReceiver     remoteSender
    forwardNewMessages("boy",         "girl",         "man",           "woman");
    forwardNewMessages("girl",          "boy",        "woman",             "man");
});

function forwardNewMessages(myReciever, mySender, remoteReceiver, remoteSender) {
    DB.getConversations().then(function(conversationsMap) {
        return Q.all(conversationsMap.map(function(conversation, conversationIndex) {
            // get the threads ids to the correct variables
            var incomingConversationId = conversation[myReciever + "_" + remoteSender + "_thread"];
            var outgoingConversationId = conversation[mySender + "_" + remoteReceiver + "_thread"];
            var messages = [];
            // check for new messages
            return accounts[myReciever].getConversation(incomingConversationId)
                .then(function(data) {
                    if(data.body && data.body.messages && data.body.messages.length > 0) {
                        messages = data.body.messages;
                        //console.log("[+] Got new messages");
                    }
                    else {
                        //console.log("[-] No new messages");
                    }
                    // we want to wait for the deletion of the conversation, but the data we need is the messages
                    return accounts[myReciever].deleteConversation(incomingConversationId).then(function() {
                        //console.log("[+] Deleted the conversation");
                    });
                })
                .then(function() {
                    return Q.all(messages.map(function(message) {
                        if(!message.from_me) {
                            remoteReceiver == "man" ? console.log("woman " + conversationIndex + ": " + message.body) : null;
                            remoteReceiver == "woman" ? console.log("man " + conversationIndex + ": " + message.body) : null;
                            return accounts[mySender].sendMessage(conversation[remoteReceiver + "Id"], outgoingConversationId, message.body);
                        }
                    }));
                })
        }))
    })
    .finally(function() {
        setTimeout(forwardNewMessages.bind(this, myReciever, mySender, remoteReceiver, remoteSender), 5000);
    });
}
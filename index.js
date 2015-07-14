/**
 * Created by lsd on 27/04/15.
 */
var OKCupid = require('okcupidjs');
var Q = require('q');
var privateConf = require('./config/private');

var conversationsMap = [
    {
        girl_woman_thread: "176416354434264977", // send as boy
        girl_man_thread: "3976064453378888284", // receive as girl
        womanId: "8442557319502001676", // Which girl are we talking to?
        manId: "4645160746334882753" // Which boy is sending us messages?
    },
    {
        girl_woman_thread: "2508393190606826185", // send as boy
        girl_man_thread: "2371371660163208327", // receive as girl
        womanId: "6166737178596815700", // Which girl are we talking to?
        manId: "6319660158626630938" // Which boy is sending us messages?
    },
    {
        girl_woman_thread: "5556454354854909739", // send as boy
        girl_man_thread: "2297910588570889704", // receive as girl
        womanId: "4199396990701358774", // Which girl are we talking to?
        manId: "7546041875731690613" // Which boy is sending us messages?
    },
    {
        girl_woman_thread: "8659079653999869691", // send as boy
        girl_man_thread: "3226376165939717040", // receive as girl
        womanId: "1112397400874198886", // Which girl are we talking to?
        manId: "6601530059872959021" // Which boy is sending us messages?
    }
];

var accounts = {
    boy:  new OKCupid(),
    girl: new OKCupid()
};

Q.all([
    accounts.boy.login(privateConf.maleAccount.username, privateConf.maleAccount.passwod),
    accounts.girl.login(privateConf.femaleAccount.username, privateConf.femaleAccount.passwod)
]).then(function() {
    return Q.all([accounts.boy.loadAccessToken(), accounts.girl.loadAccessToken()]); // Load boy's and girl's access token
}).then(function() {
    console.log("[+] All set, acting as proxy");
    // Start forwarding messages for both sides
    //                 myReceiver      mySender       remoteReceiver     remoteSender
    forwardNewMessages("girl",         "girl",         "woman",           "man");
    forwardNewMessages("girl",          "girl",        "man",             "woman");
});

function forwardNewMessages(myReciever, mySender, remoteReceiver, remoteSender) {
    Q.all(conversationsMap.map(function(conversation, conversationIndex) {
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
    .finally(function() {
        setTimeout(forwardNewMessages.bind(this, myReciever, mySender, remoteReceiver, remoteSender), 5000);
    });


}
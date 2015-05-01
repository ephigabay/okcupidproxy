/**
 * Created by lsd on 27/04/15.
 */
var OKCupid = require('okcupidjs');
var okcMethods = require('./lib/okcMethods');

var okc = new OKCupid();

var storage = [
    {
        receiverId: '18257544100032278490',
        receiverName: 'diethylamide',
        messagesHandeled: []
    }
];


okc.login('coralasaurustron', 'OKq45y0P', function(error, response) {
    if(response.headers.location && response.headers.location === '/home') {
   /*     okc.getConversations(function(conversations) {
            var unreadConversations = okcMethods.findUnreadMessages(conversations);
            console.log("all messages: " + conversations.length);
            console.log("unread messages: " + unreadConversations.length);
            okc.getConversation(unreadConversations[0].thread_id, function(error, response, body) {
                console.log(body);
            })
        })*/

        getNewMessagesForConversation("9945336917231285831");


       /* okc.sendMessage("18257544100032278490", "9945336917231285831", "testing", "1,0,1430496932,0x775b3c9b9255d99d;1c9e10861b19763f62bc55ed63f94d23fe57110f", function(error, response, body) {
            if(error) console.log("error: " + error);
            else console.dir(body);
        })*/
    }
    else {
        console.log("Error logging in.");
    }
});


function getNewMessagesForConversation(conversationId, callback) {
    okc.getConversation(conversationId, function(error, response, body) {
        console.log(body);
    })
}
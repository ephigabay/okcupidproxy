/**
 * Created by lsd on 27/04/15.
 */
var OKCupid = require('okcupidjs');
var okcMethods = require('./lib/okcMethods');

var okc = new OKCupid();

okc.login('coralasaurustron', 'OKq45y0P', function(error, response) {
    if(response.headers.location && response.headers.location === '/home') {
        okc.getConversations(function(conversations) {
            var unreadConversations = okcMethods.findUnreadMessages(conversations);
            console.log("all messages: " + conversations.length);
            console.log("unread messages: " + unreadConversations.length);
            okc.getConversation(unreadConversations[0].thread_id, function(error, response, body) {
                console.log(body);
            })
        })
    }
    else {
        console.log("Error logging in.");
    }
});

/**
 * Created by lsd on 28/04/15.
 */
function okcMethods() {}

okcMethods.findUnreadMessages = function(messages) {
    return messages.filter(function(message) {
        return message.msg_class == 'unreadMessage';
    })
};

module.exports = okcMethods;
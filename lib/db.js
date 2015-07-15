/**
 * Created by lsd on 28/04/15.
 */
var pmongo = require('promised-mongo').compatible();

var DB = function() {
    this.db = pmongo('mongodb://localhost:27017/okcupid');
    this.conversations = this.db.collection('conversations');
};

DB.prototype.insertConversation = function(boy_woman_thread, girl_man_thread, womanId, manId) {
    return this.conversations.save({
        boy_woman_thread: boy_woman_thread,
        girl_man_thread: girl_man_thread,
        womanId: womanId,
        manId: manId
    });
};

DB.prototype.getConversations = function() {
    return this.conversations.find().toArray();
};

module.exports = DB;
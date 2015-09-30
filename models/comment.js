var db = require('./db');

function Comment(name, title, content) {
    this.name = name;
    this.title = title;
    this.content = content;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
    var name = this.name,
        title = this.title,
        content = this.content;
    var query = 'INSERT comments(username, title, content) VALUES (?,?,?);';
    db.query(query, [name, title, content], function(error, results, field) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

Comment.get = function(title, callback) {
    var query = 'SELECT * FROM comments WHERE title=?;';
    db.query(query, [title], function(error, results, field) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}
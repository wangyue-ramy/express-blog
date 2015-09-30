var db = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback) {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    }

    var query = 'INSERT users (username, password, email) VALUES(?, ?, ?);'
    db.query(query, [user.name, user.password, user.email], function(error, results, field) {
        if (error) {
            console.log(error);
        } else {
            callback(null, user);
        }
    });
}

User.get = function(name, callback) {
    var query = 'SELECT * FROM users WHERE username=?';
    db.query(query, name, function(error, results, field) {
        if (results.length > 0) {
            callback(null, results);
        } else {
            callback(null, null);
        }
    });
}

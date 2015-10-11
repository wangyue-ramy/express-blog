var db = require('./db');
var markdown = require('markdown').markdown;

function Post(newPost) {
    this.name = newPost.name;
    this.title = newPost.title;
    this.post = newPost.post;
    this.tags = newPost.tags;
    this.top = newPost.top;
    this.dir = newPost.dir;
}

module.exports = Post;

Post.prototype.save = function(callback) {
    var post = {
        name: this.name,
        title: this.title,
        post: this.post,
        tags: this.tags,
        picTop: this.top,
        picDir: this.dir,
    }
    console.log(post);
    var query = 'INSERT articles (username, title, text, tags, picTop, picDir) VALUES(?, ?, ?, ?, ?, ?)';
    db.query(query, [post.name, post.title, post.post, post.tags, post.picTop, post.picDir], function(error, results, field) {
        if (error) {
            console.log(error);
        } else {
            callback();
        }
    });
}

Post.get = function(name, page, callback) {
    var start = (page - 1) * 12;
    var query = 'SELECT * FROM articles ' + (name ? 'WHERE username=? ' : '') + 'LIMIT ?,12;';
    var arr = name ? [name, start] : [start];
    db.query(query, arr, function(error, posts, field) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            posts.forEach(function(post) {
                post.text = markdown.toHTML(post.text);
            });
            posts = posts.reverse();
            var query = name ? 'SELECT COUNT(*) FROM articles WHERE username=?;' : 'SELECT COUNT(*) FROM articles;';
            db.query(query, name, function(error, results, field) {
                if (error) {
                    console.log(error);
                } else {
                    var total = results[0]['COUNT(*)'];
                    callback(null, posts, total);
                }
            });
        }
    });
}

Post.getOne = function(name, title, callback) {
    var query = 'SELECT * FROM articles WHERE title=? AND username=?';
    db.query(query, [title, name], function(error, results, field) {
        if (error) {
            callback(error, null);
        } else {
            results[0].text = markdown.toHTML(results[0].text);
            var query = 'UPDATE articles SET pv=pv+1 WHERE id=?;';
            db.query(query, [results[0].id], function(error, results, field) {});
            callback(null, results);
        }
    });
}

Post.edit = function(name, title, callback) {
    var query = 'SELECT * FROM articles WHERE title=? AND username=?';
    db.query(query, [title, name], function(error, results, field) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

Post.update = function(name, title, text, callback) {
    var query = 'UPDATE articles SET text=? WHERE username=? AND title=?';
    db.query(query, [text, name, title], function(error, results, field) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

Post.remove = function(name, title, callback) {
    var query = 'DELETE FROM articles WHERE username=? AND title=?';
    db.query(query, [name, title], function(error, results, field) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

Post.getArchive = function(callback) {
    var query = 'SELECT * FROM articles ORDER BY id DESC;';
    db.query = (query, function(error, results, field) {
        if (error) {
            console.log(error);
        } else {
            console.log(error);
            callback(null, results);
        }
    });
}

Post.getArticlesByTag = function() {

}

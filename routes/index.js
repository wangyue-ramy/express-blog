var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
var formidable = require('formidable');
formidable.IncomingForm.UPLOAD_DIR = 'h:/';


/* GET home page. */
function checkLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        res.redirect('back');
    }
    next();
}

router.get('/', function(req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Post.get(null, page, function(error, posts, total) {
        if (error) {
            posts = [];
        }
        posts.forEach(function(post, index) {
            post.tags = post.tags ? post.tags.split(',') : [];
            post.text = post.text.replace(/<\/?p>/g, '').slice(0, 100) + '...';
        });
        var context = {
            title: '主页',
            user: req.session.user,
            posts: posts,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 10 + posts.length) == total,
            page: page,
        }
        res.render('index', context);
    });
});

router.get('/screenshot', function(req, res) {
    res.render('screenshot', {
        title: '裁剪',
        user: req.session.user
    });
});


router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res) {
    res.render('reg', {
        title: '注册',
        user: req.session.user,
    });
});
router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        passwordCfm = req.body['password-confirm'],
        email = req.body.email;
    if (password != passwordCfm) {
        res.type('application/json');
        return res.send(JSON.stringify({
            code: 1,
            des: '两次密码不一致',
        }));
    }
    if (name.length < 6) {
        res.type('application/json');
        return res.send(JSON.stringify({
            code: 2,
            des: '用户名太短',
        }));
    }
    var newUser = new User({
        name: name,
        password: password,
        email: email
    });
    User.get(newUser.name, function(err, user) {
        if (user.length > 0) {
            res.type('application/json');
            return res.send(JSON.stringify({
                code: 3,
                des: '该用户已经注册'
            }));
        }
        newUser.save(function(err, user) {
            if (err) {
                return res.redirect('/reg');
            }
            req.session.user = user;
            res.type('application/json');
            return res.send(JSON.stringify({
                code: 4,
                redirect: '/'
            }));
        });
    });
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
    res.render('login', {
        title: '登录',
        user: req.session.user
    });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res) {
    var name = req.body.name,
        password = req.body.password;
    User.get(name, function(err, user) {
        console.log(user);
        user = user[0];
        res.type('application/json');
        if (!user) {
            return res.send(JSON.stringify({
                code: 1,
                des: '用户名不存在',
            }));
        }
        if (user.password != password) {
            return res.send(JSON.stringify({
                code: 2,
                des: '密码错误',
            }));
        }
        req.session.user = user;
        console.log('redirect');
        return res.send(JSON.stringify({
            code: 3,
            redirect: '/',
        }));
    });
});


router.get('/post', checkLogin);
router.get('/post', function(req, res) {
    res.render('post', {
        title: '发表',
        user: req.session.user
    });
});

router.post('/post', checkLogin);
router.post('/post', function(req, res) {

    var form = new formidable.IncomingForm();

    form.keepExtensions = true;


    form.uploadDir = './';

    form.parse(req, function(error, fields, files) {
        fs.rename(files.file.path, './public/images/' + files.file.name, function(error) {
            // var tags = [req.body.tag1, req.body.tag2, req.body.tag3].join(',');
            // if (tags == ',,') {
            //     tags = null;
            // }
            var newPost = new Post({
                name: req.session.user.username,
                title: fields.title,
                post: fields.post,
                tags: null,
                top: fields.picTop,
                dir: '/images/' + (files.file.name ? files.file.name : '1.jpg'),
            });
            newPost.save(function() {
                return res.redirect('/');
            });
        });
    });





});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

// router.get('/upload', checkLogin);
// router.get('/upload', function(req, res) {
//     res.render('upload', {
//         title: '文件上传',
//         user: req.session.user,
//     });
// });

// router.post('/upload', checkLogin);
// router.post('/upload', function(req, res) {
//     res.redirect('/upload');
// });

router.get('/u/:name', function(req, res) {
    User.get(req.params.name, function(err, user) {
        user = user[0];
        if (!user) {
            return res.redirect('/');
        }
        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.get(user.username, page, function(err, posts, total) {
            if (err) {
                return res.redirect('/');
            }
            posts.forEach(function(post, index) {
                post.tags = post.tags ? post.tags.split(',') : [];
                post.text = post.text.replace(/<\/?p>/g, '').slice(0, 100) + '...';
            });
            res.render('index', {
                title: user.username,
                posts: posts,
                user: req.session.user,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * 1 + posts.length) == total,
                page: page,
            });
        });
    });
});

router.get('/u/:name/:title', function(req, res) {
    Post.getOne(req.params.name, req.params.title, function(error, posts) {
        if (error) {
            return res.redirect('/');
        }
        Comment.get(req.params.title, function(error, comments) {
            if (error) {
                console.log(error);
            }
            posts.forEach(function(post, index) {
                post.tags = post.tags ? post.tags.split(',') : [];
            });
            res.render('article', {
                title: req.params.title,
                posts: posts,
                user: req.session.user,
                comments: comments
            });
        });

    });
});

// router.get('/archive/', function(req, res) {
//     Post.getArchive(function(err, posts) {
//         if (err) {
//             return res.redirect('/');
//         } else {
//             context = {
//                 title: '存档',
//                 posts: posts,

//             }
//             res.render('archive', )
//         }
//     });
// });

router.post('/u/:name/:title', function(req, res) {
    var name = req.body.name,
        title = req.params.title,
        content = req.body.content;
    var newComment = new Comment(name, title, content);
    if (name && title && content) {
        newComment.save(function(error, results) {
            if (error) {
                console.log(error);
            } else {
                var url = encodeURI('/u/' + req.params.name + '/' + req.params.title);
                return res.redirect(url);
            }
        });
    }
});

router.get('/edit/:name/:title', checkLogin);
router.get('/edit/:name/:title', function(req, res) {
    var currentUser = req.session.user;
    Post.edit(currentUser.username, req.params.title, function(error, posts) {
        if (error) {
            console.log(error);
            return res.redirect('back');
        } else {
            var post = posts[0];
            res.render('edit', {
                title: '编辑',
                post: post,
                user: currentUser
            });
        }
    });
});

router.post('/edit/:name/:title', checkLogin);
router.post('/edit/:name/:title', function(req, res) {
    var currentUser = req.session.user,
        text = req.body.text;
    Post.update(currentUser.username, req.params.title, text, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            var url = encodeURI('/u/' + req.params.name + '/' + req.params.title);
            return res.redirect(url);
        }
    });
});

router.get('/remove/:name/:title', checkLogin);
router.get('/remove/:name/:title', function(req, res) {
    var currentUser = req.session.user,
        title = req.params.title;
    Post.remove(currentUser.username, title, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            return res.redirect('/');
        }
    });
});

module.exports = router;

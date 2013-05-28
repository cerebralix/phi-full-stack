// Check if article is currently authenticated - GET

exports.authorized = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}
	next();
};

// List of all articles GET

exports.list = function(req, res){
	var Article = require('../models/article'),
		callback = function (err, articles) {
			res.render('./articles', { 
				title: 'Add Article!',
				path: '/createarticle',
				articles: articles
			})
		}

	Article.getArticle(null, callback);
};


// Show login form if logged out GET

exports.login = function(req, res){
	// Helper to create first db article on login
	// var Article = require('../models/article'),
	// article = new Article({
	// 			email: 'root@foo.bar', 
	// 			password: 'foo'
	// 		});

	// article.save();

	if(!req.isAuthenticated()) {
		res.render('./articles', { 
			title: 'Login!',
			path: '/login',
			article: { email: 'root@foo.bar', 
					password: 'foo'
				}
		});
	}
	else {
		res.redirect('/articles');
	};
};

// Edit Article GET

exports.editArticle = function(req, res){
	var id = req.params.articleid,
		Article = require('../models/article'),
		callback = function (err, articles) {
			var article = articles[0];
			console.log(article);
			article.canDelete = true;
			res.render('./articles', { 
				title: 'Edit ' + article.title + '!',
				path: '/updatearticle/' + article._id,
				returnPath: '/articles',
				article: article
			})
		};

	Article.getArticle(id, callback);
};

// Delete Article Confirm GET

exports.deleteArticle = function(req, res){
	var id = req.params.articleid,
		Article = require('../models/article'),
		callback = function (err, articles) {
			var article = articles[0];
			article.deleteConfirm = true;
			res.render('./articles', { 
				title: 'Delete ' + article.email + '?',
				path: '/articles/' + article._id + '/deletearticle',
				returnPath: '/articles',
				article: article
			})
		};

	Article.getArticle(id, callback);
};

// Delete Article - POST

exports.deleteArticleConfirmed = function(req, res) {
		var id = req.params.articleid,
		Article = require('../models/article'),
		callback = function (err, articles) {
			articles[0].remove();
			res.redirect('/articles');
		};

	Article.getArticle(id, callback);
};


// Create Article - POST

exports.createArticle = function(req, res) {
	var Article = require('../models/article'),
		article = new Article({
			title: req.body.articleTitle, 
			body: req.body.articleBody
		});

	article.save(function(err) {
		if(!err) {
			require('./mail').generic();
			res.redirect('/articles');
		}
	});
};

// Update Article - POST

exports.updateArticle = function(req, res) {
	var Article = require('../models/article'),
		id = req.params.articleid,
		article = {
			title: req.body.articleTitle, 
			body: req.body.articleBody
		};

	Article.findByIdAndUpdate(id, article, function(err, article) {
		if(!err) {
			require('./mail').generic();
			res.redirect('/articles');
		}
		else {
			res.redirect('/articles/' + id);
		}
	});
};
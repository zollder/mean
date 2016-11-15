
/* GET home page */
module.exports.index = function(req, res, next) {
	/* Note: render is an express function for compiling the view template into an HTML. */
	res.render('index', { title: 'Express' });
};
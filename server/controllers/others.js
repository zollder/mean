
/* About page controller. */
module.exports.about = function(req, res, next) {
	res.render('index', { title: 'About' });
};
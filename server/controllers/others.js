
/* About page controller. */
module.exports.about = function(req, res, next) {
	res.render('about', { title: 'About' });
};
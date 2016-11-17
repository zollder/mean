
/* About page controller. */
module.exports.about = function(req, res, next) {
	res.render('about', {
		content: {
			title: 'About',
			bodyContent: "MEAN playground app was created to try a MEAN stack. \n\n" +
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed lorem ac nisi dignissim accumsan."
		}	
	});
};
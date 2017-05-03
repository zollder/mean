
var mongoose = require( 'mongoose' );
var locationDao = mongoose.model('Location');
var userDao = mongoose.model('User');

/* Utility function to build API response with specified status and content. */
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.jsonp(content);
};

/**
 * Loads and returns a review sub-document by specified location and review IDs.
 */
module.exports.getReviewById = function(req, res) {
	if (!req.params || !req.params.locationId || !req.params.reviewId) {
		sendJsonResponse(res, 404, { "message":"Missing locationId or reviewId."});
		return;
	}
	
	locationDao.findById(req.params.locationId)
		.select('name reviews')
		.exec(
			function(error, location) {
				var response, review;
				if (!location) {
					sendJsonResponse(res, 404, { "message":"Location not found, ID:" + req.params.locationId });
					return;
				}
				if (error) {
					sendJsonResponse(res, 404, error);
					return;
				}
				if (!location.reviews || location.reviews.length == 0) {
					sendJsonResponse(res, 404, { "message":"No reviews found." });
					return;
				}

				console.log("Reviews length:" + location.reviews.length);
				review = location.reviews.id(req.params.reviewId);
				if (!review) {
					sendJsonResponse(res, 404, { "message":"Review not found, ID:" + req.params.reviewId });
					return;
				} else {
					response = {
						location : {
							name : location.name,
							id : req.params.locationId
						},
						review : review
					};
					sendJsonResponse(res, 200, response);
				}
			}
		);
};

/**
 * Adds a new review sub-document to an existing location document
 * with specified location ID.
 */
module.exports.createReview = function(req, res) {
	if (!req.params || !req.params.locationId) {
		sendJsonResponse(res, 404, { "message":"Missing or invalid locationId."});
		return;
	}
	// wrap review creator into getAuthor to validate the user and return a username, if exists
	// pass username into callback
	getAuthor(req, res,	function(req, res, username) {	// wrap review creation into callback
		locationDao.findById(req.params.locationId)
			.select('reviews')
			.exec(
				function(error, location) {
					if (error) {
						sendJsonResponse(res, 404, error);
						return;
					} else if (!location) {
						sendJsonResponse(res, 404, { "message":"Location not found, ID:" + req.params.locationId });
						return;
					} else {
						addReview(req, res, location, username);
					}
				}
			);		
	});
};

/**
 * Updates an existing review sub-document of an existing locusernameation document.
 */
module.exports.updateReview = function(req, res) {
	if (!req.params) {
		sendJsonResponse(res, 404, { "message":"Undefined request parameters."});
		return;
	}

	var locationId = req.params.locationId;username
	var reviewId = req.params.reviewId;
	if (!locationId || !reviewId) {
		sendJsonResponse(res, 404, { "message":"Missing location and/or review ID."});
		return;
	}

	locationDao.findById(locationId)
		.select('reviews')
		.exec(
			function(error, location) {
				if (error) {
					sendJsonResponse(res, 404, error);
					return;
				}

				if (!location) {
					sendJsonResponse(res, 404, { "message":"Location not found, ID:" + locationId });
					return;
				}

				if (location.reviews && location.reviews.length > 0) {
					var review = location.reviews.id(reviewId);
					if (!review) {
						sendJsonResponse(res, 404, { "message":"Review not found, ID:" + reviewId});
						return;
					}

					review.author = req.body.author ? req.body.author : review.author;
					review.rating = req.body.rating ? req.body.rating : review.rating;
					review.reviewText = req.body.reviewText ? req.body.reviewText : review.reviewText;
					location.save(function(err, location) {
						var savedReview;
						if (err) {
							sendJsonResponse(res, 404, err);
						} else {
							updateAverageRating(location._id);
							sendJsonResponse(res, 201, review);
						}
					});
					
				} else {
					sendJsonResponse(res, 404, { "message":"Review not found, ID:" + reviewId});
				}
			}
		);
};

/**
 * Removes/deletes an existing review sub-document from the location with specified ID.
 */
module.exports.removeReview = function(req, res) {
	if (!req.params) {
		sendJsonResponse(res, 404, { "message":"Undefined parameters."});
		return;
	}

	var locationId = req.params.locationId;
	var reviewId = req.params.reviewId;
	if (!locationId || !reviewId) {
		sendJsonResponse(res, 404, { "message":"Missing location and/or review ID."});
		return;
	}
	
	locationDao.findById(locationId)
		.select('reviews')
		.exec(function(error, location) {
			if (error) {
				sendJsonResponse(res, 404, error);
				return;
			}
			if (!location) {
				sendJsonResponse(res, 404, error);
				return;
			}
			if (!location.reviews || !(location.reviews.length > 0)) {
				sendJsonResponse(res, 404, { "message":"No reviews found"});
				return;
			}

			location.reviews.id(reviewId).remove();
			location.save(function(error, location) {
				if (error) {
					sendJsonResponse(res, 404, error);
				} else {
					updateAverageRating(location._id);
					sendJsonResponse(res, 204, null);
				}
			});
		});
};

/*
 * Finds user name for specified email and passes it to a given callback.
 */
var getAuthor = function(req, res, callback) {
	if (!req.payload || !req.payload.email) {
		sendJsonResponse(res, 404, { "message":"Missing user email"});
		return;
	}
	userDao.findOne({ email:req.payload.email })
		.exec(function(error, user) {
			if (error) {
				console.log(error);
				sendJsonResponse(res, 400, error);
				return;
			} else if (!user) {
				sendJsonResponse(res, 404, { "message":"User not found"});
				return;
			} else {
				callback(req, res, user.name);
			}
		});
};

/*
 * Parses and saves user review with associated reviewer details.
 */
var addReview = function(req, res, location, author) {
	location.reviews.push({
		author: author,
		rating: req.body.rating,
		reviewText: req.body.reviewText
	});
	location.save(function(err, location) {
		var savedReview;
		if (err) {
			console.log(err);
			sendJsonResponse(res, 400, err);
		} else {
			updateAverageRating(req.params.locationId)
			// retrieve and return the last sub-document (review)
			savedReview = location.reviews[location.reviews.length - 1];
			sendJsonResponse(res, 201, savedReview);
		}
	});
};

/* Recalculates and updates average location rating. */
var updateAverageRating = function(locationId) {
	locationDao.findById(locationId)
	.select('rating reviews')
	.exec(
		function(error, location) {
			if (error) {
				console.log(error);
				return;
			}
			
			var reviewCount, totalRating, averageRating;
			if (location.reviews && location.reviews.length > 0) {
				reviewCount = location.reviews.length;
				totalRating = 0;
				for (i=0; i<reviewCount; i++) {
					totalRating = totalRating + location.reviews[i].rating;
				}
				averageRating = parseInt(totalRating/reviewCount, 10);
				location.rating = averageRating;
				location.save(function(err) {
					if (err) {
						console.log(error);
					} else {
						console.log("Re-calculated average rating: "+ averageRating);
					}
				});
			}
		}
	);
}

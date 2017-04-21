var express = require('express');
var router = express.Router();

/* Import API controllers */
var locationsCtrl = require('../controllers/locations');
var reviewsCtrl = require('../controllers/reviews');
var authenticationCtrl = require('../controllers/authentication');

/* Map URLs to API controller functions. */

/* -----------------------Locations----------------------- */

/** Loads and returns a list of locations. */
router.get('/locations', locationsCtrl.getLocationsByDistance);

/** Loads and return a location by specified ID. */
router.get('/locations/:locationId', locationsCtrl.getLocationById);

/** Creates a new location. */
router.post('/locations', locationsCtrl.createLocation);

/** Updates an existing location with specified ID. */
router.put('/locations/:locationId', locationsCtrl.updateLocation);

/** Removes location with specified location ID. */
router.delete('/locations/:locationId', locationsCtrl.removeLocation);

/* ---------------------- Reviews----------------------- */

/** Loads and returns review sub-document by specified location and review IDs. */
router.get('/locations/:locationId/reviews/:reviewId', reviewsCtrl.getReviewById);

/** Adds a review to an existing location document with specified locationId. */
router.post('/locations/:locationId/reviews', reviewsCtrl.createReview);

/** Updates location review for specified location and review IDs. */
router.put('/locations/:locationId/reviews/:reviewId', reviewsCtrl.updateReview);

/** Removes a review with specified ID from an existing location. */
router.delete('/locations/:locationId/reviews/:reviewId', reviewsCtrl.removeReview);

/* ---------------------- Authentication----------------------- */
router.post('/register', authenticationCtrl.register);
router.post('/login', authenticationCtrl.login);

module.exports = router;

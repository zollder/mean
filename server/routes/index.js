var express = require('express');
var router = express.Router();

/* Import controllers */
var locationsCtrl = require('../controllers/locations');
var othersCtrl = require('../controllers/others');

/* Map URLs to controller functions. */

/* Location pages. */
router.get('/', locationsCtrl.home);
router.get('/location', locationsCtrl.locationInfo);
router.get('/location/review', locationsCtrl.addReview);

/* Other pages. */
router.get('/about', othersCtrl.about);

module.exports = router;

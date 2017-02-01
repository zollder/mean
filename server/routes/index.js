var express = require('express');
var router = express.Router();

/* Import controllers */
var locationsCtrl = require('../controllers/locations');
var othersCtrl = require('../controllers/others');

/* Map URLs to controller functions. */

/* Location pages. */
router.get('/', locationsCtrl.home);
router.get('/location/:locationId', locationsCtrl.locationInfo);
router.get('/location/:locationId/review', locationsCtrl.addReview);
router.post('/location/:locationId/review', locationsCtrl.saveReview);

/* Other pages. */
router.get('/about', othersCtrl.about);

module.exports = router;


/* Location-related controllers. */
module.exports.home = function(req, res, next) {
	res.render('locations-list', {
		title: 'MEAN - find a place to work with WiFi',
		pageHeader: {
			title: 'WiFi Locations: ',
			strapline: 'free nearby WiFi spots'
		},
		locations: [
            {
            	name: 'Starcups',
            	address: '125 High Street, Reading, RG6 1PS',
            	rating: 3,
            	facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
            	distance: '100m'
    		},
            {
            	name: 'Second Cup',
            	address: '300 High Street, London, RG6 1PS',
            	rating: 4,
            	facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
            	distance: '300m'
    		},
            {
            	name: 'Starbucks',
            	address: '23 Low Street, Dublin, RG6 1PS',
            	rating: 5,
            	facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
            	distance: '800m'
    		}
        ],
        sidebar: "Looking for wifi and a seat? We help you find places to work when out and about." +
        		"Perhaps with coffee, cake or a pint? Let us help you find the place you're looking for."
	});
};

module.exports.locationInfo = function(req, res, next) {
	res.render('location-info', {
		title: 'Location Info',
		pageHeader: { title: 'Starcups' },
		sidebar: {
			context: "Simon's cafe is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
			callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
		},
		location: {
			name: 'Starcups',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
			coordinates: {lat: 51.455041, lng: -0.9690884},
			openingTimes: [
	   			{
	   				days: 'Monday - Friday',
	   				opening: '7:00am',
	   				closing: '7:00pm',
	   				closed: false
	   			},
	   			{
	   				days: 'Saturday',
	   				opening: '8:00am',
	   				closing: '5:00pm',
	   				closed: false
	   			},
	   			{
	   				days: 'Sunday',
	   				closed: true
	   			}
			]
		},
		reviews: [
	        {
	        	author: 'Zollder',
	        	rating: 5,
	        	timestamp: '16 July 2013',
	        	reviewText: "What a great place. I can't say enough good things about it."
			},
	        {
	        	author: 'Axe Thrower',
	        	rating: 3,
	        	timestamp: '10 September 2016',
	        	reviewText: "It was okay. Coffee wasn't great, but the wifi was fast."
			}
	    ]
	});
};

module.exports.addReview = function(req, res, next) {
	res.render('location-review-form', {
		submitButton: { title: 'Add Review' },
		pageHeader: { title: 'Review Starcups' },
	});
};
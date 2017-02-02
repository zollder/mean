var mongoose = require( 'mongoose' );

var openingTimeSchema = new mongoose.Schema({
	days: {
		type:String,
		required:true
	},
	opening: String,
	closing: String,
	closed: {
		type:Boolean,
		required:true
	}
});

var reviewSchema = new mongoose.Schema({
	author: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true,
		min: 0,
		max: 5
	},
	reviewText: {
		type: String,
		required: true
	},
	createdOn: {
		type:Date,
		"default": Date.now
	}
});

var locationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	address: String,
	rating: {
		type:Number,
		"default":0,
		min:0,
		max:5
	},
	facilities: [String],
	geolocation: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [Number]		// preserve the order: [longitude, latitude]
	},
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema]
});
// define an index for GEO location
locationSchema.index({ geolocation:'2dsphere'});

mongoose.model('Location', locationSchema);


/**
 * http://geojson.org/geojson-spec.html#examples
 */


const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/aws_transcribe`,function(err,db){
// 	if(err){
// 		console.log("db conn error")
// 	}else{
// 		console.log("connected to db")
// 	}
// });

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
	accessKeyId: 'AKIARSINFC5HK7SMUQHI',
	secretAccessKey: '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',
	Bucket: 'my-audio-analysis'
});

const s3_2 = new aws.S3({
	accessKeyId: 'AKIARSINFC5HK7SMUQHI',
	secretAccessKey: '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',
	Bucket: 'my-audio-comprehend'
});

const profileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'my-audio-analysis',
		acl: 'public-read',
		key: function (req, file, cb) {
			//cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
			cb(null, path.basename( file.originalname, "audioFolder/"+path.extname( file.originalname ) ) )
		}
	}),
	limits:{ fileSize: 2000000000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).single('profileImage');

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
	// Allowed ext
	const filetypes = /mp3|wav/;
	// Check ext
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	// Check mime
	const mimetype = filetypes.test( file.mimetype );
	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: Audio Only!' );
	}
}

/**
 * @route POST /api/profile/business-img-upload
 * @desc Upload post image
 * @access public
 */
router.post( '/profile-img-upload', ( req, res ) => {

	console.log("Uploaded res:"+JSON.stringify(res,null,1))

	profileImgUpload( req, res, ( error ) => {

			
			var my_files = [];
			console.log("Indide api call")
			
			var params = {Bucket: "my-audio-comprehend"};
			new aws.S3().listObjects(params, function(err, json_data)
				{
				if (!err) {
				var my_Contents = json_data.Contents;

				my_Contents.forEach(element => {
					//console.log("Elemenst:",element)
					my_files.push(element.Key);
				});

				my_files.forEach(key => {
					var params = {Bucket: "my-audio-comprehend", Key: key};
					new aws.S3().getObject(params, function(err, json_data)
						{
						if (!err) {
							var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
							console.log("Data in json:",key, " ==>" ,json)
						}else{
							console.log("Error in reading:",err)
						}
					});
				});

				}else{
					console.log("Error in reading:",err)
				}
			});

		console.log( '\n------------------\nrequestOkokok', req.file );
		console.log( 'error', error );
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.file === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				const imageName = req.file.key;
				const imageLocation = req.file.location;
// Save the file name into database into profile model
				res.json( {
					image: imageName,
					location: imageLocation
				} );
			}
		}
	});
});

router.get( '/getRes', ( req, res ) => { console.log("Hello from api") ;return "1"});

/**
 * BUSINESS GALLERY IMAGES
 * MULTIPLE FILE UPLOADS
 */
// Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'my-audio-analysis',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 20000000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).array( 'galleryImage',200);
/**
 * @route POST /api/profile/multiple-file-upload
 * @desc Upload business Gallery images
 * @access public
 */
router.post('/multiple-file-upload', ( req, res ) => {
	
	uploadsBusinessGallery( req, res, ( error ) => {
		//console.log( 'files', req.files ); //send in mongo
		req.files.map((yell) => {
			//console.log("Yell:",yell);

			mongoose.connect("mongodb://localhost:27017/aws_transcribe", function (err, db) {

				var collection = db.collection('aws');
				// Insert some documents
				//db.collection.find({'PlayerScores.0' : {$exists: true}}).count();

				if(collection.find({"fileName":yell.originalname})){
					console.log("For "+yell.originalname+" its not there");

					collection.insertOne(
									{
										fileName: yell.originalname, 
										sentiResult: '',
										positive : '',
										negative:'',
										neutral :'',
										mixed:''
									}
									  ,function(err, result) {
									  if(err) console.log("error:",err)
											console.log("Inserted 1 document into the collection");
									  });	

				}else{
					console.log("present "+yell.originalname)
				}
							
			});
		})


		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.files === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				let fileArray = req.files,
					fileLocation;
				const galleryImgLocationArray = [];
				for ( let i = 0; i < fileArray.length; i++ ) {
					fileLocation = fileArray[ i ].location;
					console.log( 'filenm', fileLocation );
					galleryImgLocationArray.push( fileLocation )
				}
				// Save the file name into database
				res.json( {
					filesArray: fileArray,
					locationArray: galleryImgLocationArray
				} );
			}
		}
	});
});

module.exports = router;
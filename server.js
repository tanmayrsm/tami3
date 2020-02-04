const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const path = require( 'path' );

const router = express.Router();

const fs = require('fs');
const app = express();
const aws = require( 'aws-sdk' );


/**
 * Configure the middleware.
 * bodyParser.json() returns a function that is passed as a param to app.use() as middleware
 * With the help of this method, we can now send JSON to our express application.
 */
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

const profile = require( './routes/api/profile' );
app.use( '/api/profile', profile );


const s3 = new aws.S3({
	accessKeyId: 'AKIARSINFC5HK7SMUQHI',
	secretAccessKey: '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',
	Bucket: 'my-audio-analysis'
});
app.get('/api/hello', (req, res) => {
	//res.send({ express: 'Hello From Express' });
	my_files = [];
	sentis = [];
	var params = {Bucket: "my-audio-comprehend"};
			new aws.S3().listObjects(params, function(err, json_data)
				{
				if (!err) {
					//var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
				//console.log("Data:",json_data.Contents)
				var my_Contents = json_data.Contents;

				my_Contents.forEach(element => {
					//console.log("Elemenst:",element)
					my_files.push(element.Key);
				});
				var n = my_files.length;
				var i = 0;

				my_files.forEach(key => {
					
					var params = {Bucket: "my-audio-comprehend", Key: key};
					new aws.S3().getObject(params, function(err, json_data)
						{
						if (!err) {
							console.log("json data:",json_data.Body)
							var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
							//console.log("Data in key:",key, " ==>" ,json)
							sentis.push(json);
							i = i+1;
							if(i == my_files.length){
								console.log("finale:",sentis);
								res.send(sentis)
							}
							//console.log("sentsi is foreach=>",sentis)
						}else{
							console.log("Error in reading:",err)
						}
					});
				
				});
				//console.log("Final Sentis:",sentis)
				
				}else{
					console.log("Error in reading:",err)
				}
			});

			



  });

// We export the router so that the server.js file can pick it up
module.exports = router;

// Combine react and node js servers while deploying( YOU MIGHT HAVE ALREADY DONE THIS BEFORE
// What you need to do is make the build directory on the heroku, which will contain the index.html of your react app and then point the HTTP request to the client/build directory

if ( process.env.NODE_ENV === 'production' ) {
	// Set a static folder
	app.use( express.static( 'client/build' ) );
	app.get( '*', ( req, res ) => res.sendFile( path.resolve( __dirname, 'client', 'build', 'index.html' ) ) );

}

// Set up a port
const port = process.env.PORT || 5000;

app.listen( port, () => console.log( `Server running on port: ${port}` ) );
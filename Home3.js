import React, { Component ,Fragment} from 'react';
import axios from 'axios';
import $ from 'jquery';
const athena = require( 'athena-client' );
// const aws = require( 'aws-sdk' );



class Home extends Component {

	constructor( props ) {
	  super( props );
	  this.state = {
	   selectedFile: null,
	   selectedFiles: null,
	   sentiments:[],
	   uploaded_files : []
	  }
	}

	cham = () => {
			//data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
			axios.get(`/api/hello`)
			.then(res => {
			  const persons = res.data;
			  //console.log(persons);
			  this.setState({
				sentiments:res.data
				})
			});
	}
	
	zega = (filesObject) => {
		let file_names_yo_be_uploaded = [];
		Array.from(filesObject).forEach(file => { file_names_yo_be_uploaded.push(file.name) })
		//console.log("Uploaded file names:",file_names_yo_be_uploaded)
		this.setState({
			uploaded_files : file_names_yo_be_uploaded
		})
	}
	singleFileChangedHandler = ( event ) => {
	  this.setState({
	   selectedFile: event.target.files[0]
	  });
	  console.log("sel file:",event.target.files[0])
	 };
	multipleFileChangedHandler = (event) => {
	  this.setState({
	   selectedFiles: event.target.files
	  });
	  this.zega(event.target.files);
	  
	  console.log( event.target.files );
	 };
	 
	 
	 ///////////////////////
	 singleFileUploadHandler = ( event ) => {
				const data = new FormData();
		// If file selected
				if ( this.state.selectedFile ) {
					data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
					axios.post( '/api/profile/profile-img-upload', data, {
						headers: {
							'accept': 'application/json',
							'Accept-Language': 'en-US,en;q=0.8',
							'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
						}
					})
						.then( ( response ) => {
							if ( 200 === response.status ) {
								// If file size is larger than expected.
								if( response.data.error ) {
									if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
										this.ocShowAlert( 'Max size: 2MB', 'red' );
									} else {
										console.log( response.data );
		// If not the given file type
										this.ocShowAlert( response.data.error, 'red' );
									}
								} else {
									// Success
									let fileName = response.data;
									console.log( 'filedata', fileName );
									this.ocShowAlert( 'File Uploaded', '#3089cf' );
								}
							}
						}).catch( ( error ) => {
						// If another error
						console.log("Error:",error);
						this.ocShowAlert( error, 'red' );
					});
				} else {
					console.log("Pls select file")
					// if file not selected throw error
					//this.ocShowAlert( 'Please upload file', 'red' );
				}
			};

			multipleFileUploadHandler = () => {
				const data = new FormData();
				let selectedFiles = this.state.selectedFiles;
		// If file selected
				if ( selectedFiles ) {
					for ( let i = 0; i < selectedFiles.length; i++ ) {
						data.append( 'galleryImage', selectedFiles[ i ], selectedFiles[ i ].name );
					}
					axios.post( '/api/profile/multiple-file-upload', data, {
						headers: {
							'accept': 'application/json',
							'Accept-Language': 'en-US,en;q=0.8',
							'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
						}
					})
						.then( ( response ) => {
							console.log( 'res', response );
							if ( 200 === response.status ) {
								// If file size is larger than expected.
								if( response.data.error ) {
									if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
										this.ocShowAlert( 'Max size: 2MB', 'red' );
									} else if ( 'LIMIT_UNEXPECTED_FILE' === response.data.error.code ){
										this.ocShowAlert( 'Max 4 images allowed', 'red' );
									} else {
										// If not the given ile type
										this.ocShowAlert( response.data.error, 'red' );
									}
								} else {
									// Success
									let fileName = response.data;
									console.log( 'fileName', fileName );
									this.ocShowAlert( 'File Uploaded', '#3089cf' );
								}
							}
						}).catch( ( error ) => {
						// If another error
						this.ocShowAlert( error, 'red' );
					});
				} else {
					// if file not selected throw error
					this.ocShowAlert( 'Please upload file', 'red' );
				}
			};

			getResults = ( event ) => {
				//const data = new FormData();
		// If file selected
				if ( true ) {
					//data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
					axios.post( '/api/profile/getRes',  {
					})
						.then( ( response ) => {
							if ( 200 === response.status ) {
								// If file size is larger than expected.
								if( response.data.error ) {
									if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
										this.ocShowAlert( 'Max size: 2MB', 'red' );
									} else {
										console.log( response.data );
		// If not the given file type
										this.ocShowAlert( response.data.error, 'red' );
									}
								} else {
									// Success
									let fileName = response.data;
									console.log( 'filedata', fileName );
									this.ocShowAlert( 'File Uploaded', '#3089cf' );
								}
							}
						}).catch( ( error ) => {
						// If another error
						console.log("Error:",error);
						this.ocShowAlert( error, 'red' );
					});
				} else {
					console.log("Pls select file")
					// if file not selected throw error
					//this.ocShowAlert( 'Please upload file', 'red' );
				}
			};


			//ShowAlert Function
			ocShowAlert = ( message, background = '#3089cf' ) => {
				let alertContainer = document.querySelector( '#oc-alert-container' ),
					alertEl = document.createElement( 'div' ),
					textNode = document.createTextNode( message );
				alertEl.setAttribute( 'class', 'oc-alert-pop-up' );
				$( alertEl ).css( 'background', background );
				alertEl.appendChild( textNode );
				//alertContainer.appendChild( alertEl );
				setTimeout( function () {
					$( alertEl ).fadeOut( 'slow' );
					$( alertEl ).remove();
				}, 3000 );
			};
	
	render() {
		return(
			<div className="container">
				{/* For Alert box*/}
				<div id="oc-alert-container"></div>
				{/* Single File Upload*/}
				{/* <div className="card border-light mb-3 mt-5" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
					<div className="card-header">
						<h3 style={{ color: '#555', marginLeft: '12px' }}>Single Audio Upload</h3>
						<p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: - </p>
					</div>
					<div className="card-body">
						<p className="card-text">Please upload an audio</p>
						<input type="file" onChange={this.singleFileChangedHandler}/>
						<div className="mt-5">
							<button className="btn btn-info" onClick={this.singleFileUploadHandler}>Upload!</button>
						</div>
					</div>
				</div>
				Multiple File Upload */}
				<div className="card border-light mb-3" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
					<div className="card-header">
						<h3 style={{ color: '#555', marginLeft: '12px' }}>Upload Muliple audios</h3>
						<p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size - </p>
					</div>
					<div className="card-body">
						<p className="card-text">You can add multiple audios at a time from here</p>
						<input type="file" multiple onChange={this.multipleFileChangedHandler}/>
						<div className="mt-5">
							<button className="btn btn-info" onClick={this.multipleFileUploadHandler}>Upload!</button>
						</div>
					</div>
				</div>

				{/* get results of query */}

				<div className="card border-light mb-3" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
					<div className="card-header">
						<h3 style={{ color: '#555', marginLeft: '12px' }}>Get results</h3>
					</div>
					<div className="card-body">
						<p className="card-text">Please click below to get query results from aws athena</p>
						<p className="card-text">Selected files:
						{this.state.selectedFiles != null ? 
							<div>
								{console.log(this.state.uploaded_files)}
								
							</div>:
							<div></div>	
						}
						
						</p>
						<div className="mt-5">
							<button className="btn btn-info" onClick={this.cham}>Get results ?</button>
						</div>
						
						{this.state.sentiments.length > 0 ?
						<div>
							<table class="table">
								<th scope="col">Name of file</th>
								<th scope="col">Sentiment result</th>
								<th scope="col">Positive score(%)</th>
								<th scope="col">Negative score(%)</th>
								<th scope="col">Neutral score(%)</th>
								<th scope="col">Mixed</th>

						 {/* {console.log("Sentiments:",JSON.stringify(this.state.sentiments ,null ,1))} */}
						   {this.state.sentiments.map((listItems) => (
							 <Fragment>
							   {listItems.map((eachThing) =>
							   
							   eachThing.Sentiment==="POSITIVE" ? 
							   <tr class="table-success">
									<td>{eachThing.file_name}</td>
									<td>{eachThing.Sentiment}</td>
									<td>{(eachThing.SentimentScore.Positive*100).toFixed(4)}</td>
									<td>{(eachThing.SentimentScore.Negative*100).toFixed(4)}</td>
									<td>{(eachThing.SentimentScore.Neutral*100).toFixed(4)}</td>
									<td>{eachThing.SentimentScore.Mixed.toFixed(4)}</td>
						  		</tr>
							:
							eachThing.Sentiment==="NEGATIVE" ? 
							   <tr class="table-danger">
									<td>{eachThing.file_name}</td>
									<td>{eachThing.Sentiment}</td>
									<td>{(eachThing.SentimentScore.Positive*100).toFixed(4)}</td>
									<td>{(eachThing.SentimentScore.Negative*100).toFixed(4)}</td>
									<td>{(eachThing.SentimentScore.Neutral*100).toFixed(4)}</td>
									<td>{eachThing.SentimentScore.Mixed.toFixed(4)}</td>
								  </tr>
								  :
								  eachThing.Sentiment==="NEUTRAL" ? 
							   <tr class="table-warning">
									<td>{eachThing.file_name}</td>
									<td>{eachThing.Sentiment}</td>
									<td>{(eachThing.SentimentScore.Positive*100).toFixed(4)}</td>
									<td>{(eachThing.SentimentScore.Negative*100).toFixed(4)}</td>
									<td>{(eachThing.SentimentScore.Neutral*100).toFixed(4)}</td>
									<td>{eachThing.SentimentScore.Mixed.toFixed(4)}</td>
								  </tr>:
								  <div></div>	
							   )}
							 </Fragment>
						   ))}
						</table>
					   </div>

					  
						:<div>No sentis</div>}
					</div>
				</div>


			</div>
		);
	}
}

export default Home;
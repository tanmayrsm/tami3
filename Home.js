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
	   selectedFiles_arr : [],
	   sentiments:[],
	   uploaded_files : [],
	   res_files : [],
	   dum : [],
	   dum2 : [],
	   see_files : false
	  }
	}

	cham = () => {

			//data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
			axios.get(`/api/hello`)
			.then(res => {
			  const persons = res.data;
			  //console.log(persons);
			  this.setState({
				sentiments:res.data,
				see_files : true
				})
			});

			console.log("This.sentiments:",this.json(this.state.sentiments))
			console.log("This.result:",this.json(this.state.res_files))
			console.log("This.uploaded:",this.json(this.state.uploaded_files))
			console.log("This.see files:",this.state.see_files)
			
	}

	check2 = (fileName) => {
		var fileName = fileName.replace(".mp3","");
		fileName = fileName.replace(".wav","");

		var found = false;
		let arr = this.state.sentiments;
		for (var i = 0; i < arr.length; i++) {
			 console.log("arr[i]:"+JSON.stringify(arr[i],null,1))
			 if(arr[i][0].file_name.includes(".json")){
				arr[i][0].file_name = arr[i][0].file_name.replace(".json","");
			 }
			 console.log("two compared names:"+arr[i][0].file_name+"==>"+fileName)
			if (arr[i][0].file_name === fileName) {
				found = true;
				break;
			}
		}
		console.log("Arr:"+this.state.uploaded_files);
		
		console.log("File name to search:"+fileName+" ->found:"+found);
		return found;
	}

	check3 = (filename,arr) => {
		var fileName = fileName.replace(".mp3","");
		fileName = fileName.replace(".wav","");

		var found = false;
		
		for (var i = 0; i < arr.length; i++) {
			 console.log("arr[i]:"+JSON.stringify(arr[i],null,1))
			 console.log("two compared names:"+arr[i][0].file_name+"==>"+fileName)
			if (arr[i][0].file_name === fileName) {
				found = true;
				break;
			}
		}
		console.log("Arr:"+this.state.uploaded_files);
		console.log("File name to search:"+fileName+" ->found:"+found);
		return found;
	}
	sameer = (fileName) => {

		// console.log("Sameer for:"+fileName)

		var fileName = fileName.replace(".mp3","");
		fileName = fileName.replace(".wav","");
		
		this.state.sentiments.map((listItems) => {
			  listItems.map((eachThing) => {
				  
				  if(eachThing.file_name === fileName)
				  {
					  this.state.res_files.push(eachThing);
				  }
			  }
			)
		}	
	)
	return false;
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
	   selectedFiles: event.target.files,
	   see_files : false,
	   sentiments : [],
	   dum2:[],
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
								this.setState({
									see_files : true
								})
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

			uniq(a) {
				let arr = Array.from(new Set(a));
				return arr;
			}

			json = (num) => {
				return JSON.stringify(num,null,1)
			}
	joga = (num,arr) => {
		let i = 0;
		for(i = 0;i<arr.length ;i++){
			//console.log("num and arr[i]:"+this.json(num)+"--0->"+this.json(arr[i]))
			if (num === arr[i]){
				//console.log("returning fasle")
				return false;
			}
		}
		this.state.dum.push(num)
		//console.log("returning true")
		return true;
	}

	joga2 = (file_name,arr) => {
		let file = file_name.replace(".mp3","");
		let file2 = file.replace(".wav","");
 
		let i = 0;
		for(i = 0;i<arr.length ;i++){
			console.log("num and arr[i]:"+file2+"--0->"+arr[i])
			if (file2 === arr[i]){
				console.log("returning fasle")
				return false;
			}
		}
		this.state.dum2.push(file2)
		console.log("returning true")
		return true;
	}

	
	
	render() {
		return(
			<div className="container">
				{/* For Alert box*/}
				<div id="oc-alert-container"></div>
				
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
						<p className="card-text">
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

								

							{this.state.uploaded_files.map((file_Uploaded_name) => (
							 <Fragment>
								 {this.check2(file_Uploaded_name) ? 
								 	<Fragment>
										 {this.sameer(file_Uploaded_name)}

										 {this.state.res_files.map((num) => (
											 	
												this.joga(num,this.state.dum) ? 
												// <p>{num.file_name}</p>
												
												num.Sentiment === "POSITIVE" ? 
												<tr class="table-success">
														<td>{num.file_name}</td>
														<td>{num.Sentiment}</td>
														<td>{(num.SentimentScore.Positive*100).toFixed(4)}</td>
														<td>{(num.SentimentScore.Negative*100).toFixed(4)}</td>
														<td>{(num.SentimentScore.Neutral*100).toFixed(4)}</td>
														<td>{num.SentimentScore.Mixed.toFixed(4)}</td>
													</tr>
												:
												num.Sentiment==="NEGATIVE" ? 
												<tr class="table-danger">
														<td>{num.file_name}</td>
														<td>{num.Sentiment}</td>
														<td>{(num.SentimentScore.Positive*100).toFixed(4)}</td>
														<td>{(num.SentimentScore.Negative*100).toFixed(4)}</td>
														<td>{(num.SentimentScore.Neutral*100).toFixed(4)}</td>
														<td>{num.SentimentScore.Mixed.toFixed(4)}</td>
													</tr>
													:
													num.Sentiment==="NEUTRAL" ? 
												<tr class="table-warning">
														<td>{num.file_name}</td>
														<td>{num.Sentiment}</td>
														<td>{(num.SentimentScore.Positive*100).toFixed(4)}</td>
														<td>{(num.SentimentScore.Negative*100).toFixed(4)}</td>
														<td>{(num.SentimentScore.Neutral*100).toFixed(4)}</td>
														<td>{num.SentimentScore.Mixed.toFixed(4)}</td>
													</tr>:
													<div></div>
												
												: 
												 console.log("nothings there")
										 ))}
										 

									</Fragment>
								 :
								 <Fragment>
								
								 {this.state.res_files.length > 0 ? (this.state.see_files ?
								 this.state.res_files.map((num) => (
										
										// <p>{num.file_name}</p>

										this.joga2(file_Uploaded_name,this.state.dum2) ? 
										
										<tr class="table-active">
												<td>{file_Uploaded_name}</td>
												<td>...processing</td>
												<td>...processing</td>
												<td>...processing</td>
												<td>...processing</td>
												<td>...processing</td>
											</tr> : <span></span>
										
								 )) : <span></span>): 
									this.state.res_files.length === 0 && this.state.sentiments.length > 0  ? 
										this.state.uploaded_files.length > 0 ?
										this.state.see_files ? 
										this.state.uploaded_files.map((num) => (

											this.joga2(file_Uploaded_name,this.state.dum2) ? 
											<tr class="table-active">
												<td>{num}</td>
												<td>...andi</td>
												<td>...processing</td>
												<td>...processing</td>
												<td>...processing</td>
												<td>...processing</td>
											</tr>
											:<span></span>
										)):<span></span>
										: <span></span>
										: 
									<span></span>
									}
								 

							</Fragment>
								 }

							   
							 </Fragment>
						   ))}
						 
						 {console.log("this.stae.res_files:"+JSON.stringify(this.state.res_files),null,1)}
							
						</table>
					   </div>

					  
						: this.state.uploaded_files.length > 0 ? 
						
						this.state.res_files.length === 0 ? 
										this.state.uploaded_files.length > 0 ? 
										!this.state.see_files ? 
										this.state.uploaded_files.map((num) => (
											<tr class="table-info">
												<td>{num}</td>
												<td>-->File to be processed</td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
											</tr>
										)) : 

										<div>
										<table class="table">
											<th scope="col">Name of file</th>
											<th scope="col">Sentiment result</th>
											<th scope="col">Positive score(%)</th>
											<th scope="col">Negative score(%)</th>
											<th scope="col">Neutral score(%)</th>
											<th scope="col">Mixed</th>
				
											{this.state.uploaded_files.length > 0 ?
														
														this.state.uploaded_files.map((num) => (
															<tr class="table-active">
																<td>{num}</td>
																<td>...processing1</td>
																<td>...processing1</td>
																<td>...processing1</td>
																<td>...processing1</td>
																<td>...processing1</td>
															</tr>
														))
														: <span></span>}
												
											</table>
										</div>
										: <span></span>
										: 
									<span></span>

						: this.state.uploaded_files.length > 0 ? 
							
						
						<div>
						<table class="table">
							<th scope="col">Name of file</th>
							<th scope="col">Sentiment result</th>
							<th scope="col">Positive score(%)</th>
							<th scope="col">Negative score(%)</th>
							<th scope="col">Neutral score(%)</th>
							<th scope="col">Mixed</th>

							{this.state.uploaded_files.length > 0 ?
										
										this.state.uploaded_files.map((num) => (
											<tr class="table-active">
												<td>{num} to be uploaded</td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
											</tr>
										))
										: <span></span>}
								
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
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import * as React from 'react';
import './App.css';

interface IState{
  imageFiles: any[],
  results: any
}


class App extends React.Component<{}, IState> {
  
  constructor(props: any){
    super(props);
    this.state = {
      imageFiles: [],
      results: ""
    }
  }

  public upload(imgInput: any) {
    fetch('https://australiaeast.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=age', {      
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream', 
        'Ocp-Apim-Subscription-Key':'88276445704441cd8418ecaf2b6270f8',
      },
      body: imgInput
    })
    .then((response) => {
      if (!response.ok) {
        response.json().then((data) => {
          console.log(data)
          this.setState({
            results: "Oops, something went wrong. Please try another photo"
          })
        })
      }
      else {
        response.json().then((data) => {
          console.log(data)
          
          const age = data[0].faceAttributes.age;
          this.setState({
            results: "Age: " + age
          })
        })
      }
      return response
    })
  }

  public onChange = (file: any) => {
    this.setState({imageFiles: file.target.files[0]});
    this.upload(file.target.files[0]);
  };
  
  public render() {
    return (
      <div className="container-fluid">
      <div className="centreText">
        {/* React components must have a wrapper node/element */}
        <h1>Age Analyzer</h1>
        <h2>Upload a photo of yourself and we will try to analyze how old you are.</h2>
        <input accept="image/*" id="file-upload-button" type="file" onChange={this.onChange}/>
        <label htmlFor="file-upload-button">
          <Button variant="contained" color="primary" component = "span" className = "uploadButton">
            Upload Photo
            <PhotoCamera />
          </Button>
        </label>
        {
          this.state.results === "" && this.state.imageFiles.length !== 0 ?
          <div>
            <LinearProgress />
            <br />
            <LinearProgress color="secondary" />
          </div>
          :
          <div className="centreText"><h2>{this.state.results}</h2></div>
        }
      </div>
    </div>
    );
  }
}

export default App;

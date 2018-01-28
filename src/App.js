import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'; //no need to put .js in at the end
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
//const Clarifai = require('clarifai');
//import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//  apiKey: 'c20cf9b195744042856c5f887d4f7a9b'
// });

const particlesOptions = { 
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
  // particles: {
  //   line_linked: {
  //     shadow: {
  //       enable: true,
  //       color: "#3CA9D1",
  //       blur: 5
  //     }
  //   }
  // }
}

const initialState = {
  input:'',
  imageUrl:'',
  box: {},
  route: 'signin',
  isSignedIn: false, //here should be boolean
  user: {
  id: '',
  name:'',
  email: '',
  entries: 0,
  joined: ''
}
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;   //which has the bug that the next user will see the status of previous one.
    //   input:'',
    //   imageUrl:'',
    //   box: {},
    //   route: 'signin',
    //   isSignedIn: false, //here should be boolean
    //   user: {
    //     id: '',
    //     name:'',
    //     email: '',
    //     entries: 0,
    //     joined: ''
    //   }
    // }
  }
  //imageUrl => get displayed when we click on submit
  //box will have "top_row", "left_col", "bottom_row", and "right_col"
  //route: 'signin' => key in not signin, will get the home screen, keeps the track of where we are
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // //test
  // componentDidMount() { //this comes with react.js so does not need to arrow function
  //  fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
    //console.log(width, height);
  }

  displayFaceBox = (box) => {
    //console.log(box);
    this.setState ({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // app.models.   //which is written at backend
    //   .predict(
    //     Clarifai.FACE_DETECT_MODEL, 
    //     this.state.input)
    fetch('https://calm-fortress-64721.herokuapp.com/imageurl',{
             method: 'post',
             headers: {'Content-Type':'application/json'},
             body: JSON.stringify({
             input: this.state.input
           })
         })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://calm-fortress-64721.herokuapp.com/image',{
             method: 'put',
             headers: {'Content-Type':'application/json'},
             body: JSON.stringify({
             id: this.state.user.id
           })
         })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          //error handling when doing catch() after .then()
          .catch(console.log)
       }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
          //there was an error when Clarifai fails
  }
  //the video write the way of high-level, but I think current
  //is easy to understand, I just keep origins but I do not know how to write, need to check
 
  onRouteChange = (route) => {
      if (route === 'signout') {
        //this.setState({isSignedIn: false}).  //since has the error that the next person can see the status of previous one
        this.setState(initialState)
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route})  //to be more dynamic, change route to be variable that can receive different status
  } 
  // onRouteChange = () => {
  //   this.setState({route: 'home'}); //change route to 'home' ,need curly brackets since it is an object
  // }

  render() {
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className= 'particles'
          params={particlesOptions}
        />  
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
         ? <div>
              <Logo />
              <Rank
                name = {this.state.user.name}
                entries = {this.state.user.entries}
              />
              <ImageLinkForm 
               onInputChange={this.onInputChange} 
               onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>  //cannot return mutiple elements so need to wrap them by using
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> //here means after the user sign in, then direct to the homepage
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             )
      }  
      </div>
    );
  }
}

export default App;
//<Navigation /> => for sign out
//<ImageLinkForm onInputChange={this.onInputChange}/> => need to add this since onInputChange is a property of the app




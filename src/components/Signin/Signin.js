import React from 'react';

//somple component without state
//pure funtion
class Signin extends React.Component {  //will change to state with email and password
  constructor(props){
  	super(props);
  	this.state = {
      signInEmail: '',
      signInPassword: ''
  	}
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  onSubmitSignIn = () => {
  	fetch('https://calm-fortress-64721.herokuapp.com/signin',{
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
      	email: this.state.signInEmail,
      	password: this.state.signInPassword
      })
  	})
  	.then(response => response.json())
  	.then(user => {
      if (user.id) {
      	this.props.loadUser(user)       //main error here
      	this.props.onRouteChange('home');
      }
  	})
  }

  render(){
  	const { onRouteChange } = this.props;
  	return (
	<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">	
	 <main className="pa4 black-80">
	  <div className="measure">
	    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
	        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
	        <div className="mt3">
	          <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
	          <input 
	            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
	            type="email" 
	            name="email-address"  
	            id="email-address" 
                onChange = {this.onEmailChange}
	            />
	        </div>
	        <div className="mv3">
	          <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
	          <input 
	            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
	            type="password" 
	            name="password"  
	            id="password"
	            onChange = {this.onPasswordChange} 
	          />
	        </div>
	    </fieldset>
	    <div className="">
	      <input 
            //before: onClick = {onRouteChange('home')} 
            onClick = {this.onSubmitSignIn} 
            //here 'home' just for changing to not being 'signin for entering the home page'
	        //And we do not want to actually run this function
	        //before: will run this function when it get rendered
	        //what we want is to run it wheneven 'on click' happens and then call this function
	        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
	        type="submit" 
	        value="Sign in" 
	      />
	    </div>
	    <div className="lh-copy mt3">
	       <p onClick = {() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
	    </div>
	  </div>
	 </main>
	</article>
    );
  } 
}
//orgin: <a href="#0" className="f6 link dim black db">Register</a>
export default Signin;
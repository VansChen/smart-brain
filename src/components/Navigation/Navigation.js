import React from 'react';

//somple component without state
//pure funtion
const Navigation = ({onRouteChange, isSignedIn}) => {
  if (isSignedIn) {
  return (
    <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
      <p  onClick = {() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
    </nav>  
    //here is 'signin, since when signing out will back to the page of signin page'
    );
   } else {
     return (
       <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
         <p  onClick = {() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
         <p  onClick = {() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
       </nav>
    );
  }
}

export default Navigation
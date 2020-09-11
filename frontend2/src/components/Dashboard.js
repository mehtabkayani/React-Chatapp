import React from 'react';
import firebase from '../fire';
import '../App.css';
import Chat from './Chat';




const Dashboard = ({ handleLogout, userEmail }) => {
  
    return (

          <section className="dashboard">
              <nav>
                  <h2>Welcome {userEmail}</h2>
                   {/* <button onClick={handleLogout}>Leave room</button>  */}
              </nav>

              <Chat email={userEmail} handleLogout={handleLogout}/>
          </section>  


       
    );
};




export default Dashboard;
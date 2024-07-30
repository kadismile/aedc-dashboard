import { useState, useEffect } from "react";
import { userService } from './services/userService';
import { AuthorizedApp } from "./authorized-app";
import { UnauthorizedApp } from "./unauthorized-app";
import { MiniSpinner } from "./components/elements/spinners";
import '@fortawesome/fontawesome-free/css/all.min.css'; 

function App() {
  const [authenticated, setAuthentictaed] = useState(false)
  const [loading, setLoading] = useState(true);


  useEffect( () => {
    userService.verifyToken()
      .then( (data) => {
        if (data.status !== 'false') {
          setLoading(false)
          setAuthentictaed(true)
        } else {
          setLoading(false)
          setAuthentictaed(false)
        }
      })
  },[authenticated])

  return (
    <>
    { 
      authenticated ?
        <AuthorizedApp /> : 
        loading ? <MiniSpinner /> :
        <UnauthorizedApp />
    }
    </>
  );
}

export default App;

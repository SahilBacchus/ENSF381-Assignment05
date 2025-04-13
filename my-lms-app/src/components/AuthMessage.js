import React from 'react';
import { useContext } from 'react';
//mport { ThemeContext } from './RegForm';
//import { ThemeContextLogin } from './LoginForm';
import DisplayStatus from './DisplayStatus';

function AuthMessage(props) {
    //const { result } = useContext(ThemeContext);

    return (
        <div className="AuthMessage">
            <DisplayStatus type={props.result.success} msg={props.result.msg}/>
        </div>
    );
  }
  
  export default AuthMessage;

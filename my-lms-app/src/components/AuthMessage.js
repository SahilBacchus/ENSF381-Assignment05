import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from './RegForm';
import DisplayStatus from './DisplayStatus';

function AuthMessage() {
    const { result } = useContext(ThemeContext);

    return (
        <div className="AuthMessage">
            <DisplayStatus type={result.success} msg={result.msg}/>
        </div>
    );
  }
  
  export default AuthMessage;

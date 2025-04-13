import React, { useState, useEffect } from 'react';
import { createContext } from 'react';
import {useNavigate } from 'react-router-dom';
import AuthMessage from './AuthMessage';
import './LoginForm.css';

export const ThemeContextLogin = createContext(null);

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState({success: "", msg: ""});
    const navigate = useNavigate();

      useEffect(() => {
        if (result.success === "success") {
            setTimeout(function() {
                navigate("/courses");
            }, 2000);
        }
      }, [result, navigate]);

    async function loginUser() {
      const backendEndpoint = 'http://127.0.0.1:5000/login';
      try {
        const response = await fetch(backendEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'username':username, 'password':password}), //Converts a JavaScript object or value into a JSON string.
        });
    
        const data = await response.json();
    
        if (response.ok) {
          if (data.msg === 'success') {
            console.error('Logged in user');
            return true;
          } else {
            console.error('Failed to login');
            console.error(data);
            return false;
          }
        } else {
          console.error('Form submission failed.');
        }
      } catch (error) {
        console.error('Error during form submission:', error); }};

    async function validateCreds() {
        let resultBox = document.getElementById("login_result");
        let success  = false;
        
        if (!password || !username) {
            console.log("Password and username cannot be empty");
            setResult({
              success: "error",
              msg: "Password and username cannot be empty",
            });
            return;
          }

        if (password.length < 8) {
            console.log("Password must be at least 8 characters long");
            setResult({
              success: "error",
              msg: "Password must be at least 8 characters long",
            });
            return;
          }

          success = await loginUser();
          if (success) {
            setResult({success: 'success', msg: 'Login successful'});
            success = true;
          } else {
            setResult({success: 'error', msg: 'Login failed, please try again'});
          }
    }

    return (
        <div className="LoginForm">
            <h2>LMS Login</h2>
            <div class="form">
                <label>Username:</label><br/>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br/>
                <label>Password:</label><br/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <br/>
            <button onClick={validateCreds}>Login</button>
            <br/><br/>
            <a href="#">Forgot Password?</a>
            <br/>
            <a href="signup">Don't have an account? Sign Up</a> <br/>

            <div id="login_result">

            </div>
            {/*
            <ThemeContextLogin.Provider value={{username, password, result}}>
                <AuthMessage />
            </ThemeContextLogin.Provider>
            */}

            <AuthMessage result={result}/>
        </div>
        
    );
}
  
export default LoginForm;
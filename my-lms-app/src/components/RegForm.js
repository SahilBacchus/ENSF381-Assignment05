import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { createContext } from 'react';
import AuthMessage from './AuthMessage';
import './RegForm.css';

export const ThemeContextReg = createContext(null);


const RegForm = () => {
  const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [confirmPass, setConfirmPass] = useState('');
const [email, setEmail] = useState('');
const [result, setResult] = useState({success: "", msg: ""});
const navigate = useNavigate();


useEffect(() => {
  if (result.success === "success") {
    setTimeout(function() {
        navigate("/login");
    }, 2000);
  }
}, [result, navigate]);


async function registerUser() {
  const backendEndpoint = 'http://127.0.0.1:5000/signup';
  try {
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'username':username, 'password':password, 'email':email}), //Converts a JavaScript object or value into a JSON string.
    });

    const data = await response.json();

    if (response.ok) {
      if (data.msg === 'success') {
        console.log('Registered user');
        localStorage.setItem('student_id', data.student_id);
        return true;
      } else {
        console.error('Failed to register user');
        console.error(data);
        return false;
      }
    } else {
      console.error('Form submission failed.');
    }
  } catch (error) {
    console.error('Error during form submission:', error); }};


async function validateCreds() {
  //let resultBox = document.getElementById("login_result");
  let success  = false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~]{8,}$/;
  
  if (!password || !username) {
    console.log("Password and username cannot be empty");
    setResult({
      type: "error",
      msg: "Password and username cannot be empty",
    });
    return;
  }

  if (username.length < 3 || username.length > 20) {
    console.log("Username  must be between 3 and 20 characters long");
    setResult({
      type: "error",
      msg: "Username  must be between 3 and 20 characters long",
    });
    return;
  }

  if (username.match(/[^a-zA-Z0-9\-_]/)) {
    console.log("Allowed characters for username: alphanumeric characters (letters A-Z, numbers 0-9),hyphens (-), and underscores (_).");
    setResult({
      type: "error",
      msg: "Allowed characters for username: alphanumeric characters (letters A-Z, numbers 0-9),hyphens (-), and underscores (_).",
    });
    return;
  }

  if (username.split("")[0].match(/[^a-zA-Z]/)) {
    console.log("Username must begin with a letter");
    setResult({
      type: "error",
      msg: "Username must begin with a letter",
    });
    return;
  }

  if (password.length < 8) {
      console.log("Password must be at least 8 characters long");
      setResult({
        type: "error",
        msg: "Password must be at least 8 characters long",
      });
      return;
  }

  if (!passwordRegex.test(password)) {
    console.log("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and no spaces");
      setResult({
        type: "error",
        msg: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and no spaces",
      });
    return;
  }
/*
  if (password.match(/[^a-zA-Z0-9!@#$%^&*()-_=+[]\{\}\|\;\:\'\"\,.\<\>\?\/\`\~]/)) {
    console.log("Password can only contain the special characters : !@#$%^&*()-_=+[]{}|;:'\".<>?/`~");
      setResult({
        type: "error",
        msg: "Password can only contain the special characters : !@#$%^&*()-_=+[]{}|;:'\".<>?/`~",
      });
      return;
  }
*/

    if (password != confirmPass) {
      console.log("Passwords do not match");
      setResult({
        type: "error",
        msg: "Passwords do not match",
      });
    return;
    }

    if (!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      console.log("Invalid email format");
      setResult({
        type: "error",
        msg: "Invalid email format",
      });
    return;
    }

    let registered = await registerUser();
    if (registered) {
      setResult({success: 'success', msg: 'Signup successful'});
      success = true;
    } else {
      setResult({success: 'error', msg: 'Username already taken'});
    }
    
  /*if (!success) {
      setResult({success: 'error', msg: 'Signup failed, please try again'});
      return;
      //console.log("Falied");
      //resultBox.style = "border: 2px solid black";
      //document.getElementById("login_result").innerHTML = "Invalid username or password!";
  }*/
}

  return (
    <div>
      
      <main class="signup">
          <h2>LMS Signup</h2>
          <form>
              <label for="username">Username:</label>
              <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required/><br/><br/>
              
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required/><br/>

              <label for="confirm_pass">Confirm Password:</label>
              <input type="password" id="confirm_pass" name="confirm_pass" onChange={(e) => setConfirmPass(e.target.value)} required/><br/>

              <label for="email">Email:</label>
              <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required/><br/>
          </form> 
          <br/>
          <br/>  
              <button onClick={validateCreds}>Login</button>
          
      </main>
      <div id="signup_result">

      </div>
      {/*
            <ThemeContextLogin.Provider value={{username, password, result}}>
                <AuthMessage />
            </ThemeContextLogin.Provider>
            */}

      <AuthMessage result={result}/>
    </div>
  );
};

export default RegForm;

import './style.css'
import { onSubmit , fetchAllRooms } from './soapHandler.js'
import './soapHandler.js'

document.querySelector('#app').innerHTML = `
<label>Username</label>
<input type="text" id="username" name="username" required>
<br><br>

<label>Password</label>
<input type="password" id = "password" name="password" required>
<br><br>


<button id="submit" type ="button">Submit</button>
<div id="err"></div>
`

//setupCounter(document.querySelector('#counter'))

var errorMessage = `<label>Your id or password is incorrect</label>`

document.querySelector('#submit').addEventListener("click", function (){
  var username = document.querySelector('#username').value;
  var password = document.querySelector('#password').value;
  var viewChange = async function(){
    let table = await fetchAllRooms();
    console.log("ttttttt", table); 
    document.querySelector('#app').innerHTML = table;
  }
  var errorMsg = function(){
    document.querySelector('#err').innerHTML = errorMessage;
  }
  onSubmit(username, password,viewChange , errorMsg);
});



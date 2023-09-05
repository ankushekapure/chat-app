// This is for client
// Nodeserver is a different and we are connecting that server through this site
const socket = io('http://localhost:8000');

const form = document.getElementById('sendcontainer');


const messageinput = document.getElementById('messageinp');

const messagecontainer = document.querySelector(".container");

// Audio For Messages
var audio = new Audio('../tones/tone1.mp3');
var audio2 = new Audio('../tones/tone2.mp3');

// append function to add messages to the chat container
const append = (message, position) => {
    // Create a new div element for the message
    const messageElement = document.createElement('div');
    // Set the text content of the message element to the message passed as an argument
    messageElement.innerText = message;
    // Add the 'message' and 'position' classes to the message element
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    // Append the message element to the message container
    messagecontainer.append(messageElement);

    // Play audio if the position is 'left' (when receiving messages)
    if (position == 'left') {
        audio.play();
    }
    else if(position == 'center'){
        audio2.play();
    }
}

// Ask the user for their name and store it in the 'name' variable
const name = prompt("Enter Your Name To Join");
// Set the welcome message to display the user's name
document.getElementById('welcome').textContent = `Welcome ${name}`;
// Emit the 'new-user-joined' event to the socket.io server, passing the user's name
socket.emit('new-user-joined', name);

// Listen for the 'user-joined' event from the server
socket.on('user-joined', name => {
    // Call the append function to display a message indicating that a user has joined the chat
    append(`${name} joined the chat`, 'center');
});

// Event listener for the form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get the value of the message input
    const message = messageinput.value;
    // Call the append function to display the user's own message on the right side
    append(`You: ${message}`, 'right');
    // Send the message to the server by emitting the 'user-sent-message' event
    socket.emit('user-sent-message', message);
    // Empty the input field
    messageinput.value = "";
});

// Listen for the 'receive-message' event from the server
socket.on('receive-message', data => {
    // Call the append function to display the received message on the left side
    append(`${data.name} : ${data.message}`, 'left');
});

// Listen for the 'disconnected' event from the server
socket.on('disconnected', name => {
    // Call the append function to display a message indicating that a user has left the chat
    append(`${name} has left the chat`, 'center');
});

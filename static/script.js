// Set localStorage for username
if (!localStorage.getItem('username'))
  localStorage.setItem('username', 'guest');

document.addEventListener('DOMContentLoaded', function() {

  // Hide create-channel-div by default
  let createChannelDiv = document.querySelector('#create-channel-div');
  createChannelDiv.style.display = 'none';

  // Get localStorage for username
  document.querySelector('#username').innerHTML = "Welcome " + localStorage.getItem('username');

  // By default, submit button is disabled
  document.querySelector('#username-submit').disabled = true;

  // Enable button only uf there is text in the input field
  document.querySelector('#username-input').onkeyup = () => {
    if (document.querySelector('#username-input').value.length > 0)
      document.querySelector('#username-submit').disabled = false;
    else
      document.querySelector('#username-submit').disabled = true;
  };

  // Show current channels
  // Initialize new request
  let request = new XMLHttpRequest();
  request.open('POST', '/get_channels');

  // Callback function for when request completes
  request.onload = () => {

    // Extract JSON data from request
    const data = JSON.parse(request.responseText);

    // Update the channels div
    if (data.success) {
      let currentChannels = data.channels;
      currentChannels.forEach(function(element) {
        const li = document.createElement("li");
        const option = document.createElement("option");
        li.innerHTML = element['channel_name'];
        option.value = element['channel_name'];
        option.innerHTML = element['channel_name'];
        document.querySelector('#current-channels').append(li);
        document.querySelector('#join-channel-dropdown').append(option);
      });
    }
    else {
      const p = document.createElement("p");
      p.innerHTML = 'No channels yet.';
      p.id = 'no-channels-yet';
      document.querySelector('#channels').appendChild(p);
    }
  }

  // Send request
  request.send();

  // When user submits name form
  document.querySelector('#username-form').onsubmit = function() {

    // Set innerHTML of username
    let username = document.querySelector('#username-input').value;
    document.querySelector('#username').innerHTML = "Welcome " + username;

    // Set localStorage for username
    localStorage.setItem('username', username);

    // Clear input field
    document.querySelector('#username-input').value = '';

    // Show create-channel-div after form submission
    createChannelDiv.style.display = 'block';

    // Stop form from submitting to other page or website
    return false;
  };

  // When user submits channel form
  document.querySelector('#channel-form').onsubmit = () => {

    // Initialize new request
    const request = new XMLHttpRequest();
    const channel = document.querySelector('#channel-input').value;
    request.open('POST', '/create_channel');

    // Callback function for when request completes
    request.onload = () => {

      // Extract JSON data from request
      const data = JSON.parse(request.responseText);

      // Update the channel-result div
      if (data.success) {
        const contents = `Added channel ${data.channel_name}.`
        document.querySelector('#channel-result').innerHTML = contents;
        // Add it also to current-channels ul and join-channel-dropdown select
        const li = document.createElement("li");
        const option = document.createElement("option");
        li.innerHTML = data.channel_name;
        option.value = data.channel_name;
        option.innerHTML = data.channel_name;
        // If it's the first channel to be added, remove 'No channels yet' from current-channels
        let noChannel = document.querySelector('#no-channels-yet') !== null;
        if (noChannel) {
          let noChannelNode = document.querySelector('#no-channels-yet');
          document.querySelector('#channels').removeChild(noChannelNode);
        }
        document.querySelector('#current-channels').append(li);
        document.querySelector('#join-channel-dropdown').append(option);
      }
      else {
        document.querySelector('#channel-result').innerHTML = 'This channel already exists.';
      }
    }

    // Add data to send with request
    const data = new FormData();
    data.append('channel', channel);

    // Send request
    request.send(data);

    // Stop form from submitting to other page or website
    return false;
  };

});

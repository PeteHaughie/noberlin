const socket = io();

// Get the form element
const form = document.querySelector('.message_form');

// Add event listener for form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the textarea value
  let textareaValue = document.querySelector('#text').value;

  // Get the file input element
  const fileInput = document.querySelector('#input-files');

  // Get the selected file
  const file = fileInput.files[0];

  // Create a FormData object to store the form data
  const formData = new FormData();

  // Append the textarea value to the FormData object
  formData.append('textarea', textareaValue);
  if (textareaValue) {
    socket.emit("text-message", {
      message: textareaValue
    });
    document.querySelector('#text').value = "";
  }

  // Append the file to the FormData object
  formData.append('file', file);
  
  if(file) {
    try {
      // Send the form data to the server using fetch
      const response = await fetch('/uploads', {
        method: 'POST',
        body: formData
      });

      // Check if the request was successful
      
      if (response.ok) {
        console.log('File uploaded successfully');
        socket.emit("file-message", {message: file.name});
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
});

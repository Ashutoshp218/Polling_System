const pollForm = document.getElementById('pollForm');
const voteForm = document.getElementById('voteForm');
const pollQuestion = document.getElementById('pollQuestion');
const pollOptions = document.getElementById('pollOptions');

let socket;

// Connect to WebSocket
function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updatePollResults(data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed, reconnecting...');
    setTimeout(connectWebSocket, 1000); 
  };
}

// Update poll results in the DOM
function updatePollResults(data) {
  pollQuestion.textContent = data.pollQuestion;

  pollOptions.innerHTML = '';
  for (let option in data.options) {
    const li = document.createElement('li');
    li.textContent = `${option}: ${data.options[option].votes} votes`;
    pollOptions.appendChild(li);
  }
}

// Handle poll creation form submission
pollForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const question = document.getElementById('question').value;
  const option1 = document.getElementById('option1').value;
  const option2 = document.getElementById('option2').value;

  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, options: { option1: { votes: 0 }, option2: { votes: 0 } } }),
  });

  const data = await response.json();
  alert(`Poll created with ID: ${data.id}`);
});

// Handle vote form submission
voteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pollId = document.getElementById('pollId').value;
  const optionVote = document.getElementById('optionVote').value;

  const response = await fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option: `option${optionVote}` }),
  });

  const data = await response.json();
  alert(data.message);
});

// Initialize WebSocket connection
connectWebSocket();

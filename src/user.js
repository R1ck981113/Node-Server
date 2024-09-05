const axios = require('axios');

axios.post('http://localhost:3050/register', {
  username: 'testuser',
  password: 'testpassword'
}).then(response => console.log(response.data))
.catch(error => console.error(error));
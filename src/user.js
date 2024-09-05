const axios = require('axios');

axios.post('http://localhost:3050/register', {
  username: 'testuser1',
  password: 'testpassword'
}).then(response => console.log(response.data))
.catch(error => console.error(error));



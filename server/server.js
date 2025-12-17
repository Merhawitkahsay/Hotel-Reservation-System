const app = require('./app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});






// require('dotenv').config();
// require('./src/config/database');

// console.log('PORT:', process.env.PORT);
// console.log('DB NAME:', process.env.DB_NAME);
// console.log('JWT SECRET:', process.env.JWT_SECRET);






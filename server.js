const app = require('./src/app');
const sequelize = require('./src/config/database');
sequelize.sync({ force: true });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is up and running on port ${port}`));

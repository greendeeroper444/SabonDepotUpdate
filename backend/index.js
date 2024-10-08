const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const middleware = require('./middlewares/middleware');
const path = require('path');

dotenv.config({ path: './.env' });
const app = express();

app.use(middleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected'))
.catch((error) => console.log('Database not connected', error));

//customer routes
app.use('/customerAuth', require('./routers/CustomerRouters/CustomerAuthRouter'));
app.use('/customerProduct', require('./routers/CustomerRouters/CustomerProductRouter'));
app.use('/customerCart', require('./routers/CustomerRouters/CustomerCartRouter'));
app.use('/customerOrder', require('./routers/CustomerRouters/CustomerOrderRouter'));

//staff routes
app.use('/staffAuth', require('./routers/StaffRouters/StaffAuthRouters'));
app.use('/staffProduct', require('./routers/StaffRouters/StaffProductRouters'));
app.use('/staffOrders', require('./routers/StaffRouters/StaffOrdersRouter'));
app.use('/staffOrderWalkin', require('./routers/StaffRouters/StaffOrdersWalkinRouter'));
app.use('/staffCart', require('./routers/StaffRouters/StaffCartRouter'));

//admin routes
app.use('/adminAuth', require('./routers/AdminRouters/AdminAuthRouter'));
app.use('/adminProduct', require('./routers/AdminRouters/AdminProductRouter'));
app.use('/adminOrders', require('./routers/AdminRouters/AdminOrdersRouter'));
app.use('/adminAccounts', require('./routers/AdminRouters/AdminAccountsRouter'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));
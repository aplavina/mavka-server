const express = require('express');
const userRouter = require('./routers/UserRouter.js');
const authRouter = require('./routers/AuthRouter.js');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use('/mavka-api', userRouter);
app.use('/mavka-api', authRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

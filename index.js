const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Freelance MarketPlace Server is Running');
})

app.listen(port, () => {
    console.log(`Freelance MarketPlace Server is Running on Port : ${port}`);
})
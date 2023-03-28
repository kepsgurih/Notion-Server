import express from 'express';
import { Client } from '@notionhq/client';
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import Posting from './call/Posting.js';
import Where from './call/Where.js';

dotenv.config()
const jsonParser = bodyParser.json();
const port = process.env.PORT;
const app = express();
app.use(cors());

const authToken = process.env.NOTION_TOKEN;
const notionDbID = process.env.DATABASE_ID;
const notion = new Client({ auth: authToken });

app.get('/api', jsonParser, async (req, res) => {
    Posting()
    .then(result => res.send(result))
    .catch(err => res.send(err.message))

});

app.get('/',jsonParser, async (req, res) => {
    res.send('API')
})

app.get('/select', jsonParser, async (req, res) => {
    Where(req.query.tags)
        .then(result => res.send(result))
        .catch(err => res.send(err.message))
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
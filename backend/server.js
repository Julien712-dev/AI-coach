const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.set('trust proxy', 1);
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => res.send('Exercise classifier running'));

app.post('/update', (req, res) => {
    console.log(`Received update`);
    if (req.session.frames != null && req.session.frames.length > 0 && req.session.exerciseId == req.body.exerciseId)
        req.session.frames.push(req.body.frame);
    else {
        req.session.exerciseId = req.body.exerciseId;
        req.session.frames = [req.body.frame];
    }
    res.send(req.session.frames.length.toString());
});

app.listen(8080);
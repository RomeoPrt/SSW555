// app.js
import express from 'express';
import session from 'express-session';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 60 }
    })
);

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
};

const hbs = exphbs.create({
    helpers: {
        times: function(n, block) {
            let accum = '';
            for(let i = 0; i < n; i++)
                accum += block.fn({index: i});
            return accum;
        },
        multiply: function(value, multiple) {
            return value * multiple;
        }
    },
    defaultLayout: 'main'
});

app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);


app.use('/', (req, res, next) => {
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.auth ? 'Authenticated' : 'Not Authenticated'})`);
    next();
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Internal Server Error' });
});

app.use((req, res) => {
    res.status(404).render('error', { error: 'Page Not Found' });
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
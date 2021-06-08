require('dotenv').config();

const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const history = require('connect-history-api-fallback');

let isDev = process.env.NODE_ENV !== 'prod';

console.log(`[mgg-web] Starting in ENV ${process.env.NODE_ENV} (isDev=${isDev})`);

function build() {
    console.log(`[mgg-web] Building VueJS App.`);

    let buildCMD = exec("yarn build", function(err, stdout, stderr) {
        if(err) {
            console.error(`[mgg-web] Error while building app.`);
            console.error(err);
        }

        console.log(stdout);

        startServer();
    });

    buildCMD.on('exit', function(code) {
        console.log(`[mgg-web] Building finished with code ${code}.`);
    });
}

function startServer() {
    const app = express();

    // HTTP to HTTPS redirect
    if(process.env.SSL_ACTIVE) {
        console.log(`[mgg-web] Using HTTPS redirect.`);

        app.use(function(req, res, next) {
            if (req.secure) {
                next();
            } else {
                res.redirect('https://' + req.headers.host + req.url);
            }
        });
    }

    // Routes
    app.get('/discord', (req, res) => {
        res.redirect("https://discord.gg/vcr7Fk6MT6");
    });

    app.use(history({
        verbose: isDev
    }));

    app.use(express.static('dist', { dotfiles: 'allow' }));

    // Servers
    const httpServer = http.createServer(app);
    httpServer.listen(process.env.PORT_HTTP, () => {
        console.log(`[mgg-web] HTTP server running on port ${process.env.PORT_HTTP}.`);
    });

    if(process.env.SSL_ACTIVE) {
        const sslPK = fs.readFileSync('/etc/letsencrypt/live/mygarage.games/privkey.pem', 'utf8');
        const sslCert = fs.readFileSync('/etc/letsencrypt/live/mygarage.games/cert.pem', 'utf8');
        const sslCA = fs.readFileSync('/etc/letsencrypt/live/mygarage.games/chain.pem', 'utf8');
        const credentials = {
            key: sslPK,
            cert: sslCert,
            ca: sslCA
        };

        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(process.env.PORT_HTTPS, () => {
            console.log(`[mgg-web] HTTPS server running on port ${process.env.PORT_HTTPS}.`);
        });
    } else {
        console.log(`[mgg-web] HTTPS server disabled.`);
    }
}

build();
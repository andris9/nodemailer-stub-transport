# Stub transport module for Nodemailer

Applies for Nodemailer v1.x and not for v0.x where transports are built-in.

## Usage

Install with npm

    npm install nodemailer-stub-transport

Require to your script

```javascript
var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');
```

Create a Nodemailer transport object

```javascript
var transport = nodemailer.createTransport(stubTransport({
    host: 'localhost',
    port: 25,
    auth: {
        user: 'username',
        pass: 'password'
    }
}));
```

## Using well-known services

If you do not want to specify the hostname, port and security settings for a well known service, you can use it by its name.

```javascript
stubTransport({
    service: 'gmail',
    auth: ..
});
```

## License

**MIT**

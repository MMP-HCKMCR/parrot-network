module.exports = {
    port: (process.env.PARROT_PORT || 8080),

    locale: 'en-GB',

    host_url: (process.env.PARROT_HOST_URL || 'http://localhost:8080'),

    env: (process.env.PARROT_NODE_ENV || 'dev'),

    mongo: {
        connection: (process.env.PARROT_MONGO_CONN || 'mongodb://mongo:27017/parrots')
    },

    encryption: {
        bcrypt: {
            rounds: 9
        }
    },

    clockwork: {
        api: ''
    },

    sendgrid: {
        api: ''
    },

    session: {
        secret: (process.env.PARROT_SECRET || 'RickSanchez'),
        maxAge: 60000,
        resave: true,
        saveUninitialized: false
    }
}
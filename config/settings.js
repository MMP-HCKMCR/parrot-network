module.exports = {
    port: (process.env.PARROT_PORT || 8080),

    locale: 'en-GB',

    mongo: {
        connection: (process.env.PARROT_MONGO_CONN || '')
    },

    clockwork: {
        api: ''
    },

    sendgrid: {

    },

    session: {
        secret: (process.env.PARROT_SECRET || 'RickSanchez'),
        maxAge: 60000
    }
}
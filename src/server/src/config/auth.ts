export default {

    defaults: {
        guard: 'web',
        passwords: 'users',
    },

    guards: {
        web: {
            driver: 'session',
            provider: 'users',
        },

        api: {
            driver: 'passport',
            provider: 'users',
        },
    },


    providers: {
        users: {
            driver: 'eloquent',
            // model: User::class,
        },
    },
};
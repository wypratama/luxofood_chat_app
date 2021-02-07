import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId:
        '948648686842-9ioq1uoadv4715egmoj1h1e6764dth63.apps.googleusercontent.com',
      clientSecret: '2oqbotICc5SZ7y-gHl33GSTu',
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
});

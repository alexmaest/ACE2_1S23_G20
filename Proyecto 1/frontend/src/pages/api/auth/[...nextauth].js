import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Constants } from '@/constants'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials, req) {
        const { username, password } = credentials
        const res = await fetch(`http://${Constants.IP_ADDRESS}:3555/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        })
        const user = await res.json()

        if (res.ok && user) {
          return user
        } else return null
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login'
  }
}

export default NextAuth(authOptions)

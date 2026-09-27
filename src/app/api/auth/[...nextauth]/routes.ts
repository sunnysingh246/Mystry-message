import NextAuth from "next-auth";
import { authOptinos } from "./options"


const handler = NextAuth(authOptinos)

export { handler as GET, handler as POST }
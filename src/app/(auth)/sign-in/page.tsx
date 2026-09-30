'use client'
import { useSession, signIn, signOut } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function Component() {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        }
    };

    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button
                    className="bg-ora-500 px-3 py-1 m-4 rounded"
                    onClick={() => signOut()}
                >
                    Sign out
                </button>
            </>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto p-6">
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="border rounded px-3 py-2"
            />
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="border rounded px-3 py-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-black text-white rounded px-3 py-2">
                Sign in
            </button>
        </form>
    );
}
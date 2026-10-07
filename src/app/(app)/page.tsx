import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-88px)] bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center">
          <p className="mb-8 text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Mystery message
          </p>

          <div className="mb-8 text-2xl font-medium text-black md:text-4xl">
            Share your thoughts anonymously.
          </div>

          <p className="mb-10 text-base text-zinc-600 md:text-lg">
            Let people send you messages without revealing who they are.
          </p>

          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  )
}

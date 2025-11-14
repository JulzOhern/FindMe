import { auth, signOut } from '@/auth'

export default async function HomePage() {
  const session = await auth()

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <br />

      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button>Sign out</button>
      </form>
    </div>
  )
}

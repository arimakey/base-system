export default function LandingPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <a href="/api/auth/google">
        <button
          className="px-6 py-3 text-lg bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition"
        >
          Login with Google
        </button>
      </a>
    </div>
  );
}

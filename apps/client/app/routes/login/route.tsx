import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getSessionFromRequest, commitSession } from "../../session.server";

export async function loader({ request }: { request: Request }) {
  const session = await getSessionFromRequest(request);
  const url = new URL(request.url);
  const urlError = url.searchParams.get("error");

  const urlToken = url.searchParams.get("token");

  if (urlError) {
    session.set("error", "Authentication failed. Please try again.");
  } else if (urlToken) {
    session.set("token", urlToken);
    session.set("user", JSON.parse(atob(urlToken.split('.')[1])));
  }

  const error = session.get("error") || null;
  const token = session.get("token") || null;

  if (token) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/",
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return json(
    { error, token },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const authError = searchParams.get("error");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Authentication failed. Please try again.
        </div>
      )}
      <div className="space-y-4">
        <a
          href="/api/auth/google"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login with Google
        </a>
      </div>
    </div>
  );
}

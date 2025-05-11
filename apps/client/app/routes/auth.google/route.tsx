import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { commitSession, getSessionFromRequest } from "../../session.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const error = url.searchParams.get("error");

  if (error) {
    const session = await getSessionFromRequest(request);
    session.flash("error", "Google authentication failed");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  if (token) {
    const session = await getSessionFromRequest(request);
    session.set("token", token);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return redirect("/api/auth/google");
}

export default function GoogleAuth() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      console.error("Google auth error:", error);
    }
  }, [error]);

  return null;
}

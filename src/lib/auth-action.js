import { authClient } from "./auth-client";

export const handleGoogleAuth = async () => {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@src/features/auth/useAuth";
import { RouterLink } from "@src/components/router-link/RouterLink";
import { AuthError } from "@supabase/supabase-js";
import { isValidEmail } from "@src/utils/string-utils";
import { Page } from "@src/components/page/Page";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { useSignInOut } from "@src/api/auth";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const { signIn, isSigningIn, signInError } = useSignInOut();

  const previousLocation = useMemo(() => {
    if (location.state) {
      return location.state.from;
    }
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(previousLocation || "/", { replace: true });
    }
  }, [isAuthenticated, navigate, previousLocation]);

  return (
    <Page justifyContent="center">
      <PaperStack
        py={4}
        px={4}
        spacing={4}
        sx={{ alignItems: "center", maxWidth: "sm" }}
      >
        <Typography variant="h1">TRACKMACASH</Typography>
        {isAuthenticated ? (
          <Typography variant="body1">You are already signed in. </Typography>
        ) : (
          <SignInForm
            onSignIn={(email, password) => signIn({ email, password })}
            isSigningIn={isSigningIn}
            signInError={signInError}
          />
        )}

        {!isAuthenticated && (
          <Typography variant="body2">
            Don't have an account?{" "}
            <RouterLink to="/register">Register</RouterLink> a new account.
          </Typography>
        )}
      </PaperStack>
    </Page>
  );
}

type SignInFormProps = {
  onSignIn: (email: string, password: string) => void;
  isSigningIn: boolean;
  signInError: AuthError | null;
};

function SignInForm({ onSignIn, isSigningIn, signInError }: SignInFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const disableSignInButton = useMemo(() => {
    if (!email.trim() || !password.trim()) {
      return true;
    } else if (!isValidEmail(email)) {
      return true;
    }

    return isSigningIn;
  }, [isSigningIn, email, password]);

  const handleSignIn = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isValidEmail(email) || !password.trim()) {
        return;
      }

      onSignIn(email, password);
    },
    [onSignIn, email, password]
  );

  return (
    <Stack
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSignIn}
      width="100%"
      maxWidth="sm"
    >
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!email.trim() && !isValidEmail(email)}
          helperText={
            !!email.trim() && !isValidEmail(email) ? (
              <Typography variant="caption">Invalid email format</Typography>
            ) : undefined
          }
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <TextField
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      {!!signInError && (
        <Typography variant="body2" color="error" mb={3}>
          {signInError.message}
        </Typography>
      )}

      <Button variant="contained" type="submit" disabled={disableSignInButton}>
        Sign In
      </Button>
    </Stack>
  );
}

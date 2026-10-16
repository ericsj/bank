"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    loginAction,
    {},
  );
  return (
    <form action={formAction} className="card">
      <label>
        E-mail
        <input
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={state.email}
          required
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Logging in" : "Login"}
      </button>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

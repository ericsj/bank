import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main>
      <h1>Bank app login</h1>
      <LoginForm />
      <p>
        <small>Test users:</small>
      </p>
      <p>
        <small>Email: ana@bank.dev / password: pass123</small>
      </p>
      <p>
        <small>Email: john@bank.dev / password: pass123</small>
      </p>
    </main>
  );
}

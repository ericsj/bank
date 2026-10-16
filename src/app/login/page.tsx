import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main>
      <h1>Bank app login</h1>
      <LoginForm />
      <p>
        <small>Test users: ana@bank.dev, john@bank.dev</small>
        <small>Test password: pass123</small>
      </p>
    </main>
  );
}

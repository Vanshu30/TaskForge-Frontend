import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { signup } = useAuth();

  return (
    <main className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <RegisterForm onSubmit={signup} />
    </main>
  );
}

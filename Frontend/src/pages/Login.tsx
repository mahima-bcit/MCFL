import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { apiFetch } from "../services/apiClient";

type LoginResponse = {
  token: string;
  role: string;
  mustChangePassword: boolean;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch<LoginResponse>("api/account/login", {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      otherStorage.removeItem("token");
      otherStorage.removeItem("role");

      storage.setItem("token", data.token);
      storage.setItem("role", data.role);

      if (data.role === "Admin") {
        navigate(
          data.mustChangePassword ? "/admin/settings" : "/admin/overview",
        );
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);

      if (error instanceof TypeError) {
        setError("Login failed. Please check if backend is running.");
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-nav mb-2">
                Welcome Back
              </h1>
              <p className="text-nav/60 text-base">
                Log in to continue your financial journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-nav mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-nav/20 text-nav placeholder-nav/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-nav mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-nav/20 text-nav placeholder-nav/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-nav/30 text-primary accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-nav/70 font-medium">
                    Remember me
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full text-base py-4 justify-center"
              >
                Log in
              </Button>
            </form>

            <p className="text-center text-nav/70 text-sm mt-6">
              Don't have an account yet?{" "}
              <a
                href="/signup"
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

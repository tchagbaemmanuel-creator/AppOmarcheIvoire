import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from '@/redux/api/auth';
import { useDispatch } from 'react-redux';
import { logIn } from '../../redux/slices/authSlice';
import { toast } from 'sonner';
import { FaBasketShopping } from 'react-icons/fa6';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();

      dispatch(logIn({
        user: response.data,
        token: response.token
      }));

      navigate('/', { replace: true });
      toast.success('Connexion réussie');
    } catch (error: unknown) {
      const err = error as {
        status?: number | string;
        data?: { message?: string };
      };
      if (err.status === "FETCH_ERROR" || err.status === "PARSING_ERROR") {
        toast.error(
          "Impossible de joindre l'API. Vérifiez qu'elle tourne (port 3000 ou ngrok) et redémarrez le dashboard (npm run dev)."
        );
      } else if (err.status === 401) {
        toast.error(err.data?.message ?? "E-mail ou mot de passe incorrect");
      } else {
        toast.error(err.data?.message ?? "Erreur de connexion");
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className="sgi-gradient-bg flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl md:grid-cols-[1fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-brand-green p-10 text-white md:flex">
          <div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <FaBasketShopping className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold leading-tight">
              O&apos;Marché Ivoire
            </h2>
            <p className="mt-2 text-sm font-medium text-white/80">
              Système de gestion interne
            </p>
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            Gérez les marchés, commandes, vendeurs et livreurs depuis une interface centralisée.
          </p>
        </div>

        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1 pb-2">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green md:hidden">
              <FaBasketShopping className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl">Connexion admin</CardTitle>
            <CardDescription>
              Accédez au tableau de bord SGI avec vos identifiants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@omarcheivoire.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-border focus-visible:ring-brand-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-border focus-visible:ring-brand-green"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-dark"
                disabled={isLoading}
              >
                {isLoading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

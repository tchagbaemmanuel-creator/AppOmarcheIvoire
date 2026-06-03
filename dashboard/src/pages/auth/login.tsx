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
import { PUBLIC_WEBSITE_URL } from '@/config/site';
const LOGIN_MARKET_BG =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80";
const LOGO_SRC = "/logo-omarche-ivoire.png";

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
    <div className="sgi-login-bg relative flex min-h-screen items-center justify-center p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${LOGIN_MARKET_BG})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-green-dark/80 via-background/90 to-brand-orange-light/40" aria-hidden />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-xl backdrop-blur-sm md:grid-cols-[1fr_1.1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${LOGIN_MARKET_BG})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-brand-green-dark/85" aria-hidden />
          <div className="relative z-10">
            <img
              src={LOGO_SRC}
              alt="O'Marché Ivoire"
              className="mb-6 h-20 w-auto max-w-[220px] object-contain drop-shadow-md"
            />
            <h2 className="text-2xl font-bold leading-tight">
              O&apos;Marché Ivoire
            </h2>
            <p className="mt-2 text-sm font-medium text-white/80">
              Système de gestion interne
            </p>
          </div>
          <p className="relative z-10 text-sm leading-relaxed text-white/70">
            Gérez les marchés, commandes, vendeurs et livreurs depuis une interface centralisée.
          </p>
        </div>

        <Card className="border-0 bg-card/95 shadow-none backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2">
            <img
              src={LOGO_SRC}
              alt="O'Marché Ivoire"
              className="mb-3 h-14 w-auto object-contain md:hidden"
            />
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
              <p className="pt-2 text-center text-sm text-muted-foreground">
                <a
                  href={PUBLIC_WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-green underline-offset-4 hover:underline"
                >
                  Visiter le site O&apos;Marché Ivoire →
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

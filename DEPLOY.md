# Mise en ligne — tests

## API (Render) — OK

- URL : https://appomarcheivoire.onrender.com
- Health : GET `/`
- Docs : GET `/docs`

## SGI (dashboard) — Vercel

1. [vercel.com](https://vercel.com) → **Add New Project**
2. Import **AppOmarcheIvoire**
3. **Root Directory** : `dashboard`
4. **Environment Variable** :
   - `VITE_API_URL` = `https://appomarcheivoire.onrender.com`
5. **Deploy**

Connexion : `admin@omarche.com` / `OMarche@2024`

## Importer les données de production (Neon)

Le fichier `database.sql` à la racine contient l’historique complet (commandes, marchés, utilisateurs, etc.). Sur Neon, seul le seed minimal ne suffit pas.

```bash
cd api
# DATABASE_URL = chaîne Neon (dashboard Neon → Connection string)
bun run db:import-production
```

Cela remplace les données de la base cible par le dump, puis remet le mot de passe `admin@omarche.com` à `OMarche@2024`.

## App mobile

### Option A — Expo Go (rapide)

```bash
cd mobile
# .env avec EXPO_PUBLIC_API_URL=https://appomarcheivoire.onrender.com
npx expo start
```

Scanner le QR code avec Expo Go.

### Option B — APK (testeurs sans PC)

```bash
cd mobile
npx eas build -p android --profile preview
```

Profil `preview` dans `eas.json` pointe déjà vers l’API Render.

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

## App mobile — en ligne

API utilisée : `https://appomarcheivoire.onrender.com` (variable `EXPO_PUBLIC_API_URL`).

Compte Expo du projet : **iamcedric** (`expo.dev` → projet `omarche-ivoire`).

### Option A — Expo Go (tests immédiats, sans build)

```bash
cd mobile
cp .env.example .env   # si pas déjà fait
npm install
npx expo start --tunnel
```

1. Installer **Expo Go** sur le téléphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)).
2. Scanner le QR code affiché dans le terminal.
3. L’app charge l’API Render (première requête API ~30 s si Render était en veille).

Pour un réseau local sans tunnel : `npx expo start` (téléphone et PC sur le même Wi‑Fi).

### Option B — APK Android (recommandé pour testeurs)

APK installable, sans Expo Go ni PC :

```bash
cd mobile
npm install
npx eas login          # compte expo.dev (iamcedric)
npm run build:android:preview
```

À la fin du build, EAS affiche un **lien de téléchargement** de l’APK (valable ~30 jours). Partagez ce lien aux testeurs ; ils activent « sources inconnues » puis installent.

Suivi du build : [expo.dev/accounts/iamcedric/projects/omarche-ivoire/builds](https://expo.dev/accounts/iamcedric/projects/omarche-ivoire/builds)

### Option C — Google Play (production)

```bash
cd mobile
npm run build:android:prod
# Puis soumission (clé de compte de service Google Play requise) :
npx eas submit -p android --profile production
```

Le profil `production` génère un **AAB** (`app-bundle`) pour le Play Store.

### Option D — iOS (App Store / TestFlight)

```bash
cd mobile
npm run build:ios:prod
npx eas submit -p ios --profile production
```

Compte **Apple Developer** requis sur expo.dev.

### Scripts npm utiles

| Commande | Usage |
|----------|--------|
| `npm run start:tunnel` | Dev + QR code (réseau public) |
| `npm run build:android:preview` | APK de test |
| `npm run build:android:prod` | Bundle Play Store |

### Dépannage mobile

- **Erreur réseau / timeout** : attendre 30–60 s (réveil Render), réessayer.
- **Mauvaise API** : vérifier `.env` → `EXPO_PUBLIC_API_URL=https://appomarcheivoire.onrender.com`, puis refaire un build EAS.
- **Build EAS** : `npx eas build:list` pour voir l’historique et les liens APK.

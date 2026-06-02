#!/usr/bin/env bash
set -e

echo "=== Installation des dependances ==="
echo "API..."
cd api
bun install
cd ..

echo "Dashboard..."
cd dashboard
npm install
cd ..

echo "Mobile..."
cd mobile
npm install
cd ..

echo ""
echo "=== Commandes pour lancer le projet ==="
echo "1) API      : cd api && bun run dev"
echo "2) Dashboard: cd dashboard && npm run dev"
echo "3) Mobile   : cd mobile && npm run start"
echo ""
echo "Lance chaque commande dans un terminal separe."

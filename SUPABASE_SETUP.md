# Configuration et limites de la plateforme

## Sauvegarde préalable

La version originale du projet a été copiée avant ces modifications dans :

`C:\Users\Dell\Desktop\santer-backup-2026-11-24_0112`

Cette sauvegarde n'est pas dans le dossier du site et n'est pas utilisée par Vite.

## Raccordement à Supabase

1. Créez ou choisissez le projet Supabase de l'association.
2. Dans **Project Settings → API**, récupérez l'URL du projet et sa clé publique `anon`/publishable. N'utilisez jamais une clé `service_role` ou une clé secrète dans le navigateur.
3. Copiez `.env.example` vers `.env`, puis renseignez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Ne publiez pas `.env`.
4. Appliquez une seule fois `supabase/migrations/20261124010000_initial_medical_platform.sql` dans le SQL Editor Supabase ou avec le CLI Supabase. La migration crée les tables, les fonctions et les règles RLS; elle ne supprime pas de tables ou de données existantes.
5. Configurez les URL de site et de redirection dans **Authentication → URL Configuration**. La connexion Google exige aussi l'activation du fournisseur Google dans Supabase et la configuration de ses identifiants côté Supabase.
6. Installez et démarrez l'application avec `npm.cmd install`, puis `npm.cmd run dev`.

Sans URL et clé publique valides, le frontend refuse les opérations et affiche une erreur de configuration. L'absence de configuration n'est pas remplacée par une session ou des données de démonstration.

## Rôles et autorisation professionnelle

Les nouveaux comptes sont créés comme patients. Le navigateur ne peut ni s'attribuer le rôle `doctor` ou `admin`, ni modifier `clinician_verified`.

Après vérification d'identité et de justificatifs par l'association, un administrateur du projet peut attribuer les rôles depuis le SQL Editor Supabase, en utilisant les UUID d'utilisateurs vérifiés :

```sql
update public.profiles
set role = 'doctor', clinician_verified = true
where id = 'UUID_DU_COMPTE_VERIFIE';
```

Le compte administrateur initial doit lui aussi être créé par une personne de confiance depuis le SQL Editor :

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DU_COMPTE_ADMIN';
```

Ne donnez ces rôles qu'après vérification. La plateforme n'inclut pas encore d'interface d'administration pour vérifier des médecins ou gérer des utilisateurs.

## Périmètre réellement raccordé

- Authentification par courriel/mot de passe et OAuth Google via Supabase Auth.
- Création de profil et code patient unique par déclencheur SQL.
- Carnet patient : lecture et modification des informations de santé, partage/retrait d'autorisation, consultations, notifications et documents privés.
- Espace médecin : accès seulement après vérification; demande d'accès par code patient; données révélées seulement après accord; rédaction de brouillons de consultation/prescription et validation verrouillée.
- Communauté : publications, commentaires, réactions et signalements enregistrés dans Supabase.
- RLS sur toutes les tables applicatives et bucket privé pour les fichiers médicaux.
- Journal d'audit des lectures de lignes médicales autorisées et vérifications d'accès aux fichiers, ainsi que des accès accordés/révoqués et des modifications du carnet, consultations, prescriptions, documents et rendez-vous. La création d'un lien de téléchargement temporaire est contrôlée; les téléchargements ultérieurs via le lien signé ne produisent pas chacun un nouvel événement.

## Fonctions non disponibles ou non vérifiées

- Aucun projet Supabase, URL, clé publique ou compte de test n'était fourni au moment de ces changements. La connexion réelle, OAuth, les migrations sur une instance et les tests RLS par rôle n'ont donc pas été exécutés.
- Le tableau de bord associatif affiche des tirets, et les pages de gestion associatives, la modération, les rapports et la facturation ne sont pas raccordés à une base de données.
- La prise de rendez-vous, le formulaire de contact médical et le téléversement de documents par le médecin ne sont pas activés.
- La validation des diplômes, la modération des contenus, l'antivirus des fichiers, la rétention réglementaire, le consentement réglementaire complet et la procédure de récupération de compte nécessitent encore un processus opérationnel validé par l'association.
- Cette intégration technique ne constitue pas une certification réglementaire ni une garantie de conformité médicale. Ne mettez pas en production des données réelles avant une revue de sécurité, juridique et clinique et la validation des politiques par Supabase.

## Vérification locale

`npm.cmd run build` compile les quatre pages et leurs modules. Une compilation réussie ne valide pas à elle seule une connexion distante, les rôles, les politiques RLS ou le stockage Supabase.

## Publication de test sur GitHub Pages

Le dépôt public [heldyngatse67-svg/les-ptits-anges-an-o-test](https://github.com/heldyngatse67-svg/les-ptits-anges-an-o-test) est configuré pour GitHub Pages via Actions. Une fois le workflow réussi, le site sera disponible sur [heldyngatse67-svg.github.io/les-ptits-anges-an-o-test](https://heldyngatse67-svg.github.io/les-ptits-anges-an-o-test/). Le workflow `.github/workflows/deploy-pages.yml` compile et publie le site à chaque push sur `main`. Le chemin Vite est configuré pour ce dépôt; si vous choisissez un autre nom de dépôt, mettez aussi à jour `base` dans `vite.config.js`.

Les variables Actions publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont configurées pour la compilation. Elles ne sont pas des secrets; ne stockez jamais de clé `service_role`, de clé secrète ou de mot de passe PostgreSQL dans le dépôt ou les variables frontend.

1. Pour reproduire la publication sur un autre dépôt, créez un dépôt public. GitHub Pages gratuit exige un dépôt public.
2. Installez Git for Windows si Git n'est pas disponible, puis initialisez le dépôt local et poussez la branche `main` :

   ```powershell
   git init -b main
   git add .
   git commit -m "Configure GitHub Pages deployment" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
   git remote add origin https://github.com/VOTRE_COMPTE/les-ptits-anges-an-o-test.git
   git push -u origin main
   ```

3. Dans **Settings → Secrets and variables → Actions → Variables**, créez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Ce sont des valeurs publiques intégrées au JavaScript livré au navigateur : utilisez uniquement l'URL et la clé publishable/anon, jamais une clé `service_role`, une clé secrète ou le mot de passe PostgreSQL. `.env` est ignoré par Git.
4. Dans **Settings → Pages**, choisissez **GitHub Actions** comme source. Le workflow publiera le site à l'adresse `https://VOTRE_COMPTE.github.io/les-ptits-anges-an-o-test/`.
5. Ajoutez cette URL comme **Site URL** et URL de redirection autorisée dans la configuration d'authentification Supabase. L'authentification médicale restera limitée tant que la migration de base de données n'est pas présente dans le bon projet.

## Restaurer la version sauvegardée

La copie de sauvegarde originale est conservée à côté du projet. Pour remettre cette version en place sans supprimer la version mise à jour ni toucher aux données Supabase :

1. Arrêtez Vite et fermez les outils qui verrouillent les fichiers du projet.
2. Dans PowerShell, placez-vous dans `C:\Users\Dell\Desktop`.
3. Renommez le dossier actuel pour le conserver, puis recréez `santer` depuis la sauvegarde :

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Rename-Item -LiteralPath '.\santer' -NewName "santer-version-mise-a-jour-$stamp"
New-Item -ItemType Directory -Path '.\santer'
Copy-Item -Path '.\santer-backup-2026-11-24_0112\*' -Destination '.\santer' -Recurse -Force
```

Cette procédure garde les deux versions sur le disque, ne supprime aucun fichier utilisateur et ne lance aucune opération sur Supabase. La sauvegarde antérieure ne contient pas les identifiants `.env` ajoutés ultérieurement; ne copiez jamais un fichier `.env` dans une version restaurée sans vérifier son contenu.

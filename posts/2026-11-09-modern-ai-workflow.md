---
title: "Il y a trop d'outils IA, j'installe quoi ?"
date: 2026-11-17
lang: fr
description: "Comment adapter son environnement de travail quand on lit plus de code qu'on n'en écrit."
---

J'ai toujours écrit du code. Depuis plus de 20 ans, mon ordinateur était taillé pour écrire du code. Aujourd'hui, j'écris beaucoup moins de code. Grâce ou à cause de l'IA selon le point de vue. Mon environnement de travail n'était plus adapté à 100 %. Une nouvelle jungle d'outils est apparue. Il y en a trop ! Comment s'y retrouver ? Prenons notre fedora, notre fouet, et partons à la découverte !

## Nous lisons plus que nous écrivons

L'IA a révolutionné notre façon de travailler : nous écrivons beaucoup moins de code. Parfois plus du tout. Nous devons plus relire qu'écrire. Cette transformation doit s'accompagner d'un changement de notre façon de faire, de nos outils. Tout le monde a toujours façonné son propre environnement de travail à ses besoins : PHPStorm sous macOS, Eclipse sous Windows 🗿, Neovim sous Arch Linux (I use arch btw). L'idéal est d'adapter notre machine à notre besoin au cours de notre carrière, comme un artisan le ferait avec ses outils.

Prenons le temps de comprendre pourquoi nous devons faire évoluer nos outils.

**Avant :** on écrivait beaucoup de code, on devait comprendre soi-même "ce qui se passe". On naviguait dans le code : d'où provient la définition, recherche avancée pour trouver le nombre d'appels d'une fonction, refactorisation massive à l'aide des outils dédiés. Parfois on utilisait le débuggeur intégré (perso je mettais des `console.log` partout, TMTC).

Au début de l'IA la confiance dans le code généré n'était pas totale. Nous codions toujours. Nous promptions de façon occasionnelle. L'éditeur de code classique (PHPStorm, VSCode, Neovim) intégrait simplement l'IA avec des plugins.

Puis la confiance dans le code généré a augmenté. Qui ne s'est jamais dit : "ah bah là c'est encore mieux que ce que j'aurais fait..." ? Nous sommes passés de l'art du prompting à l'orchestration d'agents IA : le développement agentique.

**Maintenant :** il faut orchestrer les agents IA, relire beaucoup de code, avoir une vision plus macro que micro, vérifier l'architecture d'un projet, garder une trace des prompts qui ont été faits.

De nouveaux outils sont apparus pour répondre à ces besoins.

## Commencez par l'outil natif de l'abonnement que vous avez déjà

En parallèle de l'évolution des outils traditionnels, on voit apparaître de nouveaux outils conçus pour dompter les agents. Ce sont les ADE : les Agentic Development Environment.

Dans ces outils on retrouve bien souvent :
- une vue d'ensemble des agents. Pour voir leur état en un clin d'œil : au travail, bloqué sur une question, terminé.
- une interface pour la revue de code. Pratique vu la quantité de code généré, et voir les diffs de chaque agent.
- l'isolation des agents. Les agents ne se marchent pas sur les pieds, on peut travailler sur plusieurs features facilement, grâce aux [git worktree](https://git-scm.com/docs/git-worktree).
- l'historique des sessions. Rangement automatique des discussions par projet.

L'éditeur de code a parfois complètement disparu. Plus besoin d'écrire. La différence majeure entre un IDE et un ADE est donc : l'un est optimisé pour écrire du code, l'autre pour superviser des agents.

On peut classer les différents outils en 4 catégories :

- les ADE natifs, fournis par les éditeurs de modèles : [Claude Code Desktop](https://code.claude.com/docs/en/desktop), [Codex de ChatGPT](https://chatgpt.com/codex/), [Google Antigravity](https://antigravity.google/), [GitHub Copilot app](https://github.com/features/copilot)
- les "IDE + ADE", le mix des deux avec éditeurs intégrés : [Cursor](https://cursor.com/), [Zed](https://zed.dev/)
- les terminal-first ADE : [Warp](https://www.warp.dev/), [Herdr](https://github.com/herdrdev/herdr)
- les "Agent-agnostic desktop orchestrator" : [Orca](https://github.com/stablyai/orca), [Paradev](https://paradev.com/), [T3 Code](https://t3.codes/)

Le plus simple pour commencer : prenez l'ADE fourni avec votre abonnement. Ils sont bien maintenus car qui dit un bon ADE, dit plus de clients susceptibles d'utiliser leurs modèles. Ils ont des features qui facilitent la vie de dev IA : déjà payé, pas de configuration, browser intégré, connecteurs MCP, synchronisation avec son téléphone pour pouvoir lancer un prompt depuis n'importe où (😉). Le défaut est que forcément c'est un logiciel propriétaire et que notre éditeur est lié au modèle que l'on utilise. Si on change de modèle, il faut changer d'éditeur. Si cela vous gêne, [OpenCode Desktop](https://opencode.ai/desktop) offre la même expérience en open source, avec le modèle de votre choix.

Cela reste quand même, je trouve, la meilleure solution pour débuter et prendre de l'expérience sur le développement agentique. Et il est toujours possible de changer d'outil quand le besoin se fera sentir.

## Changez d'outil quand le travail change

L'évolution de mes outils de travail, forgés avec le temps 👴, a été marquée par les changements dans notre métier et aussi de mes besoins : quand j'ai trouvé Sublime Text trop limité, je me suis tourné vers la suite IntelliJ. Quand j'ai trouvé que c'était trop "usine à gaz" je me suis tourné vers VSCode. Puis la mouche VIM m'a piqué, Neovim est devenu mon favori. Et je passais 100 % de mon temps de développement dans le terminal.

Maintenant avec l'IA, écrire efficacement du code a disparu pour faire place à la nécessité de lire beaucoup plus de code et de superviser plusieurs agents sur plusieurs projets. J'ai donc dû récemment faire évoluer mon environnement de travail.

## Continuez de prendre soin de votre workbench

Mon nouveau setup, en novembre 2026, est devenu un "workflow hybride" : Claude Code Desktop pour le GUI (Graphical user interface) car niveau orchestration l'expérience "out of the box" est niquel. Moi qui ne suis pas quelqu'un de très organisé de base, ici toutes les discussions sont bien rangées automatiquement. Chaque agent et leurs sous-agents sont répertoriés par projet. On a donc un poste de pilotage à IA efficient, sans besoin de configurer grand chose.

J'ai gardé mon terminal et ses outils ([voir mes dotfiles](https://github.com/Fabious/dotfiles)). J'ai juste fait évoluer en ajoutant l'outil en ligne de commande (CLI) Claude Code tout en gardant :
- [Zellij](https://github.com/zellij-org/zellij) pour le multiplexing et la gestion des fenêtres : prompts, suivi de logs, etc.
- [Neovim](https://github.com/neovim/neovim) pour l'édition de code rapide
- [Lazygit](https://github.com/jesseduffield/lazygit) pour tout ce qui concerne Git (le goat à mes yeux)

Je lis le code généré par les agents directement dans l'app Claude, et si besoin je lance Neovim pour naviguer ou éditer le code.

Cela répond à mes propres besoins d'aujourd'hui, ce setup continuera d'évoluer.

Si vous rencontrez un mur, si vous sentez une friction ou tout simplement votre travail évolue, testez d'autres outils. N'hésitez pas à revoir votre environnement de travail. Ce changement d'ère est le bon moment pour faire un ménage de printemps. Pour commencer simplement, installez l'application native à votre abonnement : Claude Code Desktop, Codex de ChatGPT, Google Antigravity ou GitHub Copilot app.

---
title: "Too many AI tools, which one to install?"
date: 2026-11-19
lang: en
description: "How to adapt your work environment when you read more code than you write."
---

I've always written code. For more than 20 years, my machine was meant to write code. Today, I write much less. Thanks to AI, or because of it, depending on your point of view. My work environment no longer fit.
A new jungle of tools has appeared. There are too many! How do I find my way? Let's take our fedora, our whip and onward to discovery!

## We read more than we write

AI has revolutionized how we work: we write much less code. Sometimes none. We must read more than we write. This transformation must be followed by a change in how we work, a change to our tools. Everybody has made their own environment tailored to their needs: PHPStorm on macOS, Eclipse on Windows 🗿, Neovim on Arch Linux (I use arch btw). The goal is to adapt our machine to our needs at each step of our career, like a craftsman hones their tools.

Let's take a step back to really understand why we must upgrade our tools.

**Before:** we wrote lots of code. We had to understand what was happening in our program. We navigated in the code: where does this definition come from, used advanced search to find every call to a function, mass refactoring with dedicated tools. Sometimes we needed a good debugger (though I wrote `console.log`, no shame).

In the early days, we didn't fully trust generated code. We still wrote code. We prompted here and there. The traditional editor (PHPStorm, VSCode, Neovim) integrated AI through plugins.
Then we started to have more trust in what the AI was doing. Does the "ok the code is even better than what I would have done" ring a bell? That's when we transitioned from the art of prompting to agent orchestration: agentic development.

**Now:** we orchestrate AI agents, we read and review so much more code, we must have a broader picture of the program, its architecture, keep track of all the prompts and discussions and plans with AI.

New tools have appeared to answer these new needs.

## Start with the native tool of the subscription you already have

While traditional tools are still evolving, new tools have emerged to tame multiple agents. These are ADEs: Agentic Development Environments.

They share the same features:
- an overview of the agents, to see their state at a glance: working, blocked on a question, done.
- a code review interface. Handy given the amount of generated code, and to see each agent's diff.
- agent isolation. Agents don't step on each other's toes, so you can work on several features at once, thanks to [git worktrees](https://git-scm.com/docs/git-worktree).
- session history. Conversations are filed by project automatically.

The code editor is sometimes entirely gone. No need to write. The main difference between an IDE and an ADE is: one is tailored to write code, the other to supervise agents.

We can identify four kinds of ADE:
- native ADEs, shipped by the model vendors: [Claude Code Desktop](https://code.claude.com/docs/en/desktop), [Codex in ChatGPT](https://chatgpt.com/codex/), [Google Antigravity](https://antigravity.google/), [GitHub Copilot app](https://github.com/features/copilot)
- "IDE + ADE", a mix of both with a built-in editor: [Cursor](https://cursor.com/), [Zed](https://zed.dev/)
- terminal-first ADEs: [Warp](https://www.warp.dev/), [Herdr](https://github.com/herdrdev/herdr)
- "agent-agnostic desktop orchestrators": [Orca](https://github.com/stablyai/orca), [Paradev](https://paradev.com/), [T3 Code](https://t3.codes/)

The easy start: take the ADE that comes with your subscription. They are well maintained, because if their tool is good, they attract more subscribers.
They have features that make an AI developer's life easier: already paid, no configuration, integrated browser, MCP connectors, sync with your mobile phone to work anywhere (😉).
The catch obviously is that you're tied to a proprietary tool, and to its model. If you want to change models, you have to change editor. If that bothers you, [OpenCode Desktop](https://opencode.ai/desktop) offers the same experience in open source, with the model of your choice.

I found this the best way to start and gain experience on agentic development. And you can still change tools if need be.

## Change tools when the work changes

The evolution of my workbench, forged by time 👴, has been marked by the changes of our craft and also my needs: when I found Sublime Text too limited, I tried the IntelliJ suite. When I found it too cumbersome, I used VSCode. Then I started to look at VIM, and now Neovim is my favorite. I developed exclusively in my terminal.

Now with AI, writing code effectively has been replaced by the need to read and review so much more code and also supervise several agents on multiple projects. I had to change my working environment.

## Take care of your workbench

My new setup, as of November 2026, has become a "hybrid workflow":
Claude Code Desktop for the GUI (Graphical User Interface) because the out-of-the-box experience is helpful. I am not the most organized person so having everything tightly organized automatically is neat. Each agent and its sub-agents are listed by project. You quickly get an efficient AI control station, with almost no configuration.

I have kept my terminal and its tools (you can check my [dotfiles](https://github.com/Fabious/dotfiles)).
I have added the Claude Code CLI tool while keeping my trusted tools:
- [Zellij](https://github.com/zellij-org/zellij) for multiplexing and window management: prompts, log tailing, etc.
- [Neovim](https://github.com/neovim/neovim) for quick code editing
- [Lazygit](https://github.com/jesseduffield/lazygit) for everything Git (the GOAT, in my book)

I read generated code in Claude Code Desktop, and if needed I switch to Neovim to navigate and edit code.

This setup suits my present needs, and it will continue to evolve.

If you hit a wall, if you feel friction or more simply your job evolves, try new tools. Don't hesitate to re-examine your work environment. This change of era is a good time to do some spring cleaning.
To start simply, install the native app of your model: Claude Code Desktop, Codex in ChatGPT, Google Antigravity or GitHub Copilot app.

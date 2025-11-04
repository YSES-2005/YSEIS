# Young-Software-Engineers-Inventory-System

Requirements: [Docker Desktop (Windows)](https://docs.docker.com/desktop/setup/install/windows-install/) or [Docker Desktop (Mac)](https://docs.docker.com/desktop/setup/install/mac-install/)

### Development with VSCode Dev Containers

This project has a pre-configured Dev Container, which allows you to use a container as a full-featured development environment.

1.  Make sure you have the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed in VSCode.
2.  When you open this repository in VSCode, you should see a pop-up in the bottom right corner asking if you want to "Reopen in Container". Click it.
3.  If you don't see the pop-up, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and run `Dev Containers: Reopen in Container`.

This will build the dev container and you can start developing inside it.

### Using Makefile (requires make)

```
git clone https://github.com/gflapana/Young-Software-Engineers-Inventory-System
cd Young-Software-Engineers-Inventory-System
make
```

Notes:

- This repository is using pnpm instead of npm(sabi ni robbie) inside Docker images. Locally you can use pnpm as well.
- To install and run locally without Docker, install pnpm (Node 20+ includes corepack; enable it with `corepack enable`), then:

```powershell
cd backend
pnpm install
pnpm run dev

cd ..\frontend
pnpm install
pnpm run dev
```

For linux users kaya nyo na yan

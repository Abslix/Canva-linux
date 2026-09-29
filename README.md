# Canva Electron

Desktop client **Unofficial** for Canva made in Electron. It is not affiliated with, or supported by Canva.

Note: This is made with AI, But is to have a Desktop App of Canva on the desktop.

This is a work in progress. I made this mainly as a hobby/personal project. It is currently tested on Linux x64. The project is AI-assisted and may be unstable. I don't accept issues or pull requests.

## Requirements

* Node.js
* npm
* Linux x64

## Ejecutar

```bash
npm install
npx electron .
```

## Construir paquetes

Install the dependencies:

```bash
npm install
```

Build the Linux packages:

```bash
npm run dist
```

This will generate:

* **AppImage**
* **DEB**
* **RPM**

The files will be available in the `dist/` directory.

## Manual build

You can also build individual formats:

### AppImage

```bash
npx electron-builder --linux AppImage
```

### DEB

```bash
npx electron-builder --linux deb
```

### RPM

```bash
npx electron-builder --linux rpm
```

## Output

After building, the packages will be located in:

```text
dist/
├── Canva-linux-1.0.0.AppImage
├── canva-linux-1.0.0_amd64.deb
└── canva-linux-1.0.0.x86_64.rpm
```

## Disclaimer

This project is an unofficial third-party Electron wrapper for Canva.

It is not affiliated with, endorsed by, sponsored by, or supported by Canva.

This project is provided as-is for personal and educational purposes.

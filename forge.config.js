const path = require('path');

const icon = path.resolve(__dirname, 'icon.png');

module.exports = {
  packagerConfig: {
    executableName: 'canva-linux'
  },

  makers: [
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          id: 'io.github.yago.Canva',
          productName: 'Canva-linux',
          categories: ['Graphics'],

          runtime: 'org.freedesktop.Platform',
          runtimeVersion: '25.08',
          sdk: 'org.freedesktop.Sdk',

          base: 'org.electronjs.Electron2.BaseApp',
          baseVersion: '25.08',

          modules: [],

          finishArgs: [
            '--share=network',
            '--socket=x11',
            '--share=ipc',
            '--device=dri',
            '--socket=pulseaudio',
            '--filesystem=home',
            '--env=TMPDIR=/var/tmp'
          ],

          icon
        }
      }
    },

    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          productName: 'Canva-linux',
          maintainer: 'yago',
          categories: ['Graphics'],
          icon
        }
      }
    },

    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          productName: 'Canva-linux',
          categories: ['Graphics'],
          icon
        }
      }
    }
  ]
};

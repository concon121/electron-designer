const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const openAboutWindow = require('about-window').default;
const path = require('path');

const template = [{
  label: 'Edit',
  submenu: [{
    role: 'undo'
  },
  {
    role: 'redo'
  },
  {
    type: 'separator'
  },
  {
    role: 'cut'
  },
  {
    role: 'copy'
  },
  {
    role: 'paste'
  },
  {
    role: 'pasteandmatchstyle'
  },
  {
    role: 'delete'
  },
  {
    role: 'selectall'
  }
  ]
},
{
  label: 'View',
  submenu: [{
    role: 'reload'
  },
  {
    role: 'forcereload'
  },
  {
    role: 'toggledevtools'
  },
  {
    type: 'separator'
  },
  {
    role: 'resetzoom'
  },
  {
    role: 'zoomin'
  },
  {
    role: 'zoomout'
  },
  {
    type: 'separator'
  },
  {
    role: 'togglefullscreen'
  }
  ]
},
{
  role: 'window',
  submenu: [{
    role: 'minimize'
  },
  {
    role: 'close'
  }
  ]
},
{
  role: 'help',
  submenu: [{
    label: 'About',
    click() {
      openAboutWindow({
        icon_path: path.join(__dirname, '../stylesheets/v2/content/images/govuk-crest-2x.png')
      });
    }
  }, {
    label: 'Learn More',
    click() {
      require('electron').shell.openExternal('https://electron.atom.io');
    }
  }]
}
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [{
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      role: 'services',
      submenu: []
    },
    {
      type: 'separator'
    },
    {
      role: 'hide'
    },
    {
      role: 'hideothers'
    },
    {
      role: 'unhide'
    },
    {
      type: 'separator'
    },
    {
      role: 'quit'
    }
    ]
  });

  template[1].submenu.push({
    type: 'separator'
  }, {
    label: 'Speech',
    submenu: [{
      role: 'startspeaking'
    },
    {
      role: 'stopspeaking'
    }
    ]
  });

  template[3].submenu = [{
    role: 'close'
  },
  {
    role: 'minimize'
  },
  {
    role: 'zoom'
  },
  {
    type: 'separator'
  },
  {
    role: 'front'
  }
  ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

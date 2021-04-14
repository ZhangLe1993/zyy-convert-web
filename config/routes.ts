export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/picture/water',
          },
          {
            path: '/picture/water',
            name: 'pictureWater',
            icon: 'picture',
            component: './picture/index.tsx',
          },
          {
            path: '/video/analysis',
            name: 'videoAnalysis',
            icon: 'youtube',
            component: './video/analysis/index.tsx',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];


import HomePage from '../pages/home.svelte';
import ServerPage from '../pages/server.svelte';
import FileBrowser from '../pages/filebrowser.svelte';
var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/server/:ip',
    component: ServerPage,
  },
  {
    path: '/filebrowser/:ip',
    component: FileBrowser,
  },
];

export default routes;

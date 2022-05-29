
import HomePage from '../pages/home.svelte';
import ServerPage from '../pages/server.svelte';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/server/:ip',
    component: ServerPage
  },
];

export default routes;

import { writable } from 'svelte/store';
export let servers_store = writable();
if(localStorage.getItem('servers') != undefined)
    servers_store = writable(localStorage.getItem("servers"))
else
    servers_store = writable([]);
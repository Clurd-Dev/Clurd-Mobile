<Page name="home">
  <!-- Top Navbar -->
  <Navbar sliding={false}>
    <NavTitle sliding>Clurd</NavTitle>
    <NavTitleLarge>Clurd</NavTitleLarge>
  </Navbar>
  <Block>
    <center>
      <BlockTitle>Welcome to Clurd App</BlockTitle>
    </center>
    <br/>
    <Button fill on:click={addserver}>Add a server</Button>
    <br/>
    <List>
      {#each servers as server}
        <ListItem title={server.name + " - " + server.ip} link={"/server/" + server.ip} ></ListItem>
      {/each}
    </List>
  </Block>
</Page>
<script>
  import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavTitleLarge,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    Row,
    Col,
    Button,
    f7
  } from 'framework7-svelte';
  import { servers_store } from '../js/servers';
  import { onMount } from 'svelte';
  import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

  let servers = [];

  onMount(async ()=>{  
    let servers_from_store = localStorage.getItem("servers");
    if(servers_from_store != undefined){
      servers = JSON.parse(localStorage.getItem("servers"));
      servers_store.set(servers);
    }
  });
  function addserver() {
    servers_store.subscribe(value => console.log(value))
    f7.dialog.prompt("Enter the IP of your Clurd server with port", "Add a Clurd Server", (msg) => {
      if(msg != undefined && msg != ""){
        let ip, nameserver;
        ip = msg;
        f7.dialog.prompt("Enter the name of your Clurd server", "Add a Clurd Server", (name) => {
          if(name != undefined && name != ""){
            nameserver = name;
            servers.push({
            "ip": ip,
            "name": nameserver
            });
            servers = servers;
            servers_store.set(servers);
            localStorage.setItem("servers", JSON.stringify(servers));
          }else{
            f7.dialog.alert("Please enter a name"); 
          }
        });
      }
   
    }, ()=> f7.dialog.alert("Please enter an IP"));

  }
</script>
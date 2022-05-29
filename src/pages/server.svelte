<Page name="product">
    <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:arrow_left" iconAurora="f7:arrow_left" iconMd="f7:arrow_left" href="/" />
        </NavLeft>
        <NavTitle sliding>{serverip}</NavTitle>
      </Navbar>
    <Block>
        <List>
            {#each files as file_raw}
                
                    {#if file_raw.dir == true}
                    <ListItem title={file_raw.file} >
                        <i slot="media" class="icon demo-list-icon fa-solid fa-folder"></i>
                    </ListItem>
                    {:else}
                    <ListItem title={file_raw.file} on:click={async () => await(current_file = file_raw.file)} actionsOpen="#actions-one-group" href="#" >
                        <i slot="media" class="icon demo-list-icon fa-solid fa-file"></i>
                    </ListItem>
                    {/if}
            {/each}

          </List>
    </Block>
      <!-- One Group -->
  <Actions id="actions-one-group">
    <ActionsGroup>
      <ActionsLabel>{current_file}</ActionsLabel>
      <ActionsButton bold>Download</ActionsButton>
      <ActionsButton color="red">Cancel</ActionsButton>
    </ActionsGroup>
  </Actions>
</Page>


<script>
    import '@fortawesome/fontawesome-free/css/all.css'
    import { onMount } from 'svelte';
    import {Page, Navbar, Button, Block, BlockTitle, NavLeft, NavTitle, Link, List, ListItem, f7, Actions, ActionsGroup, ActionsButton, ActionsLabel} from 'framework7-svelte';
    export let f7route;
    const serverip = f7route.params.ip;
    let files = [], path, current_file;
    onMount(async ()=>{
        const request = await fetch("http://" + serverip + '/' + 'getconfig');
        if (request.ok) {
            const json = await request.json();
            path = json.path;
        } else {
            f7.dialog.alert("Error during connection of server, more detail on device log");
            console.log('HTTP-Error: ' + request.status);
        }
        const xhr = new XMLHttpRequest();
		let url = "http://" + serverip + '/' + 'getfiles';
		console.log(url);
		xhr.open('POST', url, true);
		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				files = JSON.parse(this.response);
			}
		};
		xhr.send(JSON.stringify({ folder: path }));
    });
</script>
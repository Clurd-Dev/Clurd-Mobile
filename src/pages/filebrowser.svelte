<Page name="product">
    <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:arrow_left" iconAurora="f7:arrow_left" iconMd="f7:arrow_left" back id="back" />
        </NavLeft>
        <NavTitle sliding>Copy/Move {filename}</NavTitle>
      </Navbar>
      <BlockTitle> Select the folder where you want to copy file</BlockTitle>
    <Block>
        <Link iconF7="arrow_left" text="Go back" on:click={goback}></Link>
        <List>
            {#each files as file_raw,i}
                    {#if file_raw.dir == true}
                    <ListItem title={file_raw.file} on:click={change_folder(file_raw.file)}>
                        <Icon ios="f7:folder" aurora="f7:folder" md="material:folder" slot="media"/>
                    </ListItem>
                    {:else}
                    <ListItem title={file_raw.file}>
                        <Icon ios="f7:doc" aurora="f7:doc" md="f7:doc" slot="media"/>
                    </ListItem>
                    {/if}
            {/each}
          </List>
          <Button text="Copy file there" fill on:click={copy_file(serverip, sessionStorage.getItem("path"), path + "/" + filename)}></Button>
          <br/>
          <Button text="Move file there" fill on:click={move_file(serverip, sessionStorage.getItem("path"), path + "/" + filename)}></Button>
    </Block>
</Page>


<script>
    import { copy_file, move_file } from '../js/server_io.js';
    import { onMount } from 'svelte';
    import {Page, Navbar, Button, Block, BlockTitle, NavLeft, NavTitle, Link, List, ListItem, f7, Icon, Row, Col} from 'framework7-svelte';
    export let f7route;
    const serverip = f7route.params.ip;
    let files = [], path, initial, filename, index;
    filename = sessionStorage.getItem("filename");
        path = sessionStorage.getItem("fullpath");
        if(path == undefined)
            f7.dialog.alert("Error during opening of file browser");
        initial = path;
    async function getfiles(){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + serverip + "/" + "getfiles", true);

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                files = JSON.parse(this.response);
            }
        }
        xhr.send(JSON.stringify({folder: path}));
    }
    getfiles();
    async function change_folder(new_path){
        path = path + "/" + new_path;
        await getfiles(serverip, path);
    }
    async function goback(){
        if(path != initial){
            path = path.split("/");
            path.pop();
            path = path.join("/");
            await getfiles(serverip, path);
        }else{
            f7.dialog.alert("Can't go back through home");
        }
    }

</script>
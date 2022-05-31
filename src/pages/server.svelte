<Page name="product">
    <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:arrow_left" iconAurora="f7:arrow_left" iconMd="f7:arrow_left" href="/" />
        </NavLeft>
        <NavTitle sliding>{serverip}</NavTitle>
      </Navbar>
    <Block>
        <Link iconF7="arrow_left" text="Go back" on:click={goback}></Link>
        <List>
            {#each files as file_raw,i}
                
                    {#if file_raw.dir == true}
                    <ListItem title={file_raw.file} href="#" on:click={change_folder(file_raw.file)}>
                        <Icon ios="f7:folder" aurora="f7:folder" md="material:folder" slot="media"/>
                    </ListItem>
                    {:else}
                    <ListItem title={file_raw.file} on:click={async () => {
                        await(current_file = file_raw.file);
                        await(index = i)
                        }} actionsOpen="#actions-one-group" href="#" >
                        <Icon ios="f7:doc" aurora="f7:doc" md="f7:doc" slot="media"/>
                    </ListItem>
                    {/if}
            {/each}

          </List>
    </Block>
      <!-- One Group -->
  <Actions id="actions-one-group">
    <ActionsGroup>
      <ActionsLabel>{current_file}</ActionsLabel>
      <ActionsButton bold on:click={download}>Download</ActionsButton>
      <ActionsButton bold>
          <Link href={"/filebrowser/" + serverip} on:click={copy_file}>Copy/Move folder</Link>
      </ActionsButton>
      <ActionsButton bold on:click={rename}>Rename</ActionsButton>
      <ActionsButton bold on:click={remove}>Delete</ActionsButton>
      <ActionsButton bold on:click={detail}>Detail</ActionsButton>
      <ActionsButton color="red">Cancel</ActionsButton>
    </ActionsGroup>
  </Actions>
</Page>


<script>
    import { Browser } from '@capacitor/browser';
    import { Capacitor } from '@capacitor/core';
    import { getconfig, rename_file, remove_file } from '../js/server_io.js';
    import { onMount } from 'svelte';
    import { Filesystem, Directory, Encoding} from '@capacitor/filesystem';
    import {Page, Icon, Navbar, Button, Block, BlockTitle, NavLeft, NavTitle, Link, List, ListItem, f7, Actions, ActionsGroup, ActionsButton, ActionsLabel, Row, Col} from 'framework7-svelte';
    import { Http } from '@capacitor-community/http';
    export let f7route;
    const serverip = f7route.params.ip;
    let  files = [], path, current_file, virt_path = "/", index , initial;  
    async function getfiles(){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + serverip + "/" + "getfiles", true);

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                files = JSON.parse(this.response);
            }
        }
        xhr.send(JSON.stringify({folder: path}));
        console.log(files)
    }                
    onMount(async ()=>{
        path = await getconfig(serverip);
        await getfiles();
        initial = path;
    });
    async function download(){
        let urldownload = "http://" + serverip + virt_path + current_file;
        if(Capacitor.getPlatform() == "android"){
            console.log(urldownload);
        const options = {
            url: urldownload,
            filePath: current_file,
            fileDirectory: Directory.Documents,
            // Optional
            method: 'GET',
        };
        const response= await Http.downloadFile(options).catch(err => console.error(err));
        if (response.path)
            f7.dialog.alert("File downloaded successfully in document folder of phone");
        else
            f7.dialog.alert("Can't download the file, check the log of your device");
        }else{
            f7.dialog.alert("Due to iOS limitation in file system policy, the download work only in native browser, in other platforms the download work perfectly", async()=>await Browser.open({ url: urldownload}));
        }
        
    }
    async function rename() {
        await f7.dialog.prompt("Enter a new name for this file", current_file, async(newfile)=>{
            console.log(newfile);
            if(newfile != "" || newfile != undefined){
                let response_from_rename = await rename_file(serverip, path + "/" + current_file, path + "/" + newfile);
                await getfiles();
            }
            else
                f7.dialog.alert("This name isn't valid");
        })
    }
    function remove() {
        f7.dialog.confirm("Want you remove " + current_file + "?", current_file , async() =>{
            await remove_file(serverip, path + "/" + current_file);
            await getfiles();
            f7.dialog.alert("File removed successfully");
        });
    }
    async function copy_file(){
        await sessionStorage.setItem("path", path + "/" + current_file);
        await sessionStorage.setItem("filename", current_file);
        await sessionStorage.setItem("fullpath", path);
    }
    function detail(){
        let details = `Filename: ${current_file} \n Size: ${files[index].size} \n Path: ${path + "/" + current_file} \n Read-Only: ${files[index].read_only}`
        f7.dialog.alert(details, current_file)
    }
    async function change_folder(new_path){
        virt_path = virt_path + new_path + "/";
        path = path + "/" + new_path;
        await getfiles(serverip, path);
    }
    async function goback(){
        if(path != initial && virt_path != "/"){
            path = path.split("/");
            path.pop();
            path = path.join("/");
            virt_path = virt_path.split("/");
            virt_path.pop();
            virt_path.pop();
            virt_path = virt_path.join("/") + "/";
            console.log(virt_path);
            await getfiles(serverip, path);
        }else{
            f7.dialog.alert("Can't go back through home");
        }
    }
</script>
import { Http } from '@capacitor-community/http';
import { f7 } from 'framework7-svelte';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export async function download_folder(files, path, serverip, fspath){
    let error = false;
    if(Capacitor.getPlatform() == "android"){
        Filesystem.mkdir({
            directory: Directory.Documents,
            path: "Clurd"
        }).catch(err =>{
            console.error(err);
        })
    files.forEach(async(file_raw) => {
        if(file_raw.dir != true){
            let urldownload = "http://" + serverip + path + file_raw.file;
            console.log(urldownload);
        const options = {
            url: urldownload,
            filePath: "Clurd/" + file_raw.file,
            fileDirectory: Directory.Documents,
            method: 'GET',
        };
        const response= await Http.downloadFile(options).catch(err => console.error(err));
        if (!response.path)
            error = true;
        }else{
            Filesystem.mkdir({
                directory: Directory.Documents,
                path: "Clurd/" + file_raw.file
            }).catch(err=>{
                console.log(file_raw.file);
                console.error(err);
                error = true;
            });
        }
    });
    }else
        f7.dialog.alert("The sync feature not work in iOS due to file system limitation of this OS.");
    if(error == true)
        f7.dialog.alert("Error during syncing of some data, if there are some folde hidden like .git or other this thing is normal, else check in your device log");
    else
        f7.dialog.alert("Sync finished");
}
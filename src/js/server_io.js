import {f7} from 'framework7-svelte';
import { Http } from '@capacitor-community/http';
export async function getconfig(url){
    const response_path = await Http.get({
        url: "http://" + url + '/' + 'getconfig'
            }).catch(err => {
                alert(err);
                console.error(err);
                f7.dialog.alert("Error during connection to API server, check error in the log of device");
            });
            //alert(response.data.path);
            //console.log(response_path.data.path);
            return response_path.data.path;
}


export async function rename_file(url, old_name, new_name) {
    console.log(old_name);
    console.log(new_name);
	const response = await Http.post({
                url: "http://" + url + '/' + 'rename',
                data: { folder: old_name, new: new_name},
            }).catch(err => {
                console.error(err);
                f7.dialog.alert("Error during connection to API server, check error in the log of device");
            });
    return response;
}

export async function remove_file(url, path){
	const response = await Http.post({
        url: "http://" + url + '/' + 'remove',
        data: { folder: path},
    }).catch(err => {
        console.error(err);
        f7.dialog.alert("Error during connection to API server, check error in the log of device");
    });
    return response;
}

export async function copy_file(url, oldpath, newpath){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + url + "/" + "copy", true);
    
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(this.response);
            if(this.response == "1"){
                f7.dialog.alert("File is successfully copied", "File copied successfully", ()=>document.getElementById("back").click());
            }else{
                f7.dialog.alert("Error during copy of file", "Error", ()=>document.getElementById("back").click());
            }
        }
    }
    xhr.send(JSON.stringify({ folder: oldpath, new: newpath}));
}

export async function move_file(url, oldpath, newpath){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + url + "/" + "move", true);
    
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(this.response);
            if(this.response == "1"){
                f7.dialog.alert("File is successfully copied", "File copied successfully", ()=>document.getElementById("back").click());
            }else{
                f7.dialog.alert("Error during copy of file", "Error", ()=>document.getElementById("back").click());
            }
        }
    }
    xhr.send(JSON.stringify({ folder: oldpath, new: newpath}));

}
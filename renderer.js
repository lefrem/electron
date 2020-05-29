const fs = require('fs');
const os = require('os');
const mkdirp = require('mkdirp');
const {shell} = require('electron');
const TabGroup = require("electron-tabs");

let path = os.homedir();
let lastPath = [];
let copyBuffer = [];

readFolder();

function view(folder) {    
    switch (folder) {
        case 'home':
            path = os.homedir();
            break;
        case 'desktop':
            path = os.homedir();
            path = path+"\\Desktop";
            break;
        case 'device':
            break;
        case 'document':
            path = os.homedir();
            path = path+"\\Documents";
            break;
        case 'download':
            path = os.homedir();
            path = path+"\\Downloads";
            break;    
        case 'picture':
            path = os.homedir();
            path = path+"\\Pictures";
            break;
        case 'video':
            path = os.homedir();
            path = path+"\\Videos";
            break;
        case 'music':
            path = os.homedir();
            path = path+"\\Music";
            break;
        default:            
            break;
    }

    readFolder();

}

function readFolder() {
    document.getElementById("viewBody").innerHTML = "";
    document.getElementById("path").value = "";
    document.getElementById("path").value = path;

    if (lastPath[lastPath.length-1] != path) {
        lastPath.push(path);
    }
        
    try {
        let files = fs.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            let link = path+"\\"+files[i];
            fs.stat(link, (err,stats) => {
                if (err) {
                    console.log(err);
                }
                if (stats.isDirectory()) {
                    birth = stats.birthtime.toString().substring(4, 24);
                    time = stats.mtime.toString().substring(4, 24);
                    document.getElementById("viewBody").innerHTML += '<tr onclick="selected(select'+i+')" ondblclick="childFolder(\'' + files[i] + '\')"><th><input type="checkbox" name="selected" id="select'+i+'"></th><th><img src="./images/folder.svg" class="icon-view" alt=""></th><th>'+files[i]+'</th><th>'+birth+'</th><th>'+time+'</th><th></th></tr>';
                }
                if (stats.isFile()) {
                    birth = stats.birthtime.toString().substring(4, 24);
                    time = stats.mtime.toString().substring(4, 24);
                    document.getElementById("viewBody").innerHTML += '<tr onclick="selected(select'+i+')" ondblclick="openFile(\'' + files[i] + '\')"><th><input type="checkbox" name="selected" id="select'+i+'"><th><img src="./images/file.svg" class="icon-view" alt=""></th><th>'+files[i]+'</th><th>'+birth+'</th><th>'+time+'</th><th>'+stats.size+'</th></tr>';
                }
                
            })
        }
    } catch (err) {
        console.log(err);
    }    
}

function childFolder(link) {
    path = path+'\\'+link;
    readFolder();
}

function openFile(link) {
    path = path+'\\'+link;
    shell.openExternal(path);
    path = path.split('\\');
    path.pop();
    path = path.join('\\');
}

function until() {
    path = path.split('\\');
    path.pop();
    path = path.join('\\');

    if (lastPath[lastPath.length-1] != path) {
        lastPath.push(path);
    }

    readFolder();
}

function backPath() {
    if (lastPath.length != 1) {
        lastPath.pop()
        path = lastPath[lastPath.length-1];
        readFolder()
    }
}

function selected(select) {
    if (document.getElementById(select.id).checked == true) {
        document.getElementById(select.id).checked = false;
    } else if (document.getElementById(select.id).checked == false) {
        document.getElementById(select.id).checked = true;
    }
}

function newTab() {
    let tabGroup = new TabGroup();

    let tab = tabGroup.addTab({
      title: path,
      src: path,
      visible: true
    });
}

function creatFile() {
    console.log('creat file');
    let data='';
    fs.writeFileSync(path+"\\test.txt", data, (err) => { 
        if (err) {
          console.log(err);
        } 
        else { 
          console.log("File written successfully");
        } 
      }); 
}

function creatFolder() {
    console.log('creat folder');
    fs.mkdirSync(path+"\\test",(err) => { 
        if (err) {
            console.log(err);
        } 
        else { 
          console.log("Folder written successfully");
        } 
      }); 
}

function rename() {
    console.log('rename');

    fs.rename(path+"\\test.txt", path+"\\tests.txt", (err) => { 
        if (err) {
            console.log(err);
        } 
        else { 
          console.log("raname successfully");
        } 
      }); 
}

function trash() {
    console.log('trash');
    shell.moveItemToTrash(path+"\\tests.txt");
}

function copy() {
    fs.copyFile(path+"\\tests.txt",copyBuffer, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(copyBuffer);
        console.log('tests.txt was copied in buffer');
      });
}

function past() {
    fs.copyFile(copyBuffer,path, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(copyBuffer);
        console.log('tests.txt was past in new folder');
      });
}

function move() {
    fs.copyFile(path+"\\tests.txt",path+"\\test\\tests.txt", (err) => {
        if (err) {
            console.log(err);
        }
      });
    shell.moveItemToTrash(path+"\\tests.txt");
}

function goToFolder() {
    path = document.getElementById("path").value;
    readFolder()
}
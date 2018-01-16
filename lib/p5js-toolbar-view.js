'use babel';

const express = require('express')
const portfinder = require('portfinder');
const http = require('http');

export default class P5jsToolbarView {

  constructor(serializedState) {

    this.app = express()
    this.server;
    this.port;

    //serverStatus of the server if off = false, on = true
    this.serverStatus = false;

    this.localPath =  atom.packages.resolvePackagePath("p5js-toolbar")

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('p5js-toolbar');
    const toolbar = this.element



    this.logo = document.createElement("img");
    this.logo.classList.add('p5logo');
    this.logo.src = this.localPath + "/images/p5js.svg";
    toolbar.appendChild(this.logo);

    this.button = document.createElement('img');
    this.button.classList.add('p5button');
    this.button.src = this.localPath + "/images/play-button.svg";
    toolbar.appendChild(this.button);

    this.button.addEventListener("mouseover", (e) => {
      if(this.serverStatus == true){
        this.button.src = this.localPath + "/images/stop-button-flip.svg";
      }else{
        this.button.src = this.localPath + "/images/play-button-flip.svg";
      }
    });

    this.button.addEventListener("mouseout", (e) => {
      if(this.serverStatus == true){
        this.button.src = this.localPath + "/images/stop-button.svg";
      }else{
        this.button.src = this.localPath + "/images/play-button.svg";
      }
    });

    this.button.addEventListener("click", (e) => {
      if(this.serverStatus == true){ //stop server
        // console.log("stop server")
        this.stopServer()
      }else{ //start server
        // console.log("start server")
        if(atom.project.getPaths()[1]){
          atom.notifications.addError('You might have more than one p5js project open? Open a single project and try again.');
        }else{
            if( fs.existsSync(atom.project.getPaths()[0] + "/index.html") ){ //check to see if the index.html exists.
              this.startServer()
            }else{
              console.error('no index file found')
              atom.notifications.addError('No index.html file found, are you sure you have a valid p5js project open?');
            }
        }
      }
    });


    this.newProject = document.createElement('a');
    this.newProject.classList.add('newProject');
    this.newProject.appendChild( document.createTextNode("+ New Project") );
    this.newProject.title = "+ New Project";
    this.newProject.href = "https://github.com/processing/p5.js/releases/download/0.5.16/p5.zip"; //https://p5js.org/download/
    toolbar.appendChild(this.newProject);
    // this.newProject.addEventListener("click", () => {
    //   console.log("Creating new p5js project...")
    //
    //   // fs.copyFile(this.localPath + "/p5", 'dest',fs.constants.COPYFILE_EXCL, (err) => {
    //   //   if (err) throw err;
    //   //   console.log('p5 copied to destination');
    //   // });
    //
    //
    // })

    function createLink(title, link){
      var c = document.createElement('a');
      c.appendChild( document.createTextNode(title) );
      c.title = title;
      c.href = link;
      toolbar.appendChild(c);
    }

    createLink("Reference", "http://p5js.org/reference");
    createLink("Forum", "https://forum.processing.org/two/#Category_28");
    createLink("Report Issue", "https://github.com/processing/p5.js/issues");

  } //end constructor

  startServer(){
    console.log("***RUN THE SERVER***")
    this.serverStatus = true
    // console.log(atom.project.getPaths()[0])
    this.app.use(express.static(atom.project.getPaths()[0] ))
    // let port = 3000;
    portfinder.getPort((err, port) => {
      if(err){ atom.notifications.addError(err); return;}
      this.port = port
      this.server = this.app.listen(port, () => {
        console.log('p5jstoolbar server started on: ' + port)
        atom.notifications.addSuccess('p5js-toolbar started a server to run your project at http://localhost:' + port)
        this.button.src = this.localPath + "/images/stop-button.svg";
      });
      shell.openExternal('http://localhost:'+port)
    });
  }

  stopServer(){
    console.log("***STOP THE SERVER***")
    this.serverStatus = false
    this.button.src = this.localPath + "/images/play-button.svg";
    // console.log(this.server)
    if(this.server){
      atom.notifications.addWarning('p5js-toolbar closed the server running your project at http://localhost:' + this.port)
      this.server.close()
    }
  }


  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    //kill the server too!
    this.stopServer()
  }

  getElement() {
    return this.element;
  }

}
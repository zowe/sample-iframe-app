/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/



/* JS within an iframe can reference objects of the page it is embedded in via window.parent.
   With ZLUX, there's a global called ZoweZLUX which holds useful tools. So, a site
   Can determine what actions to take by knowing if it is or isnt embedded in ZLUX via IFrame.
*/
var mvdWindow = window.parent;
var ZoweZLUX = null;
if (mvdWindow) {
  ZoweZLUX = mvdWindow.ZoweZLUX;
}


function HelloService() {
  this.path = null;
}

HelloService.prototype.setDestination = function(path) {
  this.path = path;
}

HelloService.prototype.sayHello = function(text, destination, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', destination, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE) {
      callback(xhr.responseText);
    }
  }
  xhr.send(JSON.stringify({
    "_objectType": "org.zowe.zlux.sample.angular.request.hello",
    "_metaDataVersion": "1.0.0",
    "messageFromClient": text
  }));
}

var helloService = new HelloService();

function sayHello() {
  if (ZoweZLUX) {
    console.log('IFrame is within MVD');
    let myPluginDef = mvdWindow.ZoweZLUX.pluginManager.getPlugin('org.zowe.zlux.sample.iframe');
    let url = mvdWindow.ZoweZLUX.uriBroker.pluginRESTUri(myPluginDef, 'hello', null);
    helloService.sayHello(document.getElementById('helloText').value, url, (resText) => {
    try {
      const responseJson = JSON.parse(resText);
      let serverResponseMessage = document.getElementById('serverResponseMessage');
      if (responseJson != null && responseJson.serverResponse != null) {
        serverResponseMessage.innerHTML = 
          `Server replied with 
        
        "${responseJson.serverResponse}"`;
      } else {
        serverResponseMessage.innerHTML = "<Empty Reply from Server>";
      }
      console.log(responseJson);
    } catch (e) {
      console.log(`Failed to parse response json. Received response text=${resText}`);
    }
  });
  } else {
    let serverResponseMessage = document.getElementById('serverResponseMessage');
    console.log((serverResponseMessage.innerHTML = "Not inside of Zowe, and not sure how to contact dataservice"));
  }
}


// Tests the sending of requests to other plugins. Invoked
// by the button labelled "Send App Request"

function sendAppRequest() {
  var requestText = document.getElementById('parameters').value;
  var parameters = null;
  /*Parameters for Actions could be a number, string, or object. The actual event context of an Action that an App recieves will be an object with attributes filled in via these parameters*/
  try {
    if (requestText !== undefined && requestText.trim() !== "") {
      parameters = JSON.parse(requestText);
    }
  } catch (e) {
    //requestText was not JSON
  }

  let appId = document.getElementById('appId').value;  
  if (appId) {
    let statusElement = document.getElementById('status');
    let message = '';
    if (ZoweZLUX) {
      console.log((message = 'IFrame is within MVD'));
      /* PluginManager can be used to find what Plugins (Apps are a type of Plugin) are part of the current ZLUX instance.
         Once you know that the App you want is present, you can execute Actions on it by using the Dispatcher.
      */
      let dispatcher = mvdWindow.ZoweZLUX.dispatcher;
      let pluginManager = mvdWindow.ZoweZLUX.pluginManager;
      let plugin = pluginManager.getPlugin(appId);
      if (plugin) {
        let actionTypes = document.getElementsByName('actionType');
        let type;
        for (let i =0; i < actionTypes.length; i++) {
          if (actionTypes[i].checked) {
            type = dispatcher.constants.ActionType[actionTypes[i].value];
            break;
          }
        }

        let targetModes = document.getElementsByName('targetMode');
        let mode;
        for (let i =0; i < targetModes.length; i++) {
          if (targetModes[i].checked) {
            mode = dispatcher.constants.ActionTargetMode[targetModes[i].value];
            break;
          }
        }

        if (type != undefined && mode != undefined) {
          let actionTitle = 'Launch app from sample app';
          let actionID = 'org.zowe.zlux.sample.launch';
          let argumentFormatter = {data: {op:'deref',source:'event',path:['data']}};
          /*Actions can be made ahead of time, stored and registered at startup, but for example purposes we are making one on-the-fly.
            Actions are also typically associated with Recognizers, which execute an Action when a certain pattern is seen in the running App.
          */
          let action = dispatcher.makeAction(actionID, actionTitle, mode,type,appId,argumentFormatter);
          let argumentData = {'data':(parameters ? parameters : requestText)};
          console.log((message = 'App request succeeded'));        
          statusElement.innerHTML = message;
          /*Just because the Action is invoked does not mean the target App will accept it. We've made an Action on the fly,
            So the data could be in any shape under the "data" attribute and it is up to the target App to take action or ignore this request*/
          dispatcher.invokeAction(action,argumentData);
        } else {
          console.log((message = 'Invalid target mode or action type specified'));        
        }
      } else {
        console.log((message = 'Could not find App with ID provided'));
      }
    }
    statusElement.innerHTML = message;
  }
}

window.addEventListener("load", function () {
  console.log('Sample iframe app has loaded');
}, false);


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

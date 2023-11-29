import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';



let data = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://portal.vidyo.com/user/v1_1">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <v1:LogInRequest>\r\n         <!--Optional:-->\r\n        \r\n         <!--Optional:-->\r\n         <v1:returnEndpointBehavior>false</v1:returnEndpointBehavior>\r\n         <!--Optional:-->\r\n         <v1:returnAuthToken>true</v1:returnAuthToken>\r\n         <!--Optional:-->\r\n         <v1:returnPortalVersion>false</v1:returnPortalVersion>\r\n         <!--Optional:-->\r\n         <v1:returnServiceAddress>false</v1:returnServiceAddress>\r\n         <!--Optional:-->\r\n         <v1:returnNeoRoomPermanentPairingDeviceUserAttribute>false</v1:returnNeoRoomPermanentPairingDeviceUserAttribute>\r\n         <!--Optional:-->\r\n         <v1:returnUserRole>false</v1:returnUserRole>\r\n         <!--Optional:-->\r\n         <v1:returnJwtTokens>false</v1:returnJwtTokens>\r\n         <!--Optional:-->\r\n         \r\n      </v1:LogInRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>';


export function onSubmit(username, password , onSuccess, onFailure) {
    let base64Crd = window.btoa(`${username}:${password}`);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://natantest.alpha.vidyo.com/services/v1_1/VidyoPortalUserService/',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Basic ' + base64Crd
        },
        data: data
    };
    axios.request(config)
        .then((response) => {

                // parsing to json 
                const options = {
                    ignoreDeclaration: true,
                    ignorePiTags: true,
                    removeNSPrefix: true,
                    ignoreAttributes: false
                };
                const parser = new XMLParser(options);
                const output = parser.parse(response.data);
                  
                // saving token in session
                window.sessionStorage.setItem('username',username) ;
                window.sessionStorage.setItem('password',password) ;
                window.sessionStorage.setItem('authToken',output.Envelope.Body.LogInResponse.authToken) ;
            
                onSuccess();
        })
        .catch((error) => {
            console.log(error);
            onFailure();
        });

}

export async function fetchAllRooms(){
    let conf = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://20.239.41.110:81/fetchAllRooms',
        headers: { }
      };
      
    const promise = await axios.request(conf);
    return displayTable(promise.data);

}

function displayTable(roomJson){
    var html = `<table>`;
    for(let i=0; i<roomJson.length; i++){
        html = html + `<tr><td><label>`+ roomJson[i].roomName +`</label></td>`+
         `<td><button onclick="disconnect('${roomJson[i].roomKey}','${roomJson[i].roomName}')" type ="button">Disconnect</button> </td></tr>`;
    }
    html = html + `</table>`;
    return html;
}

window.disconnect = function(roomId, roomName){

let data = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://portal.vidyo.com/user/v1_1">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <v1:GetEntityByRoomKeyRequest>\r\n         <v1:roomKey>'+roomId+'</v1:roomKey>\r\n      </v1:GetEntityByRoomKeyRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>';
let authToken = window.sessionStorage.getItem('authToken');
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://natantest.alpha.vidyo.com/services/v1_1/VidyoPortalUserService',
  headers: { 
    'Content-Type': 'text/plain', 
    'Authorization': 'Basic '+ authToken
  },
  data : data
};

axios.request(config)
.then((response) => {
  const options = {
    ignoreDeclaration: true,
    ignorePiTags: true,
    removeNSPrefix: true,
    ignoreAttributes: false
};
const parser = new XMLParser(options);
const output = parser.parse(response.data);
const entityID = output.Envelope.Body.GetEntityByRoomKeyResponse.Entity.entityID;
roomDisconnect(entityID, roomName);
})
.catch((error) => {
  console.log(error);
});

function roomDisconnect(entityID , roomName){
    
let data = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://portal.vidyo.com/user/v1_1">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <v1:disconnectConferenceAllRequest>\r\n         <v1:conferenceID>'+entityID+'</v1:conferenceID>\r\n      </v1:disconnectConferenceAllRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>';
let authToken = window.sessionStorage.getItem('authToken');
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://natantest.alpha.vidyo.com/services/v1_1/VidyoPortalUserService',
  headers: { 
    'Content-Type': 'text/plain', 
    'Authorization': 'Basic ' + authToken
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  alert(roomName + " room's participant are disconnected");
})
.catch((error) => {
  console.log(error);
});

}

}
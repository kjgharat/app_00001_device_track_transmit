
var sw_ver = "0.0.1 005"
var deviceID = "TEST";
var lastReadMin = -1;

var sidemenu_main = {
  view: "sidemenu",
  id: "topmenu",
  width: 200,
  position: "left",
  state: function (state) {
    var toolbarHeight = $$("toptoolbar").$height;
    state.top = toolbarHeight;
    state.height -= toolbarHeight;
  },
  css: "topmenu",
  body: {
    view: "list",
    borderless: true,
    scroll: false,
    template: "<span class='webix_icon fa-#icon#'></span> #value#",
    data: [
      {id: 1, value: "User Profile", icon: "user"},
      {id: 2, value: "Settings", icon: "cog"},
      {id: 3, value: "Contact us", icon: "envelope"},
      {id: 4, value: "Version", icon: "code-fork"}
    ],
    on: {
      onItemClick: function (id) {
        if (id == 3) {
          webix.alert("nebulasoftwares@gmail.com");
        } else if (id == 4) {
          webix.alert(sw_ver);
        }
      }
    },
    select: true,
    type: {
      height: 40
    }
  }
};

function trackLocation() {

  try {
    deviceID = device.uuid;
    $$('devid').setValue(deviceID);
    $$('devid').refresh();
  } catch (err) {
    alert("Could not retrieve devive ID:" + err);
  }

  if (navigator.geolocation) {
    //alert("test");
    navigator.geolocation.watchPosition(updatePosition);
  } else {
    alert("Geolocation is not supported by this device.");
  }

}
;

function updatePosition(position) {

  var latVal = position.coords.latitude;
  var longVal = position.coords.longitude;
  var d = new Date();
  var readtime = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) +
          "T" + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2) + ".000Z";
  var readtimeStr = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) +
          " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2);

  var currentMin = d.getMinutes();
  var updateFreq = $$("combo_updatefreq").getValue();
  //alert("updateFreq: " + updateFreq);
  //alert("lastReadMin: " + (currentMin % updateFreq));
  if ((lastReadMin == -1) || (((currentMin % updateFreq) == 0) && (currentMin != lastReadMin))) {
    //alert("lastReadMin: " + lastReadMin + "  currentMin:  " + currentMin);
    var payload = {};
    payload.Deviceimei = deviceID;
    payload.Readtime = readtime;
    payload.Latitude = latVal;
    payload.Longitude = longVal;

    $$('lat').setValue(latVal);
    $$('lat').refresh();
    $$('long').setValue(longVal);
    $$('long').refresh();
    $$('timestamp').setValue(readtimeStr);
    $$('timestamp').refresh();

    //
    lastReadMin = d.getMinutes();
    var url = "http://115.124.106.248:8182/rest/location/update";
    webix.ajax().headers({"Content-type": "application/json"}).post(url, JSON.stringify(payload), function (text) {
      //alert(text);
    });

  }
}

function onDeviceReady() {
  trackLocation();
}

//sudo ufw status verbose
//sudo ufw enable
//new Date().toJSON().slice(0,10)
/*
{
cols: [
{view: "label", label: "", width: 5},
{view: "button", label: 'Start', width: 100, align: 'center', click: trackLocation},
{view: "label", label: ""}
]
}
*/


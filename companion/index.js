//* Import *//

import {settingsStorage as store} from "settings";
import {peerSocket} from "messaging";
import {me} from "companion";
import {outbox} from "file-transfer";
import {encode} from "cbor";
import {locale} from "user-settings";
import { device } from "peer";
import {inbox} from "file-transfer";

//* Recieve Settings from app *//
inbox.addEventListener("newfile", pendingFiles);
pendingFiles();

//* Get Settings from settings and Sends to app *//
store.onchange = sendAll;

peerSocket.onmessage = e => {
  if(e.data && e.data.getAll) sendAll();
};

if(me.launchReasons.settingsChanged) {
  sendAll();
}

//* Functions *//

function sendAll() {
  //* Function to write settings to file *//
  let obj = {
    themeText: trim(store.getItem("Texttheme") || "white"),
    themeSteps: trim(store.getItem("Stepstheme") || "green"),
    themeCalories: trim(store.getItem("Caloriestheme") || "orange"),
    themeActivity: trim(store.getItem("Activitytheme") || "blue"),
    themeDistance: trim(store.getItem("Distancetheme") || "purple"),
    themeHeartrate: trim(store.getItem("Heartratetheme") || "red"),
    themeBackground: trim(store.getItem("Backgroundtheme") || "black"),
    themeClock: trim(store.getItem("Clocktheme") || "white"),
    themeS: trim(store.getItem("Stheme") || "red"),
    ShowStepsRings: (store.getItem("ShowStepsRings") === "true"),
    ShowCaloriesRings: (store.getItem("ShowCaloriesRings") === "true"),
    ShowActivityRings: (store.getItem("ShowActivityRings") === "true"),
    ShowDistanceRings: (store.getItem("ShowDistanceRings") === "true"),
    ShowHeartrateRings: (store.getItem("ShowHeartrateRings") === "true"),
    ShowDate: (store.getItem("ShowDate") === "true"),
    ShowBattery: (store.getItem("ShowBattery") === "true"),
    themeBackgroundImg: (store.getItem("BackgroundImgtheme") === "true"),
    faces: ["noface", "quaters", "hours", "circle", "squarehours", "square", "time", "quatersspec", "hoursspec", "circlespec", "squarehoursspec", "squarespec",],
    firstfaces: 0,
    days: getLocale(),
  };
  if(store.getItem("firstfaces2")) {
    let value = JSON.parse(store.getItem("firstfaces2")).values[0].value;
    for(let i = 0; i < obj.faces.length; i++) {
      if(value === obj.faces[i]) {
        obj.firstfaces = i;
        break;
      }
    }
  }
  outbox.enqueue("settings2.txt", encode(obj));
}

function trim(s) {
  return (s.charAt && s.charAt(0) === '"') ? s.substr(1, s.length - 2) : s;  
}

function getLocale() {
  try {
    new Date().toLocaleDateString("i");
  } catch(e) {
    let lang = locale.language.replace("_", "-");
    let days = [];
    for(let i = 0; i < 7; i++) {
      days.push(new Date(2000, 0, i + 2).toLocaleDateString(lang, {weekday: "short"}).replace(".", ""));
    }
    return days;
  }
}

async function pendingFiles() {
  let file;
  while ((file = await inbox.pop())) {
    const obj = await file.cbor();
    recieveSettings(obj);
  }
}

function recieveSettings(obj) {
  if("ShowStepsRings" in obj) {
    store.setItem("ShowStepsRings", obj.ShowStepsRings);
  }
  if("ShowCaloriesRings" in obj) {
    store.setItem("ShowCaloriesRings", obj.ShowCaloriesRings);
  }
  if("ShowDistanceRings" in obj) {
    store.setItem("ShowDistanceRings", obj.ShowDistanceRings);
  }
  if("ShowActivityRings" in obj) {
    store.setItem("ShowActivityRings", obj.ShowActivityRings);
  }
  if("ShowHeartrateRings" in obj) {
    store.setItem("ShowHeartrateRings", obj.ShowHeartrateRings);
  }
  if("ShowDate" in obj) {
    store.setItem("ShowDate", obj.ShowDate);
  }
  if("ShowBattery" in obj) {
    store.setItem("ShowBattery", obj.ShowBattery);
  }
  if("firstfaces2" in obj) {
    store.setItem("faces", obj.firstfaces2);
    store.setItem("firstfaces2", obj.firstfaces2);
  }
}

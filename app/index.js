//* Import *//
import clock from "clock";
import document from "document";
import * as health from "user-activity";
import {HeartRateSensor} from "heart-rate";
import {display} from "display";
import {vibration} from "haptics";
import {peerSocket} from "messaging";
import {preferences, units} from "user-settings";
import {me} from "appbit";
import {user} from "user-profile";
import * as fs from "fs";
import {battery} from "power";
import {charger} from "power";
import {decode} from "cbor";
import {inbox} from "file-transfer";
import {outbox} from "file-transfer";
import {encode} from "cbor";

//* Variables *//

const THEMES = {
  red:    ["F93535", "CC4848", "AB4545"],
  orange: ["FF970F", "DD7F23", "B3671D"],
  yellow: ["FFFF00", "E4DB4A", "C6BC1E"],
  green:  ["14C610", "119E0E", "0D730B"],
  blue:   ["6fa8e9", "5682b4", "32547a"],
  purple: ["E86FE9", "B455B5", "79327A"],
  navy: ["5555ff", "4444ff", "4444ff"],
  black: ["000000", "000000", "888888"],
  grey: ["888888", "666666", "444444"],
  white: ["FFFFFF", "FFFFFF", "888888"]
};

const THEMESB = {
  red: ["ff0000","AB4545"],
  orange: ["ffa500", "B3671D"],
  yellow: ["ffff00", "C6BC1E"],
  green: ["008000", "0D730B"],
  blue: ["0000ff", "32547a"],
  indigo: ["4b0082", "705585"],
  violet: ["ee82ee", "d8a7d8"],
  fbblue: ["3182DE", "8aabd0"],
  fbplum: ["A51E7C", "a57f9a"],
  fblightgray: ["A0A0A0", "d4d2d2"],
  peachpuff: ["ffdab9", "ffe7d2"],
  black: ["000000", "888888"],
  grey: ["888888", "b8b7b7"],
  white: ["ffffff", "d4d2d2"]
};

const HOUR12 = (preferences.clockDisplay === "12h");
const PROFILE = me.permissions.granted("access_user_profile");
const NOCLIMB = (health.today.local.elevationGain === undefined);

let curfaceslist = [
  JSON.stringify({"selected":[0],"values":[{"name":"01. No Watchface","value":"noface"}]}),
  JSON.stringify({"selected":[1],"values":[{"name":"02. Quaters Watchface","value":"quaters"}]}),
  JSON.stringify({"selected":[2],"values":[{"name":"03. Circle Watchface - Hours Only","value":"hours"}]}),
  JSON.stringify({"selected":[3],"values":[{"name":"04. Circle Watchface","value":"circle"}]}),
  JSON.stringify({"selected":[4],"values":[{"name":"05. Square Watchface - Hours Only","value":"squarehours"}]}),
  JSON.stringify({"selected":[5],"values":[{"name":"06. Square Watchface","value":"square"}]}),
  JSON.stringify({"selected":[6],"values":[{"name":"07. Digital Watchface","value":"time"}]}),
  JSON.stringify({"selected":[7],"values":[{"name":"08. Quaters Watchface Sepctrum","value":"quatersspec"}]}),
  JSON.stringify({"selected":[8],"values":[{"name":"09. Circle Watchface Spectrum - Hours Only","value":"hoursspec"}]}),
  JSON.stringify({"selected":[9],"values":[{"name":"10. Circle Watchface Spectrum","value":"circlespec"}]}),
  JSON.stringify({"selected":[10],"values":[{"name":"11. Square Watchface Spectrum - Hours Only","value":"squarehoursspec"}]}),
  JSON.stringify({"selected":[11],"values":[{"name":"12. Square Watchface Spectrum","value":"squarespec"}]})
]

let weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let lastUpdatedRings = 0;
let lastUpdatedHeart = 0;
let updateNow = false;
let showRings = true;
let showStepsRings = true;
let showCaloriesRings = true;
let showActivityRings = true;
let showDistanceRings = true;
let showHeartrateRings = true;
let showDate = true;
let showBattery = true;
let showBackgroundImg = true;

var classbkg = "background";
var classclock = "clockcolor";

let faces = ["noface", "quaters", "hours", "circle", "squarehours", "square", "time", "quatersspec", "hoursspec", "circlespec", "squarehoursspec", "squarespec"];
let firstfaces = 0;  //0=blank
let curfaces = 0;
let heartSensor;

let myDate = $("mydate");
let myHours = $("hours");
let myMins = $("minutes");
let mySecs = $("seconds");
let myStats = $("mystats");
let myStatssec = $("mystatssec");
let myStatspm = $("mystatspm");
let myheartStats = $("myheartstats");
let myBatteryUsage = $("mybatteryusage");
let BatteryUsage = $("batteryusage");

let myRingTL = $("today_tl");
let myRingTR = $("today_tr");
let myRingBL = $("today_bl");
let myRingBR = $("today_br");

let nodes, node, j = 0;
let settingsobj;

var delayHeart;

//* Clock *//

clock.granularity = "seconds";
clock.ontick = onTick;
onTick();

//* Buttons *//

$("center").onclick = () => {
  updateNow = true;
  //* Center Button to cycle through watch faces
  if(curfaces < 11)
  {
    curfaces = curfaces + 1;
  }
  else
  {
    curfaces = 0;
  }
  watchfaces();  
  if(curfaces < 7)
  {
    classbkg = "background";
    classclock = "clockcolor";
  }
  else
  {
    classbkg = "backgroundface";
    classclock = "handcolor";
  }
  if(settingsobj.themeBackground) {
    let colors = THEMESB[settingsobj.themeBackground] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName(classbkg + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(settingsobj.themeClock) {
    let colors = THEMES[settingsobj.themeClock] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName(classclock + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  settingsobj.firstfaces = curfaces;
  settingsobj.firstfaces2 = curfaceslist[curfaces];
  savesettings();
}

$("top_right").onclick = () => {
  //* Top Right Button - Toggle Display of Steps Ring on/off *//
  if($("stepscolor").style.display === "none") {
    updateNow = true;
    j = 0;
    nodes = document.getElementsByClassName("steps");
    while(node = nodes[j++]) node.style.display = "inline";
    settingsobj.ShowStepsRings = true;
    showStepsRings = !settingsobj.ShowStepsRings;
  } else {
    j = 0;
    nodes = document.getElementsByClassName("steps");
    while(node = nodes[j++]) node.style.display = "none";
    settingsobj.ShowStepsRings = false;
    showStepsRings = !settingsobj.ShowStepsRings;
  }
  savesettings();
};

$("top_left").onclick = () => {
  //* Top Left Button - Toggle Display of Calories Ring on/off *//
  if($("caloriescolor").style.display === "none") {
    updateNow = true;
    j = 0;
    nodes = document.getElementsByClassName("calories");
    while(node = nodes[j++]) node.style.display = "inline";
    settingsobj.ShowCaloriesRings = true;
    showStepsRings = !settingsobj.ShowCaloriesRings;
  } else {
    j = 0;
    nodes = document.getElementsByClassName("calories");
    while(node = nodes[j++]) node.style.display = "none";
    settingsobj.ShowCaloriesRings = false;
    showStepsRings = !settingsobj.ShowCaloriesRings;
  }
  savesettings();
};

$("bottom_right").onclick = () => {
  //* Bottom Right Button - Toggle Display of Distance Ring on/off *//
  if($("distancecolor").style.display === "none") {
    updateNow = true;
    j = 0;
    nodes = document.getElementsByClassName("distance");
    while(node = nodes[j++]) node.style.display = "inline";
    settingsobj.ShowDistanceRings = true;
    showDistanceRings = !settingsobj.ShowDistanceRings;
  } else {
    j = 0;
    nodes = document.getElementsByClassName("distance");
    while(node = nodes[j++]) node.style.display = "none";
    settingsobj.ShowDistanceRings = false;
    showDistanceRings = !settingsobj.ShowDistanceRings;
  }
  savesettings();
};

$("bottom_left").onclick = () => {
  //* Bottom Left Button - Toggle Display of Activity Ring on/off *//
  if($("activitycolor").style.display === "none") {
    updateNow = true;
    j = 0;
    nodes = document.getElementsByClassName("activity");
    while(node = nodes[j++]) node.style.display = "inline";
    settingsobj.ShowActivityRings = true;
    showActivityRings = !settingsobj.ShowActivityRings;
  } else {
    j = 0;
    nodes = document.getElementsByClassName("activity");
    while(node = nodes[j++]) node.style.display = "none";
    settingsobj.ShowActivityRings = false;
    showActivityRings = !settingsobj.ShowActivityRings;
  }
  savesettings();
};

$("bottom_center").onclick = () => {
  //* Bottom Center Button - Toggle Display of Heartrate Ring on/off *//
  if($("heartratecolor").style.display === "none") {
    updateNow = true;
    j = 0;
    nodes = document.getElementsByClassName("heartrate");
    while(node = nodes[j++]) node.style.display = "inline";
    settingsobj.ShowHeartrateRings = true;
    showHeartrateRings = !settingsobj.ShowHeartrateRings;
  } else {
    j = 0;
    nodes = document.getElementsByClassName("heartrate");
    while(node = nodes[j++]) node.style.display = "none";
    settingsobj.ShowHeartrateRings = false;
    showHeartrateRings = !settingsobj.ShowHeartrateRings;
  }
  savesettings();
};

$("top_center").onclick = () => {
  //* Top Center Button - Toggle Display Auto Off on/off *//
  if(display.autoOff === true) {
    display.autoOff = false;
    $("bklight").style.display = "inline";
  } else {
    display.autoOff = true;
    $("bklight").style.display = "none";
  }
};

$("right_center").onclick = () => {
  //* Center Right Button - Toggle Display of Date on/off *//
  if(myDate.style.display === "none") {
    updateNow = true;
    myDate.style.display = "inline";
    settingsobj.ShowDate = true;
    showDate = !settingsobj.ShowHDate;
  } else {
    myDate.style.display = "none";
    settingsobj.ShowDate = false;
    showDate = !settingsobj.ShowDate;
  }
  savesettings();
};

$("left_center").onclick = () => {
  //* Center Left Button - Toggle Display of Battery on/off *//
  if(myBatteryUsage.style.display === "none") {
    updateNow = true;
    if(battery.chargeLevel > 16	&& !battery.charging && !charger.connected)
    {
      j = 0;
      nodes = document.getElementsByClassName("battery");
      while(node = nodes[j++]) node.style.display = "inline";
    }
    j = 0;
    nodes = document.getElementsByClassName("battery1");
    while(node = nodes[j++]) node.style.display = "inline";
    settingsobj.ShowBattery = true;
    showBattery = !settingsobj.ShowBattery;
  } else {
    if(battery.chargeLevel > 16 && !battery.charging && !charger.connected)
    {
      j = 0;
      nodes = document.getElementsByClassName("battery");
      while(node = nodes[j++]) node.style.display = "none";
    }
    j = 0;
    nodes = document.getElementsByClassName("battery1");
    while(node = nodes[j++]) node.style.display = "none";
    settingsobj.ShowBattery = false;
    showBattery = !settingsobj.ShowBattery;
  }
  savesettings();
};

//* Settings *//

pendingFiles();
inbox.onnewfile = pendingFiles;

if(parseFile("settings2.txt")) {
  let done = (peerSocket.readyState === peerSocket.OPEN);
  if(done) {
    peerSocket.send({getAll: 1});
  } else {
    peerSocket.onopen = () => {
      if(!done) peerSocket.send({getAll: 1});
      done = true;
    };
  }
}

//* Checks *//

if(NOCLIMB) {
  $("floors").href = "ico_active.png";
}

//* Functions *//

function $(s) {
  //* Function to get a gui element by id *//
  return document.getElementById(s);
}

function onTick(now) {
  //* Function to manage watchface display *//
  now = (now && now.date) || new Date();
  let nowTime = now.getTime();
  let today = health.today.adjusted;
  let goal = health.goals;
  
  if(nowTime - lastUpdatedRings > 30000 || updateNow) {
    lastUpdatedRings = nowTime;
    updateNow = false;
    
    if($("calories").style.display === "inline")
    {
      updateRing(myRingTL, "cal", goal, today);
      $("mycaloriestats").text = today.calories;
      if(battery.chargeLevel < 17 || battery.charging || charger.connected)
      {
        if(curfaces === 4 || curfaces === 5 || curfaces === 10 || curfaces === 11)
        {
          if($("cal").x !== 30)
          {
            $("cal").x = 30;
            $("cal").y = 30;
          }
        }
        else
        {
          if($("cal").x !== 55)
          {
            $("cal").x = 55;
            $("cal").y = 55;
          }
        }
      }
      else if(curfaces === 0 || curfaces === 1 || curfaces === 2 || curfaces === 3 || curfaces === 6 || curfaces === 7 || curfaces === 8 || curfaces === 9)
      {
        if($("cal").x === 55 || $("cal").x === 30)
        {
          $("cal").x = 0;
          $("cal").y = 0;
        }
      }
    }
    
    if($("steps").style.display === "inline")
    {
      updateRing(myRingTR, "step", goal, today);
      $("mystepstats").text = today.steps;
    }
    
    if($("distance").style.display === "inline")
    {    
      updateRing(myRingBR, "dist", goal, today);
      $("mydistancestats").text = (units.distance === "metric") ? round(today.distance/1000) : round(today.distance/1609.34);
    }
    
    if($("activity").style.display === "inline")
    {
      if(NOCLIMB) {
        updateRing(myRingBL, "active", goal, today);
      } else {
        updateRing(myRingBL, "climb", goal, today);
      }
      $("myactivitystats").text = today.activeMinutes;
    }
    
      myBatteryUsage.text = battery.chargeLevel + "%";
      BatteryUsage.width = Math.round(battery.chargeLevel*(24/100));
      if(battery.chargeLevel < 17 || battery.charging || charger.connected)
      {
        j = 0;
        nodes = document.getElementsByClassName("battery");
        while(node = nodes[j++]) node.style.display = "none";
        myBatteryUsage.x = 76;
        myBatteryUsage.y = 28;
      }
      else if(myBatteryUsage.style.display === "inline")
      {
        if(curfaces === 6)
        {
          j = 0;
          nodes = document.getElementsByClassName("battery");
          while(node = nodes[j++]) node.style.display = "inline";
          myBatteryUsage.x = 108;
          myBatteryUsage.y = 98;
          $("batteryimg").y = 72;
          $("batteryusage").y = 82;
        }
        else
        {
          j = 0;
          nodes = document.getElementsByClassName("battery");
          while(node = nodes[j++]) node.style.display = "inline";
          myBatteryUsage.x = 108;
          myBatteryUsage.y = 160;
          $("batteryimg").y = 134;
          $("batteryusage").y = 144;
        }
      }
    
    if(myDate.style.display === "inline")
    {
      myDate.text = weekNames[now.getDay()] + " " + now.getDate();
    }
  }

  if($("seconds").style.display === "inline")
  {
    let hours = now.getHours() % 12;
    let mins = now.getMinutes();
    let secs = now.getSeconds();
    myHours.groupTransform.rotate.angle = (hours + mins/60)*30;
    myMins.groupTransform.rotate.angle = mins*6;
    mySecs.groupTransform.rotate.angle = secs*6;
  }
  
  if(myStats.style.display === "inline")
  {
    if(HOUR12)
    {
      
      if(now.getHours() > 12)
      {
        myStats.text = pad(now.getHours() - 12) + ":" + pad(now.getMinutes());
        myStatssec.text = pad(now.getSeconds());
        myStatspm.text = "PM"
      }
      else
      {
        myStats.text = pad(now.getHours()) + ":" + pad(now.getMinutes());
        myStatssec.text = pad(now.getSeconds());
        myStatspm.text = "AM"
      }
    }
    else
    {
      myStats.text = pad(now.getHours()) + ":" + pad(now.getMinutes());
      myStatssec.text = pad(now.getSeconds());
      myStatspm.text = ""
    }
  }
  
  if($("heartrate").style.display === "inline")
  {
    updateHeart();
  }
}

function updateRing(node, holder, goal, today) {
  //* Function to update the rings goal completion status *//
  let angle = 0;
  if(holder === "cal") {
    angle = (today.calories || 0)*270/(goal.calories || 400);
  } else if(holder === "step") {
    angle = (today.steps || 0)*270/(goal.steps || 10000);
  } else if(holder === "dist") {
    angle = (today.distance || 0)*270/(goal.distance || 7200);
  } else if(holder === "climb") {
    angle = (today.elevationGain || 0)*270/(goal.elevationGain || 20);
  } else if(holder === "active") {
    angle = (today.activeMinutes || 0)*270/(goal.activeMinutes || 30);
  }
  node.sweepAngle = Math.min(270, Math.round(angle));
}

function watchfaces() {
  //* Function to display the chosen watchface *//
  let today = health.today.adjusted;
  switch(faces[curfaces]) {
    case "time":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "inline"
      myStatssec.style.display = "inline"
      myStatspm.style.display = "inline"
      $("minutes").style.display = "none";
      $("hours").style.display = "none";
      $("seconds").style.display = "none";
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "bkg_black.png";
      $("wfc2").href = "bkg_black.png";
      movebattdate(true);
      moverings(false);
      break;
    case "quaters":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      j = 0;
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "wfc_quaters.png";
      $("wfc2").href = "bkg_black.png";
      moverings(false);
      break;
    case "hours":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      j = 0;
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "wfc_hours.png";
      $("wfc2").href = "bkg_black.png";
      moverings(false);
      break;
    case "circle":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "wfc_hours.png";
      $("wfc2").href = "wfc_minutes.png";
      moverings(false);
      break;
    case "squarehours":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "wfc_rounded.png";
      $("wfc2").href = "bkg_black.png";
      moverings(true);
      break;
    case "square":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "wfc_rounded.png";
      $("wfc2").href = "wfc_roundedmin.png";
      moverings(true);
      break;
    case "noface":
      classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "bkg_black.png";
      $("wfc2").href = "bkg_black.png";
      moverings(false);
      break;
    case "quatersspec":
      classbkg = "backgroundface";
      classclock = "handcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      j = 0;
      $("bkg").href = "bkg_colours.png";
      $("wfc1").href = "wfc_quatersinv.png";
      $("wfc2").href = "bkg_black.png";
      moverings(false);
      break;
    case "hoursspec":
      classbkg = "backgroundface";
      classclock = "handcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      j = 0;
      $("bkg").href = "bkg_colours.png";
      $("wfc1").href = "wfc_hoursinv.png";
      $("wfc2").href = "bkg_black.png";
      moverings(false);
      break;
    case "circlespec":
      classbkg = "backgroundface";
      classclock = "handcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_colours.png";
      $("wfc1").href = "wfc_minutesinv.png";
      $("wfc2").href = "wfc_hours.png";
      moverings(false);
      break;
    case "squarehoursspec":
      classbkg = "backgroundface";
      classclock = "handcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_colours.png";
      $("wfc1").href = "wfc_roundedinv.png";
      $("wfc2").href = "bkg_black.png";
      moverings(true);
      break;
    case "squarespec":
      classbkg = "backgroundface";
      classclock = "handcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_colours.png";
      $("wfc1").href = "wfc_roundedmininv.png";
      $("wfc2").href = "wfc_rounded.png";
      moverings(true);
      break;
    default:classbkg = "background";
      classclock = "clockcolor";
      myStats.style.display = "none";
      myStatssec.style.display = "none";
      myStatspm.style.display = "none";
      movebattdate(false);
      $("minutes").style.display = "inline";
      $("hours").style.display = "inline";
      $("seconds").style.display = "inline";
      $("bkg").href = "bkg_white.png";
      $("wfc1").href = "wfc_hours.png";
      $("wfc2").href = "wfc_minutes.png";
      moverings(false);
  }
}

function moverings(truefalse)
//* Function to move the rings *//
{
  if(truefalse)
  {
    if($("cal").x !== 30)
    {
      $("cal").x = 30;
      $("cal").y = 30;
    }
    if($("stepsgroup").x !== -30)
    {
      $("stepsgroup").x = -30;
      $("stepsgroup").y = 30;
    }
    if($("activitygroup").x !== 30)
    {
      $("activitygroup").x = 30;
      $("activitygroup").y = -30;
    }
    if($("distancegroup").x !== -30)
    {
      $("distancegroup").x = -30;
      $("distancegroup").y = -30;
    }
  }
  else
  {
    if(($("cal").x === 55 || $("cal").x === 30) && battery.chargeLevel > 16 && !battery.charging && !charger.connected)
    {
      $("cal").x = 0;
      $("cal").y = 0
    }
    if($("stepsgroup").x === -30)
    {
      $("stepsgroup").x = 0;
      $("stepsgroup").y = 0
    }
    if($("activitygroup").x === 30)
    {
      $("activitygroup").x = 0;
      $("activitygroup").y = 0
    }
    if($("distancegroup").x === -30)
    {
      $("distancegroup").x = 0;
      $("distancegroup").y = 0
    }
  }
}

function movebattdate(truefalse)
//* Function to move date and battery stats *//
{
  if(truefalse)
  {
    if(battery.chargeLevel > 16 && !battery.charging && !charger.connected)
    {
      $("mybatteryusage").y = 98;
      $("batteryimg").y = 72;
      $("batteryusage").y = 82;
    }
    myDate.y = 98;
  }
  else
  {
    if(battery.chargeLevel > 16 && !battery.charging && !charger.connected)
    {
      $("mybatteryusage").y = 160;
      $("batteryimg").y = 134;
      $("batteryusage").y = 144;
    }
    myDate.y = 160; 
  }
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function round(n) {
  n = n.toFixed(2);
  if(n.substr(-2) === "00") return n.substr(0, n.length - 3);
  if(n.substr(-1) === "0") return n.substr(0, n.length - 1);
  return n;
}

function updateHeart() {
  //* Function to display haertrate *//
  let h = heartSensor;
  if(!h) {
    heartSensor = h = new HeartRateSensor();
    h.onreading = () => {
      setTimeout(() => h.stop(), 100);
      clearTimeout(delayHeart);
      myheartStats.text = h.heartRate;
    };
    h.onerror = () => {
      setTimeout(() => h.stop(), 100);
      clearTimeout(delayHeart);
      myheartStats.text = "--";
    };
  }
  if(!h.activated) {
    clearTimeout(delayHeart);
    delayHeart = setTimeout(() => {
      myheartStats.text = "--";
    }, 500);
    h.start();
  }
}

function applySettings(o) {
  //* Function to apply settings *//
  if("faces" in o) faces = o.faces;
  if("firstfaces" in o) 
  {
    curfaces = firstfaces = Math.min(o.firstfaces, faces.length - 1);
    watchfaces();
    
    if(curfaces < 7)
    {
      classbkg = "background";
      classclock = "clockcolor";
    }
    else
    {
      classbkg = "backgroundface";
      classclock = "handcolor";
    }
  }
  if("themeBackgroundImg" in o) {
    showBackgroundImg = !o.themeBackgroundImg;
    updateNow = true;
    if(curfaces < 7)
    {
      $("bkg").href = showBackgroundImg ? "bkg_white.png" : "bkg_colours.png";
    }
  }
  if(o.themeBackground) {
    let colors = THEMESB[o.themeBackground] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName(classbkg + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeText) {
    let colors = THEMES[o.themeText] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("textcolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeClock) {
    let colors = THEMES[o.themeClock] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName(classclock + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeS) {
    let colors = THEMES[o.themeS] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("scolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeDistance) {
    let colors = THEMES[o.themeDistance] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("distancecolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeSteps) {
    let colors = THEMES[o.themeSteps] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("stepscolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeCalories) {
    let colors = THEMES[o.themeCalories] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("caloriescolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeActivity) {
    let colors = THEMES[o.themeActivity] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("activitycolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.themeHeartrate) {
    let colors = THEMES[o.themeHeartrate] || [];
    for(let i = 0; i < colors.length; i++) {
      let nodes = document.getElementsByClassName("heartratecolor" + (i + 1));
      let node, j = 0;
      while(node = nodes[j++]) node.style.fill = "#" + colors[i];
    }
  }
  if(o.days) {
    weekNames = o.days;
  }
  if("ShowStepsRings" in o) {
    showStepsRings = !o.ShowStepsRings;
    updateNow = true;
    let nodes = document.getElementsByClassName("steps");
    let node, j = 0;
    while(node = nodes[j++]) node.style.display = showStepsRings ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("steps");
    while(node = nodes[j++]) node.style.display = "none";
  }
  if("ShowCaloriesRings" in o) {
    showCaloriesRings = !o.ShowCaloriesRings;
    updateNow = true;
    let nodes = document.getElementsByClassName("calories");
    let node, j = 0;
    while(node = nodes[j++]) node.style.display = showCaloriesRings ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("calories");
    while(node = nodes[j++]) node.style.display = "none";
  }
  if("ShowActivityRings" in o) {
    showActivityRings = !o.ShowActivityRings;
    updateNow = true;
    let nodes = document.getElementsByClassName("activity");
    let node, j = 0;
    while(node = nodes[j++]) node.style.display = showActivityRings ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("activity");
    while(node = nodes[j++]) node.style.display = "none";
  }
  if("ShowDistanceRings" in o) {
    showDistanceRings = !o.ShowDistanceRings;
    updateNow = true;
    let nodes = document.getElementsByClassName("distance");
    let node, j = 0;
    while(node = nodes[j++]) node.style.display = showDistanceRings ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("distance");
    while(node = nodes[j++]) node.style.display = "none";
  }
  if("ShowHeartrateRings" in o) {
    showHeartrateRings = !o.ShowHeartrateRings;
    let nodes = document.getElementsByClassName("heartrate");
    let node, j = 0;
    while(node = nodes[j++]) node.style.display = showHeartrateRings ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("heartrate");
    while(node = nodes[j++]) node.style.display = "none";
  }
  if("ShowDate" in o) {
    showDate = !o.ShowDate;
    updateNow = true;
    let nodes = document.getElementsByClassName("date");
    let node, j = 0;
    while(node = nodes[j++]) node.style.display = showDate ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("date");
    while(node = nodes[j++]) node.style.display = "none";
  }
  if("ShowBattery" in o) {
    showBattery = !o.ShowBattery;
    updateNow = true;
    if(battery.chargeLevel > 16 && !battery.charging && !charger.connected)
    {
      let nodes = document.getElementsByClassName("battery");
      let node, j = 0;
      while(node = nodes[j++]) node.style.display = showBattery ? "none" : "inline";
    }
    nodes = document.getElementsByClassName("battery1");
    j = 0;
    while(node = nodes[j++]) node.style.display = showBattery ? "none" : "inline";
  }
  else
  {
    j = 0;
    nodes = document.getElementsByClassName("battery");
    while(node = nodes[j++]) node.style.display = "none";
    j = 0;
    nodes = document.getElementsByClassName("battery1");
    while(node = nodes[j++]) node.style.display = "none";
  }
  //myStats.text = "";
  lastUpdatedRings = 0;
  lastUpdatedHeart = 0;
}

function savesettings() {
  fs.writeFileSync("settings2.txt", settingsobj, "cbor");
  outbox.enqueueFile("/private/data/settings2.txt");
}

function parseFile(name) {
  let obj;
  try {
    obj = fs.readFileSync(name, "cbor");
  } catch(e) {
    return true;
  }

  if(name === "settings2.txt") {
    if(obj)
    {
      applySettings(obj);
      settingsobj = obj;
    }
  }
}

function pendingFiles() {
  let found = false;
  let temp;
  while(temp = inbox.nextFile()) {
    parseFile(temp);
    found = true;
  }
  if(found) {
    display.poke();
    vibration.start("bump");
  }
}
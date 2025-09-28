// ==UserScript==
// @name         SSBGFY
// @namespace    https://selfsrv.oxy.edu/EmployeeSelfService/ssb/*
// @version      2025-04-12
// @description  Better Time Inputs
// @author       You
// @match        https://selfsrv.oxy.edu/EmployeeSelfService/ssb/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...


  // time delay function
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  // get current url
  const url = window.location.href;
  let jsn = parseInt(url.split('/')[9])
  console.log("jsn: " + jsn)

  let timeData = []

  let timeEntryJson = {
    "timeEntryTimeInOut": {
      "id": null,
      "version": null,
      "jobSequenceNumber": jsn,
      "earnCode": "REG",
      "shift": null,
      // "timeEntryDate": "04/11/2025",
      "clockInSystemTime": null,
      "clockInDone": "N",
      "clockInComment": null,
      "clockInCommentDate": null,
      "isClockInAdjustable": false,
      // "timeIn": "1300",
      "clockOutSystemTime": null,
      "clockOutDone": "N",
      "clockOutComment": null,
      "clockOutCommentDate": null,
      "isClockOutAdjustable": false,
      // "timeOut": "1400",
      "$canClockIn": true,
      "$canClockOut": true
    }
  }


  let fullApiBody = {
    "timeData": {
      "jobSequenceNumber": jsn,
      // "timeEntryDate": "04/07/2025",
      "earnings": [{
        "$newMarker": "Y",
        "earnCode": "REG",
        "earnLongDescription": "Regular Pay",
        "earnEntryType": "T",
        "earnUnitOfTime": "H",
        "allowShiftDisplay": false,
        "allowMultipleShifts": true,
        "defaultShift": null,
        "$editEarnCodeMode": true,
        "$showAccountDist": false,
        "bulkHours": [],
        // "timeInOuts": [],
        "deleteBulkHours": [],
        "deleteTimeInOuts": [],
        "allowShiftEntry": false,
        "$earningIndex": 0
      }],
      "deleteEarnings": []
    }
  }




  let bodyElement = document.body;
  let newButton = document.createElement("div");
  newButton.innerHTML = "Click me!";
  newButton.style.position = "fixed";
  newButton.style.bottom = "0";
  newButton.style.right = "50%";
  newButton.style.zIndex = "9999";
  newButton.style.backgroundColor = "white";
  newButton.style.padding = "10px";
  newButton.style.border = "1px solid black";
  newButton.style.borderRadius = "5px";
  newButton.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

  bodyElement.appendChild(newButton);









  let newTIW = '<div class="newTimeEntryWindow" style="">  <form id="timeEntryForm">    <label for="timeM">Monday:</label>    <input type="text" id="timeM" name="timeM" value="">  </br>  <label for="timeT">Tuesday:</label>    <input type="text" id="timeT" name="timeT" value="">  </br>  <label for="timeW">Wednesday:</label>    <input type="text" id="timeW" name="timeW" value="">  </br>  <label for="timeR">Thursday:</label>    <input type="text" id="timeR" name="timeR" value="">  </br>  <label for="timeF">Friday:</label>    <input type="text" id="timeF" name="timeF" value="">  </br>  <input type="submit" value="Submit">  </form></div>';


  function getMonday2wksAgo() {
    var date = new Date();
    var day = date.getDay();
    var prevMonday = new Date();
    if (date.getDay() == 0) {
      prevMonday.setDate(date.getDate() - 14);
    } else {
      prevMonday.setDate(date.getDate() - (day - 1) - 7);
    }

    return prevMonday;
  }

  function getPreviousMonday() {
    var date = new Date();
    var day = date.getDay();
    var prevMonday = new Date();
    if (date.getDay() == 0) {
      prevMonday.setDate(date.getDate() - 7);
    } else {
      prevMonday.setDate(date.getDate() - (day - 1));
    }

    return prevMonday;
  }

  function getDayInWeek(wknum, dayltr) {
    let currwk;
    if (wknum == 0) {
      currwk = getMonday2wksAgo();
    } else {
      currwk = getPreviousMonday();
    }

    if (dayltr == "M") {
      currwk.setDate(currwk.getDate() + 0);
    } else if (dayltr == "T") {
      currwk.setDate(currwk.getDate() + 1);
    } else if (dayltr == "W") {
      currwk.setDate(currwk.getDate() + 2);
    } else if (dayltr == "R") {
      currwk.setDate(currwk.getDate() + 3);
    } else if (dayltr == "F") {
      currwk.setDate(currwk.getDate() + 4);
    } else {
      console.log("Invalid day letter");
      return null;
    }
    return currwk;
  }

  console.log(getPreviousMonday())



  newButton.addEventListener("click", function() {
    console.log("Button clicked!");
    // create new div
    let newDiv = document.createElement("div");
    newDiv.innerHTML = newTIW;
    newDiv.style.position = "fixed";
    newDiv.style.top = "0";
    newDiv.style.left = "50%";
    newDiv.style.zIndex = "9999";
    newDiv.style.backgroundColor = "white";
    newDiv.style.padding = "10px";

    // add new div to body
    bodyElement.appendChild(newDiv);

    function processTimeData(input, day) {
      if (input === "") {
        return [];
      }
      input = input.replace(" ", "");
      let shifts = input.split(",");
      let hourpairs = []
      for (let i = 0; i < shifts.length; i++) {
        let timeBounds = shifts[i].split("-");
        // check for colon
        let startHour;
        let startMinute;
        let endHour;
        let endMinute;
        if (!timeBounds[0].includes(":")) {
          startMinute = 0;
          startHour = parseInt(timeBounds[0]);
        } else {
          startMinute = parseInt(timeBounds[0].split(":")[1]);
          startHour = parseInt(timeBounds[0].split(":")[0]);
        }
        if (!timeBounds[1].includes(":")) {
          endMinute = 0;
          endHour = parseInt(timeBounds[1]);
        } else {
          endMinute = parseInt(timeBounds[1].split(":")[1]);
          endHour = parseInt(timeBounds[1].split(":")[0]);
        }
        if (startHour < 7) {
          startHour += 12;
        }
        if (endHour < 7) {
          endHour += 12;
        }
        // convert to 2330 format
        let startTime = startHour * 100 + startMinute;
        let endTime = endHour * 100 + endMinute;
        // check if startTime is greater than endTime
        if (startTime > endTime) {
          console.log("startTime is greater than endTime");
          return null;
        } else {
          hourpairs.push([startTime.toString(), endTime.toString()])
          console.log('HOURPAIRS')
          console.log([startTime, endTime])
        }
      }
      return hourpairs;
    }

    function createRequestDataMerged(timeData) {
      console.log("reqmerge timedata: ")
      console.log(timeData)
      // start with fullApiBody copy
      let reqBody = JSON.parse(JSON.stringify(fullApiBody));
      reqBody.timeData.timeEntryDate = timeData[0].timeEntryDate;
      reqBody.timeData.earnings[0].timeInOuts = [];
      for (let i = 0; i < timeData.length; i++) {
        // reqBody.timeData.earnings[0].timeInOuts.push(timeEntryJson);
        reqBody.timeData.earnings[0].timeInOuts.push(JSON.parse(JSON.stringify(timeEntryJson)));
        reqBody.timeData.earnings[0].timeInOuts[i].timeEntryTimeInOut.timeEntryDate = timeData[0].timeEntryDate;
        reqBody.timeData.earnings[0].timeInOuts[i].timeEntryTimeInOut.timeIn = timeData[i].timeIn;
        reqBody.timeData.earnings[0].timeInOuts[i].timeEntryTimeInOut.timeOut = timeData[i].timeOut;
      }
      return reqBody;
    }

    async function processForm(e) {
      if (e.preventDefault) e.preventDefault();

      let timeM = processTimeData(document.getElementById("timeM").value, "M")
      let timeT = processTimeData(document.getElementById("timeT").value, "T")
      let timeW = processTimeData(document.getElementById("timeW").value, "W")
      let timeR = processTimeData(document.getElementById("timeR").value, "R")
      let timeF = processTimeData(document.getElementById("timeF").value, "F")

      console.log("timeM: ")
      console.log(timeM)
      console.log("timeT: ")
      console.log(timeT)
      console.log("timeW: ")
      console.log(timeW)
      console.log("timeR: ")
      console.log(timeR)
      console.log("timeF: ")
      console.log(timeF)

      let reqBodyArr = []


      for (let i = 0; i < timeM.length; i++) {
        timeData.push({
          "timeIn": timeM[i][0],
          "timeOut": timeM[i][1],
          "timeEntryDate": getDayInWeek(0, "M").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeM.length; i++) {
        timeData.push({
          "timeIn": timeM[i][0],
          "timeOut": timeM[i][1],
          "timeEntryDate": getDayInWeek(1, "M").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []

      for (let i = 0; i < timeT.length; i++) {
        timeData.push({
          "timeIn": timeT[i][0],
          "timeOut": timeT[i][1],
          "timeEntryDate": getDayInWeek(0, "T").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeT.length; i++) {
        timeData.push({
          "timeIn": timeT[i][0],
          "timeOut": timeT[i][1],
          "timeEntryDate": getDayInWeek(1, "T").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeW.length; i++) {
        timeData.push({
          "timeIn": timeW[i][0],
          "timeOut": timeW[i][1],
          "timeEntryDate": getDayInWeek(0, "W").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeW.length; i++) {
        timeData.push({
          "timeIn": timeW[i][0],
          "timeOut": timeW[i][1],
          "timeEntryDate": getDayInWeek(1, "W").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeR.length; i++) {
        timeData.push({
          "timeIn": timeR[i][0],
          "timeOut": timeR[i][1],
          "timeEntryDate": getDayInWeek(0, "R").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeR.length; i++) {
        timeData.push({
          "timeIn": timeR[i][0],
          "timeOut": timeR[i][1],
          "timeEntryDate": getDayInWeek(1, "R").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeF.length; i++) {
        timeData.push({
          "timeIn": timeF[i][0],
          "timeOut": timeF[i][1],
          "timeEntryDate": getDayInWeek(0, "F").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []
      for (let i = 0; i < timeF.length; i++) {
        timeData.push({
          "timeIn": timeF[i][0],
          "timeOut": timeF[i][1],
          "timeEntryDate": getDayInWeek(1, "F").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }),
        })
      }
      if (timeData.length > 0) {
        reqBodyArr.push(createRequestDataMerged(timeData))
      }
      timeData = []

      console.log("reqBodyArr: ")
      console.log(reqBodyArr)

      for (let i = 0; i < reqBodyArr.length; i++) {
        let url = "https://selfsrv.oxy.edu/EmployeeSelfService/ssb/timeEntryDetail/saveTime";
        let headers = {
          "Content-Type": "application/json;charset=utf-8  ",
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Connection": "keep-alive",
          "Cookie": document.cookie,
          "Host": "selfsrv.oxy.edu",
          "Origin": "https://selfsrv.oxy.edu"
        }
        let body = JSON.stringify(reqBodyArr[i]);
        fetch(url, {
          method: "POST",
          headers: headers,
          body: body,
          credentials: "include",
        }).then(response => {
          if (response.status == 200) {
            console.log("Request sent");
            console.log(response);
            return response.json();
          } else {
            console.log("Request failed");
            console.log(response);
            return null;
          }
        })
        await sleep(1000);
        console.log("Slept for 1 second");
      }

      console.log("timeData: ")
      console.log(timeData)


      window.location.reload();
      return false;

    }

    var form = document.getElementById('timeEntryForm');
    if (form.attachEvent) {
      form.attachEvent("submit", processForm);
    } else {
      form.addEventListener("submit", processForm);
    }
  });
})();

function getFullEHREndPoint(endPoint) {
  return `${dentrixUrl}${endPoint}`;
}

function getFullAditEndPoint(endPoint) {
  return `${backUrl}${endPoint}`;
}

const COMMON_APPOINTMENT_STATUS = [
  {
    name: "Canceled",
    key: null,
    ehr_key: "4",
    is_active: true
  },
  {
    name: "Checked In",
    key: null,
    ehr_key: "1",
    is_active: true
  },
  {
    name: "Checked Out",
    key: null,
    ehr_key: "5",
    is_active: true
  },
  {
    name: "No Show",
    key: null,
    ehr_key: "2",
    is_active: true
  },
  {
    name: "Scheduled",
    key: null,
    ehr_key: "0",
    is_active: true
  },
  {
    name: "Walk In",
    key: null,
    ehr_key: "3",
    is_active: true
  }
];

const COMMON_APPOINTMENT_CONFIRMATION_STATUS = [
  {
    name: "Confirmed",
    key: null,
    ehr_key: "6",
    is_active: true
  },
  {
    name: "Left Message",
    key: null,
    ehr_key: "7",
    is_active: true
  },
  {
    name: "Not Available",
    key: null,
    ehr_key: "8",
    is_active: true
  },
  {
    name: "Not Confirmed",
    key: null,
    ehr_key: "9",
    is_active: true
  }
];

async function getDataFromDentrix(endpoint) {
  const fullEndpoint = getFullEHREndPoint(endpoint);
  try {
    const response = await fetch(fullEndpoint, {
      headers: {
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
        "Content-Type": "application/json; charset=utf-8",
      }});
    return await iterateResponse(response);
  } catch (error) {
    console.error(`Error fetching data from ${fullEndpoint}:`, error);
    throw error;
  }
}

async function storeDataToAdit(endpoint, dataToStore) {
  const fullEndpoint = getFullAditEndPoint(endpoint);
  try {
    const response = await fetch(fullEndpoint, await preparePostObject(dataToStore));
    return await iterateResponse(response);
  } catch (error) {
    console.error(`Error fetching data from ${fullEndpoint}:`, error);
    throw error;
  }
}

function mergeOverlappingSlotsForDay(slotsForDay) {
  // Sort slots by startDateTime
  slotsForDay.sort((a, b) => a.startDateTime - b.startDateTime);

  // Initialize mergedSlots with the first slot
  let mergedSlots = [slotsForDay[0]];

  // Iterate through remaining slots to merge overlapping ones
  for (let i = 1; i < slotsForDay.length; i++) {
    let currentSlot = slotsForDay[i];
    let lastMergedSlot = mergedSlots[mergedSlots.length - 1];

    if (currentSlot.startDateTime <= lastMergedSlot.endDateTime) {
      // Merge overlapping slots
      lastMergedSlot.endDateTime = Math.max(
        lastMergedSlot.endDateTime,
        currentSlot.endDateTime
      );
    } else {
      // Add non-overlapping slot to mergedSlots
      mergedSlots.push(currentSlot);
    }
  }

  return mergedSlots;
}

// Function to group slots by day and merge overlapping slots
function groupAndMergeSlotsByDay(slots) {
  var slotsByDay = {};

  // Group slots by day
  slots.forEach(function (slot) {
    slot.recurrences.forEach(function (day) {
      if (!slotsByDay[day]) {
        slotsByDay[day] = [];
      }
      slotsByDay[day].push(slot);
    });
  });

  // Merge overlapping slots for each day
  Object.keys(slotsByDay).forEach(function (day) {
    slotsByDay[day] = mergeOverlappingSlotsForDay(slotsByDay[day]);
  });

  return slotsByDay;
}

async function syncFailedForFirstTime(reason) {
  console.log("Please start the syncing again", reason);
  // chrome.action.setBadgeText({ text: ' ' });
  // chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  // chrome.runtime.sendMessage({
  //   type: "syncFailed",
  //   count: count
  // });
  chrome.storage.local.set({ syncFailed: true, countOfApis: count });
  const result = await new Promise((resolve) => {
    chrome.storage.local.get(['userIdentity', 'selectedLocationId', 'count', 'countOfApis', 'organisation'], (result) => {
      resolve(result);
    });
  });
  clientJs = result.userIdentity
  selectedLocationId = result.selectedLocationId
  selectedLocationOrganizationId = result.organisation
  markFailForWorkstationId(selectedLocationId, result.countOfApis, selectedLocationOrganizationId)
  // chrome.storage.local.clear(() => {
  //   console.log('Chrome storage cleared successfully.');
  // });
}

async function generateNewResponseToken() {
  // window.location.reload();
  chrome.tabs.query({ windowType: 'normal' }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if (checkUrlMatches(tabs[i].url)) {
        chrome.tabs.update(tabs[i].id, { url: tabs[i].url });
      }
    }
  });
}

function iterateResponse(response) {
  // if (response.status == 419) {
  //   generateNewResponseToken();
  // }
  // Check if the response is successful
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  // console.log(response)
  if ((response && response.url == getFullEHREndPoint(getEndpoints.LOGIN) && response.redirected) || userLogoutFromAditApp) {
    syncFailedForFirstTime();
    chrome.action.setBadgeText({ text: ' ' });
    chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    throw new Error("Dentrix Log out. Please Login Again");
  } else {
    // Parse the response as JSON
    return response.json();
  }
}

// Check if the currentUrl matches any of the patterns
function checkUrlMatches(url) {
  const matches = dentrixascendUrlToMatch.filter(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*')); // Replace * with .*
    return regex.test(url);
  });

  return matches && matches[0];
}


async function handleBadgeAndCount() {
  if (!userLogoutFromAditApp) {
    count++;
    setBadge();
    chrome.storage.local.set({ countOfApis: count });
    chrome.runtime.sendMessage({
      type: "updateCount",
      count: count,
    });
    storeCountOfApis(selectedLocationId, count);
  }
}

function setBadge(patientBatchIteration = 0) {
  percentage = (count / totalTableCount) * 100;
  if (percentage < 0) {
    percentage = 0;
  }
  if (patientBatchIteration !== undefined) {
    percentage += patientBatchIteration;
  }

  // if (percentage >= 100) {
  //   chrome.action.setBadgeText({ text: ' ' });
  //   chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
  // } else {
  //   chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  //   chrome.action.setBadgeText({ text: `${percentage.toFixed(0)}%` });
  // }
}

async function storeCountOfApis(selectedLocationId, countOfApis) {
  fetch(backUrl + "/workstation/" + selectedLocationId, {
    method: "PUT",
    headers: await getHeaderObjectForDentrixApiCall(),
    body: JSON.stringify({
      count: countOfApis,
      status: "Pending",
      userIdentity: clientJs,
      chromeVersion: chrome.runtime.getManifest().version
    }),
  })
    .then((response) => {
      return iterateResponse(response);
    })
    .then((data) => {
      console.log("data-->", data);
    })
    .catch((error) => {
      console.log(error);
      console.log("There was a problem with the fetch operation:");
    });
}

async function markFailForWorkstationId(selectedLocationId, countOfApis, selectedLocationOrganizationId, errors, markFailed = true) {
  console.log('marking as Failed for this workstationID:', clientJs)
  fetch(backUrl + "/workstation/" + selectedLocationId, {
    method: "PUT",
    headers: await getHeaderObjectForDentrixApiCall(),
    body: JSON.stringify({
      count: countOfApis > 0 ? countOfApis : undefined,
      status: markFailed ? "Failed" : 'Pending',
      userIdentity: clientJs,
      chromeVersion: chrome.runtime.getManifest().version,
      errors,
      isFirstTimeSync
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log("data-->", data);
    })
    .catch((error) => {
      console.log("There was a problem withmarkFailForWorkstationId:", error);
    });
  // if logout during non-first_time_sync then do not mark location as failed
  if (!markFailed || !isFirstTimeSync) {
    return
  }
  isFirstTimeSync = false;
  fetch(backUrl + "/ehr-locations/primary-workstation-id/" + selectedLocationOrganizationId, {
    method: "POST",
    headers: await getHeaderObjectForDentrixApiCall(),
    body: JSON.stringify([
      {
        "locationId": selectedLocationId,
        "primary_workstation_id": clientJs,
        // "is_initial_sync": false,
        "sync_failed": markFailed
      }
    ]),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log("data-->", data);
    })
    .catch((error) => {
      console.log("There was a problem with update primary-workstation-id:", error);
    });
}

async function getHeaderObjectForDentrixApiCall() {
  const result = await new Promise((resolve) => {
    chrome.storage.local.get(['token'], (result) => {
      resolve(result);
    });
  });
  authToken = result.token;
  return {
    "Content-Type": "application/json",
    Authorization: authToken,
    "x-source": "chromeext",
    session_key: "session",
  };
}

async function preparePostObject(dataToPost) {
  return {
    method: "POST",
    headers: await getHeaderObjectForDentrixApiCall(),
    body: JSON.stringify(dataToPost),
  };
}

async function preparePutObject(dataToPost) {
  return {
    method: "PUT",
    headers: await getHeaderObjectForDentrixApiCall(),
    body: JSON.stringify(dataToPost),
  };
}

async function preparePAPostData(chunk, type, operation = "UPDATE") {
  const dataKey = getDataKeyByType(type);
  return {
    [dataKey]: chunk,
    type: type,
    appointmentlocation: selectedLocationId,
    timezone: currentLocationTimezone,
    operation: operation
  };
}

const getDataKeyByType = (type) => {
  switch (type) {
    case "CarrierInsurancePlanV1":
      return "carrierInsurancePlans";
    case "CarrierPlanDeductibleV1":
      return "carrierPlanDeductibles";
    case "RecareTemplateV1":
      return "recareTemplates";
    case "PracticeProcedureV1":
      return "practiceProcedure";
    case "OrganizationLedgerTypes":
      return "organizationLedgerTypes";
    case "OrganizationLedgerTypes_mandatoryTags":
      return "organizationLedgerTypesMandatoryTags";
    case "OrganizationLedgerTypes_optionalTags":
      return "organizationLedgerTypesOptionalTags";
    case "GlobalInsuranceCarrierV1":
      return "globalInsuranceCarriers";
    case "FeeScheduleV1":
      return "feeSchedules";
    case "FeeScheduleRangesV1":
      return "rangedFeeSchedule";
    case "InsuranceCarrierV1":
      return "insuranceCarriers";
    case "ReferralSourceV1":
      return "referralSources";
    case "ExamServiceItems":
      return "examServiceItems";
    case "ItemGroups":
      return "itemGroups";
    case "ApptTypes":
      return "appointmentType";
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};

async function logSyncFunctions(pa_module_name, syncStatus, patientId = "") {
  if (patientId == "") {
    console.log(pa_module_name + " " + syncStatus);
  } else {
    console.log(
      pa_module_name + " for patient: ",
      +patientId + " has " + syncStatus + "."
    );
  }
}

async function processTabs() {
  return new Promise((resolve, reject) => {
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        window.tabs.forEach(function (tab) {
          if (checkUrlMatches(tab.url)) {
            const urlUntilDotCom = tab.url.match(/^https?:\/\/[^\/]+\.com/)[0];
            dentrixUrl = urlUntilDotCom;
          } else {
            // Perform actions for non-matching URL patterns if needed
          }
        });
      });
      resolve(dentrixUrl);
    });
  });
}

async function setChromeExtensionUpdateListener() {
  chrome.runtime.onUpdateAvailable.addListener(function (details) {
    console.log("updating to version " + details.version);
    chrome.runtime.reload();
  });

  chrome.runtime.requestUpdateCheck(function (status) {
    if (status == "update_available") {
      console.log("update pending...");
    } else if (status == "no_update") {
      console.log("no update found");
    } else if (status == "throttled") {
      console.log("Oops, I'm asking too frequently - I need to back off.");
    }
  });

}

async function getEhrDefaultLocation() {
  if (!loginUserId || !officeId || !practiceLocationId || !currentLocation) {
    await getUserIdAndOfficeId()
  }
  if (!cookieForAPI || !requestVerificationToken) {
    await checkRequestToken();
  }
  if (practiceLocationId && practiceLocationId !== '' && practiceLocationId !== null && practiceLocationId !== undefined) {
    const endpoint = `${getEndpoints.MAINURL}${practiceLocationId}${getEndpoints.BOOTSTRAP_LOCATION}${practiceLocationId}`;
    const practiceInfo = await getDataFromDentrix(endpoint);
    try {
      const url = backUrl + `/appointment-location/timezone/${practiceInfo.BillingProviderZip}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
          'x-source': 'chromeext',
          'session_key': 'session'
        },
      });
      if (!response.ok) {
        throw new Error('Network response for Get Timezone was not ok');
      }
      const data = await iterateResponse(response)
      currentLocationTimezone = data.data;
      currentLocationOrganizationId = "" + practiceLocationId;
      // console.log("currentLocationTimezone",currentLocationTimezone);
      // console.log("currentLocationOrganizationId",currentLocationOrganizationId);
    } catch (error) {
      console.log('Error: getEhrDefaultLocation:: ', error);
    }
  }
}

function autoStartBackgroundSyncing() {
  console.log('entered in auto start background syncing!')
  chrome.storage.local.get(['selectedLocationId', 'countOfApis', 'userId'], async (result) => {
    console.log('selectedLocationId-->', result.selectedLocationId)
    console.log('countOfApis-->', result.countOfApis)
    console.log('userId-->', result.userId)
    if (result.selectedLocationId !== undefined && result.countOfApis !== undefined && result.userId !== undefined) {
      if (result.countOfApis === totalTableCount) {
        getCurrentLocationForAutoSyncing()

      }
    }
  });
}

// //First Time Syncing
async function getCurrentLocationForAutoSyncing() {
  fetch(dentrixUrl + '/locationClaimDefaults')
    .then(response => {
      return iterateResponse(response)
    })
    .then(async data => {
      // Assuming the response contains a timezone value
      currentLocation = data?.id
      // Call another function to fetch the timezone
      await fetchTimezoneForAutoSyncing();
    })
    .catch(error => {
      console.log(error)
      console.log('There was a problem with the fetch operation:');
    });
}

// Function to fetch timezone
async function fetchTimezoneForAutoSyncing() {
  // Assuming you have another endpoint to fetch the timezone
  // Replace 'timezoneEndpoint' with the actual endpoint
  fetch(dentrixUrl + '/bootstrap/location/')
    .then(response => {
      return iterateResponse(response)
    })
    .then(timezoneData => {
      // Do something with the timezone data
      console.log('Timezone data:', timezoneData);
      const filteredLocation = timezoneData.find(location => location.id === currentLocation);

      if (filteredLocation) {
        currentLocationTimezone = filteredLocation.timezone;
        currentLocationOrganizationId = filteredLocation.organization.id;

        console.log('Timezone:', currentLocationTimezone);
        console.log('Organization ID:', currentLocationOrganizationId);
        //Call Next Release Functions Here
        // getPatients()
      } else {
        console.log('Location not found.');
      }

    })
    .catch(error => {
      console.log('There was a problem fetching the timezone:', error);
    });
}

function setCookie(uniqueId) {
  chrome.cookies.set({
    url: 'https://example.com', // Replace with your extension's URL
    name: 'userIdentity',
    value: uniqueId
  });
}

function getCookie() {
  chrome.cookies.get({
    url: 'https://example.com', // Replace with your extension's URL
    name: 'userIdentity'
  }, function (cookie) {
    if (cookie) {
      console.log(cookie.value);
    } else {
      console.log('Cookie not found');
    }
  });
}

/**
 * Session Timeout Code Start
 * Login: Update session timeout key on each 10 minutes.
 * Logout: Stop the interval.
 */
// var _interval;
// chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
//   try {
//     if (message.type == 'userLoginFromAditApp' || message.type == 'userLogoutFromAditApp') {
//       const window = await chrome.windows.getCurrent({ populate: true });
//       const activeTab = window.tabs.find(tab => tab.active);
//       if (message.type == 'userLoginFromAditApp') {
//         console.log('User Login | Started Interval to update session timeout');
//         if (_interval) clearInterval(_interval);
//         _interval = setInterval(() => {
//           chrome.scripting.executeScript({
//             target: {tabId: activeTab.id},
//             function: () => {
//               const oldValue = JSON.parse(localStorage.getItem('jqueryIdleTimeoutPlus'));
//               if (oldValue) {
//                 oldValue.lastActivity = Date.now();
//                 localStorage.setItem('jqueryIdleTimeoutPlus', JSON.stringify(oldValue));
//               }
//             }
//           });
//         }, 10 * 60 * 1000)
//       } else if (message.type == 'userLogoutFromAditApp') {
//         if (_interval) clearInterval(_interval);
//       }
//     }
//   } catch (error) {
//     console.error('Error in util-function onMessage :: ', error);
//   }
// });
/** Session Timeout Code End */

function checkEhrResponse(response) {
  // Check if the response is successful
  if (!response.ok) {
    return false;
  }
  // Parse the response as JSON
  return response.json();
}

function getMatchingRegexKey(url) {
  const keys = Object.keys(EHR_APIS);
  for (const key of keys) {
    const regex = new RegExp(key);
    if (regex.test(url)) {
      return EHR_APIS[key];
    }
  }
  return null;
}

function generateUniqueId() {
  // Generate a random 16-byte (128-bit) array
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  // Convert the array to a hex string
  const id = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  return `${id.substring(0,16)}_${new Date().getTime()}`;
}

function ehrApiHeaders(){
  return {
    'Content-Type': 'application/json',
    "Requestverificationtoken": requestVerificationToken,
    "Cookie": cookieForAPI,
  }
}

async function newIterateResponse(response) {
  // Check if the response is successful
  if (!response.ok) {
    throw new Error("Adit app api network response was not ok");
  }
  if (userLogoutFromAditApp) {
    syncFailedForFirstTime();
    chrome.action.setBadgeText({ text: ' ' });
    chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    throw new Error("Dentrix Log out. Please Login Again");
  } else {
    // Parse the response as JSON
    return await response.json();
  }
}

async function postDataToAdit(endpoint, dataToStore) {
  const fullEndpoint = getFullAditEndPoint(endpoint);
  try {
    const response = await fetch(fullEndpoint, await preparePostObject(dataToStore));
    return await newIterateResponse(response);
  } catch (error) {
    console.error(`Error fetching data from ${fullEndpoint}:`, error);
    throw error;
  }
}

// Utility for building API URLs with placeholders
function buildApiUrl(endpoint, replacements) {
  let apiUrl = getFullEHREndPoint(endpoint);
  return replaceMultipleValue(apiUrl, replacements);
}

// Utility for making HTTP requests
async function fetchFromApi(url, options = {}) {
  try {
      const response = await fetch(url, options);
      return await checkEhrResponse(response);
  } catch (error) {
     logAndThrowError('fetchFromApi', error)
  }
}

function logAndThrowError(functionName, error) {
  console.error(`🚀 ~ ${functionName} ~ error:`, error);
  throw error;
}

async function ehrApiCall(endpoint, replacements, method = "GET", body = null) {
  const apiUrl = buildApiUrl(endpoint, replacements);
  const options = {
      method,
      headers: ehrApiHeaders(),
  };
  if (body) options.body = JSON.stringify(body);

  return await fetchFromApi(apiUrl, options);
}

async function fetchDataFromAPI(url) {
   try {
      let response = await fetch(url, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
         }
      });

      if (!response.ok) throw new Error(`Fetch failed for URL: ${url}`);
      return await iterateResponse(response);
   } catch (error) {
      console.error(`Error in fetching the data:\n`, error);
      throw error;
   }
}

/*
async function fetchDataFromAPI(url) {
   try {
      let response = await fetch(url, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
         }
      });

      if (!response.ok) throw new Error(`Fetch failed for URL: ${url}`);
      return await iterateResponse(response);
   } catch (error) {
      console.error(`Error in fetching the data:\n`, error);
      throw error;
   }
}
*/
async function getPatients() {
  console.log("%c🏥 Patient Syncing Started...", "color: #0e7bff; font-size: 16px; font-weight: bold;");
  startPatientSync();
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
})

async function startPatientSync() {
  try {
    try {
      let result = await new Promise((resolve) => {
        chrome.storage.local.get(['uniquePatientsBatch'], (result) => {
            resolve(result);
        });
      });

      if (!result.uniquePatientsBatch?.status) {
        if (!userLogoutFromAditApp) {
          let patientIds = await syncAllPatients()
          if (patientIds.length) {
            let result2 = await new Promise((resolve) => {
              chrome.storage.local.get(['uniquePatientsBatch'], (result) => {
                  resolve(result);
              });
            });
            console.log("result2",result2);
            
            if (result2.uniquePatientsBatch?.status && result2.uniquePatientsBatch.batches) { 
              let totalIndex = result2.uniquePatientsBatch.batches;
              for (let index = 0; index < totalIndex; index++) {
                console.log("index>>>",index);
                
                let patientIdsBatch = await new Promise((resolve) => {
                  chrome.storage.local.get([`patientSyncBatch${index}`], (result) => {
                      resolve(result);
                  });
                });
                console.log("patientIdsBatch>>>",patientIdsBatch);
                
                if (!patientIdsBatch[`patientSyncBatch${index}`]?.syncStatus) {
                  await processPatientBatchToStore(patientIdsBatch[`patientSyncBatch${index}`]?.uniqueIds, {
                    appointmentlocation: selectedLocationId,
                    apptLocationEhrId: currentLocation
                  });
                  let patientStatus = {
                    syncStatus: true,
                    uniqueIds: patientIdsBatch[`patientSyncBatch${index}`]?.uniqueIds
                  }
                  chrome.storage.local.set({ [`patientSyncBatch${index}`] : patientStatus });
                }
              }     
            }
          }
        }
      }else {
        if (result.uniquePatientsBatch?.status && result.uniquePatientsBatch.batches) { 
          let totalIndex = result.uniquePatientsBatch.batches;
          for (let index = 0; index < totalIndex; index++) {
            console.log("index>>>",index);
            let patientIdsBatch = await new Promise((resolve) => {
              chrome.storage.local.get([`patientSyncBatch${index}`], (result) => {
                  resolve(result);
              });
            });
            console.log("patientIdsBatch>>>",patientIdsBatch);
            if (!patientIdsBatch[`patientSyncBatch${index}`]?.syncStatus) {
              await processPatientBatchToStore(patientIdsBatch[`patientSyncBatch${index}`]?.uniqueIds, {
                appointmentlocation: selectedLocationId,
                apptLocationEhrId: currentLocation
              });
              let patientStatus = {
                syncStatus: true,
                uniqueIds: patientIdsBatch[`patientSyncBatch${index}`]?.uniqueIds
              }
              chrome.storage.local.set({ [`patientSyncBatch${index}`] : patientStatus });
            }
            
            
          }     
        }
      }
      
    } catch (error) {
      console.log('Error in patient sync:');
      console.log(error.message);
      return // Stop execution if there's an error
    }
    if (!userLogoutFromAditApp) {
      console.log("%c✅ Patient Syncing Completed.", "color: #2ecc71; font-size: 16px; font-weight: bold;");
      await handleBadgeAndCount();
      !userLogoutFromAditApp && getAppointments();
    }
  } catch (error) {
    console.log('Error in patient sync:');
    console.log(error.message)
  }
}

async function syncAllPatients() {
  // Function to generate all dates
  function generateDates() {
    const currentDate = new Date();
    const dates = [];

    // Loop through each year from the current year back to 100 years ago
    for (let year = currentDate.getFullYear(); year >= currentDate.getFullYear() - 100; year--) {
      // Set the start date to January 1st of the current year
      const startDate = new Date(year, 0, 1);
      let currentDay = startDate;

      // Loop through all days of the year
      while (currentDay.getFullYear() === year) {
        // Stop adding dates if we've reached the current day
        if (currentDay > currentDate) {
          break;
        }

        // Format the current date as "YYYY-MM-DD 00:00:00.000"
        const formattedDate = currentDay.toISOString().split('T')[0] + ' 00:00:00.000';
        dates.push(formattedDate);

        // Move to the next day
        currentDay.setDate(currentDay.getDate() + 1);
      }
    }

    return dates;
  }

  // Split array into chunks of specified size
  function chunkArray(arr, chunkSize) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  const datesArray = generateDates();
  console.log("datesArray length:", datesArray.length);

  if (datesArray.length) {
    // Split the dates array into chunks of 10
    const dateChunks = chunkArray(datesArray, 10);

    // Process each chunk
    for (let chunk of dateChunks) {
      const promises = chunk.map(async (date) => {
        try {
          let response = await getpatientIdsWithDateparam(date);

          if (!response) {
            return;  // Skip if no response or empty response
          }
          
          // Collect unique patient IDs from the response
          response.forEach((patient) => {
            if (patient.PatientId !== undefined && !uniqueIds.has(patient.PatientId)) {
              uniqueIds.add(patient.PatientId);
            }
          });
          console.log("Unique Ids >>", Array.from(uniqueIds).length);
        } catch (error) {
          console.error(`Error fetching data for date ${date}:`, error);
          // Continue processing other dates, skip the error date
        }
      });

      // Wait for all promises in the current chunk to resolve
      await Promise.all(promises);
    }

    let patientIdsArray = Array.from(uniqueIds);
    let chunkedPatientIds = chunkArray(patientIdsArray, 100);
    if (Array.isArray(chunkedPatientIds)) {
      let patientStatus = {
        status: true,
        batches: chunkedPatientIds.length,
        allIds: patientIdsArray
      }

      chrome.storage.local.set({ uniquePatientsBatch: patientStatus });
      let AllBatchObj = chunkedPatientIds.map(batch => ({
        syncStatus: false,
        uniqueIds: batch
      }))

      AllBatchObj.forEach((elem, index) => {
        chrome.storage.local.set({ [`patientSyncBatch${index}`]: elem });
        chrome.storage.local.set({ [`patientOrderBatch${index}`]: elem });
      })

      return patientIdsArray;
    }
  }
}

let getpatientIdsWithDateparam = async (date) => {
  const baseUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/Patient/Search`;
  const url = `${baseUrl}`;
  const params = {
    "DateOfBirth": date,
    "InActive": true,
    "IsPatient": true,
    "Start": 0,
    "Length": 250,
    "SortCriteria": []
}
  try {
    const response = await getPatientsListRetry(url, params);

    if (response.length === 0) {
      console.log(`No data received for Date: ${date}. Skipping.`);
      return null;  // Return null if no data is found
    }
    return response;  // If no additional data, just return the original response

  } catch (error) {
    console.log(`Error for Date ${date}: ${error.message}`);
    if (error.message === 'Dentrix Log out. Please Login Again') {
      throw new Error('Dentrix Log out. Please Login Again');  // Throw error to handle logout
    }
    return null;  // Return null in case of other errors
  }
};

async function processPatientBatchToStore(patientIdsArray, appointmentlocation) {
  let batchSize = 50;
  let totalChunks = Math.ceil(patientIdsArray.length / batchSize);  // Calculate the total number of chunks

  console.log(`Total chunks to process: ${totalChunks}`);

  for (let i = 0; i < patientIdsArray.length; i += batchSize) {
    let batch = patientIdsArray.slice(i, i + batchSize);  // Get the next batchSize of patient IDs

    // Log current chunk number and total chunks
    let currentChunk = Math.floor(i / batchSize) + 1;
    console.log(`Processing chunk ${currentChunk} of ${totalChunks}`);

    let batchPromises = batch.map(patientId => {
      if (!patientId) {
        return null;  // Skip invalid patientId
      }
      return getPatientDetailWithRetry(patientId);  // Request patient details for the current batch
    }).filter(promise => promise !== null);  // Remove null promises (invalid IDs)

    // Await all patient detail promises for the current batch
    let allData = (await Promise.allSettled(batchPromises))
      .map(result => result.value)
      .filter(p => p);  // Filter out any failed results
    
    // Store data if available for the current batch
    if (allData.length) {
      // console.log("allData>>>",allData);
      await storePatientToAditFirstTimeSync(allData, appointmentlocation.appointmentlocation)
        .catch(error => {
          console.log(`Error storing patients for all combinations sync`, error);
        });
        // For Patient Notes
        for (const patient of allData) {
          try {
            await getAndStorePatientNotesByPatientId(String(patient.Id));
          } catch (error) {
            console.error(`Error storing notes for patient ${patient.Id}:`, error);
          }
        }
        // console.log("storePatientToAditFirstTimeSync, completed");  
    }
  }
}

function getPatientsListRetry(url, params, retries = 5, delay = 1000) {
  return new Promise(async (resolve, reject) => {
    const fetchWithRetry1 = async (retries, delay) => {
      let attempt = 0;
      let response;

      while (attempt <= retries) {
        try {
          // Make the fetch request
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Requestverificationtoken": requestVerificationToken,
              "Cookie": cookieForAPI,
            },
            body: JSON.stringify(params),
          });

          // Check if the response status is successful
          if (response.ok) {
            let data = await iterateResponse(response);

            // Ensure the expected data structure is returned
            if (data && data.data) {
              resolve(data.data);  // Resolve the promise with the data
              return;
            } else {
              resolve([]);  // Resolve with an empty array if data is not found
              return;
            }
          } else {
            // Handle non-200 status codes (e.g., 500, 503)
            if (response.status >= 500) {
              // Retry for server errors (500, 503)
              console.log(`Server error (status ${response.status}). Retrying in ${delay}ms...`);
              if (attempt < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));  // Wait before retrying
              }
              attempt++;  // Increment attempt after retrying
              continue;  // Continue with the next retry attempt
            } else {
              // Reject on non-200 status codes other than server errors (e.g., 400, 401)
              reject(new Error(`Failed to fetch data. Status: ${response.status}`));
              return;
            }
          }
        } catch (error) {
          // Handle retry logic on error
          if (attempt < retries) {
            console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));  // Delay before retrying
          } else {
            // Reject the promise if all retries fail
            console.log(`All ${retries} attempts failed.`);
            reject(error);
            return;
          }
        }

        attempt++;
      }
    };

    // Call the fetchWithRetry1 function
    await fetchWithRetry1(retries, delay);
  });
}

async function getPatientExamsAndExamDetailsData(patientId, getExamOnly = false) {
  const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientExams/GetPatientExams?patientId=${patientId}&domainKey=Exam.Charge`;
  try {
    const response = !userLogoutFromAditApp && await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch the Patient Exam Data for patient ID ${patientId}`
      );
    }

    const patient = await iterateResponse(response);
    if (!patient || !Object.keys(patient).length) {
      return;
    }

    if (getExamOnly) {
      console.log('\ngetExamOnly is true so it returns patient\n'); // remove this line
      console.log('\npatient exam data - patient\n', patient); // remove this line
      return patient;
    }

    let orderId = null;
    let examId = null;
    if (Array.isArray(patient.OrderExams)) {
      patient.OrderExams.forEach((exam) => {
        orderId = exam.OrderId;
        examId = exam.ExamId;
      });
    }

    const patientexamdetailsData = await getPatientExamDetails(patientId, orderId, examId)
    return patientexamdetailsData;
  } catch (error) {
    console.log('Error: getPatientExamsAndExamDetailsData::', error);
    return;
  }
}

async function getPatientExamDetails(patientId, orderId, examId) {
  try {
    const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientExams/GetPatientExamDetail?patientId=${patientId}&orderId=${orderId}&examId=${examId}`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });
    const patientexamdetailsData = await iterateResponse(response)
    
    return patientexamdetailsData;
  } catch (error) {
    console.error('Error: getPatientExamDetails::', error);
    return;
  }
}

async function getPatientOrders(patientId, type) {
   const endpoint = type === 'invoiced' ? 'GetInvoicedPatientOrders' : 'GetPendingPatientOrders';
   const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/${endpoint}?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=${patientId}`;
   return await fetchDataFromAPI(url);
}

async function getEyeglassOrderDetail(patientId, orderNum) {
   const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/EyeglassOrder/GetEyeglassOrderDetail?patientId=${patientId}&orderNumber=${orderNum}`;
   return await fetchDataFromAPI(url);
}

async function getOnlyEyeglassOrderDetail(patientId) {
   try {
      const invoicedOrders = await getPatientOrders(patientId, 'invoiced');
      const nonInvoicedOrders = await getPatientOrders(patientId, 'noninvoiced');

      const invoicedEyeglassOrders = (invoicedOrders.data || []).filter(order => order.OrderType === "Eyeglass");
      const nonInvoicedEyeglassOrders = (nonInvoicedOrders.data || []).filter(order => order.OrderType === "Eyeglass");

      const allOrderNumbers = [
         ...invoicedEyeglassOrders.map(order => order.OrderNum),
         ...nonInvoicedEyeglassOrders.map(order => order.OrderNum)
      ];

      const orderDetailPromises = allOrderNumbers.map(orderNum =>
         getEyeglassOrderDetail(patientId, orderNum)
      );

      const allOrderDetails = await Promise.all(orderDetailPromises);
      if (!allOrderDetails?.length) {
         console.log(`No Eyeglass Order Details found for patient ID ${patientId}`);
         return;
      }

      console.log("\nAll Eyeglass Order Details:\n", allOrderDetails);
      return allOrderDetails;
   } catch (error) {
      console.error(`Error: getOnlyEyeglassOrderDetail::\n`, error);
   }
}
/*
async function getPatientOrders(patientId, type) {
   const endpoint = type === 'invoiced' ? 'GetInvoicedPatientOrders' : 'GetPendingPatientOrders';
   const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/${endpoint}?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=${patientId}`;
   return await fetchDataFromAPI(url);
}

async function getEyeglassOrderDetail(patientId, orderNum) {
   const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/EyeglassOrder/GetEyeglassOrderDetail?patientId=${patientId}&orderNumber=${orderNum}`;
   return await fetchDataFromAPI(url);
}

async function getOnlyEyeglassOrderDetail(patientId) {
   try {
      const invoicedOrders = await getPatientOrders(patientId, 'invoiced');
      const nonInvoicedOrders = await getPatientOrders(patientId, 'noninvoiced');

      const invoicedEyeglassOrders = (invoicedOrders.data || []).filter(order => order.OrderType === "Eyeglass");
      const nonInvoicedEyeglassOrders = (nonInvoicedOrders.data || []).filter(order => order.OrderType === "Eyeglass");

      const allOrderNumbers = [
         ...invoicedEyeglassOrders.map(order => order.OrderNum),
         ...nonInvoicedEyeglassOrders.map(order => order.OrderNum)
      ];

      const orderDetailPromises = allOrderNumbers.map(orderNum =>
         getEyeglassOrderDetail(patientId, orderNum)
      );

      const allOrderDetails = await Promise.all(orderDetailPromises);
      if (!allOrderDetails?.length) {
         console.log(`No Eyeglass Order Details found for patient ID ${patientId}`);
         return;
      }

      console.log("\nAll Eyeglass Order Details:\n", allOrderDetails);
      return allOrderDetails;
   } catch (error) {
      console.error(`Error: getOnlyEyeglassOrderDetail::\n`, error);
   }
}
*/

async function getPatientDetailWithRetry(patientId, getPhoneOnly = false) {
  const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientDemographics/Get?id=${patientId}`;
  let retries = 5;
  let delay = 1000
  const fetchWithRetry2 = async (retries, delay) => {
    let response;
    for (let attempt = 0; attempt <= retries; attempt++) {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Requestverificationtoken": requestVerificationToken,
          "Cookie": cookieForAPI,
        }
      });

      if (response.status !== 404) {
        return response; // If it's not a 404, we return the response
      }

      if (attempt < retries) {
        console.log(`Attempt ${attempt + 1} failed with 404. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
      }
    }
    return response; // If all retries fail, return the last response
  };

  try {
    const response = await fetchWithRetry2(retries, delay);
    const patient = await iterateResponse(response);
    if (!patient || !Object.keys(patient).length) {
      return;
    }

    if (getPhoneOnly) {
      return patient;
    }

    const recalls = await getPatientRecalls(patientId, false);
    let insuranceDetails = [];
    if (patient?.HasInsurance) {
      insuranceDetails = await getPatientInsuranceDetails(patientId);
    }
    // const emergencyContactDetails = await getEmergencyContactDetails(patient.relationships, patientId);
    const lastAndNextAppointmentDetail = await getLastAndNextAppointmentDetail(patientId);
    const paymentDetails = await getPaymentDetails(patientId)

    // return { ...patient, recalls, insuranceDetails, emergencyContactDetails , lastAndNextAppointmentDetail, paymentDetails};
    return { ...patient, recalls, insuranceDetails , lastAndNextAppointmentDetail, paymentDetails};
  } catch (error) {
    console.log('Error: getPatientDetail::', error);
    return;
  }
}

async function getPaymentDetails(patientId) {
  const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetOrderTransactions?draw=1&start=0&length=20&orderBy=TransactionId&orderDir=desc&patientId=${patientId}&orderId=0&allowFamilyPay=false&_=1739866452290`;
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Requestverificationtoken": requestVerificationToken,
      "Cookie": cookieForAPI,
    }
  });

  // Check if the response is OK (status code 200-299)
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  let data = await iterateResponse(response);
  data = data.data;
  // data = data.filter(elem => elem.OrderType === "Exam");

  const sales = [];
  const payments = [];
  const adjustment = []
  data.forEach(item => {
    if (item.TransactionTypeID === 1) { // Sales
      sales.push({
        OrderID: item.OrderID,
        Amount: Math.abs(item.Amount),
        TransactionDate: new Date(item.TransactionDate),
        TransactionId: item.TransactionId
      });
    } else if (item.TransactionTypeID === 2) { // Payments
      payments.push({
        OrderID: item.OrderID,
        Amount: Math.abs(item.Amount),
        TransactionDate: new Date(item.TransactionDate),
        TransactionId: item.TransactionId
      });
    } else if(item.TransactionTypeID === 10){
      adjustment.push({
        OrderID: item.OrderID,
        Amount: Math.abs(item.Amount),
        TransactionDate: new Date(item.TransactionDate),
        TransactionId: item.TransactionId
      });
    }
  });
  
  const currentDate = new Date();
  const adjustedSales = [];

  sales.forEach(sale => {
    let totalPaymentForSale = 0;

    payments.forEach(payment => {
      if (payment.OrderID === sale.OrderID) {
        totalPaymentForSale += payment.Amount;
      }
    });

    adjustment.forEach(adj => {
      if (adj.OrderID === sale.OrderID) {
        totalPaymentForSale += adj.Amount
      }
    })

    adjustedSales.push({
      ...sale,
      Amount: Math.max(0, sale.Amount - totalPaymentForSale), 
    });
  });

  let thirtyDaysSum = 0;
  let sixtyDaysSum = 0;
  let ninetyDaysSum = 0;
  let overNinetyDaysSum = 0;
  let totalOutstandingBalance = 0;

  adjustedSales.forEach(sale => {
    const diffInDays = Math.floor((currentDate - sale.TransactionDate) / (1000 * 60 * 60 * 24));

    if (sale.Amount > 0) { 
      totalOutstandingBalance += sale.Amount;
    }

    if (diffInDays <= 30) {
      thirtyDaysSum += sale.Amount;
    } else if (diffInDays <= 60) {
      sixtyDaysSum += sale.Amount;
    } else if (diffInDays <= 90) {
      ninetyDaysSum += sale.Amount;
    } else {
      overNinetyDaysSum += sale.Amount;
    }
  });

  const totalPaymentAmount = payments.reduce((sum, payment) => sum + payment.Amount, 0);

  return {
    totalOutstandingBalance,
    totalPaymentAmount,
    thirtyDaysSum,
    sixtyDaysSum,
    ninetyDaysSum,
    overNinetyDaysSum
  };
}

async function getEmergencyContactDetails(patientRelationships, patientId) {
  let emergencyContactData = {
    "emergencycontactid": "",
    "emergencycontactfirstname": "",
    "emergencycontactlastname": "",
    "emergencycontactnumber": ""
  };
  try {
    let apiUrl = '';
    // console.log('Emergency Contact Detail Started for Patient Id: ',patientId)
    if (patientRelationships && patientRelationships.secondaryContact && patientRelationships.secondaryContact.id && patientRelationships.primaryContact.id == patientId) {
      // console.log('Fetching Secondary Contact detail for following patient:', patientRelationships.secondaryContact.id);
      apiUrl = dentrixUrl + '/patient/' + patientRelationships.secondaryContact.id;
    }
    if (patientRelationships && patientRelationships.primaryContact && patientRelationships.primaryContact.id && patientRelationships.primaryContact.id != patientId) {
      // console.log('Fetching Primary Contact detail for following patient:', patientRelationships.primaryContact.id);
      apiUrl = dentrixUrl + '/patient/' + patientRelationships.primaryContact.id;
    }
    if (apiUrl != '') {
      // console.log('apiUrl --> ',apiUrl)
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Parsing the JSON response
      const responseData = await iterateResponse(response)

      // console.log(responseData);

      // Check if response is not empty
      if (responseData) {
        // console.log('API Response:', responseData);
        emergencyContactData = {
          "emergencycontactid": (responseData && responseData.id) ? responseData.id : "",
          "emergencycontactfirstname": (responseData && responseData.firstName) ? responseData.firstName : "",
          "emergencycontactlastname": (responseData && responseData.lastName) ? responseData.lastName : "",
          "emergencycontactnumber": (responseData && responseData.phones && responseData.phones[0]) ? responseData.phones[0].number : ""
        };
      } else {
        // console.log('Not EmergencyContact for patient:', patientId);
      }
    }
  } catch (error) {
    console.log(`Error: getEmergencyContactDetails::`, error);
  }
  // console.log('Emergency Contact Detail Ended for Patient Id: ',patientId, ' with data: ',emergencyContactData)
  return emergencyContactData;
}

async function getLastAndNextAppointmentDetail(patientId) {
  try {
    const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/Patient/GetAllAppointmentsByPatientId?officeNumber=${practiceLocationId}&patientId=${patientId}`;
    
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await iterateResponse(response);

    // If no appointments exist, return 0 for all visits
    if (!data || !data.patientAppointments || !data.patientAppointments.length) {
      // return { firstVisit: 0, lastVisit: 0, nextVisit: 0 };
      return { firstVisit: 0, lastVisit: 0 };
    }

    // Helper function to convert AppointmentDate and AppointmentTime to UTC timestamp
    const getUtcTimestampFromDateTime = (dateStr, timeStr) => {
      const [month, day, year] = dateStr.split('/');
      
      // Convert time in 12-hour format to 24-hour format
      const timeParts = timeStr.split(' ');
      let [hours, minutes] = timeParts[0].split(':');
      let ampm = timeParts[1].toUpperCase();
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      if (ampm === 'PM' && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
      if (ampm === 'AM' && hours === 12) hours = 0; // Convert 12 AM to 00 hours

      // Create the combined datetime string and convert to UTC timestamp
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      // const date = new Date(year, month - 1, day, hours, minutes);
      return date.getTime();
    };

    // Sort the appointments by combined AppointmentDate and AppointmentTime converted to UTC timestamp
    const sortedAppointments = data.patientAppointments.sort((a, b) => {
      const timestampA = getUtcTimestampFromDateTime(a.AppointmentDate, a.AppointmentTime);
      const timestampB = getUtcTimestampFromDateTime(b.AppointmentDate, b.AppointmentTime);
      return timestampA - timestampB; // Ascending order
    });

    // Get the current UTC timestamp
    const currentUtcTimestamp = Date.now(); // This returns the current UTC timestamp

    // Initialize variables for first, last, and next visit
    let firstVisit = 0;
    let lastVisit = 0;
    let nextVisit = 0;

    // Iterate over the sorted appointments and assign the first, last, and next visits
    sortedAppointments.forEach(appointment => {
      const appointmentTimestamp = getUtcTimestampFromDateTime(appointment.AppointmentDate, appointment.AppointmentTime);

      // Set the first visit (earliest appointment)
      if (firstVisit === 0) {
        firstVisit = appointmentTimestamp;
      }

      // Set the last visit (latest appointment that is in the past)
      if (appointmentTimestamp <= currentUtcTimestamp) {
        lastVisit = appointmentTimestamp;
      }

      // If the appointment date is in the future, it becomes the next visit
      if (appointmentTimestamp > currentUtcTimestamp && nextVisit === 0) {
        nextVisit = appointmentTimestamp;
      }
    });

    // Prepare the result object based on what visits are found
    const result = {};

    // Only include the visits that are set (i.e., non-zero)
    if (firstVisit !== 0) result.firstVisit = firstVisit;
    if (lastVisit !== 0) result.lastVisit = lastVisit;
    // if (nextVisit !== 0) result.nextVisit = nextVisit;

    // If no visits are found, return 0 for all visits
    if (Object.keys(result).length === 0) {
      result.firstVisit = 0;
      result.lastVisit = 0;
      // result.nextVisit = 0;
    }

    return result;

  } catch (error) {
    console.error("Error in getLastAndNextAppointmentDetail:", error);
    // return { firstVisit: 0, lastVisit: 0, nextVisit: 0 };  // Return 0 for all visits in case of error
    return { firstVisit: 0, lastVisit: 0};  // Return 0 for all visits in case of error
  }
}

async function storePatientToAditFirstTimeSync(patients, appointmentlocation, storeSp = false) {
  try {
    // Convert patient IDs to strings
    let patientsWithStringIds = await Promise.all(patients.map(async patient => {
      let date = new Date(patient.DateOfBirth);
      let dob = (date.getTime() + date.getTimezoneOffset() * 60 * 1000);
      let languageType = patient.PreferredLanguageTypes.filter(e => e.Key == patient.PreferredLanguage);
      let title = patient.TitleTypes.filter(e => e.Key == patient.Title);
      let MaritalStatusType = patient.MaritalStatusTypes.filter(e => e.Key == patient.MaritalStatus);
      let aditPatient = {}
      if (patient.Id) {
        aditPatient.preferredLocation = { id : practiceLocationId };
        aditPatient.id = String(patient.Id);
        aditPatient.firstName = patient.FirstName;
        aditPatient.lastName = patient.LastName;
        aditPatient.middleName = patient.MiddleInitial;
        aditPatient.dateOfBirth = dob;
        aditPatient.mobile = patient.PrimaryPhoneType == 306 ? getMaskedNumber(patient.PrimaryPhone) : patient.SecondaryPhoneType == 306 ? getMaskedNumber(patient.SecondaryPhone) : '';
        aditPatient.home_phone = patient.PrimaryPhoneType == 304 ? getMaskedNumber(patient.PrimaryPhone) : patient.SecondaryPhoneType == 304 ? getMaskedNumber(patient.SecondaryPhone) : '';
        aditPatient.work_phone = patient.PrimaryPhoneType == 305 ? getMaskedNumber(patient.PrimaryPhone) : patient.SecondaryPhoneType == 305 ? getMaskedNumber(patient.SecondaryPhone) : '';
        aditPatient.preferredName = patient.NickName;
        aditPatient.emailAddress = patient.Email;
        aditPatient.status = patient.Active ? 'ACTIVE' : 'INACTIVE';
        // aditPatient.languageType = languageType.length ? languageType[0].Description : "";
        aditPatient.languageType = languageType.length ? languageType[0].Description === 'Spanish; Castilian' ? 'Spanish' : languageType[0].Description || '' : '';
        aditPatient.lastVisitDate = patient.lastAndNextAppointmentDetail ? patient.lastAndNextAppointmentDetail.lastVisit : 0;
        aditPatient.firstVisitDate = patient.lastAndNextAppointmentDetail ? patient.lastAndNextAppointmentDetail.firstVisit : 0;
        aditPatient.patientAddress = {
          address1 : patient.Address.Address1 || '',
          address2 : patient.Address.Address2 || '',
          city : patient.Address.City || '',
          state : patient.Address.State || '',
          postalCode : patient.Address.ZipCode || '',
        };
        aditPatient.primaryProvider = { id: patient?.Provider === 0 ? '' : String(patient?.Provider) };
        aditPatient.gender = patient.Sex == 'M' ? 'M' : (patient.Sex == 'F' ? 'F' : (patient.Sex == 'O' ? 'O' : ""));
        let responsiblePartyObj;
        if (patient.ResponsiblePartyId !== 0 && patient.ResponsiblePartyId !== patient.Id) {
          let responsiblePartyDetails = await getPatientDetailWithRetry(patient.ResponsiblePartyId, true)
          let responsiblePartydate = new Date(responsiblePartyDetails.DateOfBirth);
          let responsibleDob = (responsiblePartydate.getTime() + responsiblePartydate.getTimezoneOffset() * 60 * 1000)
          responsiblePartyObj = {
            patient_ehr_id : String(responsiblePartyDetails.Id),
            ehr_status : responsiblePartyDetails.Active ? 'ACTIVE' : 'INACTIVE',
            first_name : responsiblePartyDetails.FirstName,
            last_name : responsiblePartyDetails.LastName,
            ssn : responsiblePartyDetails.SocialSecurityNumber ? String(responsiblePartyDetails.SocialSecurityNumber) : '',
            birth_date : responsibleDob
          }
        };
        aditPatient.relationships = {
          primaryContact : {id: patient.ResponsiblePartyId === 0 ? '' : String(patient.ResponsiblePartyId) },
          primaryGuarantor: responsiblePartyObj || null
        };
        aditPatient.contactMethod = patient.CommunicationPreference === 3 ? 'CALL_ME' : 'Email';
        aditPatient.title = title.length ? title[0].Description : "";
        aditPatient.maritalStatus = MaritalStatusType?.length ? MaritalStatusType[0].Description : "";
        aditPatient.ssn = patient.SocialSecurityNumber ? String(patient.SocialSecurityNumber) : '',
        aditPatient.deceased = patient.Deceased;
        aditPatient.firstMonth = patient?.paymentDetails ? patient?.paymentDetails?.thirtyDaysSum  : 0;
        aditPatient.secondMonth = patient?.paymentDetails ? patient?.paymentDetails?.sixtyDaysSum  : 0;
        aditPatient.thirdMonth = patient?.paymentDetails ? patient?.paymentDetails?.ninetyDaysSum  : 0;
        aditPatient.overThreeMonths = patient?.paymentDetails ? patient?.paymentDetails?.overNinetyDaysSum  : 0;
        aditPatient.balance = patient?.paymentDetails ? patient?.paymentDetails?.totalOutstandingBalance  : 0;
        aditPatient.collectPayment = patient?.paymentDetails ? patient?.paymentDetails?.totalPaymentAmount  : 0;
        if (patient.recalls) {
          aditPatient.recalls = patient.recalls;
        }
        if (patient.insuranceDetails) {
          aditPatient.insuranceDetails = patient.insuranceDetails;
        }
      }
      return aditPatient;
    }));
  patients = patientsWithStringIds;
  const bunchSize = 30;
  let pi = 0;
  const url = `${backUrl}/patient/${appointmentlocation}`;
// console.log("patients>>>",patients);

  while (pi < patients.length && !userLogoutFromAditApp) {
    const cutTo = (pi + bunchSize) > patients.length ? patients.length : (pi + bunchSize);
    // console.log('pi: ', pi, bunchSize, cutTo);
    const cutPatient = patients.slice(pi, cutTo);
    const response = await fetch(url, await preparePostObject({ "patients": cutPatient, "storeSp": storeSp }));
    pi += bunchSize;
    if (!response.ok) {
      throw new Error('Failed to store patients to Adit');
    }
    const data = await iterateResponse(response)
    console.log('Patients stored successfully in Adit:::', data);
  }
} catch (error) {
  console.log(error, "PatientSync error");
}
}

function getMaskedNumber(mobile) {
  let maskedNumber = mobile ? mobile.replace(/[^A-Z0-9]/ig, "") : "";
  return maskedNumber;
}

/**Get recares of patient by ehr id */
async function getPatientRecalls(patient_ehr_id, forPA) {
  try {
    const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/Patient/GetAllRecallsByPatientId?patientId=${patient_ehr_id}&userId=0&officeNumber=${practiceLocationId}`
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });
    const data = await iterateResponse(response)
    if (!forPA) {
 // Modify the PatientRecallDetails to include NextRecall as an array (date + timestamp)
 if (data && data.PatientRecallDetails && data.PatientRecallDetails.length) {
  data.PatientRecallDetails = data.PatientRecallDetails.map(recall => {
    const nextRecallDate = recall.NextRecall;  // NextRecall date in MM/DD/YYYY format
    
    // If the date is present, calculate the UTC timestamp (midnight UTC)
    if (nextRecallDate) {
      const [month, day, year] = nextRecallDate.split('/');
      const date = new Date(Date.UTC(year, month - 1, day));  // Create the UTC date object
      // Replace the NextRecall field with an array containing the date and timestamp
      recall.NextRecall = date.getTime()
    }
    return recall;
  });
  return data.PatientRecallDetails; // Return the processed details
} else {
  return []; // Return empty array if no PatientRecallDetails found
}
    } else {
      if (Object.keys(data).length) {
        return data
      } else {
        return []
      }
    }

  } catch (error) {
    console.log(`Error: getPatientRecalls::`, error);
    return [];
  }
}

/** Get and manage patient insurance details */
async function getPatientInsuranceDetails(patient_ehr_id) {
  const finalInsurance = [];

  try {
    const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientInsurance/GetPatientInsurances?patientId=${patient_ehr_id}&activeOnly=true`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch patient insurances');
      return finalInsurance; // Return early on failure
    }

    const data = await iterateResponse(response);
    // console.log(data, "data::");

    // Process a maximum of 2 insurance plans
    if (data && data.length) {
      let primaryIns = data.filter(elem => elem.IsPrimaryInsurance).sort((a, b) => a.CarrierDisplay.split(" / ")[0].localeCompare(b.CarrierDisplay.split(" / ")[0]));
      let secondaryIns = data.filter(elem => !elem.IsPrimaryInsurance).sort((a, b) => a.CarrierDisplay.split(" / ")[0].localeCompare(b.CarrierDisplay.split(" / ")[0]));
      const promises = [];

      if (primaryIns.length > 0) {
        promises.push(processInsurancePlan(primaryIns[0], 0));
      }
      
      if (secondaryIns.length > 0) {
        promises.push(processInsurancePlan(secondaryIns[0], 1));
      }
    
      // Wait for all promises to resolve
      await Promise.all(promises);
    }

  } catch (error) {
    console.error(`Error in getPatientInsuranceDetails::`, error);
  }
  return finalInsurance;
  // Helper function to process each insurance plan
  async function processInsurancePlan(plan, index) {
    try {
      const insurancePlanDetails = await fetchInsurancePlanDetails(plan.PlanId);
      const subscriber = await fetchSubscriberDetails(patient_ehr_id, plan.Id);

      const insuranseData = {
        patientId: patient_ehr_id,
        // name: insurancePlanDetails.PlanName,
        name: String(plan.PlanId), // Plan id
        insuranceId: plan.Id,
        startDate: plan.InputDate,
        contact: getMaskedNumber(insurancePlanDetails.PhoneNumber),
        locationId: practiceLocationId,
        insType: insurancePlanDetails.CoverageType,
        autoExpiration: insurancePlanDetails.EligibilityExpirationDays,
        // subscriberId: subscriber.SubscriberId,
        subscriberId: String(subscriber.InsuredId), //insurance id
        company_name: insurancePlanDetails.CarrierName, // data not retrieved need confroamtion
        identity: '', // data not retrieved
        policyGroup: '', // data not retrieved
        coPayment: '', // data not retrieved
        authorization: '', // data not retrieved
        groupid: '', // data not retrieved
        priority: index + 1
      };

      finalInsurance.push(insuranseData);

    } catch (error) {
      console.error(`Error in processing insurance plan ${plan.id}:`, error);
    }
  }

  // Helper function to fetch insurance plan details
  async function fetchInsurancePlanDetails(planId) {
    const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/ProductCatalog/GetInsurancePlanDetails?planId=${planId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch insurance plan details');
    }

    return await iterateResponse(response);
  }

  // Helper function to fetch subscriber details
  async function fetchSubscriberDetails(patientId, insuranceId) {
    const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientInsurance/GetPatientInsuranceById?patientId=${patientId}&insuranceId=${insuranceId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriber details');
    }

    return await iterateResponse(response);
  }
}


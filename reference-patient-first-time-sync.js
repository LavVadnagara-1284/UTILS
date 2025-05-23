/*
async function getInvoicedPatientOrders(patientId) {
  // https://pm.eyefinity.com/api/office/0013472/MaterialOrder/GetInvoicedPatientOrders?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=57396759&_=1747983837574

  const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetInvoicedPatientOrders?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=${patientId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Patient Order Data for patient ID: ${patientId}`);
    }

    let PatientOrderData = await iterateResponse(response);
    console.log("\nPatient Order Data:\n", PatientOrderData);

    return PatientOrderData;
  } catch (error) {
    console.error(`Error: getInvoicedPatientOrders::\n`, error);
  }
}

async function getNonInvoicedPatientOrders(patientId) {
  // https://pm.eyefinity.com/api/office/0013472/MaterialOrder/GetPendingPatientOrders?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=57396759&_=1747978448912
  const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetPendingPatientOrders?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=${patientId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Patient Order Data for patient ID: ${patientId}`);
    }

    let PatientOrderData = await iterateResponse(response);
    console.log("\nPatient Order Data:\n", PatientOrderData);

    return PatientOrderData;
  } catch (error) {
    console.error(`Error: getInvoicedPatientOrders::\n`, error);
  }
}

async function getOnlyEyeglassOrderDetail(patientId) {
   let invoicedOrderNum = null;
   let invoicedPatientOrdersData = await getInvoicedPatientOrders(patientId);
   invoicedPatientOrdersData.data.forEach(order => {
      if (order.OrderType === "Eyeglass") {
         invoicedOrderNum = order.OrderNum;
      }
   })
   
   console.log("InvoicedOrderNumber:", invoicedOrderNum);

   let nonInvoicedOrderNum = null;
   let nonInvoicedPatientOrdersData = await getNonInvoicedPatientOrders(patientId);
   nonInvoicedPatientOrdersData.data.forEach(order => {
      if (order.OrderType === "Eyeglass") {
         nonInvoicedOrderNum = order.OrderNum;
      }
   })
   
   console.log("NoninvoicedOrderNumber:", nonInvoicedOrderNum);

   // https://pm.eyefinity.com/api/office/0013472/EyeglassOrder/GetEyeglassOrderDetail?patientId=39959223&orderNumber=36710748

   const invoicedDataAPIUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/EyeglassOrder/GetEyeglassOrderDetail?patientId=${patientId}&orderNumber=${invoicedOrderNum}`;
   const nonInvoicedDataAPIUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/EyeglassOrder/GetEyeglassOrderDetail?patientId=${patientId}&orderNumber=${nonInvoicedOrderNum}`;
   try {
      const invoicedDataresponse = await fetch(invoicedDataAPIUrl, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
         }
      });

      if (!invoicedDataresponse.ok) {
         throw new Error(`Failed to fetch Patient Order Data for patient ID: ${patientId}`);
      }

      let invoicedOrderData = await iterateResponse(invoicedDataresponse);
      console.log("\nPatient Invoiced Order Data:\n", invoicedOrderData);
      
      const nonInvoicedDataresponse = await fetch(nonInvoicedDataAPIUrl, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
         }
      });

      if (!nonInvoicedDataresponse.ok) {
         throw new Error(`Failed to fetch Patient Order Data for patient ID: ${patientId}`);
      }

      let nonInvoicedOrderData = await iterateResponse(nonInvoicedDataresponse);
      console.log("\nPatient Non Invoiced Data:\n", nonInvoicedOrderData);

      let PatientOrderData = {...invoicedOrderData, ...nonInvoicedOrderData};
      console.log("\nPatient Order Data:\n", PatientOrderData);

      return PatientOrderData;
   } catch (error) {
      console.error(`Error: getOnlyEyeglassOrderDetail::\n`, error);
   }
}
*/

//** Start of the Patient EyeglassOrderDetail **//
async function getAndStorePatientEyeglassOrderDetail(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchPatientEyeglassOrderDetail = async (patient) => {
      let patientId = patient.patient_ehr_id;
      let onlyEyeglassOrderDetailData = await getOnlyEyeglassOrderDetail(patientId);
      console.log("\nThis is the patient EyeglassOrderDetail Data - onlyEyeglassOrderDetailData: \n", onlyEyeglassOrderDetailData);  
      try {
        for(const element of onlyEyeglassOrderDetailData) {
          const PatientEyeglassOrderDetailPostData = {
              EyeglassOrderDetail: element,
              appointmentlocation: selectedLocationId,
              operation: "CREATE",
              patientId: patientId
            }
            console.log("\nPatient EyeglassOrderDetail POST Data:\n", PatientEyeglassOrderDetailPostData);
            // await storeAllPatientEyeglassOrderDetail(PatientEyeglassOrderDetailPostData)
        }
      } catch (error) {
        console.error(`Error: fetch Patient EyeglassOrderDetail ::\n`, error);
      }
    };
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch Patient EyeglassOrderDetail concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientEyeglassOrderDetail));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error: fetching and storing Patient EyeglassOrderDetail ::\n", error);
  }
}

async function storeAllPatientEyeglassOrderDetail(PPT){
  const url = `${backUrl}/patient/${selectedLocationId}/eyeglassorderdetail`;
  try {
    const response = await fetch(url, await preparePostObject(PPT)); 
    const data = await iterateResponse(response);
    if(!data || !data.status){
      console.log("Unable to update the eyeglassorderdetail :: ");
    }
  } catch (error) {
    console.warn("Unable to send the eyeglassorderdetail for storing :: \n", error);
  }
}
//** End of the Patient EyeglassOrderDetail **//

async function fetchData(url) {
   try {
      const response = await fetch(url, {
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
      console.error(`Error in fetchData:\n`, error);
      throw error;
   }
}

async function getPatientOrders(patientId, type) {
   const endpoint = type === 'invoiced' ? 'GetInvoicedPatientOrders' : 'GetPendingPatientOrders';
   const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/${endpoint}?draw=1&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=${patientId}`;
   return await fetchData(url);
}

async function getEyeglassOrderDetail(patientId, orderNum) {
   const url = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/EyeglassOrder/GetEyeglassOrderDetail?patientId=${patientId}&orderNumber=${orderNum}`;
   return await fetchData(url);
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
      if (!allOrderDetails || !allOrderDetails.length) {
         console.log(`No Eyeglass Order Details found for patient ID ${patientId}`);
         return;
      }

      console.log("\nAll Eyeglass Order Details:\n", allOrderDetails);
      return allOrderDetails;
   } catch (error) {
      console.error(`Error: getOnlyEyeglassOrderDetail::\n`, error);
   }
}


async function getAndStorePatientMsSql() {
  const patientListUrl = `${backUrl}/patient/${selectedLocationId}`;
  let page = 1;
  const size = 30;
  let looping = true;

  const startDate = new Date();
  // console.log("Start date:::", startDate);
  while (looping && !userLogoutFromAditApp) {
    console.log("page::", page);
    // Get list of patients from aditapp
    const aditPatients = await getPatientsListFromAdit(patientListUrl, {
      page,
      size,
      fields: "patient_ehr_id",
    });

    // Check or increment page to get next data
    if (!aditPatients.length) {
      looping = false;
      break;
    } else {
      page += 1;
    }
    console.log("aditPatients",aditPatients);


    await getSyncPAPatientFunctions(aditPatients)
    
    //all pa modules-patients
    logSyncFunctions("PA Module(s) Syncing for page " + page, " started");
    for (const patient of aditPatients) {
      let patient_ehr_id = patient.patient_ehr_id.toString();
      await processAllAppointments(patient_ehr_id);
    }
    // await fetchInsuranceClaims(aditPatients);
    // await fetchInsuranceClaimStatusHistory(aditPatients);
    // await fetchPatientTxCases(aditPatients);
    // await fetchVisits(aditPatients);
    // await fetchVisitProcedure(aditPatients);
    // await getAndStorePatientAddress(aditPatients);
    // await getAndStorePatientProcedures(aditPatients);
    // await getAndStorePatientProceduresInsuranceClaim(aditPatients);
    // await fetchPatientNotes(aditPatients);
    // // await fetchPatientClaims(aditPatients);
    // await fetchPatientSubscriberInsurancePlans(aditPatients);
    // // await getAndStorePatientMedication(selectedLocationId, aditPatients);
    // // await getAndStorePatientSsnBulk(selectedLocationId, aditPatients);
    await fetchPaymentInvoice(aditPatients);
    // // await fetchTransaction(aditPatients);
    // // await getTransactionDetails(aditPatients);
    logSyncFunctions("PA Module(s) Syncing for page " + page, " completed");
    // if (!res.ok || !data.status) {
    //   console.log(`Error while inserting patient into mssql::`);
    // }
  }



  await handleBadgeAndCount();
  await updateCloudEHRGettingStartedStatus("completed"); 
}

async function getSyncPAPatientFunctions(aditPatients) {
  await fetchAndStorePaPatient(aditPatients);
  // // await getAndStorePatientDiagnosis(aditPatients);
  await getAndStorePatientAddress(aditPatients)
  await getAndStorePatientRelationship(aditPatients)
  await fetchPatientNotes(aditPatients);
  await getAndStorePatientRecallPracticeProcedures(aditPatients);
  await fetchPatientSubscriberInsurancePlans(aditPatients);
  await getAndStorePatientExamsDetails(aditPatients);
  await getAndStorePatientExams(aditPatients);
  await getAndStoreMakePaymentMiscellaneousReasons(aditPatients);

  // await fetchPatientExams(aditPatients);
  // await getAndStorePatientInsurance(aditPatients);
}

async function fetchAndStorePaPatient(patientIdsArray){
  let batchSize = 50;
  let totalChunks = Math.ceil(patientIdsArray.length / batchSize);  // Calculate the total number of chunks

  console.log(`Total chunks to process: ${totalChunks}`);

  for (let i = 0; i < patientIdsArray.length; i += batchSize) {
    let batch = patientIdsArray.slice(i, i + batchSize);  // Get the next batchSize of patient IDs

    // Log current chunk number and total chunks
    let currentChunk = Math.floor(i / batchSize) + 1;
    console.log(`Processing chunk ${currentChunk} of ${totalChunks}`);

    let batchPromises = batch.map(patientId => {
      if (!patientId.patient_ehr_id) {
        return null;  // Skip invalid patientId
      }
      return getPatientDetailWithRetry(patientId.patient_ehr_id, true);  // Request patient details for the current batch
    }).filter(promise => promise !== null);  // Remove null promises (invalid IDs)

    // Await all patient detail promises for the current batch
    let allData = (await Promise.allSettled(batchPromises))
      .map(result => result.value)
      .filter(p => p);  // Filter out any failed results
    
    // Store data if available for the current batch
    if (allData.length) {
      // console.log("allData>>>",allData);
      await storePatientToAditMSSQL(allData)
        .catch(error => {
          console.log(`Error storing patients for all combinations sync`, error);
        }); 
    }
  }
}

async function storePatientToAditMSSQL(patients) {
  try {

    // Convert patient IDs to strings
    const patientsWithStringIds = patients.map(patient => {
      let date = new Date(patient.DateOfBirth);
      var dob = (date.getTime() + date.getTimezoneOffset() * 60 * 1000)
      let languageType = patient.PreferredLanguageTypes.filter(e => e.Key == patient.PreferredLanguage);
      let timeStampLastExamDate = ''
      if (patient.LastExamDate) {
        let lastExamDate = new Date(patient.LastExamDate);
        timeStampLastExamDate = (lastExamDate.getTime() + lastExamDate.getTimezoneOffset() * 60 * 1000);
      }
      let title = patient.TitleTypes.filter(e => e.Key == patient.Title);
      let primaryCallTimeType = patient.CallTimeTypes.filter(e => e.Key == patient.PrimaryPhoneCallTime);
      let secondaryCallTimeType = patient.CallTimeTypes.filter(e => e.Key === patient.SecondaryPhoneCallTime);
      let EmploymentStatusType = patient.EmploymentStatusTypes.filter(e => e.Key == patient.EmploymentStatus);
      let MaritalStatusType = patient.MaritalStatusTypes.filter(e => e.Key == patient.MaritalStatus);
      let EthnicityType = patient.EthnicityTypes.filter(e => e.Key == patient.Ethnicity);
      let CommunicationPreferenceType = patient.CommunicationPreferenceTypes.filter(e => e.Key == patient.CommunicationPreference);
      let ReferredByType = patient.ReferredByTypes.filter(e => e.Key == patient.Referral);
      let patientCommunicationMethodRecalls = patient.PatientCommunicationMethods.filter(e => e.Description == "Recalls");
      let patientCommunicationMethodAppointment = patient.PatientCommunicationMethods.filter(e => e.Description == "Appointment");
      let patientCommunicationMethodProductPickUp = patient.PatientCommunicationMethods.filter(e => e.Description == "Product Pick Up");
      let patientCommunicationMethodMarketingPromo = patient.PatientCommunicationMethods.filter(e => e.Description == "Marketing Promo");
      let patientCommunicationMethodEducation = patient.PatientCommunicationMethods.filter(e => e.Description == "Education");
      let primaryPhone = getMaskedNumber(patient.PrimaryPhone);
      let secondary_phone_type = patient.PhoneTypes.filter(e => e.Key == patient.SecondaryPhoneType);
      let primary_phone_type = patient.PhoneTypes.filter(e => e.Key == patient.PrimaryPhoneType);
      if (patient.Id) {
        patient.preferredLocation = { "id": practiceLocationId }
        patient.id = String(patient.Id);
        patient.firstName = patient.FirstName;
        patient.lastName = patient.LastName;
        patient.middleName = patient.MiddleInitial;
        patient.dateOfBirth = dob;
        patient.patient_ehr_id = String(patient.Id);
        patient._id = patient.PatientUid.toLowerCase();
        patient.mobile = patient.PrimaryPhoneType == 306 ? getMaskedNumber(patient.PrimaryPhone) : patient.SecondaryPhoneType == 306 ? getMaskedNumber(patient.SecondaryPhone) : '';
        patient.home_phone = patient.PrimaryPhoneType == 304 ? getMaskedNumber(patient.PrimaryPhone) : patient.SecondaryPhoneType == 304 ? getMaskedNumber(patient.SecondaryPhone) : '';
        patient.work_phone = patient.PrimaryPhoneType == 305 ? getMaskedNumber(patient.PrimaryPhone) : patient.SecondaryPhoneType == 305 ? getMaskedNumber(patient.SecondaryPhone) : '';
        patient.preferredName = patient.NickName;
        patient.emailAddress = patient.Email;
        patient.status = patient.Active ? 'ACTIVE' : 'INACTIVE';
        // patient.languageType = languageType.length ? languageType[0].Description : "";
        patient.languageType = languageType.length ? languageType[0].Description === 'Spanish; Castilian' ? 'Spanish' : languageType[0].Description || '' : '';
        patient.lastVisitDate = timeStampLastExamDate ? timeStampLastExamDate : 0;
        patient.address_one = patient.Address.Address1 || '';
        patient.address_two = patient.Address.Address2 || '';
        patient.city = patient.Address.City || '';
        patient.state = patient.Address.State || '';
        patient.zipcode = patient.Address.ZipCode || '';
        patient.country = patient.Address.Country | "";
        patient.familyId = patient.ResponsiblePartyId;
        patient.preferredContact = primaryPhone == patient.mobile ? 'Mobile' : primaryPhone == patient.home_phone ? 'Home' : 'Work'
        patient.providerId = patient?.Provider || 0;
        patient.patReferralEntityID = patient?.ReferralEntityID || 0;
        patient.patReference = ReferredByType?.length ? ReferredByType[0].Description : "";// didnt get data 
        patient.title = title.length ? title[0].Description : "";
        patient.medicalRecordNumber = patient.MedicalRecordNumber;
        patient.primaryPhoneCallTime = primaryCallTimeType.length ? primaryCallTimeType[0].Description : "";
        patient.isBadPhonePrimary = patient.isBadPhonePrimary
        patient.secondaryPhoneCallTime = secondaryCallTimeType.length ? secondaryCallTimeType[0].Description : "";
        patient.isBadPhoneSecondary = patient.isBadPhoneSecondary;
        patient.employmentStatus = EmploymentStatusType?.length ? EmploymentStatusType[0].Description : '';
        patient.maritalStatus = MaritalStatusType?.length ? MaritalStatusType[0].Description : "";
        patient.races = patient.Races?.length ? patient.Races.join(', ') : "";
        patient.ethnicity = EthnicityType?.length ? EthnicityType[0].Description : "";
        patient.communicationPreference = CommunicationPreferenceType.length ? CommunicationPreferenceType[0].Description : "";
        patient.dueBalance = patient.dueBalance;
        patient.reminingBenefits = patient.PatientInsuranceBalance;
        patient.communicationRecallsText = patientCommunicationMethodRecalls.length ? patientCommunicationMethodRecalls[0].Text : false;
        patient.communicationRecallsCall = patientCommunicationMethodRecalls.length ? patientCommunicationMethodRecalls[0].Call : false;
        patient.communicationRecallsEmail = patientCommunicationMethodRecalls.length ? patientCommunicationMethodRecalls[0].Email : false;
        patient.communicationRecallsMail = patientCommunicationMethodRecalls.length ? patientCommunicationMethodRecalls[0].Mail : false;
        patient.communicationAppointmentText = patientCommunicationMethodAppointment.length ? patientCommunicationMethodAppointment[0].Text : false;
        patient.communicationAppointmentCall = patientCommunicationMethodAppointment.length ? patientCommunicationMethodAppointment[0].Call : false;
        patient.communicationAppointmentEmail = patientCommunicationMethodAppointment.length ? patientCommunicationMethodAppointment[0].Email : false;
        patient.communicationAppointmentMail = patientCommunicationMethodAppointment.length ? patientCommunicationMethodAppointment[0].Mail : false;
        patient.communicationProductPickupText = patientCommunicationMethodProductPickUp.length ? patientCommunicationMethodProductPickUp[0].Text : false;
        patient.communicationProductPickupCall = patientCommunicationMethodProductPickUp.length ? patientCommunicationMethodProductPickUp[0].Call : false;
        patient.communicationProductPickupEmail = patientCommunicationMethodProductPickUp.length ? patientCommunicationMethodProductPickUp[0].Email : false;
        patient.communicationProductPickuptMail = patientCommunicationMethodProductPickUp.length ? patientCommunicationMethodProductPickUp[0].Mail : false;
        patient.communicationMarketingPromText = patientCommunicationMethodMarketingPromo.length ? patientCommunicationMethodMarketingPromo[0].Text : false;
        patient.communicationMarketingPromEmail = patientCommunicationMethodMarketingPromo.length ? patientCommunicationMethodMarketingPromo[0].Call : false;
        patient.communicationMarketingPromCall = patientCommunicationMethodMarketingPromo.length ? patientCommunicationMethodMarketingPromo[0].Email : false;
        patient.communicationMarketingPromMail = patientCommunicationMethodMarketingPromo.length ? patientCommunicationMethodMarketingPromo[0].Mail : false;
        patient.communicationEducationText = patientCommunicationMethodEducation.length ? patientCommunicationMethodEducation[0].Text : false;
        patient.communicationEducationEmail = patientCommunicationMethodEducation.length ? patientCommunicationMethodEducation[0].Email : false;
        patient.communicationEducationCall = patientCommunicationMethodEducation.length ? patientCommunicationMethodEducation[0].Call : false;
        patient.communicationEducationMail = patientCommunicationMethodEducation.length ? patientCommunicationMethodEducation[0].Mail : false;
        patient.deceased = patient.Deceased;
        patient.isPatientMerged = patient.IsPatientMerged;
        patient.specialNeeds = patient.SpecialNeeds;
        patient.patBalance = patient.PatientCredit;
        patient.sex = patient.Sex == 'M' ? 'Male' : (patient.Sex == 'F' ? 'Female' : (patient.Sex === 'O' ? 'Other' : ""));

        patient.secondaryPhoneType = secondary_phone_type?.length ? secondary_phone_type[0].Description : "";
        patient.primaryPhoneType = primary_phone_type?.length ? primary_phone_type[0].Description : "";

      }

      return patient;
    });
  } catch (error) {
    console.log(error, "PatientSync error");

  }
  const bunchSize = 5;
  let pi = 0;
  const url = backUrl + "/patient/" + selectedLocationId + "/mssql";
  // for (let pi = 0; pi < patients.length; pi += bunchSize) {
  while (pi < patients.length && !userLogoutFromAditApp) {
    const cutTo = (pi + bunchSize) > patients.length ? patients.length : (pi + bunchSize);
    // console.log('pi: ', pi, bunchSize, cutTo);
    const cutPatient = patients.slice(pi, cutTo);
    const response = await fetch(url, await preparePostObject(cutPatient));
    pi += bunchSize;
    if (!response.ok) {
      //stopFirstTimeSync()
      throw new Error('Failed to store patients to Adit');
    }
    const data = await iterateResponse(response)
    if (!data.status) {
      // console.log(`============:::::::::::::${data}:::::::::::::::::==========`);
    } else {
      // start - patient profile code after store patient in Adit
      // for (let pi = 0; pi < cutPatient.length; pi++) {
      //   const element = cutPatient[pi];
      //   if(!userLogoutFromAditApp && element.patientPicture){
      //     await getAndStorePatientPicture(element.id, element.patientPicture);
      //   }
      // }
      // end - patient profile code after store patient in Adit
    }
    // console.log('Patients stored successfully in Adit:::', data);
  }
}

//** Start of the Patient Exam details **//
async function getAndStorePatientExamsDetails(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchPatientExamDetails = async (patient) => {
      let patientId = patient.patient_ehr_id;
      // Fetching the data of patient exam details only
      let patientExamDetailsData = await getPatientExamsAndExamDetailsData(patientId, false);

      try {
        if (patientExamDetailsData) {
          const patientExamDetailPostData = {
            patientExamDetails: patientExamDetailsData,
            appointmentlocation: selectedLocationId,
            operation: "UPDATE",
            patientId: patientId
          }
          console.log("\npatientExamDetailPostData: \n", patientExamDetailPostData);

          await storeAllPatientExamDetails(patientExamDetailPostData)
        }
      } catch (error) {
        console.error('Error: getAndStorePatientExamsDetails::', error);
      }
    }

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientExamDetails concurrently within the batch with Check of logout flag before proceeding with each batch
        if (!userLogoutFromAditApp) {
          // Process the current batch concurrently
          await Promise.all(batch.map(fetchPatientExamDetails));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching Patient Exam Details:", error);
  }
}

// This POSTs the patient exam details to the backend
async function storeAllPatientExamDetails(examDetails) {
  const url = `${backUrl}/patient/${selectedLocationId}/examdetails`;
  try {
    const response = await fetch(url, await preparePostObject(examDetails));
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient examdetails:: ");
    }
  } catch (error) {
    console.log("Unable to update patient examdetails:: ", error);
  }
  return true;
}
//** End of the Patient ExamDetails **//

//** Start of the Patient EXAMS **//
async function getAndStorePatientExams(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchPatientExams = async (patient) => {
      let patientId = patient.patient_ehr_id;
      // Fetching the data of patient exams only
      let patientExamsData = await getPatientExamsAndExamDetailsData(patientId, true);
      let orderExamsData = patientExamsData.OrderExams;

      console.log('\nThis is the patient Exams Data - orderExamsData: \n', orderExamsData);

      try {
        if (orderExamsData) {
          orderExamsData = orderExamsData.map(element => ({
            ...element,
            ExamDate: element.ExamDate ? convertDate(element.ExamDate) : element.ExamDate,
          }));

          console.log("\nDate converted data: \n", orderExamsData);

          const patientExamsPostData = {
            patientExams: orderExamsData,
            appointmentlocation: selectedLocationId,
            operation: "UPDATE",
            patientId: patientId
          }
          console.log("\npatientExamsPostData: \n", patientExamsPostData);
          await storeAllPatientExam(patientExamsPostData)
        }
      } catch (error) {
        console.error('Error: getAndStorePatientExams::', error);
      }
    }
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientExams concurrently within the batch with Check of logout flag before proceeding with each batch
        if (!userLogoutFromAditApp) {
          // Process the current batch concurrently
          await Promise.all(batch.map(fetchPatientExams));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching Patient Exams:", error);
  }
}

async function storeAllPatientExam(patientExam) {
  const url = `${backUrl}/patient/${selectedLocationId}/exams`;
  try {
    const response = await fetch(url, await preparePostObject(patientExam));
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient exam data :: ");
    }
  } catch (error) {
    console.warn("Unable to update patient exam data :: \n", error);
  }
  return true;
}
//** End of the Patient EXAM **//

//** Start of the MakePaymentMiscellaneousReasons **//
async function getAndStoreMakePaymentMiscellaneousReasons(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchMakePaymentMiscellaneousReasons = async (patient) => {
      let patientId = patient.patient_ehr_id;
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetMakePaymentMiscellaneousReasons`;
      try {
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch MakePaymentMiscellaneousReasons for patient ID ${patientId}`);
        }

        let MakePaymentMiscellaneousReasonsData = await iterateResponse(response);
        console.log("\nMakePaymentMiscellaneousReasonsData\n", MakePaymentMiscellaneousReasonsData);

          const patientMakePaymentMiscellaneousReasonsPostData = {
            makePaymentMiscellaneousReasons: MakePaymentMiscellaneousReasonsData,
            appointmentlocation: selectedLocationId,
            operation: "CREATE",
            patientId: patientId
          }
          console.log("\npatientMakePaymentMiscellaneousReasonsPostData:\n", patientMakePaymentMiscellaneousReasonsPostData);
          await storeAllMakePaymentMiscellaneousReasons(patientMakePaymentMiscellaneousReasonsPostData)
      } catch (error) {
        console.error(`Error: getAndStoreMakePaymentMiscellaneousReasons::`, error);
      }
    };
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch MakePaymentMiscellaneousReasons concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchMakePaymentMiscellaneousReasons));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching patient PatientNotes:", error);
  }
}

async function storeAllMakePaymentMiscellaneousReasons(MPMR){
  const url = `${backUrl}/patient/${selectedLocationId}/makepaymentmiscellaneousreasons`;
  try {
    const response = await fetch(url, await preparePostObject(MPMR));
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the makepaymentmiscellaneousreasons :: ");
    }
  } catch (error) {
    console.warn("Unable to update the makepaymentmiscellaneousreasons :: \n", error);
  }
}
//** End of the MakePaymentMiscellaneousReasons **//

/*
// Start of the MakePaymentMiscellaneousReasons //
async function getAndStoreMakePaymentMiscellaneousReasons(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchMakePaymentMiscellaneousReasons = async (patient) => {
      let patientId = patient.patient_ehr_id;
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetMakePaymentMiscellaneousReasons`;
      try {
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch MakePaymentMiscellaneousReasons for patient ID ${patientId}`);
        }

        let MakePaymentMiscellaneousReasonsData = await iterateResponse(response);
        console.log("\nMakePaymentMiscellaneousReasonsData\n", MakePaymentMiscellaneousReasonsData);

          const patientMakePaymentMiscellaneousReasonsPostData = {
            makePaymentMiscellaneousReasons: MakePaymentMiscellaneousReasonsData,
            appointmentlocation: selectedLocationId,
            operation: "CREATE",
            patientId: patientId
          }
          console.log("\npatientMakePaymentMiscellaneousReasonsPostData:\n", patientMakePaymentMiscellaneousReasonsPostData);
          await storeAllMakePaymentMiscellaneousReasons(patientMakePaymentMiscellaneousReasonsPostData)
      } catch (error) {
        console.error(`Error: getAndStoreMakePaymentMiscellaneousReasons::`, error);
      }
    };
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch MakePaymentMiscellaneousReasons concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchMakePaymentMiscellaneousReasons));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching patient PatientNotes:", error);
  }
}

async function storeAllMakePaymentMiscellaneousReasons(MPMR){
  const url = `${backUrl}/patient/${selectedLocationId}/makepaymentmiscellaneousreasons`;
  try {
    const response = await fetch(url, await preparePostObject(MPMR));
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the makepaymentmiscellaneousreasons :: ");
    }
  } catch (error) {
    console.warn("Unable to update the makepaymentmiscellaneousreasons :: \n", error);
  }
}
// End of the MakePaymentMiscellaneousReasons //
*/

//** Start of the Patient PaymentNonInvoiced **//
async function getAndStorePatientPaymentNonInvoiced(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchPatientPaymentNonInvoiced = async (patient) => {
      let patientId = patient.patient_ehr_id;
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}${getEndpoints.ORDER_NONINVOICED_DETAIL_BY_PATIENT_ID}${patientId}`;
      try {
        let PatientPaymentNonInvoicedData = await fetchDataFromAPI(apiUrl);
        console.log("\nPatient PaymentNonInvoiced Data:\n", PatientPaymentNonInvoicedData);

        const patientPaymentNonInvoicedExtractedData = Array.isArray(PatientPaymentNonInvoicedData?.data) ? PatientPaymentNonInvoicedData.data : [];

        for (const element of patientPaymentNonInvoicedExtractedData) {
          const PatientPaymentNonInvoicedPostData = {
            paymentNonInvoiced: element,
            appointmentlocation: selectedLocationId,
            operation: "CREATE",
            patientId: patientId
          }
          console.log("\nPatient PaymentNonInvoiced POST Data:\n", PatientPaymentNonInvoicedPostData);
          await storeAllPatientPaymentNonInvoiced(PatientPaymentNonInvoicedPostData)
        }
      } catch (error) {
        console.error(`Error: fetch Patient PaymentNonInvoiced ::\n`, error);
      }
    };
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch Patient PaymentNonInvoiced concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientPaymentNonInvoiced));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error: fetching and storing Patient PaymentNonInvoiced ::\n", error);
  }
}

async function storeAllPatientPaymentNonInvoiced(PPNI){
  const url = `${backUrl}/patient/${selectedLocationId}/paymentnoninvoiced`;
  try {
    const response = await fetch(url, await preparePostObject(PPNI)); 
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the paymentnoninvoiced :: ");
    }
  } catch (error) {
    console.warn("Unable to send the paymentnoninvoiced for storing :: \n", error);
  }
}
//** End of the Patient PaymentNonInvoiced **//

//** Start of the Patient PaymentTransactions **//
async function getAndStorePatientPaymentTransactions(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchPatientPaymentTransactions = async (patient) => {
      let patientId = patient.patient_ehr_id;
      // https://pm.eyefinity.com/api/office/0013472/MaterialOrder/GetOrderTransactions?draw=1&start=0&length=20&orderBy=TransactionId&orderDir=desc&patientId=39959223&orderId=0&allowFamilyPay=false&_=1729068785792

      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetOrderTransactions?draw=1&start=0&length=20&orderBy=TransactionId&orderDir=desc&patientId=${patientId}&orderId=0&allowFamilyPay=false&_=1729068785792`;
      try {
        let PatientPaymentTransactionsData = await fetchDataFromAPI(apiUrl);
        console.log("\nPatient PaymentTransactions Data:\n", PatientPaymentTransactionsData);

        const patientPaymentTransactionsExtractedData = Array.isArray(PatientPaymentTransactionsData?.data) ? PatientPaymentTransactionsData.data : [];

        for (const element of patientPaymentTransactionsExtractedData) {
          const PatientPaymentTransactionsPostData = {
            paymentTransactions: element,
            appointmentlocation: selectedLocationId,
            operation: "CREATE",
            patientId: patientId
          }
          console.log("\nPatient PaymentTransactions POST Data:\n", PatientPaymentTransactionsPostData);
          await storeAllPatientPaymentTransactions(PatientPaymentTransactionsPostData)
        }
      } catch (error) {
        console.error(`Error: fetch Patient PaymentTransactions ::\n`, error);
      }
    };
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch Patient PaymentTransactions concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientPaymentTransactions));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error: fetching and storing Patient PaymentTransactions ::\n", error);
  }
}

async function storeAllPatientPaymentTransactions(PPT){
  const url = `${backUrl}/patient/${selectedLocationId}/paymenttransactions`;
  try {
    const response = await fetch(url, await preparePostObject(PPT)); 
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the paymenttransactions :: ");
    }
  } catch (error) {
    console.warn("Unable to send the paymenttransactions for storing :: \n", error);
  }
}
//** End of the Patient PaymentTransactions **//

/*
// Start of the Patient PaymentTransactions //
async function getAndStorePatientPaymentTransactions(patients, concurrencyLimit = 10) {
  try {
    // Fetching and Storing the data from the API
    const fetchPatientPaymentTransactions = async (patient) => {
      let patientId = patient.patient_ehr_id;
      // https://pm.eyefinity.com/api/office/0013472/MaterialOrder/GetOrderTransactions?draw=1&start=0&length=20&orderBy=TransactionId&orderDir=desc&patientId=39959223&orderId=0&allowFamilyPay=false&_=1729068785792

      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetOrderTransactions?draw=1&start=0&length=20&orderBy=TransactionId&orderDir=desc&patientId=${patientId}&orderId=0&allowFamilyPay=false&_=1729068785792`;
      try {
        let PatientPaymentTransactionsData = await fetchDataFromAPI(apiUrl);
        console.log("\nPatient PaymentTransactions Data:\n", PatientPaymentTransactionsData);

        const patientPaymentTransactionsExtractedData = Array.isArray(PatientPaymentTransactionsData?.data) ? PatientPaymentTransactionsData.data : [];

        for (const element of patientPaymentTransactionsExtractedData) {
          const PatientPaymentTransactionsPostData = {
            paymentTransactions: element,
            appointmentlocation: selectedLocationId,
            operation: "CREATE",
            patientId: patientId
          }
          console.log("\nPatient PaymentTransactions POST Data:\n", PatientPaymentTransactionsPostData);
          await storeAllPatientPaymentTransactions(PatientPaymentTransactionsPostData)
        }
      } catch (error) {
        console.error(`Error: fetch Patient PaymentTransactions ::\n`, error);
      }
    };
    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch Patient PaymentTransactions concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientPaymentTransactions));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error: fetching and storing Patient PaymentTransactions ::\n", error);
  }
}

async function storeAllPatientPaymentTransactions(PPT){
  const url = `${backUrl}/patient/${selectedLocationId}/paymenttransactions`;
  try {
    const response = await fetch(url, await preparePostObject(PPT)); 
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the paymenttransactions :: ");
    }
  } catch (error) {
    console.warn("Unable to send the paymenttransactions for storing :: \n", error);
  }
}
// End of the Patient PaymentTransactions //
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
              eyeglassOrderDetails: element,
              appointmentlocation: selectedLocationId,
              operation: "CREATE",
              patientId: patientId
            }
            console.log("\nPatient EyeglassOrderDetails POST Data:\n", PatientEyeglassOrderDetailPostData);
            await storeAllPatientEyeglassOrderDetails(PatientEyeglassOrderDetailPostData)
        }
      } catch (error) {
        console.error(`Error: fetch Patient EyeglassOrderDetails ::\n`, error);
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

async function storeAllPatientEyeglassOrderDetails(PPT){
  const url = `${backUrl}/patient/${selectedLocationId}/eyeglassorderdetails`;
  try {
    const response = await fetch(url, await preparePostObject(PPT)); 
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the eyeglassorderdetail :: ");
    }
  } catch (error) {
    console.warn("Unable to send the eyeglassorderdetail for storing :: \n", error);
  }
}
//** End of the Patient EyeglassOrderDetail **//

/*
// Start of the Patient EyeglassOrderDetail //
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
              eyeglassOrderDetails: element,
              appointmentlocation: selectedLocationId,
              operation: "CREATE",
              patientId: patientId
            }
            console.log("\nPatient EyeglassOrderDetails POST Data:\n", PatientEyeglassOrderDetailPostData);
            await storeAllPatientEyeglassOrderDetails(PatientEyeglassOrderDetailPostData)
        }
      } catch (error) {
        console.error(`Error: fetch Patient EyeglassOrderDetails ::\n`, error);
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

async function storeAllPatientEyeglassOrderDetails(PPT){
  const url = `${backUrl}/patient/${selectedLocationId}/eyeglassorderdetails`;
  try {
    const response = await fetch(url, await preparePostObject(PPT)); 
    const data = await iterateResponse(response);
    if (!data?.status) {
      console.log("Unable to update the eyeglassorderdetail :: ");
    }
  } catch (error) {
    console.warn("Unable to send the eyeglassorderdetail for storing :: \n", error);
  }
}
// End of the Patient EyeglassOrderDetail //
*/

async function updateCloudEHRGettingStartedStatus(status) {
  try {
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(['organisation', 'token', 'userIdentity', 'selectedLocationId', 'organisation'], (result) => {
        resolve(result);
      });
    });
    const payload = {
      "organization": result.organisation,
      "location": result.selectedLocationId,
      "popup_type": "cloudehr",
      "status": status // inprogress / completed
    };
    const statusChangeUrl = `${aditAppUrl}/location/getstartedstatuschange`;
    const response = await fetch(statusChangeUrl, {
      method: 'PUT',
      headers: await getHeaderObjectForDentrixApiCall(),
      body: JSON.stringify(payload)
    });

    // Parse the response data
    const data = await response.json();
    console.log('Success updating completed Cloud Ehr Status:', data);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to process all patients
async function processAllAppointments(patientId) {
  // logSyncFunctions("Appointment", "started", patientId);

  // Construct the URL with the patientId
  // https://pm.eyefinity.com/api/office/0013472/Patient/GetAllAppointmentsByPatientId?officeNumber=0013472&patientId=51440596
  const url = `${dentrixUrl}/api/office/${practiceLocationId}/Patient/GetAllAppointmentsByPatientId?officeNumber=${practiceLocationId}&patientId=${patientId}`;

  try {
    // Fetch the appointment data
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    // Parse the response as JSON
    const appointmentData = await response.json();
    if (appointmentData && appointmentData.patientAppointments && appointmentData.patientAppointments.length) {
      const appointmentDetails = []
      for (let appt of appointmentData.patientAppointments) {
        const url = `${dentrixUrl}/api/Appointment/GetAppointmentDetailById?appointmentId=${appt.AppointmentId}&officeId=${practiceLocationId}`;
        try {
          // Fetch the appointment data
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Requestverificationtoken": requestVerificationToken,
              "Cookie": cookieForAPI,
            }
          });
          // Check if the response is ok (status code 200-299)
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          appointmentDetails.push(await response.json());
        } catch (error) {
          // Log any errors that occur during the fetch
          console.log("There was a problem with the fetch operation:", error);
        }
      }
      // Log the appointment data to the console
      await storeAllPAAppts(appointmentDetails);
    }
    // logSyncFunctions("Appointment", "completed", patientId);
  } catch (error) {
    // Log any errors that occur during the fetch
    console.log("There was a problem with the fetch operation:", error);
  }
}

async function storeAllPAAppts(data) {
  try {
    let ApptsInChunkArr = pachunkArrayInGroups(data, 10);
    ApptsInChunkArr.map(async (apptChunkArr, chunkarridx) => {
      let appointmentSyncData = {
        appointments: apptChunkArr,
        appointmentlocation: selectedLocationId,
        operation: 'CREATE'
      };
      // Simulate updating appointments
      fetch(
        backUrl + "/paappointments/bulkInsert",
        await preparePostObject(appointmentSyncData)
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return iterateResponse(response);
        })
        .then((data) => {
          // console.log("Appointment Synced successfully:", data);
        })
        .catch((error) => {
          console.log("Error updating Appointment:");
        });

      //For Appt visits manipulation to prevent blank calls ::TODO Check this persent in eyfinity 
      // let appVisitsChunkSync = apptChunkArr.filter(
      //   (appt) => appt.visits && appt.visits.length
      // );
      // if (appVisitsChunkSync.length) {
      //   let apptVSyncData = {
      //     appointments: appVisitsChunkSync,
      //     appointmentlocation: selectedLocationId,
      //   };
      //   // Store Appointment visits into PA
      //   await storeApptVisits(apptVSyncData);
      // }
      //For Appt visits manipulation to prevent blank calls

      //For Appt Pat Proc manipulation to prevent blank calls
      // let appChunkSync = apptChunkArr.filter(
      //   (appt) => appt.patientProcedures && appt.patientProcedures.length
      // );
      // if (appChunkSync.length) {
      //   let apptPPSyncData = {
      //     appointments: appChunkSync,
      //     appointmentlocation: selectedLocationId,
      //   };
      //   // Store Appointment Patient Procedures into PA
      //   await storeceduApptPatientProre(apptPPSyncData);
      // }
      //For Appt Pat Proc manipulation to prevent blank calls

      //For Appt Practice Proc manipulation to prevent blank calls
      // let practiceProcedureChunkSync = apptChunkArr.filter(
      //   (appt) => appt.procedures && appt.procedures.length
      // );
      // if (practiceProcedureChunkSync.length) {
      //   let practiceProcedureSyncData = {
      //     appointments: practiceProcedureChunkSync,
      //     appointmentlocation: selectedLocationId,
      //   };
      //   // Store Appointment Practice Procedures into PA
      //   await storeApptPracticeProcedure(practiceProcedureSyncData);
      // }
      //For Appt Practice Proc manipulation to prevent blank calls
    });
  } catch (error) {
    console.error("Error storing PA Appts:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

/* For Appointment Patient Procedure PA */
async function storeApptPatientProcedure(ApptPPSyncData) {
  fetch(backUrl + "/appt-patient-procedure", await preparePostObject(ApptPPSyncData))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return iterateResponse(response);
    })
    .then((data) => {
      // console.log(
      //   "PA Appointment Patient Procedure Synced successfully:",
      //   data
      // );
    })
    .catch((error) => {
      console.log("Error in Appointment Patient Procedure PA:");
    });
}
/* For Appointment Patient Procedure PA */

/* For Appointment Practice Procedure PA */
async function storeApptPracticeProcedure(ApptPPSyncData) {
  // console.log(
  //   "🚀 ~ storeApptPracticeProcedure ~ ApptPPSyncData: %j",
  //   ApptPPSyncData
  // );
  fetch(backUrl + "/appt-practice-procedure", await preparePostObject(ApptPPSyncData))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return iterateResponse(response);
    })
    .then((data) => {
      // console.log(
      //   "PA Appointment Practice Procedure Synced successfully:",
      //   data
      // );
    })
    .catch((error) => {
      console.log("Error in Appointment Practice Procedure PA:");
    });
}
/* For Appointment Practice Procedure PA */

/* For Appointment Visits PA */
async function storeApptVisits(ApptVisitsSyncData) {
  fetch(backUrl + "/appointment-visits", await preparePostObject(ApptVisitsSyncData))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return iterateResponse(response);
    })
    .then((data) => {
      // console.log("PA Appointment Visits Synced successfully:", data);
    })
    .catch((error) => {
      console.log("Error in Appointment Visits PA:");
    });
}
/* For Appointment Visits PA */

async function getPatientsListFromAdit(url, params) {
  params = Object.entries(params).map(([key, value]) => `${key}=${value}`);
  url = `${url}?${params.join("&")}`;
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: await getHeaderObjectForDentrixApiCall(),
    })
      .then((response) => iterateResponse(response))
      .then((res) => {
        // console.log("getPatientsListFromAdit - res: ", res);
        if (res.status && res.data.length) {
          return resolve(res.data);
        }
        return resolve([]);
      })
      .catch((error) => {
        console.error("Error: patient list call:::", error);
        resolve([]);
      });
  });
}

async function fetchInsuranceClaims(patients, concurrencyLimit = 100) {
  try {
    // Function to fetch insurance claims for a patient
    const fetchClaims = async (patient) => {
      const patientId = patient.patient_ehr_id;
      // logSyncFunctions("Insurance Claims", "started", patientId);
      const url = dentrixUrl + `/insuranceClaim/patientClaimsREST/${patientId}`;

      try {
        // Fetching data from the API
        const response = await fetch(url);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch insurance claims for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const data = await iterateResponse(response);
        // Prepare post data for storing claims
        const insuranceClaimsPostData = {
          insuranceClaims: data,
          appointmentlocation: selectedLocationId,
          type: "InsuranceClaim",
          timezone: currentLocationTimezone,
          operation: "UPDATE",
        };
        await storeAllInsuranceClaims(insuranceClaimsPostData);
        // logSyncFunctions("Insurance Claims", "completed", patientId);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch claims concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchClaims));
        } else {
          break;
        }
      }
    };

    // Fetch claims with concurrency
    await withConcurrency();

    // Once all claims are fetched, proceed to fetch recare templates
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   storeCountOfApis(selectedLocationId, count);
    // }
  } catch (error) {
    console.error("Error fetching insurance claims:", error);
  }
}

async function storeAllInsuranceClaims(results) {
  try {
    // This function could store the results array in any way you need
    // console.log("Storing results:", results);
    const response = await fetch(
      backUrl + "/insurance-claims/bulkInsert",
      await preparePostObject(results)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store insurance claims. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Insurance Claims stored successfully.");
  } catch (error) {
    console.error("Error storing insurance claims:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function fetchInsuranceClaimStatusHistory(
  patients,
  concurrencyLimit = 100
) {
  try {
    // Function to fetch patient InsuranceClaimStatusHistory for a patient
    const fetchInsuranceClaimStatusHistory = async (patient) => {
      const patientId = patient.patient_ehr_id;
      // logSyncFunctions("Insurance Claims Status History", "started", patientId);
      const apiUrl =
        dentrixUrl + `/insuranceClaim/patientClaimsREST/${patientId}`;

      try {
        // Fetching data from the API
        const response = !userLogoutFromAditApp && (await fetch(apiUrl));
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch InsuranceClaimStatusHistory for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const InsuranceClaimStatusHistoryData = await iterateResponse(response);
        // Process the fetched data here
        InsuranceClaimStatusHistoryData.patientId = patientId;
        const InsuranceClaimStatusHistoryPostData = {
          claimStatusHistory: InsuranceClaimStatusHistoryData,
          appointmentlocation: selectedLocationId,
          type: "InsuranceClaimStatusHistoryV1",
          timezone: currentLocationTimezone,
          operation: "UPDATE",
        };
        // console.log(InsuranceClaimStatusHistoryData);
        await storeAllInsuranceClaimStatusHistory(
          InsuranceClaimStatusHistoryPostData
        );
        // logSyncFunctions(
        //   "Insurance Claims Status History",
        //   "completed",
        //   patientId
        // );
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch InsuranceClaimStatusHistory concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchInsuranceClaimStatusHistory));
        } else {
          break;
        }
      }
    };

    // Fetch InsuranceClaimStatusHistory with concurrency
    await withConcurrency();

    //count++;
    // setBadge();
    // chrome.storage.local.set({ countOfApis: count });
    // chrome.runtime.sendMessage({
    //   type: "updateCount",
    //   count: count,
    // });
    // storeCountOfApis(selectedLocationId, count);
    // !userLogoutFromAditApp && fetchPatientNotes(patients);
  } catch (error) {
    console.error("Error fetching patient InsuranceClaimStatusHistory:", error);
  }
}

async function storeAllInsuranceClaimStatusHistory(results) {
  try {
    // This function could store the results array in any way you need
    // console.log("Storing results:", results);
    const response = await fetch(
      backUrl + "/insurance-claim-status-history/bulkinsert",
      await preparePostObject(results)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store insurance claim status history. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Insurance claim status history stored successfully.");
  } catch (error) {
    console.error("Error storing insurance claim status history:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function fetchPatientTxCases(patients, concurrencyLimit = 100) {
  try {
    // Function to fetch treatment cases for a patient
    const fetchTxCases = async (patient) => {
      const patientId = patient.patient_ehr_id;
      // logSyncFunctions("PatientTx Case", "started", patientId);
      const url = `${dentrixUrl}/selectPatient/${patientId}`;

      try {
        // Fetching data from the API
        const response = await fetch(url);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch treatment cases for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const data = await iterateResponse(response);
        // Prepare post data for storing treatment cases
        const txCasesPostData = {
          txCases: data.treatmentCases,
          appointmentlocation: selectedLocationId,
          type: "TxCaseV1",
          patientid: Number(patientId),
          timezone: currentLocationTimezone,
          operation: "UPDATE",
        };
        await storeAllTreatmentCases(txCasesPostData);
        // logSyncFunctions("PatientTx Case", "completed", patientId);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch treatment cases concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchTxCases));
        } else {
          break;
        }
      }
    };

    await withConcurrency();

    // Fetch treatment cases with concurrency
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   // Once all treatment cases are fetched, proceed to fetch recare templates
    //   storeCountOfApis(selectedLocationId, count);
    // }
  } catch (error) {
    console.error("Error fetching treatment cases:", error);
  }
}

async function storeAllTreatmentCases(data) {
  try {
    // This function could store the treatment cases data array in any way you need
    // console.log("Storing treatment cases:", data);
    const response = await fetch(
      backUrl + "/tx-cases/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store treatment cases. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Treatment Cases stored successfully.");
  } catch (error) {
    console.error("Error storing treatment cases:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function fetchVisits(patients, concurrencyLimit = 100) {
  try {
    // Function to fetch visits for a patient
    const fetchPatientVisits = async (patient) => {
      const patientId = Number(patient.patient_ehr_id); // Convert patientId to number
      // logSyncFunctions("Patient Visit", "started", patientId);
      const url = `${dentrixUrl}/patient/${patientId}/treatment2/visit`;

      try {
        // Fetching data from the API
        const response = await fetch(url);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Failed to fetch visits for patient ID ${patientId}`);
        }
        // Parse the JSON response
        const data = await iterateResponse(response);
        // Prepare post data for storing treatment cases
        const visitsPostData = {
          visits: data,
          appointmentlocation: selectedLocationId,
          type: "VisitV1",
          timezone: currentLocationTimezone,
          operation: "UPDATE",
        };
        await storeAllVisits(visitsPostData);
        // Process the data as needed
        // logSyncFunctions("Patient Visit", "completed", patientId);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch visits concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientVisits));
        } else {
          break;
        }
      }
    };

    // Fetch visits with concurrency
    await withConcurrency();
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   storeCountOfApis(selectedLocationId, count);
    // }
  } catch (error) {
    console.error("Error fetching visits:", error);
  }
}

async function storeAllVisits(data) {
  try {
    // This function could store the visit data array in any way you need
    // console.log("Storing visits:", data);
    const response = await fetch(
      backUrl + "/visits/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to store visits. Status: ${response.status}`);
    }

    // If the response is successful, log the success message
    // console.log("Visits stored successfully.");
  } catch (error) {
    console.error("Error storing visits:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function fetchVisitProcedure(patients, concurrencyLimit = 100) {
  try {
    // Function to fetch visit procedure for a patient
    const fetchVisitProcedure = async (patient) => {
      const patientId = patient.patient_ehr_id;
      // logSyncFunctions("Visit Procedure", "started", patientId);
      const apiUrl = dentrixUrl + `/patient/${patientId}/progress/note`;

      try {
        // Fetching data from the API
        const response = await fetch(apiUrl);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch transaction for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const visitProcedureData = await iterateResponse(response);
        // Process the fetched data here
        const procedureData = visitProcedureData.filter(
          (ele) => (ele.type === "Procedure" && ele.visitId) || ele.txCaseId
        );
        procedureData.forEach((obj) => {
          obj.practiceProcedureId = obj.id;
        });
        const bulk = 100;
        if (procedureData.length) {
          for (let i = 0; i < procedureData.length; i += bulk) {
            const procedurePostData = {
              procedure: procedureData.slice(i, i + bulk),
              appointmentlocation: selectedLocationId,
              timezone: currentLocationTimezone,
            };
            await storeAllVisitProcedure(procedurePostData);
          }
        }
        // logSyncFunctions("Visit Procedure", "completed", patientId);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch visit procedure concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchVisitProcedure));
        } else {
          break;
        }
      }
    };

    // Fetch visit procedure with concurrency
    await withConcurrency();
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   storeCountOfApis(selectedLocationId, count);
    // }
  } catch (error) {
    console.error("Error fetching patient visit procedure:", error);
  }
}

async function storeAllVisitProcedure(data) {
  try {
    // This function could store the visit procedure data array in any way you need
    // console.log("Storing visit procedure:", data);
    const response = await fetch(
      backUrl + "/visits-procedures/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to visit procedure. Status: ${response.status}`);
    }

    // If the response is successful, log the success message
    // console.log("Visit transaction stored successfully.");
  } catch (error) {
    console.error("Error storing visit procedure:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function getAndStorePatientAddress(patients, concurrencyLimit = 10) {
  try {
    // Function to fetch patient PatientNotes for a patient
    const fetchPatientAddress = async (patient) => {
      let patientId = patient.patient_ehr_id;
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientAddress/Get?patientId=${patientId}`;
      try {
        // Fetching data from the API
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });
        //const response = !userLogoutFromAditApp && (await fetch(apiUrl));
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch PatientAddress for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const PatientAdressData = await iterateResponse(response);
        if (PatientAdressData.length) {
          // Process the fetched data here
          const PatientAdressPostData = {
            PatientAdress: PatientAdressData,
            appointmentlocation: selectedLocationId,
            type: "Patient_Address",
            operation: "UPDATE",
            patientId: patientId
          };
          await storeAllPatientAdress(PatientAdressPostData);
        }
        // logSyncFunctions("Patient Note", "completed", patientId);
      } catch (error) {
        console.error(`Error: getAndStorePatientAddress::`, error);
      }

    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientAdress concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientAddress));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching patient PatientNotes:", error);
  }
}

async function storeAllPatientAdress(PatientAdressPostData) {
  const url = `${backUrl}/patient/${selectedLocationId}/address`;
  try {
    const response = await fetch(url, await preparePostObject(PatientAdressPostData));
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient phones:: ");
    }
  } catch (error) {
    console.log("Unable to update patient phones:: ", error);
  }

  return true;
}

async function getAndStorePatientRelationship(patients, concurrencyLimit = 10) {
  try {
    // Function to fetch patient PatientNotes for a patient
    const fetchPatientRelationship = async (patient) => {
      let patientId = patient.patient_ehr_id;
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientRelationships/GetAllDependents?patientId=${patientId}`;
      try {
        // Fetching data from the API
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });
        //const response = !userLogoutFromAditApp && (await fetch(apiUrl));
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Patient Relationship for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        let  patientRelationshipData = await iterateResponse(response);        
        if (patientRelationshipData && patientRelationshipData.Dependents && patientRelationshipData.Dependents.lenght > 0) {
        let patientRelationships = patientRelationshipData.Dependents
        console.log("patientRelationships",patientRelationships);
        
        patientRelationshipData = patientRelationships.map(elem => ({
          DateOfBirth: elem.DateOfBirth ? convertDate(elem.DateOfBirth) : elem.DateOfBirth,
          Phone: elem.Phone ? getMaskedNumber(elem.Phone) : elem.Phone,
          ...elem,
        }));
          // Process the fetched data here
          const patientRelationshipPostData = {
            patientRelationship: patientRelationshipData,
            appointmentlocation: selectedLocationId,
            operation: "CREATE",
            patientId: patientId
          };
          console.log("patientRelationshipPostData",patientRelationshipPostData);
          
          await storeAllPatientRelationship(patientRelationshipPostData);
        }
        // logSyncFunctions("Patient Note", "completed", patientId);
      } catch (error) {
        console.error(`Error: getAndStorePatientAddress::`, error);
      }

    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientAdress concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientRelationship));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching patient PatientNotes:", error);
  }
}

async function storeAllPatientRelationship(patientRelationshipPostData) {
  const url = `${backUrl}/patient/${selectedLocationId}/relationship`;
  try {
    const response = await fetch(url, await preparePostObject(patientRelationshipPostData));
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient relationship:: ");
    }
  } catch (error) {
    console.log("Unable to update patient relationship:: ", error);
  }

  return true;
}


async function fetchPaymentInvoice(patients, concurrencyLimit = 10) {
  try {
    // Function to fetch patient PatientNotes for a patient
    const fetchfetchPaymentInvoice = async (patient) => {
      let patientId = patient.patient_ehr_id;
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/MaterialOrder/GetInvoicedPatientOrders?draw=4&start=0&length=10&orderBy=OrderNum&orderDir=desc&patientId=${patientId}`;
      try {
        // Fetching data from the API
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });
        //const response = !userLogoutFromAditApp && (await fetch(apiUrl));
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch PatientAddress for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const PaymentInvoiceData = await iterateResponse(response);
        console.log("\nPaymentInvoiceData\n",PaymentInvoiceData);
        
        if (PaymentInvoiceData && PaymentInvoiceData.data.length) {
          paymentInvoiceDataDetail(PaymentInvoiceData.data)
          // Process the fetched data here
          const PaymentInvoicePostData = {
            PaymentInvoice: PaymentInvoiceData.data,
            appointmentlocation: selectedLocationId,
            type: "PaymentInvoice",
            operation: "CREATE",
            timezone: currentLocationTimezone
          };
          await storeAllPaymentInvoice(PaymentInvoicePostData);
        }
        // logSyncFunctions("Patient Note", "completed", patientId);
      } catch (error) {
        console.error(`Error: getAndStorePatientAddress::`, error);
      }

    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientAdress concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchfetchPaymentInvoice));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching patient PatientNotes:", error);
  }
}

async function storeAllPaymentInvoice(paymentInvoicePostData) {
  const url = `${backUrl}/patient-payment-invoice/bulkinsert`;
  try {
    const response = await fetch(url, await preparePostObject(paymentInvoicePostData));
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient phones:: ");
    }
  } catch (error) {
    console.log("Unable to update patient phones:: ", error);
  }

  return true;
}
async function paymentInvoiceDataDetail(paymentInvoiceDataDetails) {
  const paymentInvoiceDataDetailsDto = [];

  for (const paymentInvoiceDataDetail of paymentInvoiceDataDetails) {
    const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/OrderManagement/GetInvoicedOrderDetail?orderNum=${paymentInvoiceDataDetail.OrderNum}`;
    try {
      // Fetching data from the API
      if (!userLogoutFromAditApp) {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch paymentInvoiceDataDetails for patient ID ${patientId}`
          );
        }

        // Parse the JSON response
        const PaymentInvoiceData = await iterateResponse(response);
        paymentInvoiceDataDetailsDto.push(PaymentInvoiceData);
      }
    } catch (error) {
      console.error(`Error fetching payment invoice data: ${error.message}`);
    }
  }

  console.log("paymentInvoiceDataDetailsDto", paymentInvoiceDataDetailsDto);
  
  const PaymentInvoicePostData = {
    paymentInvoiceDataDetail: paymentInvoiceDataDetailsDto,
    appointmentlocation: selectedLocationId,
    operation: "CREATE",
    timezone: currentLocationTimezone
  };

  await storepaymentInvoiceDataDetail(PaymentInvoicePostData);
}

async function storepaymentInvoiceDataDetail(paymentInvoicePostData) {
  const url = `${backUrl}/patient-payment-invoice/details/bulkinsert`;
  try {
    const response = await fetch(url, await preparePostObject(paymentInvoicePostData));
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient phones:: ");
    }
  } catch (error) {
    console.log("Unable to update patient phones:: ", error);
  }

  return true;
}

async function getAndStorePatientProcedures(patients) {
  const fetchAndStorePromises = patients.map(async (patient) => {
    const patientId = patient?.patient_ehr_id || "";
    // logSyncFunctions("Patient Procedure", "started", patientId);
    if (patientId) {
      const url = `${dentrixUrl}/patient/clinical/procedure/${patientId}`;
      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const procedure = await iterateResponse(response);
        // console.log("patient procedure.length: ", procedure.length);
        if (procedure && procedure.length) {
          const updatedProcedures = procedure.map((item) => {
            item.writeOff = item.xfer.writeOff;
            item.timezone = currentLocationTimezone;
            return item;
          });
          await storePatientProcedures(patientId, procedure);
          // start syncing of patient conditions
          const conditions = [];
          const proceduresTeeth = [];
          procedure.forEach((p) => {
            if (p.patientConditions && p.patientConditions.length) {
              p.patientConditions.forEach((c) => {
                conditions.push({
                  patientProcedureId: p.id,
                  patientConditionId: c.id,
                });
              });
            }
            // Prepare data from patient procedure for procedures teeth
            if (p.teeth) {
              proceduresTeeth.push({
                patientProcedureId: p.id,
                procedureId: p.practiceProcedure.id,
                teeth: p.teeth,
                surfaces: p.surfaces,
                classFive: p.classFive,
              });
            }
          });
          if (conditions.length) {
            await storePatientProcedurePatientConditions(conditions, patientId);
          }
          if (proceduresTeeth.length) {
            await storePatientProcedureProcedureTeeth(
              proceduresTeeth,
              patientId
            );
          }
        }
        // logSyncFunctions("Patient Procedure", "completed", patientId);
      } catch (error) {
        console.log("error: storePatientProcedures::", error);
      }
    }
  });

  await Promise.all(fetchAndStorePromises);
  return true;
}

async function storePatientProcedures(patientId, procedures) {
  // console.log("=>Patient procedure synced started.....", new Date());
  const url = `${backUrl}/patient/${patientId}/procedures/${selectedLocationId}`;
  try {
    const response = await fetch(
      url,
      await preparePostObject({ patientProcedures: procedures })
    );
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient procedures:: ");
    }
  } catch (error) {
    console.log("Unable to update patient procedures:: ", error);
  }

  return true;
}

// store patient procedure patient conditions
async function storePatientProcedurePatientConditions(conditions, patientid) {
  // console.log(
  //   "=>Patient procedure patient conditions synced started.....",
  //   new Date()
  // );
  const url = `${backUrl}/patient/${patientid}/procedures/conditions/${selectedLocationId}`;
  const response = await fetch(url, await preparePostObject({ conditions }));
  try {
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient procedure patient conditions:: ");
    }
  } catch (error) {
    console.log(
      "Unable to update patient procedure patient conditions:: ",
      error
    );
  }

  return true;
}

// store patient procedure procedure teeth
async function storePatientProcedureProcedureTeeth(proceduresTeeth, patientId) {
  // console.log(
  //   "=>Patient procedure procedure teeth synced started.....",
  //   new Date()
  // );
  const url = `${backUrl}/patient/${patientId}/procedures/teeth/${selectedLocationId}`;
  const response = await fetch(
    url,
    await preparePostObject({ teeths: proceduresTeeth })
  );
  try {
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to update patient procedure procedure teeth:: ");
    }
  } catch (error) {
    console.log("Unable to update patient procedure procedure teeth:: ", error);
  }

  return true;
}

async function getAndStorePatientRecallPracticeProcedures(patients) {
  let recarePracticeProcedure = [];

  for (let pi = 0; pi < patients.length; pi++) {
    try {
      const patient = patients[pi] || {};
      const patientId = patient.patient_ehr_id || "";

      if (patientId) {
        const recares = await getPatientRecalls(patientId, true);
        if (Object.keys(recares).length) {
          if (recares) {
            const { PatientRecallDetails = [], PatientRecallHistories = [] } = recares;
            if (PatientRecallDetails.length > 0) {
              const updatedRecallDetails = PatientRecallDetails.map(detail => ({
                ...detail,
                PatientId: patientId // Replace `PatientId` with `patientId` value
              }));
              recarePracticeProcedure.PatientRecallDetails = recarePracticeProcedure.concat(updatedRecallDetails);
            }
            if (PatientRecallHistories.length > 0) {
              let updateRecallHistories = PatientRecallHistories.map(detail => ({
                ...detail,
                PatientId: patientId // Replace `PatientId` with `patientId` value
              }))
              recarePracticeProcedure.PatientRecallHistories = recarePracticeProcedure.concat(updateRecallHistories);
            }
          }
        }
      }
    } catch (error) {
      console.log(`Error: getAndStorePatientRecarePracticeProcedures::`, error);
    }
  }

  if (recarePracticeProcedure.PatientRecallDetails.length || recarePracticeProcedure.PatientRecallHistories.length) {
    await storePatientRecallProcedures({
      PatientRecallDetails: recarePracticeProcedure.PatientRecallDetails,
      PatientRecallHistories: recarePracticeProcedure.PatientRecallHistories
    });
  }
  return true;
}


async function getPatientRecarePracticeProcedures(recares) {
  let practiceProcedure = [];
  for (let pi = 0; pi < recares.length; pi++) {
    const recare = recares[pi] || {};
    const typeId = recare.typeId || "";
    // console.log(`recare:: ${pi}, typeId:: ${typeId}`);
    if (typeId) {
      try {
        const url = `${dentrixUrl}/recare/list/${typeId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const procedure = await iterateResponse(response);
        if (
          procedure &&
          Object.keys(procedure).length &&
          procedure.procedures &&
          procedure.procedures.length
        ) {
          procedure.procedures.forEach((element) => {
            practiceProcedure.push({
              patientRecareId: recare.id,
              practiceProcedureId: element.id,
            });
          });
        }
      } catch (error) {
        console.log(`Error: getPatientRecarePracticeProcedures::`, error);
      }
    }
  }
  return practiceProcedure;
}

async function storePatientRecallProcedures(procedures) {
  const url = `${backUrl}/patient/recare/practice-procedures/${selectedLocationId}`;
  console.log(procedures, "procedures:::");

  try {
    const requestObject = await preparePostObject({ recareProcedures: procedures, operation: 'CREATE' });

    const response = await fetch(url, requestObject);

    // Check if the response is OK before processing
    if (!response.ok) {
      console.log(`Failed to store patient recall procedures. Status: ${response.status}`);
      return false;
    }

    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log("Unable to create patient recare practice procedures");
    }

  } catch (error) {
    console.log("Error: storePatientRecallProcedures:: ", error);
  }

  return true;
}


async function getAndStorePatientProceduresInsuranceClaim(patients) {
  let insuranceProcedure = [];
  for (let pi = 0; pi < patients.length; pi++) {
    const patient = patients[pi] || {};
    const patientId = patient.patient_ehr_id || "";
    // logSyncFunctions("PatientProcedure Insurance Claims", "started", patientId);
    if (patientId) {
      try {
        const url = `${dentrixUrl}/insuranceClaim/patientClaimsREST/${patientId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const claims = await iterateResponse(response);
        // console.log(
        //   "patient procedure insurance claim.length: ",
        //   claims.length
        // );
        if (claims && claims.length) {
          claims.forEach((claim) => {
            if (claim.procedures && claim.procedures.length) {
              claim.procedures.forEach((pro) => {
                insuranceProcedure.push({
                  insuranceClaimId: claim.id,
                  patientProcedureId: pro.id,
                });
              });
            }
          });
        }
      } catch (error) {
        console.log("error:patient procedure insurance claim.length:  ", error);
      }
    }
  }
  if (insuranceProcedure.length) {
    await storePatientProceduresInsuranceClaim(insuranceProcedure);
  }
  // logSyncFunctions("PatientProcedure Insurance Claims", "completed");
  return true;
}

async function storePatientProceduresInsuranceClaim(procedures) {
  // console.log(
  //   "=>Patient recare practice procedure synced started.....",
  //   new Date()
  // );
  const url = `${backUrl}/patient/procedures/insurance-claim/${selectedLocationId}`;
  try {
    const response = await fetch(
      url,
      await preparePostObject({ insuranceProcedures: procedures })
    );
    const data = await iterateResponse(response);
    if (!data || !data.status) {
      console.log(
        "Unable to create patient recare practice procedures procedures:: "
      );
    }
  } catch (error) {
    console.log(
      "error:Unable to create patient recare practice procedures procedures:: ",
      error
    );
  }

  return true;
}

async function fetchPatientNotes(patients, concurrencyLimit = 10) {
  try {
    // Function to fetch patient PatientNotes for a patient
    const fetchPatientNotes = async (patient) => {
      // logSyncFunctions("Patient Note", "started", patientId);
      let patientId = patient.patient_ehr_id;
      //if(patient.patient_ehr_id !=='11292315') return
      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientNotes/GetPatientNotesBySearchCriteria?PatientId=${patientId}&Resource=&DateFrom=&IsUrgent=false&IsFollowUp=false&DateTo=`;

      try {
        // Fetching data from the API
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });
        //const response = !userLogoutFromAditApp && (await fetch(apiUrl));
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch PatientNotes for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        let patientNotesData = await iterateResponse(response);
        let patientNotes = patientNotesData.Results
        patientNotesData = patientNotes.map(note => ({
          ...note,
          noteDate: convertDate(note.Date),
        }))
        // Process the fetched data here
        // PatientNotesData.Results.patientId = patientId;
        const PatientNotesPostData = {
          patientNotes: patientNotesData,
          appointmentlocation: selectedLocationId,
          operation: "UPDATE",
          patientId: parseInt(patientId)
        };
        await storeAllPatientNotes(PatientNotesPostData);
        // logSyncFunctions("Patient Note", "completed", patientId);
      } catch (error) {
        console.error(error);
      }

    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientNotes concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientNotes));
        } else {
          break;
        }
      }
    };

    // Fetch PatientNotes with concurrency
    await withConcurrency();
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   storeCountOfApis(selectedLocationId, count);
    // }
  } catch (error) {
    console.error("Error fetching patient PatientNotes:", error);
  }
}

async function storeAllPatientNotes(results) {
  try {
    // This function could store the results array in any way you need
    // console.log("Storing results:", results);
    const response = await fetch(
      backUrl + "/patient-notes/bulkinsert",
      await preparePostObject(results)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store patient notes. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Patient notes stored successfully.");
  } catch (error) {
    console.error("Error storing patient notes:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function fetchPatientClaims(patients, concurrencyLimit = 20) {
  try {
    // Function to fetch insurance claims REST data for a patient
    const fetchClaims = async (patient) => {
      const patientId = patient.patient_ehr_id;
      // logSyncFunctions("Insurance Claim Procedure", "started", patientId);
      const apiUrl = `${dentrixUrl}/insuranceClaim/patientClaimsREST/${patientId}`;

      try {
        // Fetching data from the API
        const response = await fetch(apiUrl);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch insurance claims for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const claimsData = await iterateResponse(response);
        // console.log(claimsData);
        // Process the fetched claims data here
        const extractedData = extractClaimAndProcedureIds(claimsData);
        // console.log(extractedData);
        const insuranceClaimsProceduresData = {
          insuranceClaimsProcedures: extractedData,
          appointmentlocation: selectedLocationId,
          type: "InsuranceClaimProceduresV1",
          timezone: currentLocationTimezone,
          operation: "ARRAY_INSERTED",
        };
        // Store the extracted data
        await storeAllPatientClaims(insuranceClaimsProceduresData);
        // logSyncFunctions("Insurance Claim Procedure", "completed", patientId);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch claims data concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchClaims));
        } else {
          break;
        }
      }
    };

    // Fetch claims data with concurrency
    await withConcurrency();

    // Once all claims data are fetched, proceed with further actions
    // For example:
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   chrome.storage.local.set({ countOfApis: count });
    //   //   !userLogoutFromAditApp && fetchPracticeProcedures();
    // }
  } catch (error) {
    console.error("Error fetching patient claims:", error);
  }
}

// Function to extract claim ID and procedure IDs
function extractClaimAndProcedureIds(claimsData) {
  const result = [];
  for (const claim of claimsData) {
    const { id, procedures, amountPaid, patientAmountPaid } = claim;
    for (const procedure of procedures) {
      result.push({
        id,
        procedureId: procedure.id,
        url: "",
        writeoff: "",
        primaryinsuranceportion: amountPaid,
        secondaryinsuranceportion: null,
        patientportion: patientAmountPaid,
      });
    }
  }
  return result;
}

// Function to store all patient claims data
async function storeAllPatientClaims(claimsData) {
  try {
    // console.log("Storing patient claims data:", claimsData);
    const response = await fetch(
      backUrl + "/insurance-claim-procedures/bulkInsert",
      await preparePostObject(claimsData)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store Insurance claims Procedures Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Insurance Claims Procedures stored successfully.");
  } catch (error) {
    console.error("Error storing Insurance claims Procedures:", error);
    throw error;
  }
}

async function fetchPatientSubscriberInsurancePlans(
  patients,
  update = false,
  concurrencyLimit = 20
) {
  try {
    // Function to fetch patient ledger for a patient
    const fetchLedger = async (patient) => {
      const patientId = patient.patient_ehr_id;
      const patientInsurancePlanResponsibilityData = await prepareDataToSendForPatientInsuranceplanResponsibility(patientId); // found table creation sp given
      if (patientInsurancePlanResponsibilityData) {
        await storeAllPatientInsurancePlanResponsibility(patientInsurancePlanResponsibilityData);
      }

      const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientInsurance/GetPatientInsurances?patientId=${patientId}&activeOnly=true`;

      try {
        const response = !userLogoutFromAditApp && await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Requestverificationtoken": requestVerificationToken,
            "Cookie": cookieForAPI,
          }
        });
        // Fetching data from the API
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Failed to fetch ledger for patient ID ${patientId}`);
        }
        // Parse the JSON response
        const data = await iterateResponse(response);
        if (data.length) {
          const subscriberInsurancePlansData = await prepareSubInsDataToSend(data, patientId);
          await storeAllSubscriberInsurancePlans(subscriberInsurancePlansData);
          const patientInsurancePlansData = await prepareDataToSendForPatientInsuranceplan(data, patientId);
          await storeAllPatientInsurancePlans(patientInsurancePlansData);
        }
        // logSyncFunctions(
        //   "Patient Subscriber Insurance Plan",
        //   "completed",
        //   patientId
        // );
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch ledger concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchLedger));
        } else {
          break;
        }
      }
    };

    // Fetch ledger with concurrency
    await withConcurrency();

    // Once all ledger are fetched, proceed with further actions
    // For example:
    // if (!userLogoutFromAditApp && !update) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   // fetchAgingBalance(patients)
    //   storeCountOfApis(selectedLocationId, count);
    //   //   !userLogoutFromAditApp && startSyncPatientPhones();
    // }
  } catch (error) {
    console.error("Error fetching patient ledger:", error);
  }
}

async function prepareSubInsDataToSend(data, patientId) {
  try {
    const subscriberInsurancePlans = await Promise.all(data.map(async (insurance) => {
      try {
        // Fetch insurance details
        const insuranceDetail = await fetchSubscriberDetails(patientId, insurance.Id);

        // Ensure insuranceDetail is valid
        if (!insuranceDetail || !insuranceDetail.Subscriber) {
          console.error(`Invalid insuranceDetail for patient ID ${patientId}, insurance ID ${insurance.Id}`);
          return null;
        }

        // Check RelationsToSubscriber array
        let RelationsToSubscriber = insuranceDetail.RelationsToSubscriber.filter(e => e.Key === insuranceDetail.RelationToSubscriberId) || [];


        return {
          lastName: insuranceDetail.Subscriber.LastName || '',
          firstName: insuranceDetail.Subscriber.FirstName,
          middleName: insuranceDetail.Subscriber.MiddleName || '',
          fullName: insuranceDetail.Subscriber.DisplayName || '',
          sex: insuranceDetail.Subscriber.Sex || '',
          ssn: insuranceDetail.Subscriber.Ssn || null,
          subscriberId: insuranceDetail.Subscriber.SubscriberId || null,
          patientInsuranceId: Number(insuranceDetail.Subscriber.PatientInsuranceId),
          addressId: insuranceDetail.Subscriber.Address?.AddressId || null,
          addressTypeId: insuranceDetail.Subscriber.Address?.AddressTypeId || null,
          address1: insuranceDetail.Subscriber.Address?.Address1 || '',
          address2: insuranceDetail.Subscriber.Address?.Address2 || '',
          city: insuranceDetail.Subscriber.Address?.City || '',
          state: insuranceDetail.Subscriber.Address?.State || '',
          zipCode: insuranceDetail.Subscriber.Address?.ZipCode || '',
          isPrimaryAddress: insuranceDetail.Subscriber.Address?.IsPrimary || false,
          addressType: insuranceDetail.Subscriber.Address?.AddressType || null,
          country: insuranceDetail.Subscriber.Address?.Country || null,
          countryId: insuranceDetail.Subscriber.Address?.CountryId || 0,
          phoneId: insuranceDetail.Subscriber.Phone?.PhoneId || null,
          phoneNumber: getMaskedNumber(insuranceDetail.Subscriber.Phone?.PhoneNumber) || '',
          extension: insuranceDetail.Subscriber.Phone?.Extension || '',
          phoneType: insuranceDetail.Subscriber.Phone?.PhoneType === 304 ? 'Home' :
            insuranceDetail.Subscriber.Phone?.PhoneType === 305 ? 'Work' : 'Mobile',
          isPrimaryPhone: insuranceDetail.Subscriber.Phone?.IsPrimary || false,
          birthDate: insuranceDetail.Subscriber.BirthDate || null,
          employer: insuranceDetail.Subscriber.Employer || '',
          groupName: insuranceDetail.Subscriber.GroupName || '',
          groupNum: insuranceDetail.Subscriber.GroupNum || '',
          relationToSubscriberId: insuranceDetail.RelationToSubscriberId || 0,
          memberId: insuranceDetail.Subscriber.MemberId || null,
          consumerId: insuranceDetail.Subscriber.ConsumerId || null,
          patientId: patientId,
          relationshiptosubscriber: RelationsToSubscriber.length ? RelationsToSubscriber[0]?.Description : "",
        };

      } catch (error) {
        console.error(`Error processing insurance ID ${insurance.Id} for patient ID ${patientId}:`, error);
        return null; // Skip this entry if an error occurs
      }
    }));

    // Filter out any null values in case of errors
    const filteredSubscriberInsurancePlans = subscriberInsurancePlans.filter(plan => plan !== null);

    // Return the final object with subscriberInsurancePlans as an array
    return {
      subscriberInsurancePlans: filteredSubscriberInsurancePlans,
      appointmentlocation: selectedLocationId,
      operation: "UPDATE",
    };

  } catch (error) {
    console.error("Error in prepareSubInsDataToSend function:", error);
    throw error;
  }
}

async function prepareDataToSendForPatientInsuranceplan(data, patientId) {
  try {
    const patientInsurancePlanDatas = await Promise.all(data.map(async (insurance) => {
      try {
        let date = new Date(insurance.InputDate);
        var startDate = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

        // Fetch insurance plan and subscriber details
        const insurancePlanDetails = await fetchInsurancePlanDetails(insurance.PlanId);
        const subscriber = await fetchSubscriberDetails(patientId, insurance.Id);

        if (!insurancePlanDetails || !subscriber) {
          console.error(`Failed to fetch details for PlanId: ${insurance.PlanId} or Subscriber Id: ${insurance.Id}`);
          return null; // Skip this insurance if fetch fails
        }

        // Filter for relationship to subscriber
        let RelationsToSubscriber = subscriber.RelationsToSubscriber.filter(e => e.Key === subscriber.RelationToSubscriberId);

        return {
          patientId: patientId,
          insuranceId: insurance.Id,
          startDate: startDate,
          identity: '', // data not retrieved
          policyGroup: subscriber.PolicyGroup,
          coPayment: '', // data not retrieved
          authorization: subscriber.AllowSharedAuthorization,
          autoExpiration: insurancePlanDetails.EligibilityExpirationDays,
          insType: insurance.PlanCoverageType === 'Both' ? 'Vision and Medical' : insurance.PlanCoverageType,
          locationId: practiceLocationId,
          relationshiptosubscriber: RelationsToSubscriber.length ? RelationsToSubscriber[0]?.Description : "",
          carrierInsurancePlanId: subscriber.PlanId || null,
          contact: getMaskedNumber(insurancePlanDetails.PhoneNumber),
          subscriberId: subscriber.Subscriber.SubscriberId,
          companyName: insurancePlanDetails.CarrierName,
        };

      } catch (error) {
        console.error(`Error processing insurance plan ${insurance.PlanId}:`, error);
        return null; // Return null to skip this entry if there is an error
      }
    }));

    // Filter out any null entries (due to errors)
    const patientInsurancePlanData = patientInsurancePlanDatas.filter(insurance => insurance !== null);

    return {
      patientInsurancePlans: patientInsurancePlanData,
      appointmentlocation: selectedLocationId,
      operation: "UPDATE",
    };
  } catch (error) {
    console.error("Error preparing data to send for patient insurance plans:", error);
    throw error; // Rethrow if needed
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
async function prepareDataToSendForPatientInsuranceplanResponsibility(patientId) {
  const apiUrl = `${dentrixUrl}${getEndpoints.MAINURL}${practiceLocationId}/PatientInsurance/ResponsiblePartyInsuranceUpdates?patientId=${patientId}`;
  try {
    // Fetching data from the API
    const response = !userLogoutFromAditApp && await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Requestverificationtoken": requestVerificationToken,
        "Cookie": cookieForAPI,
      }
    });
    //const response = !userLogoutFromAditApp && (await fetch(apiUrl));
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch prepareDataToSendForPatientInsuranceplanResponsibility for patient ID ${patientId}`
      );
    }
    const patientInsurancePlanResponsibility = await iterateResponse(response);

    if (patientInsurancePlanResponsibility.Updates && patientInsurancePlanResponsibility.Updates.length) {
      return {
        patientInsurancePlanResponsibilities: patientInsurancePlanResponsibility,
        appointmentlocation: selectedLocationId,
        operation: "CREATE",
        patientId: patientId,
      };
    }
  } catch (error) {
    console.log(error, "error:::");

  }

}

async function storeAllSubscriberInsurancePlans(data) {
  try {
    // Assuming you have a fetch call here to store the data
    const response = await fetch(
      backUrl + "/subscriber-insurance-plans/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store Subscriber Insurance Plans. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Subscriber Insurance Plans stored successfully.");
  } catch (error) {
    console.error("Error storing Subscriber Insurance Plans:", error);
  }
}

async function storeAllPatientInsurancePlans(data) {
  try {
    // Assuming you have a fetch call here to store the data
    const response = await fetch(
      backUrl + "/patient-insurance-plans/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store Patient Insurance Plans. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Patient Insurance Plans stored successfully.");
  } catch (error) {
    console.error("Error storing Patient Insurance Plans:", error);
  }
}

async function storeAllPatientInsurancePlanResponsibility(data) {
  try {
    // Assuming you have a fetch call here to store the data
    const response = await fetch(
      backUrl + "/patient-insurance-plan-responsibility/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store Patient Insurance Plans. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Patient Insurance Plans stored successfully.");
  } catch (error) {
    console.error("Error storing Patient Insurance Plans:", error);
  }
}

async function fetchAndStorePatientOrderDetails(patients, concurrencyLimit = 10){
  try {
        const fetchPatientOrder = async (patient) => {
        let patientId = patient.patient_ehr_id;
          try {
            const endPoint = `${getEndpoints.MAINURL}${practiceLocationId}${getEndpoints.ORDER_INVOICED_DETAIL_BY_PATIENT_ID}${patientId}`;
            let orders = await getEhrDataCommonFunction(endPoint, null);
            const endPoint2 = `${getEndpoints.MAINURL}${practiceLocationId}${getEndpoints.ORDER_NONINVOICED_DETAIL_BY_PATIENT_ID}${patientId}`;
            let orders2 = await getEhrDataCommonFunction(endPoint2, null);
            let filteredOrder = [...orders.data, ...orders2.data];
            filteredOrder = filteredOrder.filter(elem => elem.OrderType !== 'Exam')
            if (filteredOrder.length > 0) {
              console.log("filteredOrder",filteredOrder);
              
              // await storeOrders(filteredOrder, patientId);
            }

        } catch (error) {
        console.error(`Error: getAndStorePatientAddress::`, error);
      }

    };
        const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch PatientAdress concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchPatientOrder));
        } else {
          break;
        }
      }
    };

    await withConcurrency();
  } catch (error) {
    console.error("Error fetching patient PA Order:", error);
    
  }
}
async function getAndStorePatientMedication(apptLocId, patients) {
  for (let pi = 0; pi < patients.length; pi++) {
    const patient = patients[pi] || {};
    const patientId = patient.patient_ehr_id || "";
    // console.log(`pi:: ${pi}, patientId:: ${patientId}`);
    // logSyncFunctions("Patient Medication", "started", patientId);
    if (patientId) {
      const patientMedicatiion = await getPatientMedicationList(patientId);
      counts[patientId]
        ? (counts[patientId] = counts[patientId] + patientMedicatiion.length)
        : (counts[patientId] = patientMedicatiion.length);
      totalMeds += patientMedicatiion.length;
      if (patientMedicatiion.length) {
        const medUrl = `${backUrl}/patient-medication/${apptLocId}/${patientId}`;
        const stored = await storePatientMedication(medUrl, patientMedicatiion);
        if (!stored) {
          return false;
        }
      }
    }
    // logSyncFunctions("Patient Medication", "completed", patientId);
  }
  return true;
}

function getPatientMedicationList(patientId) {
  const url = `${dentrixUrl}/megaapp/patient/${patientId}/prescription`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => iterateResponse(response))
      .then((res) => {
        if (res) {
          return resolve(res);
        }
        return resolve([]);
      })
      .catch((error) => {
        console.log("Error: patient list call:::", error);
        return resolve([]);
      });
  });
}

function storePatientMedication(url, medications) {
  return new Promise(async (resolve, reject) => {
    fetch(url, await preparePostObject({ medications }))
      .then((response) => iterateResponse(response))
      .then((res) => {
        if (!res || !res.status) {
          console.log(`Error while storing patient medication::: ${res}`);
          return resolve(false);
        }
        return resolve(true);
      })
      .catch((error) => {
        console.log("Error: patient list call:::", error);
        return resolve(false);
      });
  });
}

async function getAndStorePatientSsnBulk(selectedLocationId, patients) {
  const ssns = [];
  for (let pi = 0; pi < patients.length; pi++) {
    const patient = patients[pi] || {};
    const patientId = patient.patient_ehr_id || "";
    // console.log(`pi:: ${pi}, patientId:: ${patientId}`);
    // logSyncFunctions("Patient SSN", "started", patientId);
    if (patientId) {
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(pi);
        }, 500)
      );
      const patientSsn = await getSsnPatient(patientId);
      if (patientSsn) {
        ssns.push({
          patient_ehr_id: patient.patient_ehr_id,
          ssn: patientSsn,
        });
      }
    }
  }
  if (ssns.length) {
    await storePatientSsnBulk(selectedLocationId, ssns);
  }
  // logSyncFunctions("Patient SSN", "completed");
  return true;
}

async function getSsnPatient(patient_ehr_id) {
  // patient/7000002009695/patientPrivacy
  try {
    const url = `${dentrixUrl}/patient/${patient_ehr_id}/patientPrivacy`;
    const abortController = new AbortController();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    }).catch((err) => {
      // console.log("SSN not found for patient::", patient_ehr_id);
      return "";
    });
    // console.log("response: ", response);
    if (!response.ok) {
      // console.log("Failed to get ssn data of patient");
      return "";
    }
    const data = await iterateResponse(response);
    if (!data || !Object.keys(data).length) {
      // console.log("No ssn data found for patient:: ", patient_ehr_id);
    }
    return data.ssn || "";
  } catch (error) {
    console.log("====error: ssn");
    return "";
  }
}

async function storePatientSsnBulk(selectedLocationId, ssns) {
  const url = `${backUrl}/patient/bulkssn/${selectedLocationId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: await getHeaderObjectForDentrixApiCall(),
    body: JSON.stringify(ssns),
  });
  const data = await iterateResponse(response);
  if (!data || !data.status) {
    // console.log("Unable to update patient ssn:: ");
  }
}

async function updateTransactions(patientId, transData, procedureData) {
  let finalTrasactions = []
  for (const transaction of transData) {
    let respProv = await fetchProviderId(patientId, transaction, procedureData);
    console.log("🚀 ~ updateTransactions ~ respProv:", respProv)
    transaction.providerId = (respProv && respProv.provider && respProv.provider.id) ? respProv.provider.id : null;
    transaction.procedureId = (respProv && respProv.patientProcedureId) ? respProv.patientProcedureId : null;
    finalTrasactions.push(transaction);
  }
  return finalTrasactions;
}

async function fetchProviderId(patientId, tdata, procedureData) {
  try {
    if (tdata.id && tdata.amount) {
      const transactionDistributionData = await fetchTransactionDistribution(patientId, tdata);
      if (transactionDistributionData.length > 0) {
        for (const transaction of transactionDistributionData) {
          const patientProcedureId = transaction.patientProcedureId;
          if (patientProcedureId) {
            for (const procedure of procedureData) {
              if (procedure.id == patientProcedureId) {
                return { provider: procedure.provider, patientProcedureId: patientProcedureId };
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchTransactionDistribution(patientId, tdata) {
  let amt = (tdata.amount < 0) ? tdata.amount * -1 : tdata.amount;
  let fixer = (tdata.amount < 0) ? 'insurancecreditId' : 'creditId';
  const url = `${dentrixUrl}/patient/ledger/payment/distribution/create?amount=${amt}&ledgerView=PATIENT_VIEW&${fixer}=${tdata.id}&patientId=${patientId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch distribution for patient ID ${patientId}`);
  }
  return await iterateResponse(response);
}

async function fetchProcedures(patientId) {
  const url = `${dentrixUrl}/patient/clinical/procedure/${patientId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch procedure for patient ID ${patientId}`);
  }
  return await iterateResponse(response);
}

async function fetchTransaction(patients, concurrencyLimit = 20) {
  try {
    // const dateFrom = new Date(new Date().setFullYear(new Date().getFullYear - 2)).getTime();  // last 2 years
    // const dateTo = new Date().getTime();  // current time
    const organizationLederTypes = await getOrganizationLedgerTypeId();
    // Function to fetch transaction for a patient
    const fetchTransaction = async (patient) => {
      const patientId = patient.patient_ehr_id;
      // logSyncFunctions("Transaction", "started", patientId);
      // const apiUrl = dentrixUrl + `/patient/${patientId}/ledger/list?autoScrollToRecentTransactions=true&range=ALL_HISTORY_DATE_RANGE&sorting=BY_DATE&view=GUARANTOR_VIEW&showHistory=false&showTime=false&showDeleted=true&showXfers=true&resetHistory=false&isSinceLastZeroBalanceEnabled=false&filteredDateRange=All%20history&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      const apiUrl =
        dentrixUrl +
        `/patient/${patientId}/ledger/list?autoScrollToRecentTransactions=true&range=ALL_HISTORY_DATE_RANGE&sorting=BY_DATE&view=GUARANTOR_VIEW&showHistory=true&showTime=false&showDeleted=true&showXfers=true&resetHistory=false&isSinceLastZeroBalanceEnabled=false&filteredDateRange=All%20history`;

      try {
        // Fetching data from the API
        const response = await fetch(apiUrl);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Failed to fetch transaction for patient ID ${patientId}`
          );
        }
        // Parse the JSON response
        const transactionData = await iterateResponse(response);
        // Process the fetched data here
        if (transactionData && transactionData[0] && !transactionData[0].id) {
          transactionData.shift();
        }
        const bulk = 3000;
        let procedureData = await fetchProcedures(patientId);
        console.log("🚀 ~ fetchTransaction - patientId~ procedureData:", procedureData)
        for (let i = 0; i < transactionData.length; i += bulk) {
          let transData = transactionData.slice(i, i + bulk);
          let correctionTransactions = await extractCorrectionsNew(transData);
          // console.log(
          //   `Transactions with Corrections for ${patientId}: `,
          //   correctionTransactions
          // );
          // const transactionDistributionData = await getTransactionDistributionData(correctionTransactions, patientId);
          let filteredTransactionData = await manipulateTransData(
            correctionTransactions,
            organizationLederTypes
          );
          //To add providerId in each Transactions
          let updatedTransactionData = await updateTransactions(patientId, filteredTransactionData, procedureData)
          //To add providerId in each Transactions
          const transactionPostData = {
            transaction: updatedTransactionData,
            appointmentlocation: selectedLocationId,
            type: "Transaction",
            timezone: currentLocationTimezone,
            operation: "UPDATE",
            patientId: patientId,
          };

          await storeAllTransaction(transactionPostData);
          const insurancePayments = filteredTransactionData.filter(
            (item) => item.type === "InsurancePayment"
          );

          // console.log(insurancePayments);
          const promises = insurancePayments.map(fetchInsurancePaymentDetails);

          // Wait for all promises to resolve
          const insuranceClaimPaymentData = await Promise.all(promises);

          // Prepare post data for storing claims
          const insuranceClaimsPaymentData = {
            insuranceClaimsInsurancePayments: insuranceClaimPaymentData,
            appointmentlocation: selectedLocationId,
            type: "InsuranceClaimInsurancePaymentsV1",
            timezone: currentLocationTimezone,
            operation: "ARRAY_INSERTED",
          };
          await storeAllInsuranceClaimsPayments(insuranceClaimsPaymentData);
        }
      } catch (error) {
        console.error(error);
      }
      // logSyncFunctions("Transaction", "completed", patientId);
    };

    // Function to handle concurrency
    const withConcurrency = async () => {
      // Loop through patients with limited concurrency
      for (let i = 0; i < patients.length; i += concurrencyLimit) {
        const batch = patients.slice(i, i + concurrencyLimit);
        // Fetch transaction concurrently within the batch
        if (!userLogoutFromAditApp) {
          await Promise.all(batch.map(fetchTransaction));
        } else {
          break;
        }
      }
    };

    // Fetch transaction with concurrency
    await withConcurrency();
    // if (!userLogoutFromAditApp) {
    //   //count++;
    //   setBadge();
    //   chrome.storage.local.set({ countOfApis: count });
    //   chrome.runtime.sendMessage({
    //     type: "updateCount",
    //     count: count,
    //   });
    //   storeCountOfApis(selectedLocationId, count);
    //   // if (!patientsListIds.length) {
    //   //   await getAllPatients(true);
    //   // }
    //   //   !userLogoutFromAditApp && fetchVisitProcedure(patientsListIds);
    // }
  } catch (error) {
    console.error("Error fetching patient transaction:", error);
  }
}

async function extractCorrectionsNew(transactions) {
  let result = [];

  transactions.forEach((transaction) => {
    result.push(transaction); // Add the original transaction
    // Add each correction as a separate transaction
    if (transaction.corrections && transaction.corrections.length > 0) {
      transaction.corrections.forEach((correction) => {
        correction.deleted = true;
        result.push(correction);
      });
    }
    // console.log(result)
  });

  return result;
}

async function manipulateTransData(transData, organizationLedgerTypes) {
  // Iterate over transData using for...of loop for async/await
  for (const tdata of transData) {
    // console.log('tdata.type-->',tdata.type)
    // console.log('tdata.description-->',tdata.description)
    // Check if tdata.type matches any of the specified types
    if (
      ["ChargeAdjustment", "Payment", "CreditAdjustment"].includes(tdata.type)
    ) {
      // console.log('entered to fetch ledger type id')
      // Remove the amount from the description using a regular expression
      tdata.description = tdata.description
        .replace(/\$\d+(\.\d+)?\*?$/, "")
        .trim();
      // Find the organization ledger type that matches tdata.type
      const foundOrganizationType = organizationLedgerTypes.find(
        (item) => item.description === tdata.description
      );

      // Assign the organizationLedgerTypeId if found
      if (foundOrganizationType) {
        tdata.organizationLedgerTypeId =
          foundOrganizationType.organizationledgertypeid;
      }
    }

    // Update type based on conditions
    if (
      tdata.type === "ChargeAdjustment" &&
      tdata.description === "Insurance Over-pmt Refund"
    ) {
      tdata.type = "InsuranceRefundAdjustment";
    } else if (
      tdata.type === "ChargeAdjustment" &&
      tdata.description === "Credit Card Full Refund"
    ) {
      tdata.type = "PatientCreditCardRefund";
    } else if (
      tdata.type === "ChargeAdjustment" &&
      tdata.description === "Credit Card Void"
    ) {
      tdata.type = "PatientCreditCardVoid";
    } else if (
      tdata.type === "ChargeAdjustment" &&
      tdata.description !== "Insurance Over-pmt Refund" &&
      tdata.description !== "Credit Card Full Refund" &&
      tdata.description !== "Credit Card Void"
    ) {
      tdata.type = "PatientChargeAdjustment";
    } else if (tdata.type === "InsurancePayment") {
      tdata.type = "InsurancePayment";
    } else if (tdata.type === "CreditAdjustment") {
      tdata.type = "PatientCreditAdjustment";
    } else if (tdata.type === "Payment") {
      tdata.type = "PatientProcedurePayment";
    } else if (tdata.type === "Procedure") {
      tdata.type = "PatientProcedureLedger";
    }

    // Assuming currentLocationTimezone is defined elsewhere in your code
    tdata.timezone = currentLocationTimezone;
  }

  return transData;
}

async function getOrganizationLedgerTypeId() {
  const url = `${dentrixUrl}/bootstrap/organizationLedgerType`;

  try {
    // Fetching data from the API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Organization Ledger Type. Status: ${response.status}`
      );
    }
    const data = await response.json();
    // console.log(data)
    let organisationTypes = [];
    let mandatoryTags = [];
    let optionalTags = [];
    data.ChargeAdjustmentTypes.forEach((elem) => {
      const organisationTypeData = {
        organizationledgertypeid: elem.id,
        description: elem.description,
        ledgertype: elem.type,
        constantdescription: elem.constantDescription,
        active: elem.active,
        allocation: elem.allocation,
        istagrestrictionenabled: elem.isTagRestrictionEnabled,
        istagcreationenabled: elem.isTagCreationEnabled,
      };

      organisationTypes.push(organisationTypeData);
      // console.log("organisationTypeData>> ChargeAdjustmentTypes", organisationTypeData);

      if (elem.mandatoryTags.length > 0) {
        elem.mandatoryTags.forEach((mandatoryTag) => {
          const OrganizationLedgerTypes_mandatoryTags = {
            organizationledgertypeid: elem.id,
            mandatorytagid: mandatoryTag.id,
          };
          mandatoryTags.push(OrganizationLedgerTypes_mandatoryTags);
        });
      }
      if (elem.optionalTags.length > 0) {
        elem.optionalTags.forEach((optionalTag) => {
          const OrganizationLedgerTypes_optionalTags = {
            organizationledgertypeid: elem.id,
            optionaltagid: optionalTag.id,
          };
          optionalTags.push(OrganizationLedgerTypes_optionalTags);
        });
      }
    });
    data.CreditAdjustmentTypes.forEach((elem) => {
      const organisationTypeData = {
        organizationledgertypeid: elem.id,
        description: elem.description,
        ledgertype: elem.type,
        constantdescription: elem.constantDescription,
        active: elem.active,
        allocation: elem.allocation,
        istagrestrictionenabled: elem.isTagRestrictionEnabled,
        istagcreationenabled: elem.isTagCreationEnabled,
      };
      // console.log("organisationTypeData>> CreditAdjustmentTypes",organisationTypeData);
      organisationTypes.push(organisationTypeData);
      if (elem.mandatoryTags.length > 0) {
        elem.mandatoryTags.forEach((mandatoryTag) => {
          const OrganizationLedgerTypes_mandatoryTags = {
            organizationledgertypeid: elem.id,
            mandatorytagid: mandatoryTag.id,
          };
          mandatoryTags.push(OrganizationLedgerTypes_mandatoryTags);
        });
      }
      if (elem.optionalTags.length > 0) {
        elem.optionalTags.forEach((optionalTag) => {
          const OrganizationLedgerTypes_optionalTags = {
            organizationledgertypeid: elem.id,
            optionaltagid: optionalTag.id,
          };
          optionalTags.push(OrganizationLedgerTypes_optionalTags);
        });
      }
    });
    data.PaymentTypes.forEach((elem) => {
      const organisationTypeData = {
        organizationledgertypeid: elem.id,
        description: elem.description,
        ledgertype: elem.type,
        constantdescription: elem.constantDescription,
        active: elem.active,
        allocation: elem.allocation,
        istagrestrictionenabled: elem.isTagRestrictionEnabled,
        istagcreationenabled: elem.isTagCreationEnabled,
      };
      // console.log("organisationTypeData>> PaymentTypes",organisationTypeData);
      organisationTypes.push(organisationTypeData);
      if (elem.mandatoryTags.length > 0) {
        elem.mandatoryTags.forEach((mandatoryTag) => {
          const OrganizationLedgerTypes_mandatoryTags = {
            organizationledgertypeid: elem.id,
            mandatorytagid: mandatoryTag.id,
          };
          mandatoryTags.push(OrganizationLedgerTypes_mandatoryTags);
        });
      }
      if (elem.optionalTags.length > 0) {
        elem.optionalTags.forEach((optionalTag) => {
          const OrganizationLedgerTypes_optionalTags = {
            organizationledgertypeid: elem.id,
            optionaltagid: optionalTag.id,
          };
          optionalTags.push(OrganizationLedgerTypes_optionalTags);
        });
      }
    });
    // console.log(organisationTypes);
    // // Assuming that you have a way to find the correct organizationLedgerTypeId from the response data
    // // You might need to filter or find from the data
    // const organizationLedgerTypeId = organisationTypes.find(item => item.type === type && item.description === description)?.id;

    // if (!organizationLedgerTypeId) {
    //   console.log(`Organization Ledger Type ID not found for type: ${type} and description: ${description}`);
    // }

    return organisationTypes || null;
  } catch (error) {
    console.error("Error fetching Organization Ledger Type:", error);
    throw error;
  }
}

async function storeAllTransaction(data) {
  try {
    // This function could store the transaction data array in any way you need
    // console.log("Storing transaction:", data);
    const response = await fetch(
      backUrl + "/transaction/bulkInsert",
      await preparePostObject(data)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to transaction. Status: ${response.status}`);
    }

    // If the response is successful, log the success message
    // console.log("transaction stored successfully.");
  } catch (error) {
    console.error("Error storing transaction:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function getTransactionDetails(patients) {
  await Promise.all(
    patients.map(async (patient) => {
      const patientId = patient.patient_ehr_id;
      // console.log(`Fetching transaction details for patient: ${patientId}`);
      // logSyncFunctions("Transaction Distribution", "started", patientId);
      if (patientId) {
        if (!userLogoutFromAditApp) {
          await getAscendTransactionDetail(patientId);
        }
      }
      // logSyncFunctions("Transaction Distribution", "completed", patientId);
    })
  );
  return true;
}

async function getAscendTransactionDetail(patientId) {
  try {
    const dateFrom = new Date(
      new Date().setFullYear(new Date().getFullYear() - 2)
    ).getTime();
    const dateTo = new Date().getTime();
    const response = await fetch(
      `${dentrixUrl}/patient/${patientId}/ledger/list?autoScrollToRecentTransactions=true&range=ALL_HISTORY_DATE_RANGE&sorting=BY_DATE&view=GUARANTOR_VIEW&showHistory=true&showTime=false&showDeleted=true&showXfers=true&resetHistory=false&isSinceLastZeroBalanceEnabled=false&filteredDateRange=All%20history`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transaction details for patient: ${patientId}`
      );
    }

    const transactions = await response.json();
    // console.log(`Transactions for ${patientId}: `, transactions);

    if (transactions.length) {
      const transactionDistributionData = await getTransactionDistributionData(
        transactions,
        patientId
      );
      // console.log(
      //   "Transaction Distribution Data: ",
      //   transactionDistributionData
      // );
      await StoreTransactionDistribution(transactionDistributionData);
    }
  } catch (error) {
    console.error(
      `Error fetching transaction details for patient: ${patientId}`,
      error
    );
  }
}

async function getTransactionDistributionData(transData, patientId) {
  const mappedDistributions = [];

  const distributionPromises = transData.map(async (tdata) => {
    let transactionDistributionUrl = "";

    if (
      ["Payment", "CreditAdjustment", "InsurancePayment"].includes(tdata.type)
    ) {
      if (tdata.amount < 0 && tdata.type === "CreditAdjustment") {
        // console.log("tdata.amount-->", tdata.amount);
        // console.log("tdata.type-->", tdata.type);
        transactionDistributionUrl = `${dentrixUrl}/patient/ledger/credit/distribution/read?amount=${tdata.amount}&ledgerView=PATIENT_VIEW&creditId=${tdata.id}&patientId=${patientId}`;
      } else if (tdata.amount < 0 && tdata.type === "Payment") {
        if (tdata.transactionPaymentSource === "MANUAL") {
          tdata.amount = -tdata.amount;
          transactionDistributionUrl = `${dentrixUrl}/patient/ledger/payment/distribution/create?amount=${tdata.amount}&ledgerView=PATIENT_VIEW&creditId=${tdata.id}&patientId=${patientId}`;
        } else if (tdata.transactionPaymentSource === "TERMINAL") {
          transactionDistributionUrl = `${dentrixUrl}/patient/ledger/payment/distribution/read?amount=${tdata.amount}&ledgerView=PATIENT_VIEW&creditId=${tdata.id}&patientId=${patientId}`;
        } else if (!tdata.transactionPaymentSource) {
          transactionDistributionUrl = `${dentrixUrl}/patient/ledger/insurance/distribution/read?amount=${tdata.amount}&ledgerView=PATIENT_VIEW&creditId=${tdata.id}&patientId=${patientId}`;
        }
      } else if (tdata.amount < 0 && tdata.type === "InsurancePayment") {
        // Call the API to get insurance payment distribution data

        const insuranceAdjustmentUrl = `${dentrixUrl}/patient/ledger/payment/insurance/adjustment/?paymentId=${tdata.id}`;
        var insuranceClaimId = 0;
        // Fetch insurance adjustment data
        const insuranceAdjustmentData = await fetchData(insuranceAdjustmentUrl);
        // console.log("Insurance Adjustment Data: ", insuranceAdjustmentData);
        if (insuranceAdjustmentData && insuranceAdjustmentData[0]) {
          insuranceClaimId = insuranceAdjustmentData[0].insuranceClaim;
        }
        transactionDistributionUrl = `${dentrixUrl}/patient/ledger/payment/insurance/distribution/read?amount=${tdata.amount}&insuranceClaimId=${insuranceClaimId}&paymentId=${tdata.id}`;
        // console.log("transactionDistributionUrl for Insurance Adjustment Data: ", transactionDistributionUrl);
      }

      if (transactionDistributionUrl) {
        // console.log(transactionDistributionUrl);
        const distributionData = await fetchData(transactionDistributionUrl);
        // console.log("Distribution Data: ", distributionData);
        const mappedDistributionData = distributionData.map((distribution) => {
          return {
            id: tdata.id,
            procedureId: distribution.chargeId,
            appliedAmount: distribution.applied,
          };
        });
        // console.log("Mapped Distribution Data: ", mappedDistributionData);
        mappedDistributions.push(...mappedDistributionData);
      }
    }
  });

  await Promise.all(distributionPromises);

  return mappedDistributions;
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    return [];
  }
}

async function StoreTransactionDistribution(TranData) {
  try {
    // console.log("Storing Transaction Distributions in Chunk:", TranData);

    let TransInChunkArr = pachunkArrayInGroups(TranData, 3000);
    const allPromise = TransInChunkArr.map((transChunkArr, chunkarridx) => {
      return new Promise(async (resolve, reject) => {
        if (transChunkArr.length > 0) {
          let url = `${backUrl}/pa-transaction-distribution/bulkInsert`;
          let transactionDistSyncData = {
            transactions: transChunkArr,
            appointmentlocation: selectedLocationId,
          };
          // console.log(
          //   "🚀 ~ TransInChunkArr ~ transactionDistSyncData: %j",
          //   transactionDistSyncData
          // );
          // Simulate updating Transaction Distribution
          fetch(url, await preparePostObject(transactionDistSyncData))
            .then((response) => {
              if (!response.ok) {
                // throw new Error('Network response was not ok');
                // console.log(
                //   "Network response was not ok: StoreTransactionDistribution"
                // );
                return resolve();
              }
              return iterateResponse(response);
            })
            .then((data) => {
              // console.log(
              //   "Transaction Distribution Synced successfully:",
              //   data
              // );
              return resolve();
            })
            .catch((error) => {
              // console.log("Error updating Transaction Distribution:");
              return resolve();
            });
          if (chunkarridx == TransInChunkArr.length - 1) {
            // If the response is successful, log the success message
            // console.log("PA Transaction Distribution stored successfully.");
          }
        }
        return resolve();
      });
    });
    await Promise.all(allPromise);
  } catch (error) {
    console.error("Error storing PA Transaction Distribution:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function storeAllInsuranceClaimsPayments(results) {
  try {
    // This function could store the results array in any way you need
    // console.log("Storing results:", results);
    const response = await fetch(
      backUrl + "/insurance-claims-insurance-payments/bulkInsert",
      await preparePostObject(results)
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to store insurance claims. Status: ${response.status}`
      );
    }

    // If the response is successful, log the success message
    // console.log("Insurance Claims stored successfully.");
  } catch (error) {
    console.error("Error storing insurance claims:", error);
    // Optionally, you can throw the error again to handle it elsewhere
    throw error;
  }
}

async function fetchInsurancePaymentDetails(insurancePayment) {
  try {
    const insurancePaymentId = insurancePayment.id;
    const apiUrl =
      dentrixUrl +
      `/patient/ledger/payment/${insurancePaymentId}?isSpecific=false`;

    const response = !userLogoutFromAditApp && (await fetch(apiUrl));
    if (!response.ok) {
      throw new Error(
        `Failed to fetch details for Insurance Payment ID ${insurancePaymentId}`
      );
    }

    const data = await iterateResponse(response);
    // Process the fetched data here
    var manipulatedData = {
      paymentId: insurancePayment.id,
      insuranceClaimId: data.insuranceClaimId,
    };
    return manipulatedData;
  } catch (error) {
    console.error(error);
  }
}

function pachunkArrayInGroups(arr, size) {
  var newArr = [];

  for (var i = 0; arr.length > size; i++) {
    newArr.push(arr.splice(0, size));
  }
  newArr.push(arr.slice(0));
  return newArr;
}

async function storeSinglePaAppt(data) {
  let ApptsInChunkArr = pachunkArrayInGroups(data, 10);
  ApptsInChunkArr.map(async (apptChunkArr, chunkarridx) => {
    let appointmentSyncData = {
      appointments: apptChunkArr,
      appointmentlocation: selectedLocationId,
    };
    // Simulate updating appointments
    fetch(
      backUrl + "/paappointments/bulkInsert",
      await preparePostObject(appointmentSyncData)
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return iterateResponse(response);
      })
      .then(async (data) => {
        console.log("Appointment Synced successfully:", data);
        //For Appt visits manipulation to prevent blank calls
        let appVisitsChunkSync = apptChunkArr.filter(
          (appt) => appt.visits && appt.visits.length
        );
        if (appVisitsChunkSync.length) {
          let apptVSyncData = {
            appointments: appVisitsChunkSync,
            appointmentlocation: selectedLocationId,
          };
          // Store Appointment visits into PA
          await storeApptVisits(apptVSyncData);
        }
        //For Appt visits manipulation to prevent blank calls

        //For Appt Pat Proc manipulation to prevent blank calls
        let appChunkSync = apptChunkArr.filter(
          (appt) => appt.patientProcedures && appt.patientProcedures.length
        );
        if (appChunkSync.length) {
          let apptPPSyncData = {
            appointments: appChunkSync,
            appointmentlocation: selectedLocationId,
          };
          // Store Appointment Patient Procedures into PA
          await storeApptPatientProcedure(apptPPSyncData);
        }
        //For Appt Pat Proc manipulation to prevent blank calls

        //For Appt Practice Proc manipulation to prevent blank calls
        let practiceProcedureChunkSync = apptChunkArr.filter(
          (appt) => appt.procedures && appt.procedures.length
        );
        if (practiceProcedureChunkSync.length) {
          let practiceProcedureSyncData = {
            appointments: practiceProcedureChunkSync,
            appointmentlocation: selectedLocationId,
          };
          // Store Appointment Practice Procedures into PA
          await storeApptPracticeProcedure(practiceProcedureSyncData);
        }
        //For Appt Practice Proc manipulation to prevent blank calls
      })
      .catch((error) => {
        console.log("Error updating Appointment:");
      });
  });
}

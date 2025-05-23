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
async function getAndStorePatientExams(patient) {
  const patientExam = await Promise.all(patient.map(async (patientId) => {
    console.log("\nThis is the patientId from the calling of the function getAndStorePatientExams() - patientId: \n", patientId);

    let patientEHRId = patientId.patient_ehr_id || "";
    console.log("\nThis is the patientId in the function getAndStorePatientExams() - patientEHRId: \n", patientEHRId);

    if (patientEHRId) {
      try {
        let paPatientExam = await getPatientExamsAndExamDetailsData(patientEHRId, getExamOnly = true)

        console.log("\nThis is the PatientExam Data after the data is being fetched from the 'getPatientExamsAndExamDetailsData(patientEHRId, true)' - paPatientExam: \n");
        console.log(paPatientExam);

        // This is to extract only OrderExams Data
        let orderExams = paPatientExam?.OrderExams || [];

        // console.log("\nExtracted OrderExams:\n");
        // console.log(orderExams);

        if (!orderExams) {
          console.warn("Missing orderExams, not found.");
          return false;
        }

        // console.log("\nThis is the Final log for patient exam data object in the getAndStorePatientExams() - (Patient ehr id and the patient exam data):");
        // console.log({
        //   patientEHRId,
        //   examData: paPatientExam
        // });

        return {
          patientEHRId,
          examData: orderExams
        }
      } catch (error) {
        console.error(`Error fetching patient exam details:`, error);
      }
    }
    return null;
  }));
  console.log("\nThis is the full patient exam data - patientExam: \n");
  console.log(patientExam);
  await storeAllPatientExam(patientExam);
}

async function storeAllPatientExam(patientExam) {
  console.log('\nSending exam data to store:\n', patientExam);

  const url = `${backUrl}/patient/${selectedLocationId}/exams`;
  try {
    const response = await fetch(url, await preparePostObject(patientExam));
    console.log('\nThis is the response in the storeAllPatientExam() - response: \n', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('\nFailed to store exam data: \n', response.status, errorText);
    }

    const data = await iterateResponse(response);
    // if (!data || !data.status) {
    //   console.log("Unable to update patient exam data :: ");
    // }
    console.log('Response JSON from exam store POST:', data);

    if (!data || typeof data !== 'object') {
      console.log("Unable to update patient exam data :: response invalid");
    } else {
      console.log("Successfully stored patient exam data");
    }

  } catch (error) {
    console.warn("Unable to update patient exam data :: \n", error);
  }

  return true;
}
//** End of the Patient EXAM **//
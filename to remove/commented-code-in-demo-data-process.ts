// case "call_update_voicemail": {
//   const idsToUpdate = body.ids;
//   const newStatus = body.status;

//   const allVoicemailArrays_dental = [
//     voicemail_austin_data,
//     voicemail_dallas_data,
//     voicemail_houston_data,
//     voicemail_austin_arc,
//     voicemail_dallas_arc,
//     voicemail_houston_arc
//   ];

//   const allVoicemailArrays_chiro = [voicemail_houston_chiro, voicemail_austin_chiro, voicemail_dallas_chiro, voicemail_austin_arc_chiro, voicemail_dallas_arc_chiro, voicemail_houston_arc_chiro];

//   const allVoicemailArrays_opto = [voicemail_austin_opto, voicemail_dallas_opto, voicemail_houston_opto, voicemail_austin_arc_opto, voicemail_dallas_arc_opto, voicemail_houston_arc_opto];


//   switch (practiceIndustry) {
//     case "optometry": {
//       // Loop through each array and update matching objects
//       allVoicemailArrays_opto.forEach(array => {
//         array.forEach(item => {
//           if (idsToUpdate.includes(item._id)) {
//             item.status = newStatus;
//           }
//         });
//       });
//       break;
//     }
//     case "chiropractor": {
//       // Loop through each array and update matching objects
//       allVoicemailArrays_chiro.forEach(array => {
//         array.forEach(item => {
//           if (idsToUpdate.includes(item._id)) {
//             item.status = newStatus;
//           }
//         });
//       });
//       break;
//     }
//     default: {
//       // Loop through each array and update matching objects
//       allVoicemailArrays_dental.forEach(array => {
//         array.forEach(item => {
//           if (idsToUpdate.includes(item._id)) {
//             item.status = newStatus;
//           }
//         });
//       });
//       break;
//     }
//   }

//   return response;
// }


private generateDynamicPatientForm(formId: string, filteredResponse: any) {
      // response.data = {
      //   ...response.data,
      //   "patientDetail": {
      //     "patient_firstName": patient.firstName,
      //     "patient_id": "94fbc5ec-88cc-4a4b-a97a-873acb410ce8",
      //     "patient_lastName": patient.lastName,
      //     "patient_mobile": patient.cell,
      //     "preferred_name": patient.fullName
      //   },
      //   "form_request_info": {
      //     "fid": "30a07248-4290-46b8-9b06-65fd51a47c56",
      //     "patient_id": "94fbc5ec-88cc-4a4b-a97a-873acb410ce8",
      //     "email": generateEmail(patient.fullName),
      //     "phone": patient.cell,
      //     "first_name": patient.firstName,
      //     "name": patient.fullName
      //   },
      // }
}

// patient_ehr-case-in-demodataprocess
// Note: uncomment if needed
// if (locationIdFromLocalStorage._id === "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948") {
//   resToChange.data[0].appointmentlocationId = locationIdFromLocalStorage.appointmentLocationId
//   resToChange.data[0].locationId = locationIdFromLocalStorage._id
//   resToChange.data[0].locationName = locationIdFromLocalStorage.name
// } else if (locationIdFromLocalStorage._id === "22bffbc8-b255-4679-a5a9-7d2326ec2549") {
//   resToChange.data[0].appointmentlocationId = locationIdFromLocalStorage.appointmentLocationId
//   resToChange.data[0].locationId = locationIdFromLocalStorage._id
//   resToChange.data[0].locationName = locationIdFromLocalStorage.name
// } else if (locationIdFromLocalStorage._id === "869f9155-c174-4f94-b0e1-0ee8d84f3b2d") {
//   resToChange.data[0].appointmentlocationId = locationIdFromLocalStorage.appointmentLocationId
//   resToChange.data[0].locationId = locationIdFromLocalStorage._id
//   resToChange.data[0].locationName = locationIdFromLocalStorage.name
// }
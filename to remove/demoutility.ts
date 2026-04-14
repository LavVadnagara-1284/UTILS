// scheduled-list.component.ts > check the timeout changes for stage and stage - demo, once done there then remove the demo condition

// This is to update and delete the audio list, this can be used when in need
/*
 case "audio_name_update_audio_mock_id_1": {
   const bName = body.name;
   const audioId = "audio_mock_id_1";

   const updateAudioName = (dataArray) => {
     const audioItem = dataArray.find(item => item._id === audioId);
     if (audioItem) {
       audioItem.name = bName;
       audioItem.updated_at = Date.now();
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   updateAudioName(allAudioData);
   updateAudioName(austinAudioData);
   updateAudioName(dallasAudioData);
   updateAudioName(houstonAudioData);

   return response;
 }

 case "audio_name_update_audio_mock_id_2": {
   const bName = body.name;
   const audioId = "audio_mock_id_2";

   const updateAudioName = (dataArray) => {
     const audioItem = dataArray.find(item => item._id === audioId);
     if (audioItem) {
       audioItem.name = bName;
       audioItem.updated_at = Date.now();
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   updateAudioName(allAudioData);
   updateAudioName(austinAudioData);
   updateAudioName(dallasAudioData);
   updateAudioName(houstonAudioData);

   return response;
 }

 case "audio_name_update_audio_mock_id_3": {
   const bName = body.name;
   const audioId = "audio_mock_id_3";

   const updateAudioName = (dataArray) => {
     const audioItem = dataArray.find(item => item._id === audioId);
     if (audioItem) {
       audioItem.name = bName;
       audioItem.updated_at = Date.now();
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   updateAudioName(allAudioData);
   updateAudioName(austinAudioData);
   updateAudioName(dallasAudioData);
   updateAudioName(houstonAudioData);

   return response;
 }

 case "audio_name_update_audio_mock_id_4": {
   const bName = body.name;
   const audioId = "audio_mock_id_4";

   const updateAudioName = (dataArray) => {
     const audioItem = dataArray.find(item => item._id === audioId);
     if (audioItem) {
       audioItem.name = bName;
       audioItem.updated_at = Date.now();
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   updateAudioName(allAudioData);
   updateAudioName(austinAudioData);
   updateAudioName(dallasAudioData);
   updateAudioName(houstonAudioData);

   return response;
 }

 case "audio_delete_audio_mock_id_1": {
   const audioId = "audio_mock_id_1";

   const deleteAudioItem = (dataArray) => {
     const audioIndex = dataArray.findIndex(item => item._id === audioId);
     if (audioIndex !== -1) {
       dataArray.splice(audioIndex, 1);
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   deleteAudioItem(allAudioData);
   deleteAudioItem(austinAudioData);
   deleteAudioItem(dallasAudioData);
   deleteAudioItem(houstonAudioData);

   return response;
 }

 case "audio_delete_audio_mock_id_2": {
   const audioId = "audio_mock_id_2";

   const deleteAudioItem = (dataArray) => {
     const audioIndex = dataArray.findIndex(item => item._id === audioId);
     if (audioIndex !== -1) {
       dataArray.splice(audioIndex, 1);
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   deleteAudioItem(allAudioData);
   deleteAudioItem(austinAudioData);
   deleteAudioItem(dallasAudioData);
   deleteAudioItem(houstonAudioData);

   return response;
 }

 case "audio_delete_audio_mock_id_3": {
   const audioId = "audio_mock_id_3";

   const deleteAudioItem = (dataArray) => {
     const audioIndex = dataArray.findIndex(item => item._id === audioId);
     if (audioIndex !== -1) {
       dataArray.splice(audioIndex, 1);
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   deleteAudioItem(allAudioData);
   deleteAudioItem(austinAudioData);
   deleteAudioItem(dallasAudioData);
   deleteAudioItem(houstonAudioData);

   return response;
 }

 case "audio_delete_audio_mock_id_4": {
   const audioId = "audio_mock_id_4";

   const deleteAudioItem = (dataArray) => {
     const audioIndex = dataArray.findIndex(item => item._id === audioId);
     if (audioIndex !== -1) {
       dataArray.splice(audioIndex, 1);
     }
   };

   const allAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_all"].data;
   const austinAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_austin"].data;
   const dallasAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_dallas"].data;
   const houstonAudioData = this.mockResponses["audio"]["get"]["dental"]["all"]["audio_houston"].data;

   deleteAudioItem(allAudioData);
   deleteAudioItem(austinAudioData);
   deleteAudioItem(dallasAudioData);
   deleteAudioItem(houstonAudioData);

   return response;
 }
*/

// ---------------------------------------------------------------------------------------------------------------------------------------

const overdue_0_To_3_ChiroBase = {
  austin: [],
  dallas: [],
  houston: [],
}

export const getPatientListByTypeNewesOverdue_0_To_3_ChiroMock = {
  all: {
    "status": true,
    "message": "Patient Overdue Listing!",
    "error": null,
    "data": [...overdue_0_To_3_ChiroBase.austin, ...overdue_0_To_3_ChiroBase.dallas, ...overdue_0_To_3_ChiroBase.houston],
    "totalLength": overdue_0_To_3_ChiroBase.austin.length + overdue_0_To_3_ChiroBase.dallas.length + overdue_0_To_3_ChiroBase.houston.length
  },
  austin: {
    "status": true,
    "message": "Patient Overdue Listing!",
    "error": null,
    "data": [...overdue_0_To_3_ChiroBase.austin],
    "totalLength": overdue_0_To_3_ChiroBase.austin.length
  },
  dallas: {
    "status": true,
    "message": "Patient Overdue Listing!",
    "error": null,
    "data": [...overdue_0_To_3_ChiroBase.dallas],
    "totalLength": overdue_0_To_3_ChiroBase.dallas.length
  },
  houston: {
    "status": true,
    "message": "Patient Overdue Listing!",
    "error": null,
    "data": [...overdue_0_To_3_ChiroBase.houston],
    "totalLength": overdue_0_To_3_ChiroBase.houston.length
  },
}

/*
const locationFields = {
    austin: {
        location: {
            "application_name": "Eaglesoft",
            "$id": constantLocationData.austin.id,
            "location": { "$ref": "location", "$id": constantLocationData.austin.id }
        },
        appointmentlocationId: constantLocationData.austin.id,
        appointmentlocationName: constantLocationData.austin.name,
    },
    dallas: {
        location: {
            "application_name": "Eaglesoft",
            "$id": constantLocationData.dallas.id,
            "location": { "$ref": "location", "$id": constantLocationData.dallas.id }
        },
        appointmentlocationId: constantLocationData.dallas.id,
        appointmentlocationName: constantLocationData.dallas.name,
    },
    houston: {
        location: {
            "application_name": "Eaglesoft",
            "$id": constantLocationData.houston.id,
            "location": { "$ref": "location", "$id": constantLocationData.houston.id }
        },
        appointmentlocationId: constantLocationData.houston.id,
        appointmentlocationName: constantLocationData.houston.name,
    },
}

To use in appointmentlocation_appientment_patient_true-opto.mock.ts and appointmentlocation_appientment_patient_true-chiro.mock.ts once done with the name change
*/
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

/*
Dallas-Service IDs: {
    "service_id_24",
    "service_id_25",
    "service_id_26",
    "service_id_27",
}

Dallas-operatory-ids: {
    "new-1-6175e09c-267d-4f54-b0c0-cbed0fc3fd41",
    "new-1-15da922b-ffea-435a-a084-532a61e2be2a",
    "new-1-94981d8f-af42-4ebd-ba2b-4dc7fbc49e7e",
    "new-1-09611674-ed3d-4bfc-9518-fa38a1831597",
}

Dallas-provider-ids: {
    "6175e09c-267d-4f54-b0c0-cbed0fc3fd41",
    "09611674-ed3d-4bfc-9518-fa38a1831597",
    "94981d8f-af42-4ebd-ba2b-4dc7fbc49e7e",
    "15da922b-ffea-435a-a084-532a61e2be2a",
}
*/

/*
this is for confirmed status
Request URL: https://betaapi.adit.com/appointmentlocation/location/ehr/setting/37072afa-fc30-446e-8bc1-e00e5fe5d445
Request Method: GET

this is for arrival status
Request URL: https://betaapi.adit.com/settings/arrivalstatus/37072afa-fc30-446e-8bc1-e00e5fe5d445
Request Method: GET

*/
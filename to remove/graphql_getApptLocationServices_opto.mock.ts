import { graphql_getApptLocationServices_Extra_Services_opto_austin, graphql_getApptLocationServices_Extra_Services_opto_dallas, graphql_getApptLocationServices_Extra_Services_opto_houstan } from "./graphql_getApptLocationServices_Extra_Services.mock";

const locationData = {
    austin: {
        "_id": "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948",
        "name": "Austin",
        "is_gettingstarted_completed": true,
        "is_online_scheduled": true,
        "__typename": "AppointmentLocation"
    },
    dallas: {
        "_id": "22bffbc8-b255-4679-a5a9-7d2326ec2549",
        "name": "Dallas",
        "is_gettingstarted_completed": true,
        "is_online_scheduled": true,
        "__typename": "AppointmentLocation"
    },
    houston: {
        "_id": "869f9155-c174-4f94-b0e1-0ee8d84f3b2d",
        "name": "Houston",
        "is_gettingstarted_completed": true,
        "is_online_scheduled": true,
        "__typename": "AppointmentLocation"
    }
}

export const graphql_getApptLocationServices_austin_opto_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (3 + graphql_getApptLocationServices_Extra_Services_opto_austin.length),
                "result": [
                    {
                        "_id": "opto-senior-exam-austin-new",
                        "name": "Senior Eye Health Exam",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Low Vision Evaluation",
                                    "apptype_ehr_id": "opto-2",
                                    "_id": "opto-apptype-2",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.austin,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    {
                        "_id": "opto-cl-exam-austin-returning",
                        "name": "Contact Lens Exam",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Low Vision Evaluation",
                                    "apptype_ehr_id": "opto-5",
                                    "_id": "opto-apptype-5",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.austin,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    {
                        "_id": "opto-senior-exam-austin-new-2",
                        "name": "Senior Eye Health Exam",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Low Vision Evaluation",
                                    "apptype_ehr_id": "opto-9",
                                    "_id": "opto-apptype-9",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.austin,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_opto_austin
                ]
            }
        }
    }
};

export const graphql_getApptLocationServices_dallas_opto_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (2 + graphql_getApptLocationServices_Extra_Services_opto_dallas.length),
                "result": [
                    {
                        "_id": "opto-comp-exam-dallas-returning",
                        "name": "Comprehensive Eye Exam",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Low Vision Evaluation",
                                    "apptype_ehr_id": "opto-3",
                                    "_id": "opto-apptype-3",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.dallas,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    {
                        "_id": "opto-comp-exam-dallas-new",
                        "name": "Comprehensive Eye Exam",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Low Vision Evaluation",
                                    "apptype_ehr_id": "opto-7",
                                    "_id": "opto-apptype-7",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.dallas,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_opto_dallas
                ]
            }
        }
    }
};

export const graphql_getApptLocationServices_houston_opto_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (4 + graphql_getApptLocationServices_Extra_Services_opto_houstan.length),
                "result": [
                    {
                        "_id": "opto-cl-exam-houston-new",
                        "name": "Contact Lens Exam",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Comprehensive Eye Exam",
                                    "apptype_ehr_id": "opto-1",
                                    "_id": "opto-apptype-1",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.houston,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    {
                        "_id": "opto-pediatric-exam-houston-returning",
                        "name": "Pediatric Eye Exam",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Contact Lens Exam",
                                    "apptype_ehr_id": "opto-4",
                                    "_id": "opto-apptype-4",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.houston,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    {
                        "_id": "opto-eyeglass-exam-houston-new",
                        "name": "Eyeglass Exam",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Low Vision Evaluation",
                                    "apptype_ehr_id": "opto-6",
                                    "_id": "opto-apptype-6",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.houston,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    {
                        "_id": "opto-comp-exam-houston-new",
                        "name": "Comprehensive Eye Exam",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Follow-Up Appointment",
                                    "apptype_ehr_id": "opto-8",
                                    "_id": "opto-apptype-8",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.houston,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_opto_houstan
                ]
            }
        }
    }
};

export const graphql_getApptLocationServices_opto_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": graphql_getApptLocationServices_austin_opto_mock.data.getApptLocationServices.data.result.length + graphql_getApptLocationServices_houston_opto_mock.data.getApptLocationServices.data.result.length,
                "result": [
                    ...graphql_getApptLocationServices_austin_opto_mock.data.getApptLocationServices.data.result,
                    ...graphql_getApptLocationServices_houston_opto_mock.data.getApptLocationServices.data.result,
                ]
            }
        }
    }
};
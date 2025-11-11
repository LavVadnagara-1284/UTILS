import { graphql_getApptLocationServices_Extra_Services_chiro_austin, graphql_getApptLocationServices_Extra_Services_chiro_dallas, graphql_getApptLocationServices_Extra_Services_chiro_houstan } from "./graphql_getApptLocationServices_Extra_Services.mock";

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

export const graphql_getApptLocationServices_austin_chiro_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (2 + graphql_getApptLocationServices_Extra_Services_chiro_austin.length),
                "result": [
                    {
                        "_id": "chiro-new-patient-consultation-austin-new",
                        "name": "New Patient Consultation",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Consultation",
                                    "apptype_ehr_id": "chiro-2",
                                    "_id": "chiro-apptype-2",
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
                        "_id": "chiro-massage-austin-returning",
                        "name": "Massage",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [
                                    "LMT-John (3)",
                                    "LMT-Jen (2)"
                                ],
                                "appointmenttype": {
                                    "name": "Consultation",
                                    "apptype_ehr_id": "chiro-5",
                                    "_id": "chiro-apptype-5",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.austin,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_chiro_austin
                ]
            }
        }
    }
};

export const graphql_getApptLocationServices_dallas_chiro_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (2 + graphql_getApptLocationServices_Extra_Services_chiro_dallas.length),
                "result": [
                    {
                        "_id": "chiro-adjustment-dallas-returning",
                        "name": "Adjustment",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Consultation",
                                    "apptype_ehr_id": "chiro-3",
                                    "_id": "chiro-apptype-3",
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
                        "_id": "chiro-adjustment-dallas-new",
                        "name": "Adjustment",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Consultation",
                                    "apptype_ehr_id": "chiro-7",
                                    "_id": "chiro-apptype-7",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.dallas,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_chiro_dallas
                ]
            }
        }
    }
};

export const graphql_getApptLocationServices_houston_chiro_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (4 + graphql_getApptLocationServices_Extra_Services_chiro_houstan.length),
                "result": [
                    {
                        "_id": "chiro-massage-houston-new",
                        "name": "Massage",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [
                                    "LMT-John (3)",
                                    "LMT-Jen (2)"
                                ],
                                "appointmenttype": {
                                    "name": "Massage",
                                    "apptype_ehr_id": "chiro-1",
                                    "_id": "chiro-apptype-1",
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
                        "_id": "chiro-follow-up-houston-returning",
                        "name": "Follow Up",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Follow Up",
                                    "apptype_ehr_id": "chiro-4",
                                    "_id": "chiro-apptype-4",
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
                        "_id": "chiro-consultation-houston-new",
                        "name": "Consultation",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Consultation",
                                    "apptype_ehr_id": "chiro-6",
                                    "_id": "chiro-apptype-6",
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
                        "_id": "chiro-adjustment-houston-new",
                        "name": "Adjustment",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Adjustment",
                                    "apptype_ehr_id": "chiro-8",
                                    "_id": "chiro-apptype-8",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.houston,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_chiro_houstan
                ]
            }
        }
    }
};

export const graphql_getApptLocationServices_chiro_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": graphql_getApptLocationServices_austin_chiro_mock.data.getApptLocationServices.data.result.length + graphql_getApptLocationServices_houston_chiro_mock.data.getApptLocationServices.data.result.length,
                "result": [...graphql_getApptLocationServices_austin_chiro_mock.data.getApptLocationServices.data.result, ...graphql_getApptLocationServices_houston_chiro_mock.data.getApptLocationServices.data.result,]
            }
        }
    }
};
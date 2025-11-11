import { graphql_getApptLocationServices_Extra_Services_austin, graphql_getApptLocationServices_Extra_Services_dallas, graphql_getApptLocationServices_Extra_Services_houstan } from "./graphql_getApptLocationServices_Extra_Services.mock";

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

export const graphql_getApptLocationServices_austin_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (3 + graphql_getApptLocationServices_Extra_Services_austin.length), // Count of Austin services
                "result": [
                    ...graphql_getApptLocationServices_Extra_Services_austin,
                    {
                        "_id": "b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6",
                        "name": "Dental Crowns",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "2",
                                    "_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
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
                        "_id": "e4f5a6b7-c8d9-e0f1-a2b3-c4d5e6f7a8b9",
                        "name": "Teeth Whitening",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "5",
                                    "_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
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
                        "_id": "c8d9e0f1-a2b3-c4d5-e6f7-a8b9c0d1e2f3",
                        "name": "Dental Crowns",
                        "is_new": true,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "9",
                                    "_id": "b8c9d0e1-f2a3-4567-8901-234567890abc",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.austin,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    }
                ],
                "__typename": "GetApptLocationServicesDto"
            },
            "__typename": "GetApptLocationServicesMainDto"
        }
    }
};

export const graphql_getApptLocationServices_dallas_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (3 + graphql_getApptLocationServices_Extra_Services_dallas.length), // Count of Dallas services
                "result": [
                    {
                        "_id": "c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7",
                        "name": "Fluoride Treatment",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "3",
                                    "_id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
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
                        "_id": "a6b7c8d9-e0f1-a2b3-c4d5-e6f7a8b9c0d1",
                        "name": "Routine Dental Exam",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "7",
                                    "_id": "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
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
                        "_id": "a6b7c8d9-e0f1-a2b3-c4d5-e6f7a8b9c0d11",
                        // "name": "Teeth Root Canal Therapy / Prophylaxis",
                        "name": "Tooth Filling / Cavity Treatment",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "7",
                                    "_id": "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.dallas,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_dallas
                ],
                "__typename": "GetApptLocationServicesDto"
            },
            "__typename": "GetApptLocationServicesMainDto"
        }
    }
};

export const graphql_getApptLocationServices_houston_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": (4 + graphql_getApptLocationServices_Extra_Services_houstan.length), // Count of Houston services
                "result": [
                    {
                        "_id": "a0c1b2c3-d4e5-f6a7-b8c9-d0e1f2a3b4c5",
                        "name": "Teeth Whitening",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Teeth Whitening",
                                    "apptype_ehr_id": "1",
                                    "_id": "e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6",
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
                        "_id": "d3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8",
                        "name": "Tooth Filling / Cavity Treatment",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Root Canal Therapy",
                                    "apptype_ehr_id": "4",
                                    "_id": "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
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
                        "_id": "f5a6b7c8-d9e0-f1a2-b3c4-d5e6f7a8b9c0",
                        "name": "Root Canal Therapy",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "Wisdom Teeth Removal",
                                    "apptype_ehr_id": "6",
                                    "_id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
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
                        "_id": "b7c8d9e0-f1a2-b3c4-d5e6-f7a8b9c0d1e2",
                        "name": "Fluoride Treatment",
                        "is_new": false,
                        "is_active": true,
                        "time_alloted": 30,
                        "appointmentlocations": [
                            {
                                "procedurecodes": [],
                                "appointmenttype": {
                                    "name": "New Patient Exam DR",
                                    "apptype_ehr_id": "8",
                                    "_id": "a7b8c9d0-e1f2-3456-7890-abcdef012345",
                                    "__typename": "AppointmentType"
                                },
                                "appointmentlocation": locationData.houston,
                                "time_alloted": 30,
                                "__typename": "CustomAppointmentLocations"
                            }
                        ],
                        "__typename": "Service"
                    },
                    ...graphql_getApptLocationServices_Extra_Services_houstan
                ],
                "__typename": "GetApptLocationServicesDto"
            },
            "__typename": "GetApptLocationServicesMainDto"
        }
    }
};


export const graphql_getApptLocationServices_is_active_false_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": 0,
                "result": [],
                "__typename": "GetApptLocationServicesDto"
            },
            "__typename": "GetApptLocationServicesMainDto"
        }
    }
}

export const graphql_getApptLocationServices_mock = {
    "data": {
        "getApptLocationServices": {
            "status": true,
            "message": "Success!",
            "error": "",
            "data": {
                "totalCount": graphql_getApptLocationServices_austin_mock.data.getApptLocationServices.data.result.length + graphql_getApptLocationServices_houston_mock.data.getApptLocationServices.data.result.length,
                "result": [
                    ...graphql_getApptLocationServices_austin_mock.data.getApptLocationServices.data.result,
                    ...graphql_getApptLocationServices_houston_mock.data.getApptLocationServices.data.result,
                ],
                "__typename": "GetApptLocationServicesDto"
            },
            "__typename": "GetApptLocationServicesMainDto"
        }
    }
};
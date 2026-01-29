import { constant_booking_link } from "../../constant-mock-data/constant-os-data.mock";

const BookinglinkBase = {
    theam_colour: "#000000",
    google_analiytic_id: "",
    required_logo: true,
    required_phone: true,
    required_address: true,
    required_map: true,
    required_appointment_for: null,
    required_patient_type: true,
    required_service: null,
    required_insurance: true,
    required_provider: true,
    required_primary_insurance: true,
    required_payment_method: true,
    required_join_asap: true,
    required_add_calender: true,
    show_patient_type: null,
    show_service: true,
    message_text: null,
    email_msg: null,
    email_sub: null,
    logo: "a8e0cd4f-9cda-4026-8c93-0c0a5ce8edc3/839017ff-2570-4b7a-944c-c583d479b84b/os/bookinglink/836252cb-42c0-47e5-8e5b-4c5fcefb7e92_1749738438596.png",
    message_priority: null,
    send_via_email: null,
    send_via_sms: null,
    is_show_provider: true,
    __typename: "Bookinglink",
};

const LOCATION = { AUSTIN: "Austin", DALLAS: "Dallas", HOUSTON: "Houston", MULTI: "2 Locations Selected", };
const createLocation = (name: string) => ({ name, is_ehr_connected: true, is_optometry: null, __typename: "AppointmentLocation", });
const createBookingLink = (id: string, name: string, locationText: string, patientType: string, serviceName: string, bookingUrl: any) => ({
    _id: id,
    name,
    locations: [createLocation(locationText)],
    selected_patient_type: patientType,
    selected_service_name: serviceName,
    show_insurance: true,
    bookinglink_url: bookingUrl,
    ...BookinglinkBase,
});
// const withLocation = (booking: any, locationText: string) => ({ ...booking, locations: [createLocation(locationText)], });
const buildResponse = (result: any[]) => ({
    data: {
        getBookinglinks: {
            status: true,
            message: "Get Bookinglink Successfully!",
            error: "",
            data: {
                totalCount: result.length,
                result,
                __typename: "BookinglinksDto",
            },
            __typename: "BookinglinksMainDto",
        },
    },
});

const linkData = {
    dental: {
        booking_link_1: createBookingLink("booking_link_1", "Exam and Cleaning", LOCATION.HOUSTON, "", "Exam and Cleaning", constant_booking_link.dental),
        booking_link_2: createBookingLink("booking_link_2", "Emergency Appointment", LOCATION.MULTI, "", "Emergency Appointment", constant_booking_link.dental),
        booking_link_3: createBookingLink("booking_link_3", "New patient Exam and Cleaning", LOCATION.MULTI, "New", "New patient Exam and Cleaning", constant_booking_link.dental),
        booking_link_4: createBookingLink("booking_link_4", "Teeth Whitening Consult", LOCATION.MULTI, "", "", constant_booking_link.dental),
        booking_link_5: createBookingLink("booking_link_5", "Exam and Cleaning", LOCATION.AUSTIN, "", "", constant_booking_link.dental),
        booking_link_6: createBookingLink("booking_link_6", "Emergency Appointment", LOCATION.MULTI, "", "", constant_booking_link.dental),
    },
    optometry: {
        booking_link_1: createBookingLink("booking_link_1", "Follow Up Appointment", LOCATION.HOUSTON, "", "Follow Up Appointment", constant_booking_link.optometry),
        booking_link_2: createBookingLink("booking_link_2", "Emergency Eye Care", LOCATION.MULTI, "", "Emergency Appointment", constant_booking_link.optometry),
        booking_link_3: createBookingLink("booking_link_3", "Comprehensive Eye Exam", LOCATION.MULTI, "New", "Follow Up Appointment", constant_booking_link.optometry),
        booking_link_4: createBookingLink("booking_link_4", "Pediatric Eye Exam", LOCATION.MULTI, "", "", constant_booking_link.optometry),
        booking_link_5: createBookingLink("booking_link_5", "Follow Up Appointment", LOCATION.AUSTIN, "", "", constant_booking_link.optometry),
        booking_link_6: createBookingLink("booking_link_6", "Emergency Appointment", LOCATION.MULTI, "", "", constant_booking_link.optometry),
    },
    chiropractor: {
        booking_link_1: createBookingLink("booking_link_1", "Exam and Adjustment", LOCATION.HOUSTON, "", "Exam and Adjustment", constant_booking_link.chiropractor),
        booking_link_2: createBookingLink("booking_link_2", "Emergency Appointment for Back or Neck Pain", LOCATION.MULTI, "", "Emergency Appointment for Back or Neck Pain", constant_booking_link.chiropractor),
        booking_link_3: createBookingLink("booking_link_3", "New Patient Exam and Adjustment", LOCATION.MULTI, "New", "New Patient Exam and Adjustment", constant_booking_link.chiropractor),
        booking_link_4: createBookingLink("booking_link_4", "Posture and Spine Assessment", LOCATION.MULTI, "", "", constant_booking_link.chiropractor),
        booking_link_5: createBookingLink("booking_link_5", "Wellness or Maintenance Adjustment", LOCATION.AUSTIN, "", "", constant_booking_link.chiropractor),
        booking_link_6: createBookingLink("booking_link_6", "Emergency Appointment for Back or Neck Pain", LOCATION.MULTI, "", "", constant_booking_link.chiropractor),
    },
}

export const graphqlGetBookinglinksMock = {
    dental: {
        all: buildResponse([linkData.dental.booking_link_1, linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_5, linkData.dental.booking_link_6]),
        austin: buildResponse([linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_5, linkData.dental.booking_link_6]),
        houston: buildResponse([linkData.dental.booking_link_1, linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_6]),
        dallas: buildResponse([]),
    },
    optometry: {
        all: buildResponse([linkData.dental.booking_link_1, linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_5, linkData.dental.booking_link_6]),
        austin: buildResponse([linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_5, linkData.dental.booking_link_6]),
        houston: buildResponse([linkData.dental.booking_link_1, linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_6]),
        dallas: buildResponse([]),
    },
    chiropractor: {
        all: buildResponse([linkData.dental.booking_link_1, linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_5, linkData.dental.booking_link_6]),
        austin: buildResponse([linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_5, linkData.dental.booking_link_6]),
        houston: buildResponse([linkData.dental.booking_link_1, linkData.dental.booking_link_2, linkData.dental.booking_link_3, linkData.dental.booking_link_4, linkData.dental.booking_link_6]),
        dallas: buildResponse([]),
    },
}

const locationData = {
    austin: [
        {
            "_id": "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948",
            "name": "Austin",
            "location": { "ref": "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948", "__typename": "AppointmentLocationFields" },
            "isRCMEnabled": true,
            "__typename": "AppointmentLocation"
        }
    ],
    dallas: [
        {
            _id: "22bffbc8-b255-4679-a5a9-7d2326ec2549",
            name: "Dallas",
            location: { ref: "22bffbc8-b255-4679-a5a9-7d2326ec2549", __typename: "AppointmentLocationFields" },
            isRCMEnabled: true,
            __typename: "AppointmentLocation",
        },
    ],
    houston: [
        {
            "_id": "869f9155-c174-4f94-b0e1-0ee8d84f3b2d",
            "name": "Houston",
            "location": { "ref": "869f9155-c174-4f94-b0e1-0ee8d84f3b2d", "__typename": "AppointmentLocationFields" },
            "isRCMEnabled": true,
            "__typename": "AppointmentLocation"
        }
    ],
}

const multiLocationData = {
    austin_houston: [...locationData.austin, ...locationData.houston],
    austin: [...locationData.austin],
    houston: [...locationData.houston],
}

// --- Base Bookinglink Details Data ---
const bookinglink_details_base_data = {
    amount: "$50.00",
    bookinglink_url: "", // This will be overridden by the factory function
    customurl: "",
    email_msg: null,
    email_sub: null,
    form_json: [
        {
            column_class: "1",
            dropdown_type: "",
            field_type: "text",
            id: "0",
            is_required: true,
            label: "My First Name",
            number_type: "",
            options: [],
            place_holder: "Enter Text",
            sub_type: "text",
            __typename: "FormJson"
        },
        {
            column_class: "1",
            dropdown_type: "",
            field_type: "text",
            id: "1",
            is_required: true,
            label: "My Last Name",
            number_type: "",
            options: [],
            place_holder: "Enter Text",
            sub_type: "text",
            __typename: "FormJson"
        },
        {
            column_class: "1",
            dropdown_type: "",
            field_type: "date",
            id: "2",
            is_required: true,
            label: "DOB",
            number_type: "",
            options: [],
            place_holder: "DD/MM/YY",
            sub_type: "text",
            __typename: "FormJson"
        },
        {
            column_class: "1",
            dropdown_type: "",
            field_type: "text",
            id: "3",
            is_required: true,
            label: "Phone",
            number_type: "",
            options: [],
            place_holder: "(123) 456-7890",
            sub_type: "text",
            __typename: "FormJson"
        },
        {
            column_class: "1",
            dropdown_type: "",
            field_type: "email",
            id: "4",
            is_required: true,
            label: "Email",
            number_type: "",
            options: [],
            place_holder: "john.doe@example.com",
            sub_type: "text",
            __typename: "FormJson"
        },
        {
            column_class: "1",
            dropdown_type: "",
            field_type: "textarea",
            id: "5",
            is_required: false,
            label: "Comments or Special Request",
            number_type: "",
            options: [],
            place_holder: "Enter Text",
            sub_type: "text",
            __typename: "FormJson"
        }
    ],
    google_analiytic_id: "",
    is_save_card: true,
    is_show_provider: true,
    locations: [], // This will be overridden by the factory function
    logo: "",
    message_priority: null,
    message_text: null,
    name: "", // This will be overridden by the factory function
    phone: "",
    practice_name: "", // This will be overridden by the factory function
    required_address: true,
    required_add_calender: true,
    required_appointment_for: null,
    required_child: true,
    required_customurl: null,
    required_insurance: true,
    required_join_asap: true,
    required_logo: true,
    required_patient_type: true,
    required_payment_method: true,
    required_phone: true,
    required_practice_name: true,
    required_primary_insurance: true,
    required_provider: true,
    required_service: null,
    required_spouse: true,
    selected_customurl: "thankyou_page",
    selected_patient_type: "New",
    selected_provider: "",
    selected_service: "8d4186d9-33ac-4e6f-9a73-b3f88d348344",
    send_via_email: null,
    send_via_sms: null,
    short_url: "https://p.adit.com/LphJ3",
    show_datepicker: true,
    show_insurance: true,
    show_primary_insurance: true,
    show_secondary_insurance: true,
    theam_colour: "#000000",
    thank_you_headling: "Thank you for scheduling!",
    _id: "" // This will be overridden by the factory function
};

// --- Helper Function to Create Specific Bookinglink Details Mocks ---
const createBookinglinkDetailsMock = (name: string, locations: any, id: string, practice_name: string, bookinglink_url: any) => {
    return {
        data: {
            getBookinglinkDetails: {
                status: true,
                message: "Get Bookinglink Successfully!",
                error: "",
                data: {
                    ...bookinglink_details_base_data, // Spread the base data
                    bookinglink_url: bookinglink_url,
                    _id: id, // Override the ID if provided
                    name: name,
                    locations: locations, // Override the locations
                    practice_name: practice_name,
                },
                __typename: "BookinglinkMainDto"
            }
        }
    };
};

const practice_nameData = { dental: "ABC Family Dentistry", optometry: "ABC Vision", chiropractor: "ABC Family Chiropractic" }

export const graphqlGetBookinglinkDetailsMock = {
    dental: {
        booking_link_1: createBookinglinkDetailsMock("Exam and Cleaning", locationData.houston, "booking_link_1", practice_nameData.dental, constant_booking_link.dental),
        booking_link_2: createBookinglinkDetailsMock("Emergency Appointment", multiLocationData.austin_houston, "booking_link_2", practice_nameData.dental, constant_booking_link.dental),
        booking_link_3: createBookinglinkDetailsMock("New patient Exam and Cleaning", multiLocationData.austin_houston, "booking_link_3", practice_nameData.dental, constant_booking_link.dental),
        booking_link_4: createBookinglinkDetailsMock("Teeth Whitening Consult", multiLocationData.austin_houston, "booking_link_4", practice_nameData.dental, constant_booking_link.dental),
        booking_link_5: createBookinglinkDetailsMock("Exam and Cleaning", locationData.austin, "booking_link_5", practice_nameData.dental, constant_booking_link.dental),
        booking_link_6: createBookinglinkDetailsMock("Emergency Appointment", multiLocationData.austin_houston, "booking_link_6", practice_nameData.dental, constant_booking_link.dental),
    },
    optometry: {
        booking_link_1: createBookinglinkDetailsMock("Follow Up Appointment", locationData.houston, "booking_link_1", practice_nameData.optometry, constant_booking_link.optometry),
        booking_link_2: createBookinglinkDetailsMock("Emergency Eye Care", multiLocationData.austin_houston, "booking_link_2", practice_nameData.optometry, constant_booking_link.optometry),
        booking_link_3: createBookinglinkDetailsMock("Comprehensive Eye Exam", multiLocationData.austin_houston, "booking_link_3", practice_nameData.optometry, constant_booking_link.optometry),
        booking_link_4: createBookinglinkDetailsMock("Pediatric Eye Exam", multiLocationData.austin_houston, "booking_link_4", practice_nameData.optometry, constant_booking_link.optometry),
        booking_link_5: createBookinglinkDetailsMock("Follow Up Appointment", locationData.austin, "booking_link_5", practice_nameData.optometry, constant_booking_link.optometry),
        booking_link_6: createBookinglinkDetailsMock("Emergency Appointment", multiLocationData.austin_houston, "booking_link_6", practice_nameData.optometry, constant_booking_link.optometry),
    },
    chiropractor: {
        booking_link_1: createBookinglinkDetailsMock("Exam and Adjustment", locationData.houston, "booking_link_1", practice_nameData.chiropractor, constant_booking_link.chiropractor),
        booking_link_2: createBookinglinkDetailsMock("Emergency Appointment for Back or Neck Pain", multiLocationData.austin_houston, "booking_link_2", practice_nameData.chiropractor, constant_booking_link.chiropractor),
        booking_link_3: createBookinglinkDetailsMock("New Patient Exam and Adjustment", multiLocationData.austin_houston, "booking_link_3", practice_nameData.chiropractor, constant_booking_link.chiropractor),
        booking_link_4: createBookinglinkDetailsMock("Posture and Spine Assessment", multiLocationData.austin_houston, "booking_link_4", practice_nameData.chiropractor, constant_booking_link.chiropractor),
        booking_link_5: createBookinglinkDetailsMock("Wellness or Maintenance Adjustment", locationData.austin, "booking_link_5", practice_nameData.chiropractor, constant_booking_link.chiropractor),
        booking_link_6: createBookinglinkDetailsMock("Emergency Appointment for Back or Neck Pain", multiLocationData.austin_houston, "booking_link_6", practice_nameData.chiropractor, constant_booking_link.chiropractor),
    },
};
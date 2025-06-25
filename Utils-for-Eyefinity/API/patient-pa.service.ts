import { CouchbaseHelperService } from '@adittech/couchbase-nest';
import { ElasticsearchHelperService } from '@adittech/elasticsearch-nest';
import { LoggerHelperService } from '@adittech/logger-nest';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { COUCHBASE_CONSTANTS } from '../../common/constants/couchbase-config';
import { SqlService, getApiListSP, getColumnsSP, getMsPoolMultiple, getdentrixWebEhrMappingWithMSTables, insertTableData, modifyData, runMsQuery } from '../../shared/services/shared/sql.service';

@Injectable()
export class PatientPaService {
    dt_patients = COUCHBASE_CONSTANTS.KEYS.PATIENT;
    dt_appt_loc = COUCHBASE_CONSTANTS.KEYS.APPOINTMENT_LOCATION;
    dt_location = COUCHBASE_CONSTANTS.KEYS.LOCATION;
    dt_organization = COUCHBASE_CONSTANTS.KEYS.ORGANIZATION;
    private doc_type_dentrix_web_ehr = COUCHBASE_CONSTANTS.KEYS.WEB_EHR_DOC;
    private cb_bucket_scope = process.env.COUCHBASE_DEFAULT_SCOPE_NAME;

    constructor(private _logger: LoggerHelperService,
        private _couchbaseHelperService: CouchbaseHelperService,
        private _esHelper: ElasticsearchHelperService,
        private _sqlService: SqlService) { }

    /**Sync bulk patient initially to the SP/mssql,
     * read patients from es and call SP to store patients
     */
    // async bulkSyncPatientSql(params, body) {
    //     try {
    //         const webehrquery = `SELECT t.* FROM ${this.cb_bucket_scope} AS t WHERE t._type = '${this.doc_type_dentrix_web_ehr}' ` + 'AND t.appointmentlocation.`$ref` =' + `'${params.appointmentlocation}' limit 1`;
    //         let webEhrDoc: any = await this._couchbaseHelperService.runQuery(webehrquery);
    //         if (!webEhrDoc || !webEhrDoc.data || !webEhrDoc.data.length) {
    //             this._logger.error(`createDentrixPatinetPayload: Web Ehr Doc not found for appointment location ${params.appointmentlocation}`);
    //             return []
    //         }
    //         webEhrDoc = webEhrDoc.data[0];

    //         let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
    //         if (!appointmentlocationdoc || !appointmentlocationdoc.data) {
    //             this._logger.info('Appointment location not found!:');
    //             throw 'Appointment location not found!:';
    //         }
    //         appointmentlocationdoc = appointmentlocationdoc.data;

    //         let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
    //         if (!locationdoc || !locationdoc.data) {
    //             this._logger.info('Location not found!:');
    //             throw 'Location not found!:';
    //         }
    //         locationdoc = locationdoc.data;

    //         let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
    //         organizationdoc = organizationdoc.data;

    //         this._logger.info('mssql Patients Syncing Started...' + new Date());

    //         let patientLast = 1;
    //         let from = 0;
    //         const size = 500;
    //         // for (let pi = 0; pi < 1; pi++) {//patientLast
    //         // this._logger.info(`Patinet index && from::: ${pi} && ${from}`);
    //         const ids = body.map(p => p.patient_ehr_id);
    //         const esQuery = {
    //             query: {
    //                 bool: {
    //                     must: [{ term: { 'appointmentlocationId.keyword': appointmentlocationdoc._id } },
    //                     { terms: { 'patient_ehr_id.keyword': ids } }
    //                     ]
    //                 }
    //             },
    //             size,
    //             // from
    //         }
    //         let patients = await this._esHelper.search(this.dt_patients, esQuery);
    //         if (!patients || !patients.hits.hits.length) {
    //             if (!patients) {
    //                 this._logger.error(`Elastic patient search error::: ${JSON.stringify(patients)}`);
    //             } else {
    //                 this._logger.info('No more patients found to be sync.');
    //             }
    //             // break;
    //         } else {
    //             patientLast += 1;
    //             from += size;
    //         }
    //         const patientsArr = patients.hits.hits;
    //         await this.storePatientsToSql(params, patientsArr, webEhrDoc);
    //     } catch (err) {
    //         console.log('Error while syncing patient to MsSql::: ', err);
    //         this._logger.error(`Error while syncing patient to MsSql::: ${err}`);
    //         throw err;
    //     }
    //     return { message: 'Patients synced successfully to MsSql' };
    // }

    async storePatientsToSql(appointmentlocation, patientsArr, operation = 'CREATE') {
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: appointmentlocation,
                tableName: 'PatientV1'
            });
            const preparedPatients = this.prepareSqlPatientObj(patientsArr, appointmentlocation, Sync_Client_LocId);
            const modifiedPatients = await modifyData(preparedPatients, columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, operation);
            const rowsaffected = await insertTableData(pool, modifiedPatients, columns, primarySP, api.TableName);
            console.log('patient = rowsaffected: ', rowsaffected);
        } catch (err) {
            console.log('Error while syncing patient to MsSql::: ', err);
            this._logger.error(`Error while syncing patient to MsSql::: ${err}`);
            throw err;
        }
        return { message: 'Patients synced successfully to MsSql' };
    }

    prepareSqlPatientObj(patients: any[], location_ehr_id: string, sync_client_locid: number) {
        patients = patients.map((sp) => {

            const patient = sp;
            const sqlPatient = {
                Sync_Client_LocId: Number(sync_client_locid),
                id: patient.patient_ehr_id,
                patient_id: patient.patient_ehr_id,
                patient_uid: patient.PatientUid || null,
                family_id: String(patient.familyId) || null,
                first_name: patient.firstName || null,
                last_name: patient.lastName || null,
                middle_name: patient.middleName || null,
                preferred_name: patient.preferredName || null,
                sex: patient.sex || null,
                date_of_birth: moment(patient.dateOfBirth).format('YYYY-MM-DD') || null,
                title: patient.title || null,
                medical_record_number: patient.medicalRecordNumber || null,
                pat_balance: parseFloat(patient.patBalance) || null,
                patient_insurance_balance: parseFloat(patient.reminingBenefits) || null,
                email: patient.emailAddress || null,
                address1: patient.address_one || null,
                address2: patient.address_two || null,
                city: patient.city || null,
                state: patient.state || null,
                zipcode: patient.zipcode || null,
                country: patient.country || null,
                preferred_contact: patient.preferredContact || null,
                primary_phone_type: patient.primaryPhoneType || null,
                primary_phone_call_time: patient.primaryPhoneCallTime || null,
                is_bad_phone_primary: patient.isBadPhonePrimary || null,
                secondary_phone_type: patient.secondaryPhoneType || null, // Added missing secondary_phone_type field
                secondary_phone_call_time: patient.secondaryPhoneCallTime || null,
                is_bad_phone_secondary: patient.isBadPhoneSecondary || null,
                employment_status: patient.employmentStatus || null,
                marital_status: patient.maritalStatus || null,
                races: patient.races || null,
                ethnicity: patient.ethnicity || null,
                preferred_language: patient.languageType || null,
                communication_preference: patient.communicationPreference || null,
                referral: patient.referral || null,
                outstanding_balance: parseFloat(patient.dueBalance) || null,
                patient_credit: parseFloat(patient.patientCredit) || null,
                communication_recalls_text: patient.communicationRecallsText || false,
                communication_recalls_call: patient.communicationRecallsCall || false,
                communication_recalls_email: patient.communicationRecallsEmail || false,
                communication_recalls_mail: patient.communicationRecallsMail || false,
                communication_appointment_text: patient.communicationAppointmentText || false,
                communication_appointment_call: patient.communicationAppointmentCall || false,
                communication_appointment_email: patient.communicationAppointmentEmail || false,
                communication_appointment_mail: patient.communicationAppointmentMail || false,
                communication_product_pickup_text: patient.communicationProductPickupText || false,
                communication_product_pickup_call: patient.communicationProductPickupCall || false,
                communication_product_pickup_email: patient.communicationProductPickupEmail || false,
                communication_product_pickup_mail: patient.communicationProductPickupMail || false,
                communication_marketing_promo_text: patient.communicationMarketingPromText || false,
                communication_marketing_promo_call: patient.communicationMarketingPromCall || false,
                communication_marketing_promo_email: patient.communicationMarketingPromEmail || false,
                communication_marketing_promo_mail: patient.communicationMarketingPromMail || false,
                communication_education_text: patient.communicationEducationText || false,
                communication_education_call: patient.communicationEducationCall || false,
                communication_education_email: patient.communicationEducationEmail || false,
                communication_education_mail: patient.communicationEducationMail || false,
                deceased: patient.deceased || false,
                is_patient_merged: patient.isPatientMerged || false,
                special_needs: patient.specialNeeds || false,
                active: patient.status || null,
                home: patient.home_phone || null,
                work: patient.work_phone || null,
                mobile: patient.mobile || null,
                last_visit_date: patient.lastVisitDate ? moment(patient.lastVisitDate).format('YYYY-MM-DD') : null,
                pat_reference: patient.patReference || "",
                provider_id: patient.providerId || null,
                lastmodified: moment(patient.updated_at).format('YYYY-MM-DD'),
                location_id: patient.HomeOffice,
                pat_referral_entity_id: patient.patReferralEntityID || null
            };
            console.log("sqlPatient::", sqlPatient);

            return sqlPatient;
        });
        return patients;
    }

    //*** Start storing patient Exam Details initially to the MsSql ***//
    async storeExamDetailsMsSql(params, examDetails){
        
        try {
            this._logger.info('Patient Exam Details Syncing Started...' + new Date());
            params.patientId = examDetails.patientId;
            params.orderId = examDetails.orderId;
            params.examId = examDetails.examId;
            params.providerId = examDetails.providerId;
                try {
                    await this.storeExamDetails(params, examDetails);

                } catch (error) {
                    this._logger.error('Error Adding Patient Exam Details:: >> ' + JSON.stringify(error));
                }
            return 'patient Exam Details synced successfully.';
        } catch (err) {
            console.log('Error while syncing patient Exam Details::: ', err);
            this._logger.error(`Error while syncing patient Exam Details::: ${err}`);
            throw err;
        }
    }

    async storeExamDetails(params, examDetails) {
        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientExamDetailsV1'
        });

        let preparedPatientExamDetails = await this.patientExamDetailsDoc(params, examDetails, Sync_Client_LocId)
        
        const modifiedPatientExamDetails = await modifyData([preparedPatientExamDetails], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        const rowsaffected = await insertTableData(pool, modifiedPatientExamDetails, columns, primarySP, api.TableName);
        this._logger.info('Patient Exam Details = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient Exam Details Data Sync Successfully for ' + params.appointmentlocation);
        return true;
    }

    async patientExamDetailsDoc(params, examDetails, Sync_Client_LocId) {
        console.log("patientExamDetailsDoc - examDetails:\n",examDetails);
        try {
            let preparedExamDetail = {
                sync_client_locid: parseInt(Sync_Client_LocId),
                patientId: examDetails.patientId,
                orderId: examDetails.patientExamDetails.patientExamDetail.OrderId, 
                examId: examDetails.patientExamDetails.patientExamDetail.ExamId,
                id: examDetails.patientExamDetails.patientExamDetail.OrderId,
                providerId: examDetails.patientExamDetails.patientExamDetail.ProviderId, 
                diabetes: examDetails.patientExamDetails.patientExamDetail.Diabetes, 
                isInvoiced: examDetails.patientExamDetails.patientExamDetail.IsInvoiced,  
                hasEditPermission: examDetails.patientExamDetails.patientExamDetail.HasEditExamPermission,  
                telehealthFeatureAvailable: examDetails.patientExamDetails.telehealthFeatureAvailable, 
                performOnTheFlyCalculations: examDetails.patientExamDetails.performOnTheFlyCalculationsForExamOrders, 
                isLifeStyleQuestionEnabled: examDetails.patientExamDetails.isLifeStyleQuestionEnabled, 
                isPriceTransparencyEnabled: examDetails.patientExamDetails.isPriceTransparencyEnabled, 
                
                providers: examDetails.patientExamDetails.patientExamDetail.ProviderId,
                examCptCodes: examDetails.patientExamDetails.patientExamDetail.ExamCptCodes[0].Key || null,
                fittingFeeCptCodes: examDetails.patientExamDetails.patientExamDetail.FittingFeeCptCodes[0].Key || null,
                procedureCptCodes: examDetails.patientExamDetails.patientExamDetail.ProcedureCptCodes,
                pqrsCptCodes: examDetails.patientExamDetails.patientExamDetail.PqrsCptCodes,
                modifierCodes: examDetails.patientExamDetails.patientExamDetail.ModifierCodes,
                diagnosticCodes: examDetails.patientExamDetails.patientExamDetail.DiagnosisCodes,

                dilationReasons: examDetails.patientExamDetails.patientExamDetail.DilationReasons, 
                insuranceEligibilityId: examDetails.patientExamDetails.patientExamDetail.InsuranceEligibilityId, 
                
                diagnosticCodeA: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeA,
                diagnosticCodeB: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeB,
                diagnosticCodeC: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeC,
                diagnosticCodeD: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeD,
                diagnosticCodeE: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeE,
                diagnosticCodeF: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeF,
                diagnosticCodeG: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeG,
                diagnosticCodeH: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeH,
                diagnosticCodeI: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeI,
                diagnosticCodeJ: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeJ,
                diagnosticCodeK: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeK,
                diagnosticCodeL: examDetails.patientExamDetails.patientExamDetail.DiagnosticCodeL, 
                
                multipleExamCptWarning: examDetails.patientExamDetails.patientExamDetail.MultipleExamCptWarning,
            
                selectedExamCptCode: examDetails.patientExamDetails.patientExamDetail.ExamCptCodes[0].Key,
                selectedFittingFeeCptCode: examDetails.patientExamDetails.patientExamDetail.FittingFeeCptCodes[0].Key,
                selectedProcedureCptCodes: examDetails.patientExamDetails.patientExamDetail.SelectedProcedureCptCodes || null,
                selectedPqrsCptCodes: examDetails.patientExamDetails.patientExamDetail.SelectedPqrsCptCodes,
                
                dilation: examDetails.patientExamDetails.patientExamDetail.Dilation, 
                armd: examDetails.patientExamDetails.patientExamDetail.Armd, 
                diabeticRetinopathy: examDetails.patientExamDetails.patientExamDetail.DiabeticRetinopathy, 
                highRiskPreDiabetes: examDetails.patientExamDetails.patientExamDetail.HighRiskPreDiabetes, 
                glaucoma: examDetails.patientExamDetails.patientExamDetail.Glaucoma, 
                highCholesterol: examDetails.patientExamDetails.patientExamDetail.HighCholesterol, 
                hypertension: examDetails.patientExamDetails.patientExamDetail.Hypertension, 
                arcus: examDetails.patientExamDetails.patientExamDetail.Arcus, 
                abnormalPupil: examDetails.patientExamDetails.patientExamDetail.AbnormalPupil, 
                cataract: examDetails.patientExamDetails.patientExamDetail.Cataract, 
                pcp: examDetails.patientExamDetails.patientExamDetail.Pcp, 
                
                employeeId: examDetails.patientExamDetails.patientExamDetail.EmployeeId,
                isEstimated: examDetails.patientExamDetails.patientExamDetail.InsurancePricing.IsEstimated, 
                primaryInsurance: examDetails.patientExamDetails.patientExamDetail.InsurancePricing.PrimaryInsurance, 
                secondaryInsurance: examDetails.patientExamDetails.patientExamDetail.InsurancePricing.SecondaryInsurance, 
            
                itemCharges: examDetails.patientExamDetails.patientExamDetail.InsurancePricing?.ItemCharges,
              };
              console.log("\n\npatientExamDetailsDoc - preparedExamDetail:\n",preparedExamDetail);
              console.log("\n");
            return preparedExamDetail;
        } catch (error) {
            console.log(error);
        }
    }
    //*** End storing patient Exam Details initially to the MsSql ***//

    //*** Start storing patient Exams initially to the MsSql ***//
    async storeExamsMsSql(params, examData) {
        try {
            this._logger.info('Patient Exam Details Syncing Started...' + new Date());
            params.patientId = examData.patientId;
            for (const currentPatientExamData of examData.patientExam) {
                try {
                    await this.storeExams(params, currentPatientExamData);
                } catch (error) {
                    this._logger.error('Error Adding Patient Exam:: >> ' + JSON.stringify(error));
                }
            }
            return 'patient Exam Data synced successfully.';
        } catch (err) {
            console.log('Error while syncing patient Exam::: ', err);
            this._logger.error(`Error while syncing patient Exam::: ${err}`);
            throw err;
        }
    }

    async storeExams(params, exams) {
        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientExamsV1'
        });

        let preparedPatientExam = await this.patientExamsDoc(params, exams, Sync_Client_LocId)
        console.log("\npreparedPatientExam - \n",preparedPatientExam);
        
        const modifiedPatientExam = await modifyData([preparedPatientExam], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        console.log("\nmodifiedPatientExam-\n",modifiedPatientExam);
        
        const rowsaffected = await insertTableData(pool, modifiedPatientExam, columns, primarySP, api.TableName);
        this._logger.info('Patient Exams = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient Exam Data Sync Successfully for ' + params.appointmentlocation);
        return true;
    }

    async patientExamsDoc(params, exams, Sync_Client_LocId) {
        console.log("\nin doc - \n", exams);
        
        try {
            let preparedExam = {
                Sync_Client_LocId: parseInt(Sync_Client_LocId),
                PatientId: exams.PatientId,
                ExamId: exams.ExamId,
                OrderId: exams.OrderId,
                // id: exams.ExamId,
                ExamDate: moment(exams.ExamDate).format('YYYY-MM-DD') || 0,
                Doctor: exams.Doctor,
                ProcedureCodes: null,
                DiagnosisCodes: null,
                Source: exams.Source,
                IsInvoiced: exams.IsInvoiced,
                HasOrders: exams.HasOrders,
                OfficeNumber: exams.OfficeNumber,
                MultipleExamCptWarning: exams.MultipleExamCptWarning,
                DiagnosisCodesList: null,
                DiagnosisCodeIds: null,
                // insert_update_delete: params.operation == "CREATE" ? 1 : 2
            };
            console.log("\npreparedExam:\n",preparedExam);
            return preparedExam;
            // return;
        } catch (error) {
            console.log(error);
        }
    }

    //*** End storing patient Exam Details initially to the MsSql ***//

    //*** Start storing MakePaymentMiscellaneousReasonsMsSql initially to the MsSql ***//
    async storeMakePaymentMiscellaneousReasonsMsSql(params, MPMRData) {
        console.log("\nstoreMakePaymentMiscellaneousReasonsMsSql - MPMRData\n", MPMRData);
        try {
            this._logger.info('MakePaymentMiscellaneousReasonsMsSql Syncing Started...' + new Date());
            params.patientId = MPMRData.patientId;
            console.log("\nparams.patientId\n", params.patientId);

            try {
                await this.storeMakePaymentMiscellaneousReasons(params, MPMRData);
            } catch (error) {
                this._logger.error('Error Adding MakePaymentMiscellaneousReasonsMsSql:: >> ' + JSON.stringify(error));
            }
            return 'MakePaymentMiscellaneousReasonsMsSql synced Successfully.';
        } catch (error) {
            console.log('Error while syncing MakePaymentMiscellaneousReasonsMsSql::: ', error);
            this._logger.error(`Error while syncing MakePaymentMiscellaneousReasonsMsSql::: ${error}`)
        }
    }

    async storeMakePaymentMiscellaneousReasons(params, MPMRData) {
        console.log("\nstoreMakePaymentMiscellaneousReasons - MPMRData\n", MPMRData);

        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientMakePaymentMiscellaneousReasonsV1'
        });

        let preparedMPMRDoc = await this.MPMRDoc(params, MPMRData, Sync_Client_LocId)
        const modifiedMPMR = await modifyData([preparedMPMRDoc], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        const rowsaffected = await insertTableData(pool, modifiedMPMR, columns, primarySP, api.TableName);
        this._logger.info('MakePaymentMiscellaneousReasons = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA MakePaymentMiscellaneousReasons Data Sync Successfully for ' + params.appointmentlocation);
        return true;
    }

    async MPMRDoc(params, MPMRData, Sync_Client_LocId) {
        console.log("\nMPMRDoc - MPMRData\n", MPMRData);
        try {
            let preparedMPMR = {
                sync_client_locid: parseInt(Sync_Client_LocId),
                ReasonId: MPMRData.makePaymentMiscellaneousReasons.MiscPmtReasons[1].Key ?? 0,
                IsRequiredNote: MPMRData.makePaymentMiscellaneousReasons.IsRequiredNote,
                MiscPmtReasons: MPMRData.makePaymentMiscellaneousReasons.MiscPmtReasons[1].Description ?? '',
                LastUpdated: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            console.log("\npreparedMPMR:\n", preparedMPMR);
            return preparedMPMR;
        } catch (error) {
            console.error("Error making the MPMR Doc:\n", error);
        }
    }
    //*** End storing MakePaymentMiscellaneousReasonsMsSql initially to the MsSql ***//

    //*** Start storing Patient PaymentNonInvoiced initially to the MsSql ***//
    async storePatientPaymentNonInvoicedMsSql(params, PaymentNonInvoicedData) {
        // console.log("\n in store to mssql function - PaymentNonInvoicedData: \n", PaymentNonInvoicedData);
        try {
            this._logger.info('Patient PaymentNonInvoicedData Syncing Started...' + new Date());
            params.patientId = PaymentNonInvoicedData.patientId;
            // console.log("\nparams.patientId\n", params.patientId);
            try {
                await this.storePatientPaymentNonInvoiced(params, PaymentNonInvoicedData);
            } catch (error) {
                this._logger.error('Error Adding Patient PaymentNonInvoiced :: >> ' + JSON.stringify(error));
            }
            return 'Patient PaymentNonInvoiced synced Successfully.';
        } catch (error) {
            console.log('Error while syncing Patient PaymentNonInvoiced ::: ', error);
            this._logger.error(`Error while syncing Patient PaymentNonInvoiced ::: ${error}`)
            throw error;
        }
    }

    async storePatientPaymentNonInvoiced(params, PaymentNonInvoicedData) {
        // console.log("\nin store patient payment non invoiced function - PaymentNonInvoicedData\n", PaymentNonInvoicedData);

        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientPaymentNonInvoicedV1'
        });

        let preparedPatientPaymentNonInvoicedDoc = await this.patientPaymentNonInvoicedDoc(params, PaymentNonInvoicedData, Sync_Client_LocId)
        // console.log("\npreparedPatientPaymentNonInvoicedDoc - \n", preparedPatientPaymentNonInvoicedDoc);
        const modifiedMPMR = await modifyData([preparedPatientPaymentNonInvoicedDoc], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        const rowsaffected = await insertTableData(pool, modifiedMPMR, columns, primarySP, api.TableName);
        this._logger.info('Patient PaymentNonInvoiced = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient PaymentNonInvoiced Sync Successfully for ' + params.appointmentlocation);
        return true;
    }

    async patientPaymentNonInvoicedDoc(params, PaymentNonInvoicedData, Sync_Client_LocId) {
        console.log("\n In Patient PaymentNonInvoiced Doc function - PaymentNonInvoicedData\n", PaymentNonInvoicedData);
        try {
            let preparedPatientPaymentNonInvoicedDoc = {
                sync_client_locid: parseInt(Sync_Client_LocId),
                OfficeNumber: PaymentNonInvoicedData.paymentNonInvoiced.OfficeNumber,
                PatientName: PaymentNonInvoicedData.paymentNonInvoiced.PatientName,
                PatientId: PaymentNonInvoicedData.paymentNonInvoiced.PatientId,
                OrderNum: PaymentNonInvoicedData.paymentNonInvoiced.OrderNum,
                RemakeOrderNumberDisplay: PaymentNonInvoicedData.paymentNonInvoiced.RemakeOrderNumberDisplay,
                RemakeOrderNum: PaymentNonInvoicedData.paymentNonInvoiced.RemakeOrderNum,
                OrderType: PaymentNonInvoicedData.paymentNonInvoiced.OrderType,
                OrderTypeDisplay: PaymentNonInvoicedData.paymentNonInvoiced.OrderTypeDisplay,
                PrimaryPhone: PaymentNonInvoicedData.paymentNonInvoiced.PrimaryPhone,
                SecondaryPhone: PaymentNonInvoicedData.paymentNonInvoiced.SecondaryPhone,
                
                OrderDate: moment(PaymentNonInvoicedData.paymentNonInvoiced.OrderDate).format('YYYY-MM-DD') || 0,
                PromisedDate: moment(PaymentNonInvoicedData.paymentNonInvoiced.PromisedDate).format('YYYY-MM-DD') || 0,
                
                RemainingBalance: PaymentNonInvoicedData.paymentNonInvoiced.RemainingBalance,
                OrderBalance: PaymentNonInvoicedData.paymentNonInvoiced.OrderBalance,
                PatientAmount: PaymentNonInvoicedData.paymentNonInvoiced.PatientAmount,
                OrderStatus: PaymentNonInvoicedData.paymentNonInvoiced.OrderStatus,
                InvoiceStatus: PaymentNonInvoicedData.paymentNonInvoiced.InvoiceStatus,
                ClaimStatus: PaymentNonInvoicedData.paymentNonInvoiced.ClaimStatus,
                Price: PaymentNonInvoicedData.paymentNonInvoiced.Price,
                Payment: PaymentNonInvoicedData.paymentNonInvoiced.Payment,
                IsDirty: PaymentNonInvoicedData.paymentNonInvoiced.IsDirty,
                LabName: PaymentNonInvoicedData.paymentNonInvoiced.LabName,
                HasLabJobCancellationBeenRequested: PaymentNonInvoicedData.paymentNonInvoiced.HasLabJobCancellationBeenRequested,
                LabAllowsCancellation: PaymentNonInvoicedData.paymentNonInvoiced.LabAllowsCancellation,
                SortIndex: PaymentNonInvoicedData.paymentNonInvoiced.SortIndex,
                ClaimId: PaymentNonInvoicedData.paymentNonInvoiced.ClaimId,
                ClaimDataId: PaymentNonInvoicedData.paymentNonInvoiced.ClaimDataId,
                MiscOrderWorkflowId: PaymentNonInvoicedData.paymentNonInvoiced.MiscOrderWorkflowId,
                LabOrderIntegrationStatus: PaymentNonInvoicedData.paymentNonInvoiced.LabOrderIntegrationStatus,
                FrameFulfillmentOrderStatus: PaymentNonInvoicedData.paymentNonInvoiced.FrameFulfillmentOrderStatus,
                ABBStatus: PaymentNonInvoicedData.paymentNonInvoiced.ABBStatus,
                CLSupplierItemStatus: PaymentNonInvoicedData.paymentNonInvoiced.CLSupplierItemStatus,
                IsReadyForProcessing: PaymentNonInvoicedData.paymentNonInvoiced.IsReadyForProcessing,
                InvoiceId: PaymentNonInvoicedData.paymentNonInvoiced.InvoiceId,
                PreviousPayment: PaymentNonInvoicedData.paymentNonInvoiced.PreviousPayment,
                DefaultDepositPayment: PaymentNonInvoicedData.paymentNonInvoiced.DefaultDepositPayment,
                CanDeliver: PaymentNonInvoicedData.paymentNonInvoiced.CanDeliver,
                HasDeliverWFAction: PaymentNonInvoicedData.paymentNonInvoiced.HasDeliverWFAction,
                IsSelected: PaymentNonInvoicedData.paymentNonInvoiced.IsSelected,
                InsuranceDateRange: PaymentNonInvoicedData.paymentNonInvoiced.InsuranceDateRange,
                IsRemake: PaymentNonInvoicedData.paymentNonInvoiced.IsRemake,
                NoClaimDescription: PaymentNonInvoicedData.paymentNonInvoiced.NoClaimDescription,
                HasDetails: PaymentNonInvoicedData.paymentNonInvoiced.HasDetails,
                LabSystem: PaymentNonInvoicedData.paymentNonInvoiced.LabSystem,
                AllowRetransmission: PaymentNonInvoicedData.paymentNonInvoiced.AllowRetransmission,
                HasValidDiopterIncrement: PaymentNonInvoicedData.paymentNonInvoiced.HasValidDiopterIncrement,
                LabStatus: PaymentNonInvoicedData.paymentNonInvoiced.LabStatus,
                IsLabOrderAtRisk: PaymentNonInvoicedData.paymentNonInvoiced.IsLabOrderAtRisk,
                IsLabOrderStatusHistory: PaymentNonInvoicedData.paymentNonInvoiced.IsLabOrderStatusHistory,
                Carrier: PaymentNonInvoicedData.paymentNonInvoiced.Carrier,
                PromotionApplied: PaymentNonInvoicedData.paymentNonInvoiced.PromotionApplied,
                PromotionSavings: PaymentNonInvoicedData.paymentNonInvoiced.PromotionSavings,
                Retail: PaymentNonInvoicedData.paymentNonInvoiced.Retail,
                TotalDiscount: PaymentNonInvoicedData.paymentNonInvoiced.TotalDiscount,
                TotalTax: PaymentNonInvoicedData.paymentNonInvoiced.TotalTax,
                TotalInsurance: PaymentNonInvoicedData.paymentNonInvoiced.TotalInsurance,
                EstimatedDeliveryDate: PaymentNonInvoicedData.paymentNonInvoiced.EstimatedDeliveryDate,
                NumberOfRetransmits: PaymentNonInvoicedData.paymentNonInvoiced.NumberOfRetransmits,
                EstimatedDeliveryDateDisplay: PaymentNonInvoicedData.paymentNonInvoiced.EstimatedDeliveryDateDisplay,
                IsQualificationRequired: PaymentNonInvoicedData.paymentNonInvoiced.IsQualificationRequired,
                IsValid: PaymentNonInvoicedData.paymentNonInvoiced.IsValid,
                ValidationMessage: PaymentNonInvoicedData.paymentNonInvoiced.ValidationMessage,
                IsSameDayInsurancePricing: PaymentNonInvoicedData.paymentNonInvoiced.IsSameDayInsurancePricing,
                IsSameDayTaxesApplied: PaymentNonInvoicedData.paymentNonInvoiced.IsSameDayTaxesApplied,
                IsDisabled: PaymentNonInvoicedData.paymentNonInvoiced.IsDisabled,
                FrameStatus: PaymentNonInvoicedData.paymentNonInvoiced.FrameStatus,
                ShowAddWarranty: PaymentNonInvoicedData.paymentNonInvoiced.ShowAddWarranty,
                ShowRedeemWarranty: PaymentNonInvoicedData.paymentNonInvoiced.ShowRedeemWarranty,
                WarrantyTargetOrderId: PaymentNonInvoicedData.paymentNonInvoiced.WarrantyTargetOrderId,
                IsWarrantyRedeemed: PaymentNonInvoicedData.paymentNonInvoiced.IsWarrantyRedeemed,
                DeliveryDate: PaymentNonInvoicedData.paymentNonInvoiced.DeliveryDate,
                SaleTransactionDate: PaymentNonInvoicedData.paymentNonInvoiced.SaleTransactionDate,
                OverrideWarrantyAfterPurchase: PaymentNonInvoicedData.paymentNonInvoiced.OverrideWarrantyAfterPurchase,
                WarrantyAddedToOrderNum: PaymentNonInvoicedData.paymentNonInvoiced.WarrantyAddedToOrderNum,
                ShowPrintInvoiceDetail: PaymentNonInvoicedData.paymentNonInvoiced.ShowPrintInvoiceDetail,
                SalePaymentId: PaymentNonInvoicedData.paymentNonInvoiced.SalePaymentId,
                WarrantyDescription: PaymentNonInvoicedData.paymentNonInvoiced.WarrantyDescription,
                IsTargetOrder: PaymentNonInvoicedData.paymentNonInvoiced.IsTargetOrder,
                HasPatientWarranty: PaymentNonInvoicedData.paymentNonInvoiced.HasPatientWarranty,
            }
            console.log("\nThe prepared PatientPaymentNonInvoiced Doc:\n", preparedPatientPaymentNonInvoicedDoc);
            return preparedPatientPaymentNonInvoicedDoc;
        } catch (error) {
            console.error("Error making the PatientPaymentNonInvoiced Doc:\n", error);
        }
    }
    //*** End storing Patient PaymentNonInvoiced initially to the MsSql ***//

    //*** Start storing Patient PaymentTransactions initially to the MsSql ***//
    async storePatientPaymentTransactionsMsSql(params, PaymentTransactionsData) {
        // console.log("\n in store to mssql function - PaymentTransactionsData: \n", PaymentTransactionsData);
        try {
            this._logger.info('Patient PaymentTransactionsData Syncing Started...' + new Date());
            params.patientId = PaymentTransactionsData.patientId;
            // console.log("\nparams.patientId\n", params.patientId);
            try {
                await this.storePatientPaymentTransactions(params, PaymentTransactionsData);
            } catch (error) {
                this._logger.error('Error Adding Patient PaymentTransactions :: >> ' + JSON.stringify(error));
            }
            return 'Patient PaymentTransactions synced Successfully.';
        } catch (error) {
            console.log('Error while syncing Patient PaymentTransactions ::: ', error);
            this._logger.error(`Error while syncing Patient PaymentTransactions ::: ${error}`)
            throw error;
        }
    }

    async storePatientPaymentTransactions(params, PaymentTransactionsData) {
        // console.log("\nin store patient payment non invoiced function - PaymentTransactionsData\n", PaymentTransactionsData);

        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientPaymentTransactionsV1'
        });

        let preparedPatientPaymentTransactionsDoc = await this.patientPaymentTransactionsDocs(params, PaymentTransactionsData, Sync_Client_LocId)
        console.log("\npreparedPatientPaymentTransactionsDoc - \n", preparedPatientPaymentTransactionsDoc);
        console.log("\nLength of preparedPatientPaymentTransactionsDoc - \n", Object.keys(preparedPatientPaymentTransactionsDoc).length);
        const modifiedMPMR = await modifyData([preparedPatientPaymentTransactionsDoc], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        const rowsaffected = await insertTableData(pool, modifiedMPMR, columns, primarySP, api.TableName);
        this._logger.info('Patient PaymentTransactions = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient PaymentTransactions Data Sync Successfully for ' + params.appointmentlocation);
        return true;
    }

    async patientPaymentTransactionsDocs(params, PaymentTransactionsData, Sync_Client_LocId) {
        console.log("\n In Patient PaymentTransactions Doc function - PaymentTransactionsData\n", PaymentTransactionsData);
        try {
            let preparedPatientPaymentTransactionsDoc = {
                sync_client_locid: parseInt(Sync_Client_LocId),
                MiscPaymentId: PaymentTransactionsData.paymentTransactions.MiscPaymentId,
                PaymentId: PaymentTransactionsData.paymentTransactions.PaymentId,
                AmountDisplay: PaymentTransactionsData.paymentTransactions.AmountDisplay,
                Amount: PaymentTransactionsData.paymentTransactions.Amount,
                Associate: PaymentTransactionsData.paymentTransactions.Associate,
                EmployeeId: PaymentTransactionsData.paymentTransactions.EmployeeId,
                OrderTypeDisplay: PaymentTransactionsData.paymentTransactions.OrderTypeDisplay,
                OrderType: PaymentTransactionsData.paymentTransactions.OrderType,
                OrderID: PaymentTransactionsData.paymentTransactions.OrderID,
                OfficeId: PaymentTransactionsData.paymentTransactions.OfficeId,
                PatientName: PaymentTransactionsData.paymentTransactions.PatientName,
                PatientID: PaymentTransactionsData.paymentTransactions.PatientID,
                // id: PaymentTransactionsData.paymentTransactions.PatientID,
                TransactionTypeString: PaymentTransactionsData.paymentTransactions.TransactionTypeString,
                TransactionTypeID: PaymentTransactionsData.paymentTransactions.TransactionTypeID,
                TransactionDateDisplay: moment(PaymentTransactionsData.paymentTransactions.TransactionDate).format('YYYY-MM-DD') || 0,
                TransactionDate: moment(PaymentTransactionsData.paymentTransactions.TransactionDate).format('YYYY-MM-DD') || 0,
                TransactionId: PaymentTransactionsData.paymentTransactions.TransactionId,
                MiscPaymentReason: PaymentTransactionsData.paymentTransactions.MiscPaymentReason,
                RefundReason: PaymentTransactionsData.paymentTransactions.RefundReason,
                ReportUrl: PaymentTransactionsData.paymentTransactions.ReportUrl,
                ReportAvailable: PaymentTransactionsData.paymentTransactions.ReportAvailable,
            }
            // console.log("\nThe prepared PatientPaymentTransactions Doc:\n", preparedPatientPaymentTransactionsDoc);
            return preparedPatientPaymentTransactionsDoc;
        } catch (error) {
            console.error("Error making the PatientPaymentTransactions Doc:\n", error);
        }
    }
    //*** End storing Patient PaymentTransactions initially to the MsSql ***//
    
    //*** Start storing Patient EyeglassOrderDetail initially to the MsSql ***//
    async storePatientEyeglassOrderDetailsMsSql(params, EyeglassOrderDetailData) {
        // console.log("\n in store to mssql function - EyeglassOrderDetailData: \n", EyeglassOrderDetailData);
        try {
            this._logger.info('Patient EyeglassOrderDetailData Syncing Started...' + new Date());
            params.patientId = EyeglassOrderDetailData.patientId;
            // console.log("\nparams.patientId\n", params.patientId);
            try {
                await this.storePatientEyeglassOrderDetails(params, EyeglassOrderDetailData);
            } catch (error) {
                this._logger.error('Error Adding Patient EyeglassOrderDetail :: >> ' + JSON.stringify(error));
            }
            return { success: true, message: 'Patient EyeglassOrderDetails synced Successfully.' };
        } catch (error) {
            console.log('Error while syncing Patient EyeglassOrderDetail ::: ', error);
            this._logger.error(`Error while syncing Patient EyeglassOrderDetail ::: ${error}`)
            throw error;
        }
    }

    async storePatientEyeglassOrderDetails(params, EyeglassOrderDetailData) {
        // console.log("\nin store patient payment non invoiced function - EyeglassOrderDetailData\n", EyeglassOrderDetailData);

        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientEyeglassOrderDetailsV1'
        });

        let preparedPatientEyeglassOrderDetailDoc = await this.patientEyeglassOrderDetailsDocs(params, EyeglassOrderDetailData, Sync_Client_LocId)
        console.log("\npreparedPatientEyeglassOrderDetailDoc - \n", preparedPatientEyeglassOrderDetailDoc);
        console.log("\nLength of preparedPatientEyeglassOrderDetailDoc - ", Object.keys(preparedPatientEyeglassOrderDetailDoc).length);
        const modifiedMPMR = await modifyData([preparedPatientEyeglassOrderDetailDoc], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        const rowsaffected = await insertTableData(pool, modifiedMPMR, columns, primarySP, api.TableName);
        this._logger.info('Patient EyeglassOrderDetail = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient EyeglassOrderDetail Data Sync Successfully for ' + params.appointmentlocation);
        return true;
    }

    async patientEyeglassOrderDetailsDocs(params, EyeglassOrderDetailData, Sync_Client_LocId) {
        console.log("\n In Patient EyeglassOrderDetail Doc function - EyeglassOrderDetailData\n", EyeglassOrderDetailData);
        try {
            // console.log("\nThe prepared PatientEyeglassOrderDetail Doc:\n", preparedPatientEyeglassOrderDetailDoc);
            // Helper function to safely parse integers for BIGINT columns
            const safeParseBigInt = (value) => {
                if (value === null || value === undefined || value === '') return null;
                const parsed = parseInt(value);
                if (isNaN(parsed)) return null;
                return parsed;
            };

            // Helper function to safely parse numbers
            const safeParseNumber = (value, defaultValue = 0) => {
                if (value === null || value === undefined || value === '') return defaultValue;
                const parsed = parseFloat(value);
                if (isNaN(parsed)) return defaultValue;
                return parsed;
            };

            let preparedPatientEyeglassOrderDetailDoc = {
                sync_client_locid: safeParseBigInt(Sync_Client_LocId), 
                OrderNumber: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderNumber,
                CopyOrderNumber: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.CopyOrderNumber ?? null,
                OfficeNum: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OfficeNum ?? null,
                OrderDate: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderDate ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderDate).format('YYYY-MM-DD') : null,
                OrderTime: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderTime ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderTime, 'HH:mm:ss').format('HH:mm:ss') : null,
                ProcessDate: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ProcessDate ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ProcessDate).format('YYYY-MM-DD') : null,
                DeliveryDate: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.DeliveryDate ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.DeliveryDate).format('YYYY-MM-DD') : null,
                ExpectDate: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ExpectDate ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ExpectDate).format('YYYY-MM-DD') : null,
                StatusCode: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.StatusCode ?? null,
                StatusCodeChangedDate: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.StatusCodeChangedDate ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.StatusCodeChangedDate).format('YYYY-MM-DD') : null,
                InvoiceStatus: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.InvoiceStatus ?? null,
                NumberOfRemakes: safeParseNumber(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.NumberOfRemakes, 0), 
                PhoneOrder: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.PhoneOrder ?? false,
                ClaimBilled: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ClaimBilled ?? false,
                IsInvoiced: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsInvoiced ?? false,
                IsOrderStatusLabOnHold: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsOrderStatusLabOnHold ?? false,
                PatientExamId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.PatientExamId), 
                IsOutsideDoctor: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsOutsideDoctor ?? false,
                IsVsp: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsVsp ?? false,
                RxDate: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RxDate ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RxDate).format('YYYY-MM-DD') : null,
                EyeglassOrderType: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.EyeglassOrderType ?? null,
                EyeglassOrderTypeDescription: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.EyeglassOrderTypeDescription ?? null,
                OrderIsValid: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderIsValid ?? false,
                ManualLabOrder: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ManualLabOrder ?? false,
                SellingModel: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.SellingModel ?? null,
                PatientId: safeParseBigInt(params.patientId), 
                DoctorId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.DoctorId), 
                DoctorFullName: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.DoctorFullName ?? null,
                EmployeeId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.EmployeeId), 
                DispenseType: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.DispenseType ?? null,
                DispenseNote: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.DispenseNote ?? null,
                OrderType: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OrderType ?? null,
                LabId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.LabId), 
                LabInstructions: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.LabInstructions ?? null,
                ToMakeFrame: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ToMakeFrame ?? false,
                ToMakeLeftLens: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ToMakeLeftLens ?? false,
                ToMakeRightLens: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ToMakeRightLens ?? false,
                ToMakeExtras: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ToMakeExtras ?? false,
                ShipTo: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ShipTo ?? null,
                ShipToType: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ShipToType ?? null,
                ServiceLocationId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ServiceLocationId), 
                RemakeOrder: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeOrder ?? null,
                RemakeTypeId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeTypeId), 
                RemakeTypeOverride: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeTypeOverride ?? null,
                OverrideRemakeUserId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OverrideRemakeUserId), 
                RemakeType: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeType ?? null,
                RemakeOrderDetail: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeOrderDetail ?? null,
                RemakeDisplayString: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeDisplayString ?? null,
                RemakeReasons: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeReasons ?? null,
                RemakeNote: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeNote ?? null,
                RemakeNoteId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RemakeNoteId), 
                IsOldSystemRemake: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsOldSystemRemake ?? false,
                IsWarrantyRedemption: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsWarrantyRedemption ?? false,
                IsRemakeConfigurationEnabled: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsRemakeConfigurationEnabled ?? false,
                InsurancePricing: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.InsurancePricing ?? null,
                InsuranceEligibilityId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.InsuranceEligibilityId), 
                WarrantyInstanceId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.WarrantyInstanceId), 
                IsQualificationRequired: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.IsQualificationRequired ?? false,
                QualificationId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.QualificationId), 
                QualificationDateUtc: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.QualificationDateUtc ? moment(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.QualificationDateUtc).format('YYYY-MM-DD HH:mm:ss') : null,
                QualificationLabId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.QualificationLabId), 
                QualificationLabName: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.QualificationLabName ?? null,
                RedeemOrderNumber: safeParseNumber(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RedeemOrderNumber, 0), 
                InventoryReturnOptionID: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.InventoryReturnOptionID), 
                InventoryReturnOptionNote: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.InventoryReturnOptionNote ?? null,
                RedeemExact: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RedeemExact ?? false,
                RedeemProductChange: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.RedeemProductChange ?? false,
                OverrideRedemptionUserId: safeParseBigInt(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.OverrideRedemptionUserId), 
                ItemsBeingRedeemed: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ItemsBeingRedeemed ?? null,
                LensCoatingsRetailPrice: safeParseNumber(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.LensCoatingsRetailPrice, 0), 
                LensEdgeRetailPrice: safeParseNumber(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.LensEdgeRetailPrice, 0), 
                LensTintRetailPrice: safeParseNumber(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.LensTintRetailPrice, 0), 
                ExtrasRetailPrice: safeParseNumber(EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.ExtrasRetailPrice, 0), 
                Extras: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.Extras ?? null,
                // Lenses: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.Lenses ?? null,
                // Frame: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.Frame ?? null,
                // Lab: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.Lab ?? null,
                Lenses: null,
                Frame: null,
                Lab: null,
                PdType: EyeglassOrderDetailData.eyeglassOrderDetails.eyeglassOrderDetail.PdType ?? null,
            };
            return preparedPatientEyeglassOrderDetailDoc;
        } catch (error) {
            console.error("Error making the PatientEyeglassOrderDetail Doc:\n", error);
        }
    }
    //*** End storing Patient EyeglassOrderDetail initially to the MsSql ***//

    // Store patient Address initially to the MsSql
    async storeAddressMsSql(params, Adress) {
        try {
            this._logger.info('Patient Address Syncing Started...' + new Date());
            params.patientId = Adress.patientId;
            params.operation = Adress.operation;
            for (let index = 0; index < Adress.PatientAdress.length; index++) {
                let currentPatientNotesData = Adress.PatientAdress[index];
                try {
                    await this.storePatienAddress(params, currentPatientNotesData);

                } catch (error) {
                    this._logger.error('Error Adding Patient Adress:: >> ' + JSON.stringify(error));
                }
            }
            return 'patient Address synced successfully.';
        } catch (err) {
            console.log('Error while syncing patient Adress::: ', err);
            this._logger.error(`Error while syncing patient Adress::: ${err}`);
            throw err;
        }
    }

    async storePatientRelationshipMsSql(params, relationship) {
        try {
            this._logger.info('Patient Relationship Syncing Started...' + new Date());
            params.patientId = relationship.patientId;
            params.operation = relationship.operation;
            for (let index = 0; index < relationship.patientRelationship.length; index++) {
                let currentPatientRelationData = relationship.patientRelationship[index];
                try {
                    await this.storePatienRelationship(params, currentPatientRelationData);

                } catch (error) {
                    this._logger.error('Error Adding Patient Relationship:: >> ' + JSON.stringify(error));
                }
            }
            return 'patient Relationship synced successfully.';
        } catch (err) {
            console.log('Error while syncing patient Relationship::: ', err);
            this._logger.error(`Error while syncing patient Relationship::: ${err}`);
            throw err;
        }
    }

    async storePatienAddress(params, adress) {
        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientAdressV1'
        });

        let preparedAddress = await this.patientAdresssDoc(params, adress, Sync_Client_LocId)

        // manipulating data to store

        const modifiedPatientAddress = await modifyData([preparedAddress], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, 'UNKNOWN');
        const rowsaffected = await insertTableData(pool, modifiedPatientAddress, columns, primarySP, api.TableName);
        this._logger.info('Patient Address = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient Address Data Sync Successfully for ' + params.appointmentlocation);
        return true;

    }

    async storePatienRelationship(params, relationship) {
        const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientRelationshipV1'
        });

        let preparedPatientRelationship = await this.patientRelationshipDoc(params,relationship, Sync_Client_LocId)
        const modifiedPatientAddress = await modifyData([preparedPatientRelationship], columns, Sync_Client_LocId, api.TableName.toLowerCase(), webEhrDoc.time_zone, {}, params.operation);
        const rowsaffected = await insertTableData(pool, modifiedPatientAddress, columns, primarySP, api.TableName);
        this._logger.info('Patient Relationship = rowsaffected: ', JSON.stringify(rowsaffected));
        this._logger.info('PA Patient Relationship Data Sync Successfully for ' + params.appointmentlocation);
        return true;

    }

    async patientAdresssDoc(params, patientAdress, Sync_Client_LocId) {
        try {
            let preparedAddress = {
                sync_client_locid: parseInt(Sync_Client_LocId),
                AddressId: patientAdress.AddressId,
                patientId: parseInt(params.patientId),
                AddressTypeId: patientAdress.AddressTypeId,
                Address1: patientAdress.Address1,
                Address2: patientAdress.Address2 || null,
                City: patientAdress.City,
                State: patientAdress.State,
                ZipCode: patientAdress.ZipCode,
                IsPrimary: patientAdress.IsPrimary || false,
                AddressType: patientAdress.AddressType,
                Country: patientAdress.Country,
                CountryId: patientAdress.CountryId,
                insert_update_delete: params.operation == "CREATE" ? 1 : 2
            }
            return preparedAddress;
        } catch (error) {
            console.log(error);
        }

    }

    async patientRelationshipDoc(params, relationship, Sync_Client_LocId) {
        try {
            let preparedAddress = {
                sync_client_locid: parseInt(Sync_Client_LocId),
                companyid: relationship.CompanyId || null,
                homeoffice: relationship.HomeOffice || null,
                examoffice: relationship.ExamOffice,
                patientid: relationship.PatientId,
                firstname: relationship.FirstName,
                lastname: relationship.LastName,
                nickname: relationship.NickName,
                dateofbirth: moment(relationship.DateOfBirth).format('YYYY-MM-DD') || 0,
                age: relationship.Age,
                phone: relationship.Phone,
                address: relationship.Address,
                inactive: relationship.InActive,
                ispatient: relationship.IsPatient,
                isresponsibleparty: relationship.IsResponsibleParty,
                lastexamdate: relationship.LastExamDate,
                rtepartnercode: relationship.RtePartnerCode,
                orderid: relationship.OrderId,
                responsiblepartyname: relationship.RtePartnerCode,
                insert_update_delete: params.operation == "CREATE" ? 1 : 2
            }
            return preparedAddress;
        } catch (error) {
            console.log(error);
        }

    }
    // Store patient recares (recall) in bulk to MsSql by patient
    async storePatientRecares(params, body) {
        const patientRecares = body.recares;

        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientRecareV1'
            });

            this._logger.info('Patient recares Syncing Started...' + new Date());

            // manipulating data to store
            const preparedRecares = [];
            patientRecares.forEach((patient) => {
                patient.recares.forEach((recare) => {
                    const r = {
                        sync_client_locid: Sync_Client_LocId,
                        patientrecare: { id: recare.Id },
                        duedate: recare.dueDate || null,
                        intervalunit: recare.interval && recare.interval.type || null,
                        interval: recare.interval && recare.interval.count || null,
                        note: recare.note || null,
                        servicedate: recare.serviceDate || null,
                        posteddate: recare.postedDate || null,
                        lastmodified: null,
                        status: recare.status,
                        scheduledappointmentid: recare.appointmentId || null,
                        patientid: patient.patientid,
                        locationid: recare.recareLocationId && recare.recareLocationId.id || null,
                        recaretemplateid: recare.typeId || null,
                        userid: null,   //recare.user = we are getting user name from dentrix ex: sagar
                        // insert_update_delete
                    }

                    preparedRecares.push(r);
                });

            });

            const modifiedPatientRecares = await modifyData(preparedRecares, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, 'CREATE');
            const affected = await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            console.log('PatientRecares affected: ', affected);
            this._logger.info('Patient recares Syncing End...' + new Date());
            return 'patient recares synced successfully.';
        } catch (err) {
            console.log('Error while syncing patient recares::: ', err);
            this._logger.error(`Error while syncing patient recares::: ${err}`);
            throw err;
        }
    }

    // Add/Update/Delete single patient recare (recall) to MsSql
    async storePatientRecare(params, recare) {
        try {
            let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
            if (!appointmentlocationdoc.data) {
                this._logger.info('Appointment location not found!:');
                throw 'Appointment location not found!:';
            }
            appointmentlocationdoc = appointmentlocationdoc.data;

            let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
            if (!locationdoc.data) {
                this._logger.info('Location not found!:');
                throw 'Location not found!:';
            }
            locationdoc = locationdoc.data;

            let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
            organizationdoc = organizationdoc.data;

            const spParams = {
                appointmentlocationId: appointmentlocationdoc._id,
                locationId: locationdoc._id,
                location_name: locationdoc.name,
                ehr_name: appointmentlocationdoc.application_name,
                ehr_version: appointmentlocationdoc.application_version,
                organizationId: organizationdoc._id,
                organization_name: organizationdoc.name
            }

            const pool = await getMsPoolMultiple(spParams);
            const Sync_Client_LocId = pool.config.Sync_Client_LocId;
            let apiList = await getApiListSP(pool.config.server, pool.config, spParams);

            const TableName = getdentrixWebEhrMappingWithMSTables('PatientRecareV1');
            const api = apiList.find(a => a.TableName.toLowerCase() === TableName.toLowerCase());

            const columns = await getColumnsSP(pool.config.server, pool.config, { Salutation: api.Salutation, TableName: api.TableName });
            let primarySP = process.env.INSERT_DATA_SP;
            primarySP = primarySP.replaceAll('TABLENAME', api.TableName);
            primarySP = primarySP.replaceAll('SALUTATION', api.Salutation);

            this._logger.info(`Patient recare ${params.operation}...` + new Date());

            // manipulating data to store
            const r = {
                sync_client_locid: Sync_Client_LocId,
                patientrecare: { id: recare.id || recare.patientRecareId },
                duedate: recare.dueDate || null,
                intervalunit: recare.interval && recare.interval.type || null,
                interval: recare.interval && recare.interval.count || null,
                note: recare.note || null,
                servicedate: recare.serviceDate || null,
                posteddate: recare.postedDate || null,
                lastmodified: null,
                status: recare.status,
                scheduledappointmentid: recare.appointmentId || null,
                patientid: recare.patientId,
                locationid: recare.recareLocationId && recare.recareLocationId.id || null,
                recaretemplateid: recare.typeId || null,
                userid: null,   //recare.user = we are getting user name from dentrix ex: sagar
                // insert_update_delete
            }
            let operation = 'CREATE';
            if (params.operation == 'update') {
                operation = 'UPDATE';
            } else if (params.operation == 'delete') {
                operation = 'DELETE';
            }
            const modifiedPatientRecares = await modifyData([r], columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, operation);
            await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            this._logger.info(`Patient recare ${operation}...` + new Date());
            return `patient recare ${operation} successfully.`;
        } catch (err) {
            console.log('Error while storePatientRecare::: ', err);
            this._logger.error(`Error while storePatientRecare::: ${err}`);
            throw err;
        }
    }

    /**Store referred patients to the MsSql */
    async storeReferredPatients(params, body) {
        const referredPatients = body.referredPatients;
        this._logger.info('Referred patient Syncing Start...' + new Date());
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'ReferredPatients'
            });

            // manipulating data to store
            const preparedReferred = [];
            referredPatients.forEach((patient) => {
                patient.referredPatients.forEach((rPatient) => {
                    const r = {
                        sync_client_locid: Sync_Client_LocId,
                        patientid: patient.patientid,
                        referredpatientid: '' + rPatient.id,
                        insert_update_delete: 4
                    }

                    preparedReferred.push(r);
                });

            });

            const modifiedPatientReferred = await modifyData(preparedReferred, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, 'CREATE');
            const affected = await insertTableData(pool, modifiedPatientReferred, columns, primarySP, api.TableName);
            console.log('PatientReferred = affected: ', affected);
            this._logger.info('Referred patient Syncing End...' + new Date());
            return 'Referred patient synced successfully.';
        } catch (error) {
            console.log('Error while storing referred patients::: ', error);
            this._logger.error('Error while storing referred patients::: ' + error);
            throw error;
        }
    }

    /**Store patient procedure to the MsSql */
    async storePatientProcedures(params, body) {
        const patientProcedures = body.patientProcedures;

        let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
        if (!appointmentlocationdoc.data) {
            this._logger.info('Appointment location not found!:');
            throw 'Appointment location not found!:';
        }
        appointmentlocationdoc = appointmentlocationdoc.data;

        let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
        if (!locationdoc.data) {
            this._logger.info('Location not found!:');
            throw 'Location not found!:';
        }
        locationdoc = locationdoc.data;

        let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
        organizationdoc = organizationdoc.data;


        this._logger.info('Patient procedure Syncing Start...' + new Date());
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientProcedureV1'
            });

            // manipulating data to store
            const preparedProcedures = [];
            patientProcedures.forEach((pro) => {
                const r = {
                    sync_client_locid: Sync_Client_LocId,
                    patientid: pro.patient && pro.patient.id || null,
                    id: pro.id,
                    locationId: pro.location && pro.location.id || null,
                    renderingProviderId: pro.provider && pro.provider.id || null,
                    treatmentPlannedProviderId: pro.treatmentPlannedProvider && pro.treatmentPlannedProvider.id || null,
                    amount: pro.amount,
                    practiceProcedureId: pro.practiceProcedure && pro.practiceProcedure.id || null,
                    status: pro.status || null,
                    notes: pro.note || null,
                    state: pro.state || null,
                    monthsRemaining: pro.monthsRemaining || null,
                    primaryInsuranceEstimateOverride: pro.primaryInsuranceEstimate || null,
                    secondaryInsuranceEstimateOverride: pro.secondaryInsuranceEstimate || null,
                    serviceDate: pro.serviceDate ? moment(pro.serviceDate).tz(pro.timezone).format('YYYY-MM-DD HH:mm:ss') : null,
                    treatmentPlannedDate: pro.treatmentPlannedDate ? moment(pro.treatmentPlannedDate).tz(pro.timezone).format('YYYY-MM-DD HH:mm:ss') : null,
                    startDate: pro.startDate ? moment(pro.startDate).tz(pro.timezone).format('YYYY-MM-DD HH:mm:ss') : null,
                    billToInsurance: pro.billToInsurance || null,
                    autoCalculateEstimateEnabled: pro.autoCalculateEstimateEnabled || null,
                    unlock: pro.unlocked || false,
                    primaryInsurance: pro.primaryInsurance || null,
                    secondaryInsurance: pro.secondaryInsurance || null,
                    writeOff: pro.writeOff || null,
                    guarantorPortion: pro.guarantorPortion || null,
                    endDate: pro.completionDate ? moment(pro.completionDate).tz(pro.timezone).format('YYYY-MM-DD HH:mm:ss') : null,
                    // We did not find below fields in procedure api so gives the default value
                    lastModified: moment().tz(pro.timezone).valueOf(),
                    oralCavity: null,
                    replacedByid: null,
                    entryDate: moment().tz(pro.timezone).valueOf(),
                    expirationDate: null,
                    // insert_update_delete
                }

                preparedProcedures.push(r);
            });

            const modifiedPatientRecares = await modifyData(preparedProcedures, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, 'UPDATE');
            await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            this._logger.info('Patient procedure Syncing End...' + new Date());
            return 'patient procedure synced successfully.';
        } catch (error) {
            console.log('Error while storing patient procedure::: ', error);
            this._logger.error('Error while storing patients procedure::: ' + error);
            throw error;
        }
    }

    /**Store patient recare practice procedure to the MsSql */
    async storePatientRecacePracticeProcedures(params, body) {
        this._logger.info('Patient recares practice procedure Syncing Start...' + new Date());
        try {
            if (body.recareProcedures.PatientRecallDetails) {
                await this.preparePatientRecallDetailsSp(params,body,  body.recareProcedures.PatientRecallDetails);
            }
            if (body.recareProcedures.PatientRecallHistories) {
                await this.preparePatientRecallHistoriesSp(params,body, body.recareProcedures.PatientRecallHistories);
            }
        } catch (error) {
            console.log('Error while storing patient recare practice procedure::: ', error);
            this._logger.error('Error while storing patients recare practice procedure::: ' + error);
            throw error;
        }
    }

    async preparePatientRecallDetailsSp(params, body, PatientRecallDetails) {
        try {
            const operation = body.operation || 'UPDATE';
            const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientRecallDetailsV1'
            });
            
            // manipulating data to store
            const preparedProcedures = [];
            PatientRecallDetails.forEach((pro) => {
                let r = {
                    sync_client_locid: Sync_Client_LocId,
                    id: pro.Id,
                    RecallType: pro.RecallType,
                    MonthsToRecall: pro.MonthsToRecall,
                    NextRecall: pro.NextRecall ? moment(pro.NextRecall).format('YYYY-MM-DD') : 0,
                    RecallTypeId: pro.RecallTypeId,
                    PatientId: Number(pro.PatientId),
                    IsActive: pro.IsActive || false,
                    OfficeNumber: Number(pro.OfficeNumber)
                }

                preparedProcedures.push(r);
            });

            const modifiedPatientRecares = await modifyData(preparedProcedures, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, operation);
            console.log(modifiedPatientRecares,"modifiedPatientRecares");
            
            await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            this._logger.info('Patient recares practice procedure Syncing End...' + new Date());
            return 'patient recares practice procedure synced successfully.';

        } catch (error) {


        }
    }
    async preparePatientRecallHistoriesSp(params, body, PatientRecallHistories) {
        try {
            const operation = body.operation || 'UPDATE';
            const { columns, Sync_Client_LocId, api, primarySP, pool, webEhrDoc } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientRecallHistoriesV1'
            });  
            
            // manipulating data to store
            const recallHistoriesProcedures = [];
            PatientRecallHistories.forEach((pro) => {
                let r = {
                    sync_client_locid: Sync_Client_LocId,
                    IsPartnerCorrespondence:pro.IsPartnerCorrespondence,
                    CorrespondenceDate:pro.CorrespondenceDate ? moment(pro.CorrespondenceDate).format('YYYY-MM-DD') :0,
                    RecallType:pro.RecallType || null,
                    NoticeNum:pro.NoticeNum || null,
                    CorrespondenceName: pro.CorrespondenceName || null,
                    OfficeNumber: pro.OfficeNumber|| null,
                    PatientId: Number(pro.PatientId)
                }
                recallHistoriesProcedures.push(r);
            });

            const modifiedPatientRecares = await modifyData(recallHistoriesProcedures, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, operation);
            
            await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            this._logger.info('Patient recares practice procedure Syncing End...' + new Date());
            return 'patient recares practice procedure synced successfully.';
        } catch (error) {
            console.log('Error while storing patient recare practice procedure::: ', error);
            this._logger.error('Error while storing patients recare practice procedure::: ' + error);
            throw error;
        }
    }

    /**Store patient procedure insurance claim to the MsSql */
    async storePatientProceduresInsuranceClaim(params, body) {
        const insuranceProcedures = body.insuranceProcedures;

        let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
        if (!appointmentlocationdoc.data) {
            this._logger.info('Appointment location not found!:');
            throw 'Appointment location not found!:';
        }
        appointmentlocationdoc = appointmentlocationdoc.data;

        let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
        if (!locationdoc.data) {
            this._logger.info('Location not found!:');
            throw 'Location not found!:';
        }
        locationdoc = locationdoc.data;

        let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
        organizationdoc = organizationdoc.data;


        this._logger.info('Patient recares practice procedure Syncing Start...' + new Date());
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientProcedures_insuranceClaims'
            });

            // manipulating data to store
            const preparedProcedures = [];
            insuranceProcedures.forEach((pro) => {
                const r = {
                    sync_client_locid: Sync_Client_LocId,
                    patientProcedureId: pro.patientProcedureId,
                    insuranceClaimId: pro.insuranceClaimId,
                    insert_update_delete: 4
                }

                preparedProcedures.push(r);
            });

            const modifiedPatientRecares = await modifyData(preparedProcedures, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, 'CREATE');
            await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            this._logger.info('Patient procedure insurance claim Syncing End...' + new Date());
            return 'patient procedure insurance claim synced successfully.';
        } catch (error) {
            console.log('Error while storing patient procedure insurance claim::: ', error);
            this._logger.error('Error while storing patients procedure insurance claim::: ' + error);
            throw error;
        }
    }

    // Get patient recall by recall ehr id from SP
    async getRecallById(params) {
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientRecareV1'
            });
            const query = `select * from ${api.Salutation}.${api.Salutation}_${api.TableName} where Sync_Client_LocId=${Sync_Client_LocId} and PatientRecareid=${params.id}`
            console.log('query: ', query);
            const recall = await runMsQuery(pool, query);
            if (recall && recall[0] && recall[0][0]) {
                return recall[0][0];
            }
            return;
        } catch (error) {
            console.log('Error while finding patient recall::: ', error);
            this._logger.error('Error while finding patient recall::: ' + error);
            throw error;
        }
    }

    async storePatientProceduresPatientConditions(params: any, body: any) {
        const conditions = body.conditions;

        let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
        if (!appointmentlocationdoc.data) {
            this._logger.info('Appointment location not found!:');
            throw 'Appointment location not found!:';
        }
        appointmentlocationdoc = appointmentlocationdoc.data;

        let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
        if (!locationdoc.data) {
            this._logger.info('Location not found!:');
            throw 'Location not found!:';
        }
        locationdoc = locationdoc.data;

        let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
        organizationdoc = organizationdoc.data;


        this._logger.info('Patient procedure patient conditions Syncing Start...' + new Date());
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientProcedures_patientConditions'
            });

            // manipulating data to store
            const preparedConditions = this.preparePatientConditions(conditions, Sync_Client_LocId);

            const modifiedPatientRecares = await modifyData(preparedConditions, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, '');
            await insertTableData(pool, modifiedPatientRecares, columns, primarySP, api.TableName);
            this._logger.info('Patient procedure patient conditions Syncing End...' + new Date());
            return 'Patient procedure patient conditions synced successfully.';
        } catch (error) {
            console.log('Error while storing Patient procedure patient conditions::: ', error);
            this._logger.error('Error while storing Patient procedure patient conditions::: ' + error);
            throw error;
        }
    }

    preparePatientConditions(conditions, Sync_Client_LocId) {
        return conditions.map((condition) => {
            const c = {
                Sync_Client_LocId,
                patientProcedureId: condition.patientProcedureId,
                patientConditionId: condition.patientConditionId,
                insert_update_delete: 4
            };
            return c;
        })
    }

    async storePatientProceduresProcedureTeeth(params: any, body: any) {
        const teeths = body.teeths;

        let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
        if (!appointmentlocationdoc.data) {
            this._logger.info('Appointment location not found!:');
            throw 'Appointment location not found!:';
        }
        appointmentlocationdoc = appointmentlocationdoc.data;

        let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
        if (!locationdoc.data) {
            this._logger.info('Location not found!:');
            throw 'Location not found!:';
        }
        locationdoc = locationdoc.data;

        let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
        organizationdoc = organizationdoc.data;


        this._logger.info('Patient procedure procedure teeth Syncing Start...' + new Date());
        try {
            const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
                appointmentlocation: params.appointmentlocation,
                tableName: 'PatientProcedures_procedureTeeth'
            });

            // manipulating data to store
            const preparedteeths = this.preparePatientProcedureTeeth(teeths, Sync_Client_LocId);

            const modifiedProcedureTeeth = await modifyData(preparedteeths, columns, Sync_Client_LocId, api.TableName.toLowerCase(), '', {}, '');
            await insertTableData(pool, modifiedProcedureTeeth, columns, primarySP, api.TableName);
            this._logger.info('Patient procedure procedure teeth Syncing End...' + new Date());
            return 'Patient procedure procedure teeth synced successfully.';
        } catch (error) {
            console.log('Error while storing Patient procedure procedure teeth::: ', error);
            this._logger.error('Error while storing Patient procedure procedure teeth::: ' + error);
            throw error;
        }
    }

    preparePatientProcedureTeeth(teeths, Sync_Client_LocId) {
        const surfaces = {
            "mesial": false,
            "occlusal": false,
            "incisal": false,
            "distal": false,
            "lingual": false,
            "buccal": false,
            "facial": false,
            "incisalOcclusal": false,
            "facialBuccal": false
        }
        return teeths.map((teeth) => {
            const c = {
                Sync_Client_LocId,
                procedureTeethId: teeth.teeth, //passed teeth becauase not getting from dentrix
                procedureId: teeth.procedureId,
                ...surfaces,    //default value of surfaces
                ...teeth.surfaces,  //Overwrite default value
                classFive: teeth.classFive,
                toothId: teeth.teeth,
                patientProcedureId: teeth.patientProcedureId,
                insert_update_delete: 4
            };
            return c;
        })
    }

    async getLocSyncId(params) {
        const { columns, Sync_Client_LocId, api, primarySP, pool } = await this._sqlService.checkAndGetSpConnection({
            appointmentlocation: params.appointmentlocation,
            tableName: 'PatientProcedures_insuranceClaims'
        });

        return { data: Sync_Client_LocId }
    }
}

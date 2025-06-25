import * as sql from 'mssql';
import * as moment from 'moment';
import { LoggerHelperService } from '@adittech/logger-nest';
import { CouchbaseHelperService } from '@adittech/couchbase-nest';
import { COUCHBASE_CONSTANTS } from '../../../common/constants/couchbase-config';
import { Injectable } from '@nestjs/common';
const momenttz = require('moment-timezone');

interface MsSQLConfig {
    user: string;
    password: string;
    server: string;
    port: number;
    database: string;
    connectionTimeout: number;
    requestTimeout: number;
    stream: boolean;
    parseJSON: boolean;
    pool: {
        idleTimeoutMillis: number;
    };
    arrayRowMode: boolean;
    options: {
        enableArithAbort: boolean;
        encrypt: boolean;
        trustServerCertificate: boolean;
    };
}

interface ApiData {
    TableName: string;
    Salutation: string;
}

interface Params {
    [key: string]: any;
}

interface RunSPResult {
    recordset: any[];
}

interface BulkInsertData {
    ID: number;
    FixWhereFromDate: string;
    TotalRecord: number;
    IsDelete_Data: any;
    IsAll_Data: any;
}

export const MsPools: {[key: string]: sql.ConnectionPool} = {};

export const MsSQL:MsSQLConfig = {
    user: process.env.MsSQLConfig_user,
    password: process.env.MsSQLConfig_password,
    server: process.env.MsSQLConfig_server,
    port: +process.env.MsSQLConfig_port,
    database: process.env.MsSQLConfig_database,
    connectionTimeout: +process.env.MsSQLConfig_connectionTimeout,
    requestTimeout: +process.env.MsSQLConfig_requestTimeout,
    stream: process.env.MsSQLConfig_stream === 'true',
    parseJSON: process.env.MsSQLConfig_parseJSON === 'true',
    pool: {
      idleTimeoutMillis: +process.env.MsSQLConfig_pool_idleTimeoutMillis,
    },
    arrayRowMode: process.env.MsSQLConfig_arrayRowMode === 'true',
    options: {
      enableArithAbort: process.env.MsSQLConfig_options_enableArithAbort === 'true',
      encrypt: process.env.MsSQLConfig_options_encrypt === 'true',
      trustServerCertificate: process.env.MsSQLConfig_options_trustServerCertificate === 'true',
    },
  };

export const LOCATION_DETAILS_SP: string = process.env.Get_Location_Details_Server ? String(process.env.Get_Location_Details_Server) : 'PA.Get_Location_Details_Server';
export const GET_API_LIST_SP: string = process.env.Get_EHR_TableList_Server ? String(process.env.Get_EHR_TableList_Server) : 'dbo.Get_EHR_TableList_Server';
export const GET_COLUMNS_SP: string = 'Dbo.USP_GetTablesColumns';
export const DIRECT_BULK_INSERT_SP: string = 'SALUTATION.USP_InsertUpdate_Direct_SALUTATION_TABLENAME';
export const UPDATE_WRITEOFF_SP: string = `SALUTATION.USP_Update_SALUTATION_PatientProcedures_WriteOffData`;

// used no where
export const getMsPool = async (name: string, config: MsSQLConfig): Promise<sql.ConnectionPool> => {
    if (!Object.keys(MsPools).includes(name)) {
        const pool = new sql.ConnectionPool(config);
        const close = pool.close.bind(pool);
        pool.close = (...args: any[]): any => {
            delete MsPools[name];
            return close(...args);
        }
        await pool.connect();
        MsPools[name] = pool;
    }
    return MsPools[name];
}
// used no where
export const runMsQuery = async (pool: sql.ConnectionPool, query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const request = new sql.Request(pool);
        request.query(query, (err: any, result: any) => {
            if (err) reject(err);
            console.log(result)
            resolve(result.recordsets);
        })
    });
}

export const runMsSP = (pool_name: string, pool_config: MsSQLConfig, sp: string, params: Params = {}): Promise<RunSPResult> => new Promise((resolve, reject) => {
    getMsPool(pool_name, pool_config)
        .then(pool => {
            const request = new sql.Request(pool);
            Object.keys(params).forEach(async k => {
                if (typeof params[k] == 'string') {
                    request.input(k, sql.NVarChar, params[k])
                }

                if (typeof params[k] == 'number') {
                    request.input(k, sql.Int, params[k])
                }

                if (typeof params[k] == 'object') {
                    request.input(k, sql.TVP, params[k])
                }
            });

            request.execute(sp, (err: any, result: RunSPResult) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
        .catch(err => {
            console.log("ERROR runMsSP: ", err);
            reject(err);
        })
})

// used no where
export const getMsPoolMultiple = async (params: Params = {}): Promise<sql.ConnectionPool> => {
    try {
        let pool_name = `${params.organizationId}_${params.appointmentlocationId}`
        if (Object.keys(MsPools).includes(pool_name)) {
            return MsPools[pool_name];
        }
        MsSQL.database=process.env.MsSQLConfig_database;
        let sp_db: any = await runMsSP('MASTER', MsSQL, LOCATION_DETAILS_SP, { Client_Loc_Id: params.locationId, EHR_Name: params.ehr_name });
        if (!sp_db.recordset || !Object.keys(sp_db.recordsets[0]).length || !sp_db.recordset[0].Sync_Client_LocId) {
            MsSQL.database=process.env.MsSQLConfig_database;
            await getApiListSP('MASTER', MsSQL, params);
            sp_db = await runMsSP('MASTER', MsSQL, LOCATION_DETAILS_SP, { Client_Loc_Id: params.locationId, EHR_Name: params.ehr_name });
        }
        let response = sp_db.recordsets[0][0];

        if (!response) {
            throw new Error('database not available.');
        }

        const mssql_config_server: MsSQLConfig = {
            user: response.ServerUserId,
            password: response.ServerUserPassword,
            server: response.ServerName,
            port: response.Port,
            database: response.Location_Database_Name,
            connectionTimeout: MsSQL.connectionTimeout,
            requestTimeout: MsSQL.requestTimeout,
            stream: MsSQL.stream,
            parseJSON: MsSQL.parseJSON,
            pool: MsSQL.pool,
            arrayRowMode: MsSQL.arrayRowMode,
            options: MsSQL.options
        }
        const pool = await getMsPool(pool_name, mssql_config_server);
        pool.config.Sync_Client_LocId = response.Sync_Client_LocId;
        pool.config['parameters'] = params;
        MsPools[pool_name] = pool;
        return pool;
    } catch (e) {
        console.log("ERROR getMsPoolMultiple: ", e);
        throw e;
    }
}

// this function is only used in appointment.service.ts
export const getApiListSP = async (pool_name: string, pool_config: MsSQLConfig, doc: Params = {}): Promise<any[]> => {
    try {
        if (MsPools[GET_API_LIST_SP]?.apiList) {
            const last_date = MsPools[GET_API_LIST_SP]['last_date'];
            const diff = moment(new Date()).diff(moment(last_date),'minutes');
            if(diff <= 60 ){
                return MsPools[GET_API_LIST_SP]['apiList'];
            }
        }
        const data = {
            Cur_LocationAditId: doc.appointmentlocationId,
            EHR_Name: doc.ehr_name,
            EHR_Version: doc.ehr_version,
            LocationName: doc.location_name,
            OrganizationId: doc.organizationId,
            OrganizationName: doc.organization_name
        }

        const get_api_mssql_config_server: MsSQLConfig = { ...pool_config };
        get_api_mssql_config_server.database = process.env.MsSQLConfig_database;
        const sp_getApiList:any = await runMsSP(pool_name, get_api_mssql_config_server, GET_API_LIST_SP, data);
        MsPools[GET_API_LIST_SP] = {};
        if (!sp_getApiList.recordsets[0][0]) {
            return [{ error: true }, { 'getApiListSP ~ GET_API_LIST_SP:': GET_API_LIST_SP, 'MsPools[GET_API_LIST_SP][last_date]:': MsPools[GET_API_LIST_SP]['last_date'], 'sp_getApiList.recordsets[0]:': sp_getApiList.recordsets[0] }];

        }
        MsPools[GET_API_LIST_SP]['apiList'] = sp_getApiList.recordsets[0] || null;
        MsPools[GET_API_LIST_SP]['last_date'] = new Date();
        return MsPools[GET_API_LIST_SP]['apiList'];
    } catch (error) {
        console.log("ERROR getApiListSP: ", error);
        throw error;
    }
}
// used in appointment.service.ts and same file
export const getColumnsSP = async (pool_name: string, pool_config: MsSQLConfig, data: Params = {}, isCron: boolean = false): Promise<any[]> => {
    try {
        if( MsPools?.[`${data.TableName}__${GET_COLUMNS_SP}`]?.['columns']){
            const last_date = MsPools[`${data.TableName}__${GET_COLUMNS_SP}`]['last_date'];
            const diff = moment(new Date()).diff(moment(last_date),'minutes');
            if(diff <= 60 ){
                return MsPools[`${data.TableName}__${GET_COLUMNS_SP}`]['columns'];
            }
        }
        // pool_config.database = process.env.MsSQLConfig_database;
        let columns: any = await runMsSP(pool_name, pool_config, GET_COLUMNS_SP, data);
        columns = columns.recordsets[0] ? [...columns.recordsets[0]] : null;
        if (!isCron && columns) {
            columns.push({
                COLUMN_NAME: 'Insert_Update_Delete',
                DATA_TYPE: 'int',
                NULLABLE: 'NO'
            })
        }
        MsPools[`${data.TableName}__${GET_COLUMNS_SP}`] = {};
        MsPools[`${data.TableName}__${GET_COLUMNS_SP}`]['columns'] = columns ? columns.map((column: any) => ({
            ...column,
            COLUMN_NAME: column.COLUMN_NAME.toLowerCase()
        })) : null;
        MsPools[`${data.TableName}__${GET_COLUMNS_SP}`]['last_date'] = new Date();
        return MsPools[`${data.TableName}__${GET_COLUMNS_SP}`]['columns'];
    } catch (error) {
        console.log("ERROR getColumnsSP: ", error);
        throw error;
    }
}
// used in same file
export const runSPByPool = (pool: sql.ConnectionPool, sp: string, params: Params, is_tvp_On=true): Promise<any> => new Promise((resolve, reject) => {
    const request = new sql.Request(pool);
    Object.keys(params).forEach(async k => {
        if (typeof params[k] == 'string') {
            request.input(k, sql.NVarChar, params[k])
        }

        if (typeof params[k] == 'number') {
            request.input(k, sql.Int, params[k])
        }

        if (typeof params[k] == 'object' && is_tvp_On) {
            request.input(k, sql.TVP, params[k])
        }
    });
    
    request.execute(sp, (err: any, result: RunSPResult) => {
        if (err) {
            reject(err);
        }
        resolve(result);
    })
})

// Moved this function into SqlService class to use some other services
export const updateBulkTimeSP = async (pool_name: string, pool_config: MsSQLConfig, locationid: number): Promise<void> => {
    try {
        const sp = process.env.UPDATE_BULK_TIME_SP;
        const params = {
            Cur_LocationAditId: locationid,
        }
        const mssql_config_server: MsSQLConfig = { ...pool_config };
        mssql_config_server.database = MsSQL.database;
        await runMsSP(pool_name, mssql_config_server, sp, params);
    } catch (error) {
        console.log("ERROR updateBulkTimeSP: ", error);
        throw error;
    }
}

// used no where
export const insertBulkDataDirectSP = (pool: sql.ConnectionPool, api: ApiData, Sync_Client_LocId: number, lastModifiedDateTime: string, totalRecords: number, IsDelete_Data: any, IsAll_Data: any): Promise<any> => new Promise((resolve, reject) => {
    let sp = DIRECT_BULK_INSERT_SP;
    sp = sp.replaceAll('TABLENAME', api.TableName);
    sp = sp.replaceAll('SALUTATION', api.Salutation);

    const params: BulkInsertData = {
        ID: Number(Sync_Client_LocId),
        FixWhereFromDate: moment(lastModifiedDateTime).format('YYYY-MM-DD HH:mm:ss'),
        TotalRecord: totalRecords,
        IsDelete_Data,
        IsAll_Data
    }
    runSPByPool(pool, sp, params)
        .then(response => {
            if (response?.recordset?.length) {
                resolve(response.recordset[0])
            }
        })
        .catch(reject)
})
// used no where
export const resetTableData = (pool: sql.ConnectionPool, tableName: string, Sync_Client_LocId: number): Promise<any> => new Promise((resolve, reject) => {
    const query = `DELETE FROM ${tableName} WHERE Sync_Client_Locid=${Sync_Client_LocId}`;
    const request = new sql.Request(pool);
    request.query(query, (err: any, result: any) => {
        if (err) {
            reject(err);
        }
        console.log(`resetTableData ${tableName} %j`, result);
        resolve(result);
    })
})
// used no where
export const getPoolByName = async (appointmentlocationId: string, organizationId: string): Promise<sql.ConnectionPool | undefined> => {
    let pool_name = `${organizationId}_${appointmentlocationId}`

    if (Object.keys(MsPools).includes(pool_name)) {
        return MsPools[pool_name];
    }
}
// used no where
export const updateWriteOffSP = (pool: sql.ConnectionPool, api: ApiData, Sync_Client_LocId: number, data: any): Promise<void> => new Promise((resolve, reject) => {
    const { patientId, patientProcedureId, primaryInsurance, secondaryInsurance, writeOff, guarantorPortion } = data
    let sp = UPDATE_WRITEOFF_SP;
    sp = sp.replaceAll('TABLENAME', api.TableName);
    sp = sp.replaceAll('SALUTATION', api.Salutation);

    const params = {
        ID: Number(Sync_Client_LocId),
        patientId: patientId,
        patientProcedureId: patientProcedureId,
        primaryInsurance: primaryInsurance ? Number(primaryInsurance) : 0,
        secondaryInsurance: secondaryInsurance ? Number(secondaryInsurance) : 0,
        writeOff: writeOff ? Number(writeOff) : 0,
        guarantorPortion: guarantorPortion ? Number(guarantorPortion) : 0,
    }

    runSPByPool(pool, sp, params)
        .then(resolve)
        .catch(reject)
})
// used in appt.service.ts, patient-insurance-plans.service
export const getdentrixWebEhrMappingWithMSTables = (type:any) => {
    const tableName = DENTRIX_WEB_EHR_API_MAPPING_WITH_DB[type];
    if (!tableName) {
        return type
    }
    return tableName;
}

const DENTRIX_WEB_EHR_API_MAPPING_WITH_DB = {
    'AppointmentV1': 'Appointments',
    'AgingBalancesV1': 'AgingBalances',
    'PatientV1': 'Patients',
    'OperatoryV1': 'Operatories',
    'ProviderV1': 'Providers',
    'OutsideproviderV1': 'Outsideproviders',
    'RecallTypeV1': 'Recall_Types',
    'CarrierInsurPlanCoordinationOfBenefitsV1': 'CarrierInsurancePlanCoordinationofBenefits',
    'CarrierInsurancePlanV1': 'CarrierInsurancePlans',
    'CarrierPlanDeductibleV1': 'CarrierPlandeDuctibles',
    'FeeScheduleRangesV1': 'FeeScheduleRanges',
    'FeeScheduleRanges_ItemsV1': 'FeeScheduleRanges_Items',
    'FeeScheduleV1': 'FeeSchedules',
    'GlobalInsuranceCarrierV1': 'GlobalInsuranceCarriers',
    'InsuranceClaim': 'InsuranceClaims',
    'InsuranceClaimInsurancePaymentsV1': 'InsuranceClaims_insurancePayments',
    'InsuranceClaimProceduresV1': 'InsuranceClaims_procedures',
    'LocationV1': 'Locations',
    'MissedAppointmentV1': 'MissedAppointments',
    'MissedAppointment': 'MissedAppointments',
    'PatientProcedureV1': 'PatientProcedures',
    'PatientRecareV1': 'PatientRecares',
    'PracticeProcedureV1': 'PracticeProcedures',
    'RecareTemplateV1': 'RecareTemplates',
    'RecareTemplatesPracticeProceduresV1':'RecareTemplates_practiceProcedures',
    'ReferralSourceV1': 'ReferralSources',
    'Transaction': 'Transactions',
    'TransactionTagV1': 'TransactionTags',
    'TxCaseV1': 'TxCases',
    'VisitV1': 'Visits',
    'EventV1': 'Events',
    'InsuranceCarrierV1': 'InsuranceCarriers',
    'ToothV1': 'patientteeth1globals',
    'Tooth': 'patientteeth1globals',
    'PatientInsurancePlanV1': 'Patients_Insurance',
    'PatientInsurancePlanResponsibilityV1': 'PatientInsurancePlans_responsibilities',
    'SubscriberInsurancePlanV1': 'SubscriberInsurancePlans',
    'OrganizationLedgerTypesV1': 'OrganizationLedgerTypes',
    'OrganizationLedgerTypes_mandatoryTagsV1': 'OrganizationLedgerTypes_mandatoryTags',
    'OrganizationLedgerTypes_optionalTagsV1': 'OrganizationLedgerTypes_optionalTags',
    'PatientPhoneV1': 'Patients_phones',
    'PatientAdressV1': 'Patient_Address',
    'PatientRelationshipV1': 'Patient_Relationship',
    'PatientExamDetailsV1': 'ExamDetails',
    'PatientExamsV1': 'PatientExams',
    'PatientOrderV1': 'PatientOrder',
    'PatientMakePaymentMiscellaneousReasonsV1': 'MakePaymentMiscellaneousReasons',
    'PatientPaymentNonInvoicedV1': 'PaymentNonInvoiced',
    'PatientPaymentTransactionsV1':'PaymentTransactions',
    'PatientEyeglassOrderDetailsV1': 'EyeglassOrderDetails',
    'ReferredPatients': 'Patients_referredPatients',
    'PatientRecallDetailsV1': 'PatientRecallDetails',
    'PatientRecallHistoriesV1': 'PatientRecallHistories',
    'Providers_ProviderNumbers': 'Providers_ProviderNumbers',
    'Providers_insuranceCarriers': 'Providers_insuranceCarriers',
    'eventsV1': 'events',
    'InsuranceClaimStatusHistoryV1': 'InsuranceClaims_claimStatusHistory',
    'PatientProcedures_insuranceClaims': 'PatientProcedures_insuranceClaims',
    'Transactions_Distributions':'Transactions_Distributions',
    'PatientNotesV1': 'Patient_Notes',
    'TxCasesProceduresV1': 'TxCases_procedures',
    'VisitsProceduresV1': 'Visits_procedures',
    'Appointments_visits':'Appointments_visits',
    'Appointments_patientProcedures':'Appointments_patientProcedures',
    'Appointments_practiceProcedures':'Appointments_practiceProcedures',
    'PracticeProcedures_procedures': 'PracticeProcedures_procedures',
    'PatientProcedures_patientConditions': 'PatientProcedures_patientConditions',
    'PatientProcedures_procedureTeeth': 'PatientProcedures_procedureTeeth',
    'USP_Delete_DTXAC_Appointments':'USP_Delete_DTXAC_Appointments',
    'USP_Delete_DTXAC_SubscriberInsurancePlans': 'USP_Delete_DTXAC_SubscriberInsurancePlans'
}
// used at every where
export const insertTableData = async (pool:any, data:any, columns:any, sp:any, tableName = '') => {
    console.log(`insertTableData: ${tableName} | data - \n${JSON.stringify(data, null, 4)} - records\nTotal of ${Object.keys(data).length}`);
    
    try {
        if (!data.length) {
            console.log('ERROR: insertTableData: data is empty!', data);
        }
        const table = new sql.Table();
        for (let column of columns) {
            table.columns.add(column.COLUMN_NAME, getDataType(column.DATA_TYPE), { nullable: column.IS_NULLABLE === 'YES' ? true : false });
        }

        for (let d of data) {
            table.rows.add(...Object.values(d));
        }
        const params = {
            ID: Number(pool.config.Sync_Client_LocId),
            TblParameter: table
        }
        const runSPByPoolData = await runSPByPool(pool, sp, params);
        console.log(`insertTableData: ${tableName} | runSPByPoolData - \n${JSON.stringify(runSPByPoolData, null, 4)} - records\nTotal of ${Object.keys(data).length}`);
        
        return true;
    } catch (error) {
        console.log(error);
        console.log(`ERROR WHILE INSERTING DATA ON TABLE`, error, tableName);
        throw error;
    }
}

export const getDataType = (datatype) => {
    switch (datatype) {
        case 'nvarchar':
            return sql.NVarChar(sql.MAX);
        case 'bigint':
            return sql.BigInt;
        case 'date':
            return sql.DateTime;
        case 'numeric':
            return sql.Numeric(10, 3);
        case 'datetime':
            return sql.DateTime;
        case 'binary':
            return sql.Binary;
        case 'bit':
            return sql.Bit;
        case 'char':
            return sql.Char;
        case 'decimal':
            return sql.Decimal(10, 3);
        case 'int':
            return sql.Int;
        case 'float':
            return sql.Float;
        default:
            console.log("new datatype ====> %j", datatype)
            return sql.NVarChar(sql.MAX);
    }
}
// used at every where
export const modifyData = async (responseArr = [], columnData = [], Sync_Client_LocId, tableName, timezone, extraFields = {}, operation = 'CREATE', isCron = false) => {
    try {
        return responseArr.map((dataObj, index) => {
            dataObj = { ...dataObj, ...extraFields };
            let keys = Object.keys(dataObj);
            let n = keys.length;
            let obj:any = {};
            let key;
            while (n--) {
                key = keys[n];
                obj[key.toLowerCase()] = dataObj[key];
            }
            let primary = tableName.toLowerCase();
            if (primary.includes('1')) {
                const arr = primary.split('1');
                primary = arr[arr.length - 1];
            }
            if (primary[primary.length - 1] === 's') {
                primary = primary.slice(0, -1).toLowerCase();
            }
            obj[primary + 'id'] = obj.id;
            obj['sync_client_locid'] = Sync_Client_LocId;
            obj = findObjectIds(obj);
            
            console.log(`modifyData: ${tableName} | obj - \n${JSON.stringify(obj, null, 4)} - records\nTotal of ${Object.keys(obj).length}`);

            const newObj:any = {};
            const is_temp = obj.is_temp;
            for (let column of columnData) {
                if (column.COLUMN_NAME === 'insert_update_delete') {
                    newObj[column.COLUMN_NAME] = obj[column.COLUMN_NAME] ?? getInsertUpdateDelete(operation);
                    continue;
                }

                let col = column.COLUMN_NAME;
                if (['startdate', 'enddate'].includes(column.COLUMN_NAME) && tableName.toLowerCase() === 'appointments') {
                    col = column.COLUMN_NAME.replace('date', '');
                }

                if (col === 'state' && obj[col] && tableName.toLowerCase() === 'patients') {
                    obj[col] = obj[col].slice(0, 2);
                }

                newObj[column.COLUMN_NAME] = !is_temp ? getColumnValue(obj[col], column.DATA_TYPE, timezone) : getColumnValueForTemp(obj[col], column.DATA_TYPE);
            }

            if (isCron) delete newObj.insert_update_delete;
            console.log(`modifyData: ${tableName} | newObj - \n${JSON.stringify(newObj, null, 4)} - records\nTotal of ${Object.keys(newObj).length}`);
            
            return newObj;
        })
    } catch (error) {
        console.log("ERROR modifyData", error);
    }
}

const findObjectIds = (obj:any) => {
    for (let [key, value] of Object.entries(obj)) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            continue;
        }

        if (value && Object.keys(value).includes('id')) {
            obj[key + 'id'] = (value as any).id;
            delete obj[key];
        }

        for (let [subkey, subvalue] of Object.entries(value)) {
            if (!subvalue || typeof subvalue !== 'object' || Array.isArray(subvalue)) {
                continue;
            }

            if (subvalue && Object.keys(subvalue).includes('id')) {
                if (['codeA', 'codeB', 'codeC', 'codeD'].includes(subkey)) {
                    subkey = subkey.replace('code', '').toLowerCase();
                }
                obj[key + subkey + 'id'] = subvalue.id;
                delete obj[key];
            }

        }
    }
    return obj;
}

const getInsertUpdateDelete = (operation) => {
    let operationCode = OPERATION_MAPPING[operation];
    if (!operationCode) {
        throw new Error('INVALID OPERATION DETAILS!');
    }
    return operationCode;
}

const getColumnValue = (value : any, datatype : any, timezone : any) => {
    switch (datatype) {
        case 'nvarchar':
            return value ? String(value) : undefined;
        case 'bigint':
            return value ? Number(value) : undefined;
        case 'date':
            return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : undefined;
        case 'numeric':
            return value ? Number(value) : undefined;
        case 'datetime':
            if (value) {
                const isUtc = typeof value === 'string' && value.includes('T') && value.includes('Z');
                if (isUtc) {
                    return momenttz(value).tz(timezone).format('YYYY-MM-DD HH:mm:ss') || undefined;
                } else {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            } else {
                return undefined;
            }
        case 'binary':
            return value ? Number(value) : undefined;
        case 'bit':
            return value === true ? 1 : (value === false ? 0 : undefined);
        case 'char':
            return value ? String(value) : undefined;
        case 'decimal':
            return value ? Number(value) : undefined;
        case 'int':
            return value ? Number(value) : undefined;
        case 'float':
            return value ? Number(value) : undefined;
        default:
            return value ?? undefined;
    }
}

const getColumnValueForTemp = (value: any, datatype : any) => {
    switch (datatype) {
        case 'nvarchar':
            return value ? String(value) : '';
        case 'bigint':
            return value ? Number(value) : 0;
        case 'date':
            return moment().format('YYYY-MM-DD HH:mm:ss');
        case 'numeric':
            return value ? Number(value) : 0;
        case 'datetime':
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        case 'binary':
            return value ? Number(value) : 0;
        case 'bit':
            return 0
        case 'char':
            return value ? String(value) : '';
        case 'decimal':
            return value ? Number(value) : 0;
        case 'int':
            return value ? Number(value) : 0;
        case 'float':
            return value ? Number(value) : 0;
        default:
            return value ?? "";
    }
}

const OPERATION_MAPPING = {
    'CREATE': 1,
    'UPDATE': 2,
    'DELETE': 3,
    'ARRAY_INSERTED': 4,
    'ARRAY_DELETED': 5
};

@Injectable()
export class SqlService {
    dt_appt_loc = COUCHBASE_CONSTANTS.KEYS.APPOINTMENT_LOCATION;
    dt_location = COUCHBASE_CONSTANTS.KEYS.LOCATION;
    dt_organization = COUCHBASE_CONSTANTS.KEYS.ORGANIZATION;
    dt_web_ehr_doc = COUCHBASE_CONSTANTS.KEYS.WEB_EHR_DOC;

    constructor(private readonly _logger: LoggerHelperService,
        private readonly _couchbaseHelperService: CouchbaseHelperService) { }

    /**Check and get SP connection/common details */
    async checkAndGetSpConnection(params : any) {
        try {
            let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${params.appointmentlocation}`);
            if (!appointmentlocationdoc?.data) {
                this._logger.info('Appointment location not found!:');
                throw new Error('Appointment location not found!:');
            }
            appointmentlocationdoc = appointmentlocationdoc.data;
            
            let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
            if (!locationdoc) {
                this._logger.info('Location not found!:');
                throw new Error('Location not found!:');
            }
            locationdoc = locationdoc.data;

            let organizationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_organization}|${appointmentlocationdoc.organization.$ref}`);
            organizationdoc = organizationdoc.data;

            const webEhrDoc = await this.getWebEHRDoc(appointmentlocationdoc.location.$ref, this.dt_web_ehr_doc, false);
            
            const spParams = {
                appointmentlocationId: appointmentlocationdoc._id,
                locationId: locationdoc._id,
                location_name: locationdoc.name,
                ehr_name: appointmentlocationdoc.application_name,
                ehr_version: appointmentlocationdoc.application_version,
                organizationId: organizationdoc._id,
                organization_name: organizationdoc.name
            }

            // For this task -> https://app.asana.com/1/7153196700226/project/1209308814928714/task/1209807484701863?focus=true
            // Check for both application_name and application_version
            if (!spParams.ehr_name || !spParams.ehr_version) {
                const msg = 'Application name and EHR version are required to connect with PA.';
                throw msg;
            }

            const pool = await this.getMsPoolMultiple(spParams);
            const Sync_Client_LocId = pool.config.Sync_Client_LocId;
            let apiList = await this.getApiListSP(pool.config.server, pool.config, spParams);
            if (apiList[0]['error']) {
                apiList = null;
            }
            let throwCount = 1;
            while (!apiList && throwCount <= 5) {
                apiList = await this.getApiListSP(pool.config.server, pool.config, spParams);
                if (apiList[0]['error']) {
                    this._logger.info(`getapitlist error retry: ${JSON.stringify(apiList)}`);
                    apiList = null;
                }
                throwCount++;
                if (throwCount > 5) {
                    throw { error: `Did not get api list after 5 retry.` };
                }
            }

            const TableName = this.getdentrixWebEhrMappingWithMSTables(params.tableName);
            const api = apiList.find(a => a.TableName.toLowerCase() === TableName.toLowerCase());
            const columns = await getColumnsSP(pool.config.server, pool.config, { Salutation: api.Salutation, TableName: api.TableName });
            let primarySP = process.env.INSERT_DATA_SP;
            primarySP = primarySP.replaceAll('TABLENAME', api.TableName);
            primarySP = primarySP.replaceAll('SALUTATION', api.Salutation);
            
            return { appointmentlocationdoc, locationdoc, organizationdoc, Sync_Client_LocId, pool, api, columns, primarySP, webEhrDoc };
        } catch (error) {
            this._logger.info(`checkAndGetSpConnection:: ${JSON.stringify(error)} --- ${error}`);
            throw error;
        }
    }

    // Update the last_sync time of PA location in SP
    async updateBulkTimeSP(data): Promise<void> {
        try {
            let appointmentlocationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_appt_loc}|${data.appointmentlocation}`);
            if (!appointmentlocationdoc.data) {
                this._logger.info('Appointment location not found!:');
                throw new Error('Appointment location not found!:');
            }
            appointmentlocationdoc = appointmentlocationdoc.data;

            let locationdoc: any = await this._couchbaseHelperService.getDocument(`${this.dt_location}|${appointmentlocationdoc.location.$ref}`);
            if (!locationdoc) {
                this._logger.info('Location not found!:');
                throw new Error('Location not found!:');
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
            
            const pool = await this.getMsPoolMultiple(spParams);

            const sp = process.env.UPDATE_BULK_TIME_SP;
            const params = {
                Cur_LocationAditId: appointmentlocationdoc._id,
            }
            const mssql_config_server: MsSQLConfig = { ...pool.config };
            mssql_config_server.database = MsSQL.database;
            await this.runMsSP(pool.config.server, mssql_config_server, sp, params);
        } catch (error) {
            this._logger.info(`Error: PA last_sync not updated for appt loc id - ${data.appointmentlocation} - At ${new Date().toISOString()}; Error: ${JSON.stringify(error)}`);
        }
    }

    async getMsPoolMultiple(params: Params = {}): Promise<sql.ConnectionPool> {
        try {
            let pool_name = `${params.organizationId}_${params.appointmentlocationId}`
            if (Object.keys(MsPools).includes(pool_name)) {
                return MsPools[pool_name];
            }
            MsSQL.database=process.env.MsSQLConfig_database;
            let sp_db: any = await this.runMsSP('MASTER', MsSQL, LOCATION_DETAILS_SP, { Client_Loc_Id: params.locationId, EHR_Name: params.ehr_name });
            
            // For this task -> https://app.asana.com/1/7153196700226/project/1209308814928714/task/1209807484701863?focus=true
            // Check for both application_name and application_version
            if (!params.ehr_name || !params.ehr_version) {
                const msg = 'Application name and EHR version are required to connect with PA.';
                throw msg;
            }

            if (!sp_db.recordset || !Object.keys(sp_db.recordsets[0]).length || !sp_db.recordset[0].Sync_Client_LocId) {
                MsSQL.database=process.env.MsSQLConfig_database;
                await getApiListSP('MASTER', MsSQL, params);
                sp_db = await this.runMsSP('MASTER', MsSQL, LOCATION_DETAILS_SP, { Client_Loc_Id: params.locationId, EHR_Name: params.ehr_name });
            }
            let response = sp_db.recordsets[0][0];
    
            if (!response) {
                throw new Error('database not available.');
            }
    
            const mssql_config_server: MsSQLConfig = {
                user: response.ServerUserId,
                password: response.ServerUserPassword,
                server: response.ServerName,
                port: response.Port,
                database: response.Location_Database_Name,
                connectionTimeout: MsSQL.connectionTimeout,
                requestTimeout: MsSQL.requestTimeout,
                stream: MsSQL.stream,
                parseJSON: MsSQL.parseJSON,
                pool: MsSQL.pool,
                arrayRowMode: MsSQL.arrayRowMode,
                options: MsSQL.options
            }
            const pool = await this.getMsPool(pool_name, mssql_config_server);
            pool.config.Sync_Client_LocId = response.Sync_Client_LocId;
            pool.config['parameters'] = params;
            MsPools[pool_name] = pool;
            return pool;
        } catch (e) {
            console.log("ERROR getMsPoolMultiple: ", e);
            throw e;
        }
    }

    async getApiListSP(pool_name: string, pool_config: MsSQLConfig, doc: Params = {}): Promise<any[]>{
        try {
            if(MsPools?.[GET_API_LIST_SP]?.['apiList']){
                const last_date = MsPools[GET_API_LIST_SP]['last_date'];
                const diff = moment(new Date()).diff(moment(last_date),'minutes');
                if(diff <= 60 ){
                    return MsPools[GET_API_LIST_SP]['apiList'];
                }
            }
            const data = {
                Cur_LocationAditId: doc.appointmentlocationId,
                EHR_Name: doc.ehr_name,
                EHR_Version: doc.ehr_version,
                LocationName: doc.location_name,
                OrganizationId: doc.organizationId,
                OrganizationName: doc.organization_name
            }
    
            const get_api_mssql_config_server: MsSQLConfig = { ...pool_config };
            get_api_mssql_config_server.database = process.env.MsSQLConfig_database;
            this._logger.info(`pool_name:: ${doc.appointmentlocationId} -- ${pool_name}`)
            this._logger.info(`get_api_mssql_config_server:: ${doc.appointmentlocationId} -- ${JSON.stringify(get_api_mssql_config_server)}`)
            this._logger.info(`GET_API_LIST_SP:: ${doc.appointmentlocationId} -- ${GET_API_LIST_SP}`)
            this._logger.info(`data:: ${doc.appointmentlocationId} -- ${JSON.stringify(data)}`)
            const sp_getApiList:any = await this.runMsSP(pool_name, get_api_mssql_config_server, GET_API_LIST_SP, data);
            MsPools[GET_API_LIST_SP] = {};
            if (!sp_getApiList?.recordsets?.[0]?.[0]) {
                return [{ error: true }, { 'getApiListSP ~ GET_API_LIST_SP:': GET_API_LIST_SP, 'MsPools[GET_API_LIST_SP][last_date]:': MsPools[GET_API_LIST_SP]['last_date'], 'sp_getApiList.recordsets[0]:': sp_getApiList.recordsets[0] }];
    
            }
            MsPools[GET_API_LIST_SP]['apiList'] = sp_getApiList.recordsets[0] || null;
            MsPools[GET_API_LIST_SP]['last_date'] = new Date();
            return MsPools[GET_API_LIST_SP]['apiList'];
        } catch (error) {
            this._logger.info(`Error: getApiListSp:: ${doc.appointmentlocationId} -- ${JSON.stringify(error)} -- ${error}`);
            throw error;
        }
    }

    async getMsPool(name: string, config: MsSQLConfig): Promise<sql.ConnectionPool>{
        if (!Object.keys(MsPools).includes(name)) {
            const pool = new sql.ConnectionPool(config);
            const close = pool.close.bind(pool);
            pool.close = (...args: any[]): any => {
                delete MsPools[name];
                return close(...args);
            }
            await pool.connect();
            MsPools[name] = pool;
        }
        return MsPools[name];
    }

    async runMsQuery(pool: sql.ConnectionPool, query: string): Promise<any[]>{
        return new Promise((resolve, reject) => {
            const request = new sql.Request(pool);
            request.query(query, (err: any, result: any) => {
                if (err) reject(err);
                console.log(result)
                resolve(result.recordsets);
            })
        });
    }

    runMsSP(pool_name: string, pool_config: MsSQLConfig, sp: string, params: Params = {}): Promise<RunSPResult> {
        return new Promise((resolve, reject) => {
        getMsPool(pool_name, pool_config)
            .then(pool => {
                const request = new sql.Request(pool);
                Object.keys(params).forEach(async k => {
                    if (typeof params[k] == 'string') {
                        request.input(k, sql.NVarChar, params[k])
                    }
    
                    if (typeof params[k] == 'number') {
                        request.input(k, sql.Int, params[k])
                    }
    
                    if (typeof params[k] == 'object') {
                        request.input(k, sql.TVP, params[k])
                    }
                });
    
                request.execute(sp, (err: any, result: RunSPResult) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
            .catch(err => {
                console.log("ERROR runMsSP: ", err);
                reject(err);
            })
    })
}

getdentrixWebEhrMappingWithMSTables (type:any) {
    const tableName = DENTRIX_WEB_EHR_API_MAPPING_WITH_DB[type];
    if (!tableName) {
        return type
    }
    return tableName;
}

    async getWebEHRDoc(apptlocid: string, _type: string, isMulti = false) {
        let statement = "SELECT t.* " +
            "FROM `" + COUCHBASE_CONSTANTS.COLLECTIONS.DEFAULT + "` AS t " +
            "WHERE t._type = '" + _type + "' AND t.appointmentlocation.`$ref` ='" + apptlocid + "'";
        let queryInfo: any = await this._couchbaseHelperService.runQuery(statement);
        if (isMulti) {
            return queryInfo?.data ?? [];
        } else {
            return queryInfo.data[0] ?? {};
        }
    }
}
// used in this file only
// Get Array values
export const getSubTableKeysAndData = async (tableName : any, responseData = []) => {
    try {
        const keys = [];
        const returnData = {};
        if (!responseData.length) {
            return { tableKeys: [], returnData: {} };
        }

        // fix for feeschedules
        if (tableName === 'feescheduleranges') {
            keys.push('items');
        }

        for (let entry of responseData) {
            for (let [key, value] of Object.entries(entry)) {
                if (Array.isArray(value)) {
                    if (!keys.includes(key)) {
                        keys.push(key);
                    }
                }
            }
        }

        for (let data of responseData) {
            if (tableName === 'feescheduleranges') {
                data.items = Object.keys(data.items).map(key => ({
                    practiceProcedureId: key,
                    fee: data['items'][key]
                }))
            }
            for (let key of keys) {
                if (data[key] && Array.isArray(data[key])) {
                    const objKey = `${tableName}_${key.toLowerCase()}`;
                    let primary = tableName.toLowerCase();
                    if (primary[primary.length - 1] == 's') {
                        primary = primary.slice(0, -1).toLowerCase();
                    }
                    data[key] = data[key].map(item => ({ ...item, [primary + 'id']: data.id }))
                    if (!data[key].length) {
                        data[key].push(
                            {
                                [primary + 'id']: data.id,
                                insert_update_delete: 5,
                                is_temp: true
                            }
                        )
                    }
                    if (returnData[objKey]) {
                        returnData[objKey] = [...returnData[objKey], ...data[key]]
                    } else {
                        returnData[objKey] = [...data[key]]
                    }
                }
            }
        }
        const tableKeys = keys.map(d => ({ tablekey: `${tableName}_${d.toLowerCase()}`, key: d }));
        return { tableKeys, returnData }
    } catch (error) {
        console.log('ERROR getSubTableKeys: ', error);
        throw error;
    }
}
// used in appointment.service.ts
//To insert Data only
export const insertDataIntoDB = async (api, params, data = []) => {
    try {
        const tableName = api.TableName.toLowerCase()
        let { Sync_Client_LocId, columns, pool, apiList, time_zone, operation } = params;
        let primarySP = process.env.INSERT_DATA_SP;
        primarySP = primarySP.replaceAll('TABLENAME', api.TableName);
        primarySP = primarySP.replaceAll('SALUTATION', api.Salutation);
        const modifiedData = await modifyData(data, columns, Sync_Client_LocId, api.TableName, time_zone,{}, operation);
        //console.log("🚀 ~ insertDataIntoDB ~ operation: %j", operation)
        console.log("🚀 ~ modifiedData: %j", modifiedData.length)
        // console.log("🚀 ~~ pool : %j", pool)
        // console.log("🚀 ~ columns : %j ", columns)
        // console.log("🚀 ~ primarySP : %j ", primarySP)
        console.log("🚀 ~ TableName : %j ", api.TableName)
        // return
        await insertTableData(pool, modifiedData, columns, primarySP, api.TableName);

        const { tableKeys, returnData } = await getSubTableKeysAndData(tableName, data);

        if (tableKeys.length) {
            for (const { key, tablekey } of tableKeys) {
                const newAPi = apiList.find(a => a.TableName.toLowerCase() === tablekey);
                if (!newAPi) {
                    continue;
                }
                if (!returnData[tablekey].length) {
                    continue;
                }
                let columnData = await getColumnsSP(pool.config.server, pool.config, { Salutation: newAPi.Salutation, TableName: newAPi.TableName });
                const modifiedData = await modifyData(returnData[tablekey], columnData, Sync_Client_LocId, key, time_zone, {}, 'UNKNOWN');
                let secondarySP = process.env.INSERT_DATA_SP;
                secondarySP = secondarySP.replaceAll('TABLENAME', newAPi.TableName);
                secondarySP = secondarySP.replaceAll('SALUTATION', newAPi.Salutation);
                await insertTableData(pool, modifiedData, columnData, secondarySP, newAPi.TableName);
            }
        }
        return;
    } catch (error) {
        console.log("🚀 ~ insertDataIntoDB ~ error:", error)
        throw error;
    }
}

export const removeDataDirectSP = async (api, pool, data) => {
    let sp = process.env.REMOVE_DATA_SP;
    sp = sp.replaceAll('TABLENAME', api.TableName);
    sp = sp.replaceAll('SALUTATION', api.Salutation);

    let resp = await runSPByPool(pool, sp, data, false);
    console.log("🚀 ~ removeDataDirectSP ~ resp: %j", resp)
    return resp;
}
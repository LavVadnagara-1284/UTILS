import { Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { CouchbaseHelperService } from "@adittech/couchbase-nest";
import * as uuid from "uuid";
// import * as moment from "moment";
const moment = require('moment-timezone');
import { COUCHBASE_CONSTANTS } from "../common/constants/couchbase-config";
import { LoggerHelperService } from '@adittech/logger-nest';
import { ProviderCustomHoursService } from "./customhours.service";
import { CB_PROV_QUERIES } from './queries.service';

@Injectable()
export class ProviderService {
  constructor(private couchbaseHelperService: CouchbaseHelperService, private _logger: LoggerHelperService, private pCHourService: ProviderCustomHoursService) { }

  async create(createProviderDto: CreateProviderDto, apptlocdoc: any, mixproviderhours: any, timezone: string) {
    let client_pro_ehr_id = '' + createProviderDto.id;
    //getofficehours
    // if (mixproviderhours) {
    //   providerhour = await this.mapProviderHours(mixproviderhours, timezone)
    // }
    //getofficehours
    let providerInfo: any = await this.findOne(client_pro_ehr_id, apptlocdoc._id);
    if (providerInfo && providerInfo._id) {
      //Exist so Update from here
      let updateResp: any = await this.update(createProviderDto, apptlocdoc);
      // ProviderHours Calc
      // await this.manageProviderHours(createProviderDto.customHours, providerInfo, apptlocdoc, timezone)
      // ProviderHours Calc
      let finalRes = (updateResp.status) ? { msg: `${client_pro_ehr_id} updated successfully!` } : { msg: `${client_pro_ehr_id} not updated successfully due to internal server error!`, data: updateResp };
      this._logger.info('Provider Updated >>> ' + JSON.stringify(finalRes));
      return finalRes;
    } else {
      let providerObj: any = await this.prepareProviderDoc(createProviderDto, apptlocdoc, null);
      let resp: any = await this.couchbaseHelperService.addDocument(`${COUCHBASE_CONSTANTS.KEYS.PROVIDER}|${providerObj._id}`, providerObj);
      // ProviderHours Calc
      await this.manageProviderHours(createProviderDto.customHours, providerObj, apptlocdoc, timezone)
      // ProviderHours Calc
      let finalRes = (resp.status) ? { msg: `${providerObj._id} created successfully!`, id: providerObj._id } : { msg: `${providerObj._id} not created successfully due to internal server error!`, data: resp };
      this._logger.info('Provider created >>> ' + JSON.stringify(finalRes));
      return finalRes;
    }
  }

  async findOne(id: string, apptloc: string) {
    let statement = `SELECT t.* FROM ${process.env.COUCHBASE_DEFAULT_SCOPE_NAME} AS t WHERE t._type = '${COUCHBASE_CONSTANTS.KEYS.PROVIDER}' AND t.provider_ehr_id = '${id}' ` + 'AND t.locations.`$ref` =' + `'${apptloc}' limit 1`;
    let providerInfo: any = await this.couchbaseHelperService.runQuery(statement);
    return (providerInfo && providerInfo.data && providerInfo.data.length > 0) ? providerInfo.data[0] : {};
  }

  async findOneViaCB(id: string) {
    try {
      let docs: any = await this.couchbaseHelperService.getDocument(`${COUCHBASE_CONSTANTS.KEYS.PROVIDER}|${id}`)
      return (docs && docs.data) ? docs.data : 'No Data Found!';
    } catch (error) {
      console.error('Error in findOneViaCB:', error);
      throw error;
    }
  }

  async update(createProviderDto: CreateProviderDto, foundDoc: any) {
    let updateProviderObj = this.prepareUpdateProviderDoc(createProviderDto, foundDoc);
    let updateResp: any = await this.couchbaseHelperService.upsertDocument(`${COUCHBASE_CONSTANTS.KEYS.PROVIDER}|${foundDoc._id}`, updateProviderObj);
    return updateResp;
  }


// prepareProviderDoc(requestData: any, apptLocDoc: any, existingDoc: any) {
//   try {
//     let providerDoc: any = {
//       _type: COUCHBASE_CONSTANTS.KEYS.PROVIDER,
//       _id: (existingDoc && existingDoc._id) ? existingDoc._id : uuid.v4(),
//       first_name: requestData.firstName || '',
//       last_name: requestData.lastName || '',
//       display_name: requestData.firstName + ' ' + requestData.lastName,
//       ehr_sync_date: moment().valueOf(),
//       accredation: [],
//       bio: '',
//       education: [],
//       gender: '',
//       image: '',
//       is_deleted: false,
//       ehr_status: requestData.active,
//       is_active: false,
//       languages: [],
//       membership: [],
//       npi: requestData.npi,
//       officehour: providerhour || {},
//       provider_ehr_id: '' + requestData.id,
//       provider_localdb_id: '',
//       specialities: (requestData.specialty && requestData.specialty.name) ? [{ name: requestData.specialty.name }] : [],
//       treatment_max_age: '',
//       treatment_min_age: '',
//       is_primary_provider: requestData.isPrimaryProvider || false,
//       locations: apptLocDoc && this._getRefObj(COUCHBASE_CONSTANTS.KEYS.APPOINTMENT_LOCATION, apptLocDoc._id),
//       organization: apptLocDoc.organization,
//       created_by: apptLocDoc.owner,
//       created_at: moment().valueOf(),
//       deleted_at: null
//     };
//     return providerDoc;
//   } catch (error) {
//     this._logger.error('Provider ERR:>>> ' + JSON.stringify(error));
//     throw error;
//   }
// }

  prepareProviderDoc(requestData: any, apptLocDoc: any, existingDoc: any) {
    try {
      if (existingDoc && existingDoc._id) {
        this.prepareUpdateProviderDoc(requestData, existingDoc)
      } else {
        this.createNewProviderDoc(requestData, apptLocDoc);
      }
    } catch (error) {
      this._logger.error('Provider ERR:>>> ' + JSON.stringify(error));
      throw error;
    }
  }

  createNewProviderDoc(requestData: any, apptLocDoc: any) {
    return {
      _type: COUCHBASE_CONSTANTS.KEYS.PROVIDER,
      _id: uuid.v4(),
      first_name: requestData.firstName || '',
      last_name: requestData.lastName || '',
      display_name: `${requestData.firstName || ''} ${requestData.lastName || ''}`,
      ehr_sync_date: moment().valueOf(),
      accredation: [],
      bio: '',
      education: [],
      gender: '',
      image: '',
      is_deleted: false,
      ehr_status: requestData.active,
      is_active: false,
      languages: [],
      membership: [],
      npi: requestData.npi,
      officehour: {
        "Friday": [],
        "Monday": [],
        "Saturday": [],
        "Sunday": [],
        "Thursday": [],
        "Tuesday": [],
        "Wednesday": []
    },
      provider_ehr_id: '' + requestData.id,
      provider_localdb_id: '',
      specialities: (requestData.specialty && requestData.specialty.name) ? [{ name: requestData.specialty.name }] : [],
      treatment_max_age: '',
      treatment_min_age: '',
      is_primary_provider: requestData.isPrimaryProvider || false,
      locations: apptLocDoc && this._getRefObj(COUCHBASE_CONSTANTS.KEYS.APPOINTMENT_LOCATION, apptLocDoc._id),
      organization: apptLocDoc.organization,
      created_by: apptLocDoc.owner,
      created_at: moment().valueOf(),
      deleted_at: null
    };
  }

  prepareUpdateProviderDoc(reqData: any, existingData: any) {
    let updateData = {
      ...existingData
    };
    let fieldsToUpdate = Object.keys(reqData);
    fieldsToUpdate.map((item) => {
      updateData[item] = reqData[item]
    })
    return updateData;
  }

  _getRefObj(type: string, id: string) {
    return {
      _type: type,
      $ref: id,
    };
  }

  async mapProviderHours(providerHours: any[], timezone: string) {
    const locationSlots = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
  
    try {
      // Loop over each entry in providerHours
      for (const hour of providerHours) {
        const { OperatingDay, OpenFrom, OpenTo, IsOperatingDay } = hour;
  
        // Only map if the day is an operating day
        if (IsOperatingDay) {
          // Format the opening and closing times to HH:mm using moment with the specified timezone
          const formattedOpenFrom = moment.tz(`${OpenFrom} ${hour.OpenFromAmPm}`, 'hh:mm a', timezone).format('HH:mm');
          const formattedOpenTo = moment.tz(`${OpenTo} ${hour.OpenToAmPm}`, 'hh:mm a', timezone).format('HH:mm');
  
          // Push to the correct day in locationSlots
          locationSlots[OperatingDay].push({
            start: formattedOpenFrom,
            end: formattedOpenTo,
          });
        }
      }
  
      return locationSlots;
    } catch (error) {
      console.log(error);
    }
  }
  

  async manageProviderHours(customHours, providerInfo, apptlocdoc, timezone) {
    //To get opTime
    let getOpTime: any = await this.pCHourService.getOpTime(customHours, timezone);
    //To get opTime

    //Restrict blank optime entries in providerhour
    if (Object.keys(getOpTime).length <= 0) {
      return true;
    }
    //Restrict blank optime entries in providerhour

    // need to add customhours for all operatories as discussed with Yash/Bharatbhai

    // let allOperatoriesQuery: any = await CB_PROV_QUERIES.GET_OPERATORY('', apptlocdoc._id)
    // let allOperatories: any[] = await this.pCHourService.ExeQuery(allOperatoriesQuery, true);
    // if (allOperatories.length > 0) {
    //   allOperatories.map(async (opData: any) => {

        //Get Providerhour if exists
        let proHourQuery: any = await CB_PROV_QUERIES.GET_PROVIDERHOURS(providerInfo.provider_ehr_id, apptlocdoc._id);
        let proHourInfo: any = await this.pCHourService.ExeQuery(proHourQuery);
        //Get Providerhour if exists

        //Add or update providerhours
        let hoursadded = await this.pCHourService.newProviderCustomHourCreate(providerInfo, getOpTime, apptlocdoc, proHourInfo);

        // need to add customhours for all operatories as discussed with Yash/Bharatbhai
        return hoursadded;
    //   })
    // }
    return true;
  }

  // async getProviderHours(providerId:string,mixproviderhours:any){
  //   let mappedProviderHours = {}
  //   let defaultProvidersHour = mixproviderhours.find(ph => ph.isDefaultSchedule);
  //   if (defaultProvidersHour && defaultProvidersHour['days']) {
  //     mappedProviderHours = await this.mapProviderHours(defaultProvidersHour['days']);
  //   } else {
  //     console.log(`Default provider hour not found!  provider id: ${providerId}`)
  //   }
  //   return mappedProviderHours;
  // }

  // async mapProviderHours(unMappedProviderHours) {
  //   let officehour = {};
  //   for (let weekDay of Object.keys(unMappedProviderHours)) {
  //     // convert titlecase
  //     let day = weekDay.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  //     officehour[day] = [];

  //     if (!unMappedProviderHours[weekDay] || !unMappedProviderHours[weekDay].length) {
  //       continue;
  //     }

  //     for (const week of unMappedProviderHours[weekDay]) {
  //       if (!week.hours || !week.hours.length) {
  //         continue;
  //       }

  //       for (let hours of week.hours) {
  //         officehour[day].push({
  //           start: hours['startTime'],
  //           end: hours['endTime']
  //         })
  //       }
  //     }
  //   }
  //   return officehour;
  // }

  async remove(providerId: string, requestData: any) {
    try {
      let provider_statement = await CB_PROV_QUERIES.GET_PROVIDER(providerId, requestData.appointmentlocation)
      let providerInfo: any = await this.couchbaseHelperService.runQuery(provider_statement);
      if (providerId && providerInfo && providerInfo.data && providerInfo.data[0]) {
        const id = providerInfo.data[0]._id
        let foundDoc: any = await this.findOneById(id);
        if (foundDoc) {
          let updateProviderdocDto = { is_deleted: true }
          let providerDocObj = this.prepareUpdateProviderDoc(updateProviderdocDto, foundDoc)
          let updateResp: any = await this.couchbaseHelperService.upsertDocument(`${COUCHBASE_CONSTANTS.KEYS.PROVIDER}|${id}`, providerDocObj);
          let finalRes = (updateResp.status) ? { msg: `${id} updated successfully!` } : { msg: `${id} not updated successfully due to internal server error!`, data: updateResp };
          return finalRes;
        }
      } else {
        return 'Doc not found!'
      }
    } catch (error) {
      this._logger.error('Error in remove Provider:: >> ' + JSON.stringify(error));
      throw error; // Rethrow the error to propagate it to the caller
    }
  }

  async findOneById(id: string) {
    try {
      let docs: any = await this.couchbaseHelperService.getDocument(`${COUCHBASE_CONSTANTS.KEYS.PROVIDER}|${id}`)
      return (docs && docs.data) ? docs.data : 'No Data Found!';
    } catch (error) {
      this._logger.error('Error in findOne Operatory:: >> ' + JSON.stringify(error));
      throw error; // Rethrow the error to propagate it to the caller
    }
  }
}

____________________________________________________________________________________________________________

       
    //    beta & live channel are difference//

    //    process.env,envvv === "live"{
    //     URL = CONSTANTS.livegChatError.Eyefinity;
    //    }ELSE{
    //     URL = BETAQ;
    //    }
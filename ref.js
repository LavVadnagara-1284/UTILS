=> For reference purpose:
{

  "id": "a9d05186-74bd-4249-ac2b-a35f7534935a",
    "name": "OrgId",

      "Location Ids": [
        {
          "id": "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948",
          "name": "Austin",
        },
        {
          "id": "22bffbc8-b255-4679-a5a9-7d2326ec2549",
          "name": "Dallas",
        },
        {
          "id": "869f9155-c174-4f94-b0e1-0ee8d84f3b2d",
          "name": "Houston",
        }
      ]

}

user - list.component.ts > environment.isDemoApp

export const Data = {
  get: {
    dental: {
      all: {},
      // austin
      "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948": {},
      // dallas
      "22bffbc8-b255-4679-a5a9-7d2326ec2549": {},
      // houston
      "869f9155-c174-4f94-b0e1-0ee8d84f3b2d": {}
    }
  },
  post: {
    dental: {
      all: {},
      // austin
      "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948": {},
      // dallas
      "22bffbc8-b255-4679-a5a9-7d2326ec2549": {},
      // houston
      "869f9155-c174-4f94-b0e1-0ee8d84f3b2d": {}
    }
  },
  put: {
    dental: {
      all: {},
      // austin
      "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948": {},
      // dallas
      "22bffbc8-b255-4679-a5a9-7d2326ec2549": {},
      // houston
      "869f9155-c174-4f94-b0e1-0ee8d84f3b2d": {}
    }
  },
  delete: {
    dental: {
      all: {},
      // austin
      "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948": {},
      // dallas
      "22bffbc8-b255-4679-a5a9-7d2326ec2549": {},
      // houston
      "869f9155-c174-4f94-b0e1-0ee8d84f3b2d": {}
    }
  }
}

/*
 
  "018e6525-a501-ba0f-c381-d330864c7601": {  Ruth Canal  },
  "028e6525-a501-ba0f-c381-d330864c7602": {  Eve Namel  },
  "038e6525-a501-ba0f-c381-d330864c7603": {  DAN TURE  },
  "048e6525-a501-ba0f-c381-d330864c7604": {  PERRY O'DONTIST  },
  "058e6525-a501-ba0f-c381-d330864c7605": {  PEARL WHITE  },
  "068e6525-a501-ba0f-c381-d330864c7606": {  MILEY SMILEY  },
  "078e6525-a501-ba0f-c381-d330864c7607": {  INA CISOR  },
  "088e6525-a501-ba0f-c381-d330864c7608": {  ANNIE STESHIA  },
  "098e6525-a501-ba0f-c381-d330864c7609": {  SARAH BELLUM  },
  "108e6525-a501-ba0f-c381-d330864c7610": {  JALEN GREEN  },
  "118e6525-a501-ba0f-c381-d330864c7611": {  ERNEST FLOSSY  },
  "128e6525-a501-ba0f-c381-d330864c7612": {  PHIL LING  },
  "138e6525-a501-ba0f-c381-d330864c7613": {  MOE LARS  },
  "148e6525-a501-ba0f-c381-d330864c7614": {  JOE ADAM  },
  "158e6525-a501-ba0f-c381-d330864c7615": {  MANDI BILL  },
 
*/

{
  "018e6525-a501-ba0f-c381-d330864c7601": { "Ruth Canal" },
  "028e6525-a501-ba0f-c381-d330864c7602": { "Eve Namel" },
  "038e6525-a501-ba0f-c381-d330864c7603": { "DAN TURE" },
  "048e6525-a501-ba0f-c381-d330864c7604": { "PERRY O'DONTIST" },
  "058e6525-a501-ba0f-c381-d330864c7605": { "PEARL WHITE" },
  "068e6525-a501-ba0f-c381-d330864c7606": { "MILEY SMILEY" },
  "078e6525-a501-ba0f-c381-d330864c7607": { "INA CISOR" },
  "088e6525-a501-ba0f-c381-d330864c7608": { "ANNIE STESHIA" },
  "098e6525-a501-ba0f-c381-d330864c7609": { "SARAH BELLUM" },
  "108e6525-a501-ba0f-c381-d330864c7610": { "JALEN GREEN" },
  "118e6525-a501-ba0f-c381-d330864c7611": { "ERNEST FLOSSY" },
  "128e6525-a501-ba0f-c381-d330864c7612": { "PHIL LING" },
  "138e6525-a501-ba0f-c381-d330864c7613": { "MOE LARS" },
  "148e6525-a501-ba0f-c381-d330864c7614": { "JOE ADAM" },
  "158e6525-a501-ba0f-c381-d330864c7615": { "MANDI BILL" },
  "168e6525-a501-ba0f-c381-d330864c7616": { "GINGER VITIS" },
}

{
  // console.info(`\n** Log Check start **\n--------------------------------------------------------------------------------\nActual URL: ${url}\n--------------------------------------------------------------------------------\nURL Parts: ${urlParts.join(' | ')}\n--------------------------------------------------------------------------------\nModule: ${moduleKey}\nMethod: ${method}\nPracticeIndustry: ${practiceIndustry}\nLocationId: ${locationId}\nLocation Name: ${foundLocation?.name || "all"}\n--------------------------------------------------------------------------------\nEndpoint: ${methodKey}\n--------------------------------------------------------------------------------`);

  // console.info(`Trying path 1: ${locationId} - ${methodKey}\nValue: `, this.mockResponses?.[moduleKey]?.[method]?.[practiceIndustry]?.[locationId]?.[methodKey]);
  // console.info(`Trying path 2: all - ${methodKey}\nValue: `, this.mockResponses?.[moduleKey]?.[method]?.[this.defaultPracticeIndustry]?.["all"]?.[methodKey]);

  // return (this.mockResponses?.[moduleKey]?.[method]?.[practiceIndustry]?.[locationId]?.[methodKey] || this.mockResponses?.[moduleKey]?.[method]?.[this.defaultPracticeIndustry]?.["all"]?.[methodKey] || null);

  console.info("\n***** Log Check Start *****");
  console.groupCollapsed("=> Mock Request Analysis -", url);
  console.info(`URL Parts: ${urlParts.join(' | ')}\nModule Key: ${moduleKey}\nMethod: ${method}\nPractice Industry: ${practiceIndustry}\nLocation ID: ${locationId}\nLocation Name: ${foundLocation?.name || "all"}`);

  const valuePath1 = this.mockResponses?.[moduleKey]?.[method]?.[practiceIndustry]?.[locationId]?.[methodKey];
  const valuePath2 = this.mockResponses?.[moduleKey]?.[method]?.[this.defaultPracticeIndustry]?.["all"]?.[methodKey];

  console.info(`Path 1: [ ${practiceIndustry} → ${locationId} → ${methodKey} ]`, "\nValue:", valuePath1, `\nPath 2: [ ${this.defaultPracticeIndustry} → all → ${methodKey} ]`, "\nValue:", valuePath2);
  console.info("URL:\n", url, "\nEndpoint:\n", methodKey);
  console.groupEnd();

  return valuePath1 || valuePath2 || null;
}

console.info('Mock Response:', mockResponse, "\n***** Log Check End *****\n\n");
console.info('Mock Response:', mockResponse);

  => auth interceptor
{
  import { Injectable } from '@angular/core';
  import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
  import { Observable, of } from 'rxjs';
  import { LocalStorageService } from './local-storage.service';
  import { CommonMethodService } from './../../providers/common-method.service';
  import { default as commonmessage } from './../../../../src/common.message';
  import { catchError, tap } from 'rxjs/operators';
  import { AccessDeniedService } from 'src/app/access-denied/access-denied.service';
  import { CommonHttpService } from './common-http.service';
  import { Router } from '@angular/router';
  import { environment } from 'src/environments/environment';
  declare let window
  import { DemoUrlService } from "./demo-url.service";

  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {

    authHeader: any = "";
    constructor(
      private _localStorageService: LocalStorageService,
      private _commonMethodService: CommonMethodService,
      private accessDeniedService: AccessDeniedService,
      private commonHttpService: CommonHttpService,
      private _route: Router,
      private _demoUrlService: DemoUrlService
    ) {
    }

    isDemoApp = environment.isDemoApp;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if ((req.url).indexOf("auth") == -1 || (req.url).indexOf("/auth/session") > -1) {
        this.authHeader = this._localStorageService.getFrontAuthorizationToken();
      }
      const apiUrls = [
        environment.apiUrl,
        environment.internalchatApiUrl,
        environment.arApiUrl,
        environment.pozativeApiUrl,
        environment.payApiUrl,
        environment.portalApiUrl,
        environment.schedulerApiUrl,
        environment.aditcarrierApiUrl,
        environment.aditpdfgenerateApiUrl,
        environment.auditlogsApiUrl,
        environment.ehrGetStartedApi,
        environment.ehrcurvesyncApi,
        environment.adminAPiUrl,
        environment.apps.financing.api_url
      ];

      let urlToVerify = req.url;
      apiUrls.forEach(apiUrl => {
        urlToVerify = urlToVerify.replace(apiUrl + '/', '');
      });

      // console.info("urlToVerify::::::::", urlToVerify); 
      if (this.isDemoApp && this._demoUrlService.isDemoUrl(urlToVerify)) {
        if (urlToVerify === "auth/login") {
          const isAuthenticated = this._demoUrlService.isUserAuthenticated(req.body);
          if (!isAuthenticated) {
            return of(
              new HttpResponse({
                status: 401,
                body: {
                  "status": false,
                  "message": "Incorrect password entered. Please try again.",
                  "error": 401,
                  "data": null
                }
              })
            );
          }
        }
        const mockResponse = this._demoUrlService.getMockResponseForRequest(urlToVerify, req.method.toLowerCase(), req);
        if (!mockResponse) {
          // console.info("No Mock Response found for", urlToVerify);
        }
        console.info('Mock Response:', mockResponse, "\n***** Log Check End *****\n\n");
        this.commonHttpService.hideCommonLoader(); // Need to remove
        return of(
          new HttpResponse({
            status: 200,
            body: mockResponse
          })
        );
      }

      let authReq: any = req;
      if (this.authHeader && this.authHeader != "") {
        authReq = req.clone({
          setHeaders: {
            'Authorization': `${this.authHeader}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate, post-check = 0, pre - check=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'x-source': window.adit ? 'desktopapp' : ''
          }
        });
      } else {
        authReq = req.clone({
          setHeaders: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, post-check = 0, pre - check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }

      try {
        authReq.params.map.delete('organization');
      } catch (error) {

      }
      return next.handle(authReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            const body = event.body;

            // Case 1: Direct code on root body
            if (body?.code === 13 || body?.code === 401) {
              const userId = this._localStorageService.getFrontLoggedInUserId();
              if (userId) {
                this._localStorageService.setLastLoggedInUserId(userId);
              }
              this._localStorageService.impersonateLogout();
              this._commonMethodService.showErrorToaster(body.message || "Your Session Has Expired.", "", 7000);
              this._route.navigate(['auth/login']);
              return;
            }

            // Case 2: Code nested under data.<operationName>
            if (body?.data && typeof body.data === 'object') {
              const responses = Object.values(body.data);

              for (const res of responses) {
                if (res && typeof res === 'object' && 'code' in res) {
                  const result = res as { code: number; message?: string; data?: any };

                  switch (result.code) {
                    case 13:
                    case 401:
                      const userId = this._localStorageService.getFrontLoggedInUserId();
                      if (userId) {
                        this._localStorageService.setLastLoggedInUserId(userId);
                      }
                      this._localStorageService.impersonateLogout();
                      this._commonMethodService.showErrorToaster(result.message || "Your Session Has Expired.", "", 7000);
                      this._route.navigate(['auth/login']);
                      return;

                    case 14:
                      this.accessDeniedService.accessDenied({ status: true, ip: result?.data?.ip });
                      this.commonHttpService.hideCommonLoader();
                      break;

                    default:
                      break;
                  }
                }
              }
            }
          }
        }, error => {
          console.info("interceptor error::::::::", error.message);
        })
      );

    }
  }
}

=> demo url service

{
  import { Injectable } from "@angular/core";

  import { LocalStorageService } from "./local-storage.service";
  import { ConstantsService } from "../../providers/constants.service";
  import { authData } from "src/demo/data/auth";
  import { locationData } from "src/demo/data/location";
  import { userData } from "src/demo/data/user";
  import { dashboardData } from "src/demo/data/dashboard";
  import { organizationData } from "src/demo/data/organization";
  import { notificationData } from "src/demo/data/notification";
  import { releasenoteData } from "src/demo/data/releasenote";
  import { patientCardData } from "src/demo/data/patient-card";
  import { zohoHelpAccessData } from "src/demo/data/zohohelpaccess";
  import { getLocationsForSoftphoneData } from "src/demo/data/getlocationsforsoftphone";
  import { appointmentLocationsData } from "src/demo/data/appointmentlocations";
  import { chatgroupData } from "src/demo/data/chatgroup";
  import { organizationv2Data } from "src/demo/data/organizationv2";
  import { appointmentData } from "src/demo/data/appointment";
  import { getcalloverridelocationsData } from "src/demo/data/getcalloverridelocations";
  import { patientFormData } from "src/demo/data/patient-form";
  import { engageData } from "src/demo/data/engage";
  import { practiceanalyticsData } from "src/demo/data/practiceanalytics";
  import { emailcampaignData } from "src/demo/data/emailcampaign";
  import { getActiveLocationOfAppByAppNameData } from "src/demo/data/getactivelocationofappbyappname";
  import { optionData } from "src/demo/data/option";
  import { quickTextData } from "src/demo/data/quickText";
  import { reportData } from "src/demo/data/report";
  import { aditPayData } from "src/demo/data/aditpay";
  import { getRestrictedIpData } from "src/demo/data/getrestrictedip";
  import { practiceIndustryListData } from "src/demo/data/practiceindustrylist";
  import { settingLocationV2Data } from "src/demo/data/settinglocationv2";
  import { auditLogData } from "src/demo/data/auditlog";
  import { appData } from "src/demo/data/appData";
  import { outstandingPaymentData } from "src/demo/data/outstandingpayment";
  import { getCustomerDetailsData } from "src/demo/data/getcustomerdetails";
  import { getallinvoiceData } from "src/demo/data/getallinvoice";
  import { invoiceData } from "src/demo/data/invoice";
  import { getAllLocationInvoiceData } from "src/demo/data/getalllocationinvoice";
  import { getLocationInvoiceData } from "src/demo/data/getlocationinvoice";
  import { restrictOrganizationIpData } from "src/demo/data/restrict-organization-ip";
  import { phoneModelData } from "src/demo/data/phonemodel";
  import { settingLocationData } from "src/demo/data/settinglocation";
  import { getOutgoingNumberSettingDetailsData } from "src/demo/data/getoutgoingnumbersettingdetails";
  import { tendlcData } from "src/demo/data/tendlc";
  import { settingsData } from "src/demo/data/settings";
  import { facebookadsData } from "src/demo/data/facebookads";
  import { systemroleData } from "src/demo/data/systemrole";
  import { numberData } from "src/demo/data/number";
  import { numbersData } from "src/demo/data/numbers";
  import { callflowData } from "src/demo/data/callflow";
  import { blockcallerData } from "src/demo/data/blockcaller";
  import { holdmusicData } from "src/demo/data/holdmusic";
  import { getPrefixData } from "src/demo/data/get-prefix";
  import { voicemailoverrideData } from "src/demo/data/voicemailoverride";
  import { vmboxesData } from "src/demo/data/vmboxes";
  import { lineData } from "src/demo/data/line";
  import { audioData } from "src/demo/data/audio";
  import { roleData } from "src/demo/data/role";
  import { timeZoneData } from "src/demo/data/timezone";
  import { userv2Data } from "src/demo/data/userv2";
  import { createNewCustomerData } from "src/demo/data/createNewCustomer";
  import { updateBillingTypeData } from "src/demo/data/updatebillingtype";
  import { tenantData } from "src/demo/data/tenantdata";
  import { chatData } from "src/demo/data/chat";
  import { appointmentlocationData } from "src/demo/data/appointmentlocation";
  import { videoData } from "src/demo/data/video";
  import { communicationData } from "src/demo/data/communication";
  import { optinData } from "src/demo/data/optin";
  import { financingData } from "src/demo/data/financing";
  import { callData } from 'src/demo/data/call';
  import { listfaxData } from 'src/demo/data/listfax'
  import { ContentObserver } from "@angular/cdk/observers";
  import { compileDeferResolverFunction } from "@angular/compiler";
  import { listengagenotificationData } from "src/demo/data/listengagenotification";
  import { pozativeData } from "src/demo/data/pozative";
  import { addengagenotificationData } from "src/demo/data/addengagenotification";
  import { tagData } from "src/demo/data/tag";
  import { summariesData } from "src/demo/data/summaries";
  import { saveRestrictedIpData } from "src/demo/data/save-restricted-ip";
  import { deleteRestrictedIpData } from "src/demo/data/delete-restricted-ip";
  import { patientesData } from "src/demo/data/patientes";
  import { patientpreferenceData } from "src/demo/data/patientpreference";
  import { getfilterData } from "src/demo/data/getfilter";
  import { getpatientlistbytypeesData } from "src/demo/data/getpatientlistbytypees";
  import { getpatientlistbytypenewesData } from "src/demo/data/getpatientlistbytypenewes";
  import { getoverduepatientschartsdataesData } from "src/demo/data/getoverduepatientschartsdataes";
  import { getpatientcollectionchartdataData } from "src/demo/data/getpatientcollectionchartdata";
  import { getpatientlistbytypecollectionData } from "src/demo/data/getpatientlistbytypecollection";
  import { getisEHRConnectedLocationListData } from "src/demo/data/getisEHRConnectedLocationList";
  import { getAllSegmentsCountData } from "src/demo/data/getAllSegmentsCount";
  import { pascheduleData } from "src/demo/data/paschedule";
  import { listlinesfromuserData } from "src/demo/data/listlinesfromuser";

  export let opt_location_current_datetime = "";
  @Injectable({
    providedIn: "root",
  })
  export class DemoUrlService {
    constructor(
      private _localStorageService: LocalStorageService,
      private _constantsService: ConstantsService
    ) { }

    defaultPracticeIndustry = "dental";

    private readonly demoEndpoints: string[] = [

      "auth/login",
      "auth/session",
      "auth/zohojwttokenfetch",
      "location/appointmentlocationlist",
      "zohohelpaccess",
      "dashboard/orgapp",
      "dashboard/userapp",
      "organization/getstarted",
      "notification/getpracticeandusernotificationcount",
      "notification/app-wise-counts",
      "notification/get-updated",
      "patient-card/fetchehrsynclocations",
      "getlocationsforsoftphone",
      "appointmentlocations",
      "appointmentlocations/getinactivedefaultproviderlist",
      "chatgroup/checkunreadcount",
      "organizationv2",
      "organizationv2/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "organizationv2/getresellerrequestlist",
      "organizationv2/getresellerrequestlist/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "organization/getstarted/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "appointment/getunreadappointmentflag",
      "getcalloverridelocations",
      "patient-form/form-builder/get-org-practice-industry",
      "location/getdefault",
      "user",
      "appointmentlocation/location/ehr",
      "notification/checklogin",
      "patient-form/preference/list", // loader loading
      "patient-form/device/list",
      "patient-form/preference/detail",
      "patient-form/preference/save",
      "patient-form/treatment-plan/upload-logo",
      "patient-form/treatment-plan/upload-banner",
      "patient-form/auto-assign/get-form-assignment-detail",
      "patient-form/auto-assign/find-location-unique-id",
      "patient-form/auto-assign/get-all-auto-assign-forms",
      "patient-form/form-builder/location/ehr",
      "patient-form/auto-assign/check-pa-enabled",
      "patient-form/form-builder/get-appointment-types-for-location",
      "patient-form/auto-assign/get-treatment-code",
      "patient-form/auto-assign/save-auto-form-assignment",
      "patient-form/auto-assign/update-reminder-active-status",
      "patient-form/treatment-plan/get-preferences",
      "patient-form/treatment-plan/save-preferences",
      "patient-form/insight/get", // data - stagedata
      "patient-form/insight/get-submitted-ps-form", // loader loading
      "patient-form/auto-assign/get-all-auto-assign-forms", // loader loading
      "patient-form/get-all-forms", // payload - stagedata
      "patient-form/get-timezone-for-location", // data - stagedata
      "patient-form/get-pending-forms", // data - stagedata
      "patient-form/form-builder/get-form-populated-on-device",
      "patient-form/form-builder/get-folder-list",
      "patient-form/form-builder/update-form-location", // payload
      "patient-form/treatment-plan/organization/pa-access-check",
      "patient-form/form-builder/get-set-form-tour-details",
      "patient-form/treatment-plan/discard",
      "patient-form/treatment-plan/get",
      "patient-form/treatment-plan/get-patient",
      "patient-form/treatment-plan/get-treatment-plan-by-patient",
      "patient-form/treatment-plan/get-details",
      "patient-form/treatment-plan/export",
      'patient-form/treatment-plan/save',
      "patient-form/treatment-plan/send",
      "patient-form/treatment-plan/create", // data depened on user entry
      "patient-form/device/get", // check
      "patient-form/forms/get-ehr-last-sync",
      "patient-form/form-builder/get-form-builder-list",
      "patient-form/form-builder/get-form-library-list",
      "patient-form/form-builder/get-list-Of-disease",
      "patient-form/form-builder/get-list-Of-medications",
      "patient-form/form-builder/json-to-html",
      "patient-form/treatment-plan/mark-archive-unarchive",
      "patient-form/forms/get-patient-form-submissions-list", // not call
      "patient-form/forms/update-archive-status",
      "patient-form/pdf-export-web",
      "patient-form/treatment-plan/cancel",
      "patient-form/forms/get-form-unread-count",
      "patient-form/get-patient-details",
      "patient-form/get-quick-text-for-form-request",
      "patient-form/send-form-request",
      "patient-form/get-patient-info-for-prepopulate-prefill-fields", // response based on patient id - not defined
      "location",
      //Email Campaign start
      "emailcampaign/template",
      "emailcampaign/drip-campaign/list",
      "emailcampaign/drip-campaign/get-drip-campaign",
      "masterSegmentsCheckAndCreate",
      "emailcampaign/checkIsPreferencesSet",
      "emailcampaign/segmentLookupList",
      "emailcampaign/drip-campaign/segment-details",
      "getActiveLocationOfAppByAppName",
      "emailcampaign/drip-campaign/create-drip-campaign",
      "emailcampaign/drip-campaign/follow-up-message/create",
      "emailcampaign/drip-campaign/followup-message/get",
      "emailcampaign/drip-campaign/follow-up-message/update/save-mail-subject",
      "emailcampaign/drip-campaign/follow-up-message/update/mail-template",
      "emailcampaign/drip-campaign/follow-up-message/update/name",
      "emailcampaign/drip-campaign/clone-drip-campaign",
      "emailcampaign/campaign",
      // "emailcampaign/campaign/12f3094b-792f-4bc2-aeea-435b2b6d7f24",
      // "emailcampaign/campaign/2e9ac0c1-f204-408d-9c65-ff589bd55c26",
      // "emailcampaign/campaign/0c91aacd-25c2-4ccf-b9a1-82e5f3441219",
      // "emailcampaign/campaign/12f3094b-792f-4bc2-aeea-435b2b6d7f24",
      "emailcampaign/getCampaignDetailForReport",
      "emailcampaign/getEmailCampaingPreferencesList",
      "emailcampaign/getEmailCampaingPreferences",
      "emailcampaign/isPatientAppActive",
      "emailcampaign/mailinglist",
      "emailcampaign/getMailerDetail",
      "emailcampaign/mailerContact",
      "emailcampaign/getEmailSettingDetail",
      "getisEHRConnectedLocationList",
      "emailcampaign/replicateCampaign",
      "emailcampaign/deleteSelectedMailerContact",
      "emailcampaign/addMailingList",
      "segment",
      "emailcampaign/deleteSelectedMailerContact",
      "emailcampaign/patientEmailsbySegments",
      "emailcampaign/sendTestMail",
      "emailcampaign/addContactMailingList",
      " emailcampaign/getCampaignEmailDetail",
      //Email Campaign end
      // quick-text ---> start
      // recall-reminder - done
      // appointment-reminder - done
      // payment-request - done
      // text message - done
      // financing - done
      // form-request - in progress
      "location/ehr",
      "engage/preferenceforreminder",
      // "optin/getOptinSettings",
      "engage/sms", // payload - stage app
      "adit-pay/check-duplicate-payment",
      "adit-pay/get-request-text-pref",
      "adit-pay/billing/countries",
      "adit-pay/process-payment-intent", // payload - stage app
      "adit-pay/capture-payment-intent", // payload - stage app
      "adit-pay/process/offline-payment", // payload - stage app
      "adit-pay/payment/update-request", // payload - stage app
      "financing/location/configurations",
      "financing/location/patient-list", // depend on patient details - response pending
      "financing/send-request",
      "financing/resend-request",
      "engage/getPozativeShortUrl",
      // quick-text ---> end
      // report - start
      "findreportmonthandyear_adit",
      "published-report_adit",
      // report - end
      //Patient Module start
      // "/patient",
      // "/patientpreference/getpreference",
      // "/patientpreference/updatepreference",
      // "/patientpreference/practicelogoupload",
      // "/patientpreference/getpreferenceoverview",
      // "/patients",
      // "/getpatientlistbytype",
      // "/getpatientlistbytypees",
      // "/getpatientlistbytypenew",
      // "/getpatientlistbytypenewes",
      // "/getpatientlistbytypecollection",
      // "/getpatientcollectionchartdata",
      //Patient Module end
      //Patient Module extra start
      "/getfilter",
      //Patient Module extra end
      //Patient List start

      "patientes",
      "patientpreference/getpreference",
      "getpatientlistbytypees",
      "getpatientlistbytypenewes",
      "getpatientlistbytypecollection",
      "getpatientcollectionchartdata",
      "getoverduepatientschartsdataes",
      "getAllSegmentsCount",
      "getSegmentsList",
      "getProviderListbyAppointmentLocation",
      "getPatientsCount",
      "appointmentlocation/appientment/patient",
      "appointmentlocation/operatory/patient",
      "service/organization/appointmenttype",
      "provider",

      //Patient List end
      //----------------------------------------------------------------------------------------------
      //remaining apis start

      "appointmentlocation/getapplicationname", //get 
      "getHeaderPatientDetail", //get 
      "patient-card/fetchpatientdata", //post 
      "patient-card/fetchpatientnotespagination", //post 
      "asappatient/fetchAsapPatient", //post 
      "order/getordersbypatient", //get 
      //post

      //post with payload
      //remaining apis end
      "appointmentlocations",
      "location/appointmentlocationlist",
      "user/568e6525-e501-4a0f-8381-1330864c76c3",

      "notification/get",
      "releaseNote/list",
      "notification/getusernotificationList",
      "chatgroup/fetchusers",
      "chat/fetchchatgroups",
      "location",

      // * Start of Module => adit-pay

      // all
      "adit-pay/configure",
      "adit-pay/payouts/getpayoutsOverviewDetails",
      "adit-pay/getPaymentRequestOverviewDetailsLocationWise",
      "adit-pay/set-setup-flag",
      "adit-pay/linkExpired",
      "adit-pay/requests",
      "adit-pay/payouts/list",
      "adit-pay/payouts/getPayoutsDataForChart",
      "adit-pay/get-payment-plan-list",
      "adit-pay/getPaymentRequestOverviewDetails",
      "adit-pay/payment-request",
      "adit-pay/disputes/list",
      "adit-pay/preference/overview",

      // austin
      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder",

      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder/1b7ad5da-c7e1-4e71-a78d-6d372b946edb",
      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder/c2789fca-4982-478a-8648-3af666365e06",
      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder/50b7594a-c744-42cd-87ff-fa2b308eca82",

      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder/set-reminder-status/1b7ad5da-c7e1-4e71-a78d-6d372b946edb",
      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder/set-reminder-status/c2789fca-4982-478a-8648-3af666365e06",
      "adit-pay/preferences/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/payment-reminder/set-reminder-status/50b7594a-c744-42cd-87ff-fa2b308eca82",

      // dallas
      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder",

      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder/fdf75e3f-6ad1-4a36-b5d5-061e2c49b074",
      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder/341ba34e-19b5-4f25-b99e-1025601a23bb",
      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder/1349798e-829a-4de3-9fbf-def5b266c90d",

      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder/set-reminder-status/fdf75e3f-6ad1-4a36-b5d5-061e2c49b074",
      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder/set-reminder-status/341ba34e-19b5-4f25-b99e-1025601a23bb",
      "adit-pay/preferences/22bffbc8-b255-4679-a5a9-7d2326ec2549/payment-reminder/set-reminder-status/1349798e-829a-4de3-9fbf-def5b266c90d",

      // houston
      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder",

      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder/4db49538-585c-4a2d-b133-f44afeace1de",
      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder/ca3fec4c-ed9a-4302-adb3-f3c555dca10a",
      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder/1a226cbc-364a-4c2e-b746-311beff119b5",

      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder/set-reminder-status/4db49538-585c-4a2d-b133-f44afeace1de",
      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder/set-reminder-status/ca3fec4c-ed9a-4302-adb3-f3c555dca10a",
      "adit-pay/preferences/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/payment-reminder/set-reminder-status/1a226cbc-364a-4c2e-b746-311beff119b5",

      // * End of Module => adit-pay

      // * Start of Module => settings

      "get-restricted-ip",
      "restrict-organization-ip",
      "save-restricted-ip",
      "delete-restricted-ip",
      "practiceIndustryList",
      "settinglocationv2",
      "settinglocation",
      "organization/getstarted/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "organization/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "organization/getstartedstatus",
      "organization/removeApp/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "organization/addApp/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "auditlog",
      "auditlog/export",
      "engage/locations/cloud_ehr",
      "getfilter/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "app",
      "organizationv2/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "userv2",
      "outstandingpayment",
      "getcustomerdetails",
      "getallinvoice",
      "invoice",
      "getalllocationinvoice",
      "getlocationinvoice",
      "phonemodel",
      "location",
      "appointmentlocation/getofficetimebyappointmentlocation",
      "getOutgoingNumberSettingDetails",
      "tendlc/getbusinessinformation/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948",
      "settings/checkAccountIsConnectedToAwd",
      "settings/getGoogleUrl",
      "facebookads/checkConnection",
      "facebookads/getFbPageUrl",
      "systemrole",
      "user/changePassword/568e6525-e501-4a0f-8381-1330864c76c3",
      "number/findall",
      "numbers/landlinelist",
      "callflow/listcallflow",
      "callflow/702b3f81-9b71-4933-8ecd-d88df4622cba",
      "callflow/804b3f81-9b71-4933-8ecd-d88df4622def",
      "callflow/906b3f81-9b71-4933-8ecd-d88df4622ghi",
      "callflow/update/702b3f81-9b71-4933-8ecd-d88df4622cba", // put
      "callflow/update/804b3f81-9b71-4933-8ecd-d88df4622def", // put
      "callflow/update/906b3f81-9b71-4933-8ecd-d88df4622ghi", // put
      "callflow/update/b7fbb26f-dfbe-4ff8-809d-265efa5952b4", // put
      "callflow/auditlog/702b3f81-9b71-4933-8ecd-d88df4622cba", // post
      "callflow/auditlog/804b3f81-9b71-4933-8ecd-d88df4622def", // post
      "callflow/auditlog/906b3f81-9b71-4933-8ecd-d88df4622ghi", // post
      "callflow/auditlog/b7fbb26f-dfbe-4ff8-809d-265efa5952b4", // post
      "blockcaller/list/a9d05186-74bd-4249-ac2b-a35f7534935a",
      "holdmusic/list",
      "get-prefix",
      "voicemailoverride",
      "voicemailoverride/detail",
      "vmboxes/getvmbox",
      "line",
      "voicemailoverride/update",
      "audio",
      "audio/delete",
      "communication",
      "communication/update",
      "role",
      "tag",
      "timezone",
      "user/addbulkuser",
      "user/checkUserNameExist",
      "user/20e40317-5e61-4a0c-828d-9a4f8125fa8d",
      "user",
      "user/gettooltipdetails",
      "user/getuserroleaccess",
      "user/tablesetting",
      "user/savedFilter",
      "user/getuserlocationrole",
      "user/location/remove",
      "user/location/add",
      "emailcampaign/getEmailSettingDetail",
      "adit-pay/connect/payment-gateway/account",
      "createNewCustomer",
      "updatebillingtype",
      "tenantdata",
      "number/findnumber",
      "numbers/landlinelist",
      "numbers/955caa69-5f48-467b-858e-44c2eb1617ab",
      "numbers/numberdetails/955caa69-5f48-467b-858e-44c2eb1617ab",
      "number/transferanumber",
      "vmboxes/updatemultivmbox",
      "holdmusic/details", // get
      "holdmusic/update", //post
      "listengagenotification",
      "addengagenotification",
      "appointmentlocation/notification",
      "notification",
      "pozative/addNotificationSetting",
      "pozative/getNotificationSetting",
      "practiceanalytics/addemailnotification",
      "practiceanalytics/getemailnotification",
      "practiceanalytics/updatepracticeanalytics", // Note: This API fails on stage too, i am keeping this api here so that it does not break the flow as it makes the session to expire.
      "summaries",
      "paschedule/getehrclient",
      "number/create",
      "listlinesfromuser",
      "",
      // * End of Module => settings

      "appointmentlocation/location/ehr/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948",
      "appointmentlocation/location/ehr/22bffbc8-b255-4679-a5a9-7d2326ec2549",
      "appointmentlocation/location/ehr/869f9155-c174-4f94-b0e1-0ee8d84f3b2d",
      "video/createvideosession",
      "video/checkessionexistsindb",
      "video/creatvideoshortlink",
      "user/568e6525-e501-4a0f-8381-1330864c76c3",
      "dashboard/userapp/568e6525-e501-4a0f-8381-1330864c76c3",
      "patient-form/form-builder/get-org-practice-industry",
      "location/getdefault",
      "pozative/DashboardReviewList",
      "pozative/PreferencesOverview",
      "pozative/preference/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948",
      "pozative/businessPagesList",
      "communication/detail",
      "pozative/preference",
      "pozative/statusOfBPages",
      "pozative/getReviewList",
      "pozative/insightsOverview",
      "pozative/insights",
      "pozative/inviteList",
      "pozative/getReviewList",
      "pozative/getCampaignList",
      "pozative/DashboardOverview",
      "pozative/getSocialtypeByLocation",
      "pozative/dashboard",
      "pozative/getPatientsOfCampaign/5715c1a3-539d-488c-bab8-d54c528d678",
      // "pozative/quickText",
      // "optin/getOptinSettings",
      "pozative/createCampaign",


      "financing/location/configurations",
      "financing/preference/overview",
      "financing/preference/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/get",
      "financing/preference/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/get",
      "financing/preference/22bffbc8-b255-4679-a5a9-7d2326ec2549/get",

      "financing/preference/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/save",
      "financing/preference/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/save",
      "financing/preference/22bffbc8-b255-4679-a5a9-7d2326ec2549/save",

      "financing/application/location/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/charts",
      "financing/application/location/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/charts",
      "financing/application/location/22bffbc8-b255-4679-a5a9-7d2326ec2549/charts",

      "financing/application/list",
      "financing/transaction/overview/charts",
      "financing/transaction/list",

      "financing/transaction/location/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/charts",
      "financing/transaction/location/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/charts",
      "financing/transaction/location/22bffbc8-b255-4679-a5a9-7d2326ec2549/charts",

      "call/masterdata",
      "call/unique",
      "listfax",

      //Engage Module start
      "engage/appreminder/birthdaywishes/get",
      "engage/appreminder/birthdaywishes/save",
      "engage/appreminder/appointmentconfirmation/get",
      "engage/appreminder/appointmentconfirmation/save",
      //Engage Module end

      // * Start of Module => Practice Analytics
      "practiceanalytics/check_ehr_system",
      "practiceanalytics/client_unique_id",
      "practiceanalytics/paviewcount",
      "practiceanalytics/getreports", // get
      "practiceanalytics/findmappingstatus", // post
      "practiceanalytics/findappstatus", // app // post
      "practiceanalytics/getincomplateformforpatient", // post
      "practiceanalytics/findaptstatus", // apT // post
      "practiceanalytics/getpatientpic", // post
      "practiceanalytics/getverificationstatus", // post
      "practiceanalytics/findproviderhours", // post
      "practiceanalytics/findoperatorytime", // post
      "practiceanalytics/getlastsync/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948", // get
      "practiceanalytics/getlastsync/22bffbc8-b255-4679-a5a9-7d2326ec2549", // get
      "practiceanalytics/getlastsync/869f9155-c174-4f94-b0e1-0ee8d84f3b2d", // get
      "paschedule/provider",
      "paschedule/operatory", // This is a blocker  as no data is available for this api
      "paschedule/appointmenttype",
      "paschedule/status",
      "appointmentlocation/getGmbHours",
      "practiceanalytics/activeproviderlist/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948", // get
      "practiceanalytics/activeproviderlist/22bffbc8-b255-4679-a5a9-7d2326ec2549", // get
      "practiceanalytics/activeproviderlist/869f9155-c174-4f94-b0e1-0ee8d84f3b2d", // get
      // * End of Module => Practice Analytics
    ];

    private readonly mockResponses = {
      "auth": authData,
      "location": locationData,
      "user": userData,
      "dashboard": dashboardData,
      "organization": organizationData,
      "notification": notificationData,
      "releasenote": releasenoteData,
      "patient-card": patientCardData,
      "zohohelpaccess": zohoHelpAccessData,
      "getlocationsforsoftphone": getLocationsForSoftphoneData,
      "appointmentlocations": appointmentLocationsData,
      "chatgroup": chatgroupData,
      "organizationv2": organizationv2Data,
      "appointment": appointmentData,
      "getcalloverridelocations": getcalloverridelocationsData,
      "patient-form": patientFormData,
      "appointmentlocation": appointmentlocationData,
      "practiceanalytics": practiceanalyticsData,
      "engage": engageData,
      "emailcampaign": emailcampaignData,
      "getactivelocationofappbyappname": getActiveLocationOfAppByAppNameData,
      "getoutgoingnumbersettingdetails": getOutgoingNumberSettingDetailsData,
      "getpatientdetailforengage": quickTextData,
      "findreportmonthandyear_adit": reportData,
      "published-report_adit": reportData,
      "patientes": patientesData,
      "patientpreference": patientpreferenceData,
      "getfilter": getfilterData,
      "getpatientlistbytypees": getpatientlistbytypeesData,
      "getpatientlistbytypenewes": getpatientlistbytypenewesData,
      "getoverduepatientschartsdataes": getoverduepatientschartsdataesData,
      "getpatientcollectionchartdata": getpatientcollectionchartdataData,
      "getpatientlistbytypecollection": getpatientlistbytypecollectionData,
      "adit-pay": aditPayData,
      "get-restricted-ip": getRestrictedIpData,
      "restrict-organization-ip": restrictOrganizationIpData,
      "save-restricted-ip": saveRestrictedIpData,
      "delete-restricted-ip": deleteRestrictedIpData,
      "practiceindustrylist": practiceIndustryListData,
      "settinglocationv2": settingLocationV2Data,
      "settinglocation": settingLocationData,
      "auditlog": auditLogData,
      "app": appData,
      "userv2": userv2Data,
      "outstandingpayment": outstandingPaymentData,
      "getcustomerdetails": getCustomerDetailsData,
      "getallinvoice": getallinvoiceData,
      "invoice": invoiceData,
      "getalllocationinvoice": getAllLocationInvoiceData,
      "getlocationinvoice": getLocationInvoiceData,
      "phonemodel": phoneModelData,
      "tendlc": tendlcData,
      "settings": settingsData,
      "facebookads": facebookadsData,
      "systemrole": systemroleData,
      "number": numberData,
      "numbers": numbersData,
      "callflow": callflowData,
      "blockcaller": blockcallerData,
      "holdmusic": holdmusicData,
      "get-prefix": getPrefixData,
      "voicemailoverride": voicemailoverrideData,
      "vmboxes": vmboxesData,
      "line": lineData,
      "audio": audioData,
      "communication": communicationData,
      "role": roleData,
      "tag": tagData,
      "timezone": timeZoneData,
      "createNewCustomer": createNewCustomerData,
      "updatebillingtype": updateBillingTypeData,
      "tenantdata": tenantData,
      "chat": chatData,
      "video": videoData,
      "pozative": pozativeData,
      "optin": optinData,
      "financing": financingData,
      "call": callData,
      "listfax": listfaxData,
      "listengagenotification": listengagenotificationData,
      "addengagenotification": addengagenotificationData,
      "summaries": summariesData,
      "getisehrconnectedlocationlist": getisEHRConnectedLocationListData,
      "getallsegmentscount": getAllSegmentsCountData,
      "paschedule": pascheduleData,
      "listlinesfromuser": listlinesfromuserData,
    }

    public isDemoUrl(url: string): boolean {
      // console.log("Data:", url)
      const isExists = this.demoEndpoints.includes(url.toLowerCase()); // check normal url
      if (!isExists) {
        const match = this.demoEndpoints.some((endpoint) =>
          url.startsWith(endpoint)
        ); // check parameterised url
        if (match) {
          return true;
        }
      }
      return isExists;
    }

    public getMockResponseForRequest(url: string, method, req: any): any {
      const body = req.body || {};
      const params = req.params || {};

      const match = url.match(/^[^?]+/);
      const cleanedUrl = match ? match[0] : url;
      const urlParts = cleanedUrl.toLowerCase().split("/");

      const moduleKey = urlParts[0];
      const practiceIndustry = this._localStorageService.getPracticeIndustryForDemo() || this.defaultPracticeIndustry;
      const methodKey = this.createMethodKey(urlParts, body, params);

      if (methodKey == "appointmentlocations_getinactivedefaultproviderlist" || methodKey == "user_tablesetting") {
        console.info("ERRORRRR = ", methodKey, this.mockResponses?.[moduleKey]?.[method]?.[practiceIndustry]?.["all"]);
      }

      const locations = [
        { _id: "1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948", name: "Austin" },
        { _id: "22bffbc8-b255-4679-a5a9-7d2326ec2549", name: "Dallas" },
        { _id: "869f9155-c174-4f94-b0e1-0ee8d84f3b2d", name: "Houston" },
      ];

      let locationId = this._localStorageService.getLocation() || 'all';

      // Check if methodKey contains a location name
      const foundLocation = locations.find((loc) =>
        methodKey.toLowerCase().includes(loc._id.toLowerCase())
      );

      if (foundLocation) {
        locationId = foundLocation._id;
      }


      console.info("\n***** Log Check Start *****");
      console.groupCollapsed("=> Mock Request Analysis -", url);
      console.info(`URL Parts: ${urlParts.join(' | ')}\nModule Key: ${moduleKey}\nMethod: ${method}\nPractice Industry: ${practiceIndustry}\nLocation ID: ${locationId}\nLocation Name: ${foundLocation?.name || "all"}`);

      const valuePath1 = this.mockResponses?.[moduleKey]?.[method]?.[practiceIndustry]?.[locationId]?.[methodKey];
      const valuePath2 = this.mockResponses?.[moduleKey]?.[method]?.[this.defaultPracticeIndustry]?.["all"]?.[methodKey];

      console.info(`Path 1: [ ${practiceIndustry} → ${locationId} → ${methodKey} ]`, "\nValue:", valuePath1, `\nPath 2: [ ${this.defaultPracticeIndustry} → all → ${methodKey} ]`, "\nValue:", valuePath2);
      console.info("Endpoint: ", methodKey);
      console.groupEnd();

      return valuePath1 || valuePath2 || null;

      // return (this.mockResponses?.[moduleKey]?.[method]?.[practiceIndustry]?.[locationId]?.[methodKey] || this.mockResponses?.[moduleKey]?.[method]?.[this.defaultPracticeIndustry]?.["all"]?.[methodKey] || null);
    }

    public isUserAuthenticated(params: any) {
      let isAuthenticated = false;
      const user = this._constantsService.staticLoginData.find(
        (element: any) =>
          element.email === params.email && element.password === params.password
      );
      if (!user) {
        isAuthenticated = false;
      } else {
        isAuthenticated = true;
        this._localStorageService.setPracticeIndustryForDemo(user.user_type);
      }
      return isAuthenticated;
    }

    public createMethodKey(urlParts, body, params) {
      let methodKey = `${urlParts.join('_')}`;

      const isGet = params && typeof params.get === 'function'; // URLSearchParams
      const isPost = body && typeof body === 'object';

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = tomorrow.toISOString().split('T')[0];

      switch (methodKey) {
        //Email Campaigns start
        case "emailcampaign_drip-campaign_list":
          // Handle specific case
          methodKey += `_${params.get("status")}`;
          methodKey += `_${params.get("is_default_campaigns")}`;
          break;

        case "emailcampaign_template":
          methodKey += `_${params.get("template_type")}`;
          break;

        case "emailcampaign_drip-campaign_get-drip-campaign":
          methodKey += `_${params.get("dripCampaignId")}`;
          break;

        case "emailcampaign_segmentLookupList":
          methodKey += `_${params.get("location")}`;
          break;

        case "emailcampaign_ispatientappactive":
          methodKey += `_${body.organizationId}`;
          methodKey += `_${body.locationId}`;
          break;

        case "emailcampaign_mailinglist":
          methodKey += `_${params.get("location")}`;
          methodKey += `_${params.get("pageNo")}`;
          methodKey += `_${params.get("limit")}`;
          methodKey += `_${params.get("type")}`;
          break;

        case "emailcampaign_getcampaigndetailforreport":
          methodKey += `_${body.campaignId}`;
          methodKey += `_${body.locationId}`;
          break;

        case "emailcampaign_getmailerdetail":
          methodKey += `_${body.locationId}`;
          methodKey += `_${body.mailingId}`;
          break;

        case "emailcampaign_mailercontact":
          methodKey += `_${params.get('mailingId')}`;
          break;

        case "getactivelocationofappbyappname":
          methodKey += `_${body.appalias}`;
          break;

        case "emailcampaign_checkispreferencesset":
          methodKey += `_${body.locationIds}`;
          break;

        case "emailcampaign_campaign":
          if (isGet) {
            methodKey += `_${params.get("location")}`;
            methodKey += `_${params.get("pageNo")}`;
            methodKey += `_${params.get("limit")}`;
            methodKey += `_${params.get("filter")}`;
          } else if (isPost) {
            methodKey += `_${body.campaign_name}`;
            methodKey += `_${body.locationIds}`;
            methodKey += `_${body.status}`;
            methodKey += `_${body.subscribers_senders}`;
          }
          break;

        case "emailcampaign_drip-campaign_create-drip-campaign":
          methodKey += `_${body.allias}`;
          break;

        case "emailcampaign_drip-campaign_follow-up-message_create":
          methodKey += `_${body.allias}`;
          break;

        case "emailcampaign_drip-campaign_followup-message_get":
          methodKey += `_${body.followUpMessageId}`;
          break;

        case "emailcampaign_drip-campaign_follow-up-message_update_save-mail-subject":
          methodKey += `_${body.dripCampaignFollowupId}`;
          methodKey += `_${body.previewText}`;
          methodKey += `_${body.subject}`;
          break;

        case "emailcampaign_drip-campaign_follow-up-message_update_mail-template":
          methodKey += `_${body.dripCampaignFollowupId}`;
          break;

        case "emailcampaign_drip-campaign_follow-up-message_update_name":
          methodKey += `_${body.dripCampaignFollowupId}`;
          break;

        case 'patient-form_treatment-plan_get':
          methodKey += `_${params.get('status')}`;
          break;

        case 'patient-form_form-builder_get-form-builder-list':
          methodKey += `_${body.selectedTab}`;
          break;

        case 'patient-form_treatment-plan_mark-archive-unarchive':
          methodKey += `_${body.type}`;
          break;

        case 'patient-form_forms_get-patient-form-submissions-list':
          methodKey += `_${body.tabFilter}`;
          break;

        case 'patient-form_forms_update-archive-status':
          methodKey += `_${body.is_archived}`;
          break;

        case 'patient-form_auto-assign_update-reminder-active-status':
          methodKey += `_${body.isactive}`;
          break;

        case 'optin_getOptinSettings':
          methodKey += `_${body.optinKey}`;
          break;


        //Email Campaigns end

        //Patient Module start
        case "patientes":
          methodKey += `_${params.get("organization")}`;
          methodKey += `_${params.get("location")}`;
          methodKey += `_${params.get("filter")}`;
          methodKey += `_${params.get("limit")}`;
          methodKey += `_${params.get("pageNo")}`;
          methodKey += `_${params.get("sortKey")}`;
          methodKey += `_${params.get("sortDirection")}`;
          break;

        case "patientpreference_getpreferenceoverview":
          methodKey += `_${body.organization}`;
          methodKey += `_${body.userId}`;
          break;

        case "getpatientlistbytypees":
          methodKey += `_${params.get("organization")}`;
          methodKey += `_${params.get("filterType")}`;
          methodKey += `_${params.get("minDate")}`;
          methodKey += `_${params.get("maxDate")}`;
          methodKey += `_${params.get("location")}`;
          break;

        case "getpatientlistbytypenewes":
          methodKey += `_${body.filterType}`;
          methodKey += `_${body.minDate}`;
          methodKey += `_${body.maxDate}`;
          break;

        case "getoverduepatientschartsdataes":
          methodKey += `_${body.organization}`;
          methodKey += `_${body.filterType}`;
          methodKey += `_${body.location}`;
          break;

        case "getpatientcollectionchartdata":
          methodKey += `_${params.get("organization")}`;
          methodKey += `_${params.get("location")}`;
          break;

        case "getpatientlistbytypecollection":
          methodKey += `_${body.organization}`;
          methodKey += `_${body.filterType}`;
          // methodKey += `_${body.pageNo}`;
          // methodKey += `_${body.limit}`;
          // methodKey += `_${body.sortKey}`;
          // methodKey += `_${body.sortDirection}`;
          // methodKey += `_${body.minDate}`;
          // methodKey += `_${body.maxDate}`;
          methodKey += `_${body.location}`;
          break;

        case "getAllSegmentsCount":
          methodKey += `_${body.filter}`;
          methodKey += `_${body.location}`;
          break;

        case "getSegmentsList":
          methodKey += `_${body.filter}`;
          methodKey += `_${body.limit}`;
          methodKey += `_${body.location}`;
          methodKey += `_${body.skip}`;

          break;

        case "getProviderListbyAppointmentLocation":
          methodKey += `_${body.locationId}`;
          break;

        case "appointmentlocation_appientment_patient":
          methodKey += `_${params.get("location")}`;
          methodKey += `_${params.get("isFromWeb")}`;
          break;

        case "appointmentlocation_operatory_patient":
          methodKey += `_${params.get("location")}_${params.get("isFromWeb")}`;
          // methodKey += `_${params.get("responsefields")}`;
          // methodKey += `_${params.get("isFromWeb")}`;
          break;

        case "service_organization_appointmenttype":
          methodKey += `_${params.get("organization")}`;
          methodKey += `_${params.get("location")}`;
          methodKey += `_${params.get("responsefields")}`;
          break;

        case "provider":
          methodKey += `_${params.get("organization")}`;
          methodKey += `_${params.get("location")}`;
          methodKey += `_${params.get("responsefields")}`;
          break;
        // case "getPatientsCount":

        // Patient Module ends

        //Engage Module start

        //Engage Module end

        case 'pozative_getreviewlist':
          // Handle specific case
          methodKey += `_${params.get('is_type')}`;
          break;

        case "pozative_dashboardreviewlist":
          methodKey += `_${body.is_type}`;
          break;

        case "financing_application_list":
          methodKey += `_${params.get('status')}`;
          break;

        case "financing_transaction_list":
          methodKey += `_${params.get('status')}`;
          break;

        case "adit-pay_requests":
          methodKey += `_${params.get('status')}`;
          break;

        case "adit-pay_get-payment-plan-list":
          methodKey += `_${params.get('status')}_${params.get('plan_type')}`;
          break;

        case "adit-pay_disputes_list":
          methodKey += `_${params.get('status')}`;
          break;

        case "adit-pay_payouts_getpayoutsdataforchart":
          methodKey += `_${body.location}`;
          break;

        case "adit-pay_connect_payment-gateway_account":
          methodKey += `_${body.location}`;
          break;

        case "getlocationinvoice":
          methodKey += `_${params.get('location')}`;
          break;

        case "appointment":
          methodKey += `_${params.get('is_appointment')}`; // this is a small blocker as the status is not changing the result
          break;

        case "practiceanalytics_getreports": {
          const optParam = params.get('opt');
          const optObj = optParam ? JSON.parse(optParam) : {};
          opt_location_current_datetime = optObj.Location_Current_Datetime;

          if (opt_location_current_datetime > formattedTomorrow) {
            methodKey += `_MorningHuddle_Today_Header_${opt_location_current_datetime}`; // this is a blocker as this date can not be exported to the mock data file 
          } else {
            methodKey += `_${params.get('q')}_${opt_location_current_datetime || ''}`;
          }
          break;
        }

        default: break;
      }
      return methodKey;
    }
  }
}

{
  function generateTodayTimeBlocks(count, blockMinutes = 60) {
    const blocks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < count; i++) {
      const start = new Date(today.getTime() + i * blockMinutes * 60 * 1000);
      const end = new Date(start.getTime() + blockMinutes * 60 * 1000);
      blocks.push({
        ApptStartTime: start.toISOString(),
        ApptEndTime: end.toISOString()
      });
    }
    return blocks;
  }

  function assignTimeBlocksToAppointments(appointments, blocks) {
    const updated = appointments.map((apt, index) => {
      if (index < blocks.length) {
        return {
          ...apt,
          ApptStartTime: blocks[index].ApptStartTime,
          ApptEndTime: blocks[index].ApptEndTime
        };
      }
      return apt;
    });
    return updated;
  }

  const appointments = []

  const blocks = generateTodayTimeBlocks(appointments.length, 30);
  const updatedAppointments = assignTimeBlocksToAppointments(appointments, blocks);
}

case "practiceanalytics_getreports": {

  const optParam = params.get('opt');
  const optObj = optParam ? JSON.parse(optParam) : {};
  opt_location_current_datetime = optObj.Location_Current_Datetime;

  if (
    (params.get('q') === "Schedule_WeekView") ||
    (params.get('q') === "NewPatient_Header") ||
    (params.get('q') === "Dashboard_Growth_Overall_Patient") ||
    (params.get('q') === "Visits_Get_Page_Header") ||
    (params.get('q') === "Recare_Header") ||
    (params.get('q') === "Dashboard_Collection") ||
    (params.get('q') === "Production_Detail_List_Header") ||
    (params.get('q') === "Production_Detail_List") ||
    (params.get('q') === "Hyginee_ReAppointment_Header") ||
    (params.get('q') === "RestorativeCase_Header") ||
    (params.get('q') === "HygieneCase_Header") ||
    (params.get('q') === "Cancellations_Header") ||
    (params.get('q') === "NoShows_Header") ||
    (params.get('q') === "Operatory_Utilization") ||
    (params.get('q') === "Dashboard_Growth_Patient_Base") ||
    (params.get('q') === "Dashboard_Growth_fluoride_Perio_YearOverYear") ||
    (params.get('q') === "Dashboard_Growth_Reappt_YearOverYear") ||
    (params.get('q') === "Dashboard_Growth_Production_Growth") ||
    (params.get('q') === "Dashboard_Growth_New_Patient_Performance") ||
    (params.get('q') === "Dashboard_Growth_Production_YearOverYear") ||
    (params.get('q') === "Dashboard_Growth_Collection_YearOverYear") ||
    (params.get('q') === "Dashboard_Growth_Visits_YearOverYear") ||
    (params.get('q') === "Practice_Health_Score_Card") ||
    (params.get('q') === "HygieneCase_Dashboard_Header") ||
    (params.get('q') === "ProviderCase_Header") ||
    (params.get('q') === "NewPatient_Hygiene_Dashboard_Header") ||
    (params.get('q') === "Location_Operatory_list") ||
    (params.get('q') === "Provider_list") ||
    (params.get('q') === "Get_Location_Procedure_Status")
  ) {
    methodKey += `_${params.get('q')}_`;
  } else {
    if (optObj.start_time) {
      opt_start_time = optObj.start_time;
      methodKey += `_${params.get('q')}_${opt_start_time || ''}`;
    } else {
      if (opt_location_current_datetime > formattedTomorrow) {
        methodKey += `_MorningHuddle_Today_Header_${opt_location_current_datetime}`; // this is a blocker as this date can not be exported to the mock data file 
      } else {
        methodKey += `_${params.get('q')}_${opt_location_current_datetime || ''}`;
      }
    }
  }
  break;
}

[
  {
    "_id": "119fa0da-a80d-46d2-9e54-67487b0a63d7",
    "alias": "internalchat",
    "app_url": "/internal",
    "is_active": true,
    "logo_class": "icon-internal-chat",
    "name": "Internal Chat",
    "position": 30,
    "isActiveApp": false
  },
  {
    "_id": "19cb5797-0d9e-48ca-a2ea-8576aa914f89",
    "alias": "patients",
    "app_url": "/patients",
    "is_active": true,
    "logo_class": "icon-Patients",
    "name": "Patients",
    "position": 90,
    "isActiveApp": false
  },
  {
    "_id": "40a650bf-6484-4d2f-a373-807029500b76",
    "alias": "telemed",
    "app_url": "/video",
    "is_active": true,
    "logo_class": "icon-Telemed",
    "name": "TeleMed",
    "position": 100,
    "isActiveApp": false
  },
  {
    "_id": "40a650bf-6484-4d2f-a373-807029500b77",
    "alias": "aditPay",
    "app_url": "/adit-pay",
    "is_active": true,
    "logo_class": "icon-adit-pay",
    "name": "Adit Pay",
    "position": 70,
    "isActiveApp": false
  },
  {
    "_id": "4f4ade1f-129e-4036-a27c-7b9eacd1587c",
    "alias": "pozative",
    "app_url": "/pozative",
    "is_active": true,
    "logo_class": "icon-Pozative",
    "name": "Pozative",
    "position": 60,
    "isActiveApp": false
  },
  {
    "_id": "80b93b39-38ac-49ef-95f6-504b149bc664",
    "alias": "patient-form",
    "app_url": "/patient-form",
    "is_active": true,
    "logo_class": "icon-Patient-Form",
    "name": "Patient Forms",
    "position": 40,
    "isActiveApp": false
  },
  {
    "_id": "8c76b282-3af7-4d3c-b772-b0695385f8ff",
    "alias": "appointment",
    "app_url": "/appointment-forms",
    "is_active": true,
    "logo_class": "icon-Appt-Reminders",
    "name": "Online Scheduling",
    "position": 50,
    "isActiveApp": false
  },
  {
    "_id": "ab24771d-353f-4fce-9bb4-fa8ae24f5e46",
    "alias": "engage",
    "app_url": "/engage",
    "is_active": true,
    "logo_class": "icon-Engage",
    "name": "Engage",
    "position": 20,
    "unread_count": 0,
    "isActiveApp": false
  },
  {
    "_id": "ad056d84-eab7-42b8-8a64-06833a253234",
    "alias": "reports",
    "app_url": "/reports",
    "is_active": true,
    "logo_class": "icon-Reporting",
    "name": "Reports",
    "position": 120,
    "isActiveApp": false
  },
  {
    "_id": "b5928b68-4d55-4387-8c04-638dda785c78",
    "alias": "practice-analytics",
    "app_url": "/practice-analytics",
    "is_active": true,
    "logo_class": "icon-Practice-Analytics-Icon",
    "name": "Practice Analytics",
    "position": 10,
    "isActiveApp": false
  },
  {
    "_id": "d7afe00b-a89f-43e4-b7f1-6801e905eed2",
    "alias": "email-campaign",
    "app_url": "/email",
    "is_active": true,
    "logo_class": "icon-Email-Campaign",
    "name": "Email Campaigns",
    "position": 80,
    "isActiveApp": false
  },
  {
    "_id": "e6c028df-8eff-4d0f-85e4-d5a9514009e9",
    "alias": "track",
    "app_url": "/tracking",
    "is_active": true,
    "logo_class": "icon-Call-Tracking",
    "name": "Call Tracking",
    "position": 110,
    "isActiveApp": false
  },
  {
    "_id": "0c0941e4-1722-11ee-be56-0242ac120002",
    "alias": "financing",
    "app_url": "/financing",
    "is_active": true,
    "logo_class": "icon-financing",
    "name": "Financing",
    "position": 75,
    "isActiveApp": false
  },
  {
    "_id": "5aad8fe6-c3f9-444f-82ff-7ea2c6d6c48b",
    "alias": "rcm",
    "app_url": "/rcm",
    "is_active": true,
    "logo_class": "icon-rcm",
    "name": "RCM",
    "position": 77,
    "isActiveApp": false
  },
  {
    "_id": "e3b0c442-98fc-1c14-9f91-f7b7a1b12442",
    "alias": "tasks",
    "app_url": "/task",
    "is_active": true,
    "logo_class": "icon-task",
    "name": "Tasks",
    "position": 21,
    "isActiveApp": false
  }
]

// This file is auto-generated to organize and list duplicate demo endpoints.

// Duplicate endpoints with their counts
export const duplicateDemoEndpoints: { endpoint: string; count: number }[] = [
  { endpoint: "user", count: 5 },
  { endpoint: "appointmentlocations", count: 4 },
  { endpoint: "practiceanalytics/check_ehr_system", count: 4 },
  { endpoint: "notification/get", count: 2 },
  { endpoint: "releaseNote/list", count: 2 },
  { endpoint: "notification/getusernotificationList", count: 2 },
  { endpoint: "chatgroup/fetchusers", count: 2 },
  { endpoint: "chat/fetchchatgroups", count: 2 },
  { endpoint: "user/568e6525-e501-4a0f-8381-1330864c76c3", count: 2 },
  { endpoint: "getfilter/a9d05186-74bd-4249-ac2b-a35f7534935a", count: 2 },
  { endpoint: "patient-form/auto-assign/get-all-auto-assign-forms", count: 2 },
  { endpoint: "patient-form/get-timezone-for-location", count: 2 },
  { endpoint: "emailcampaign/deleteSelectedMailerContact", count: 2 },
  { endpoint: "adit-pay/billing/countries", count: 3 },
  { endpoint: "adit-pay/payment/update-request", count: 3 },
  { endpoint: "adit-pay/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948/getpatientopenpaymentrequest", count: 10 },
  { endpoint: "adit-pay/869f9155-c174-4f94-b0e1-0ee8d84f3b2d/getpatientopenpaymentrequest", count: 9 },
  { endpoint: "getHeaderPatientDetail", count: 2 },
  { endpoint: "location/ehr", count: 2 },
  { endpoint: "provider", count: 2 },
  { endpoint: "numbers/landlinelist", count: 2 },
  { endpoint: "call/masterdata", count: 2 },
  { endpoint: "call/unique", count: 2 },
  { endpoint: "listfax", count: 2 },
  { endpoint: "tag", count: 2 },
  { endpoint: "chat/fetchchatgroups", count: 2 },
  { endpoint: "practiceanalytics/paviewcount", count: 6 },
  { endpoint: "practiceanalytics/getreports", count: 6 },
  { endpoint: "practiceanalytics/getmasterpasegmentlist", count: 3 },
  { endpoint: "practiceanalytics/getpasegmentlist", count: 3 },
  { endpoint: "practiceanalytics/activeproviderlist/1e0d2d3b-c4ec-48e8-a0f5-fd327f7db948", count: 2 },
  { endpoint: "practiceanalytics/activeproviderlist/22bffbc8-b255-4679-a5a9-7d2326ec2549", count: 2 },
  { endpoint: "practiceanalytics/activeproviderlist/869f9155-c174-4f94-b0e1-0ee8d84f3b2d", count: 2 },
  { endpoint: "practiceanalytics/followuptemplate/assigneelist", count: 4 },
  { endpoint: "practiceanalytics/pasegment/checkandcreatepamasterpatientlist", count: 2 },
  { endpoint: "practiceanalytics/pasegment", count: 2 },
  { endpoint: "order/getordersbypatient", count: 2 },
  { endpoint: "patient-card/fetchpatientnotespagination", count: 2 },
  { endpoint: "engage/getenabledappfromlocation", count: 2 },
  { endpoint: "engage/gettimezonefromlocation", count: 2 },
  { endpoint: "getPreferencestextcampaign", count: 2 },
  { endpoint: "rcm-request/getrcmquicktextmessage", count: 2 },
  { endpoint: "rcm-request/createandsendequest", count: 2 },
  { endpoint: "pozative/getReviewList", count: 2 },
  { endpoint: "pozative/createCampaign", count: 2 },
  { endpoint: "reviewrequestpatientsearch", count: 2 },
  { endpoint: "patientes", count: 2 },
];


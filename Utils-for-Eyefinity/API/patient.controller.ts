import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { BulkCreatePatientDto } from './patient.request.dto';
import { SwaggerBinding } from '@adittech/core-nest';
import { LoggerHelperService } from '@adittech/logger-nest';
import { FindAllParamsDto, FindAllQueryDto } from '../patient/patient.request.dto';
import { PatientPaService } from '../practice-analytics/patient-pa/patient-pa.service';
import { BodyPatientRecaresDto, BodyPatinetAdressPaDto, BodyReferredPatient, ParamsPatientRecaresDto, ParamsPatinetPaDto, ParamsPatinetAdressPaDto, ParamsReferredPatientDto, QueryPatinetPaDto, ParamsPatientRelationshipPaDto, BodyPatinetRelationshipPaDto, ParamsPatinetExamDetailsPaDto, BodyPatinetExamDetailsPaDto, ParamsPatinetExamsPaDto, BodyPatinetExamsPaDto, ParamsPatinetMPMRPaDto, BodyPatinetMPMRPaDto, ParamsPatinetPaymentNonInvoicedPaDto, BodyPatinetPaymentNonInvoicedPaDto, ParamsPatinetpaymenttransactionsPaDto, BodyPatinetpaymenttransactionsPaDto, ParamsPatinetEyeglassOrderDetailPaDto, BodyPatinetEyeglassOrderDetailPaDto } from '../practice-analytics/patient-pa/patient-pa.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('patient')
export class PatientController {
    constructor(private readonly _patientService: PatientService,
        private readonly _logger: LoggerHelperService,
        private readonly _paPatientService: PatientPaService) { }

    @Get('/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Get list of patient medications by filters',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async findAll(@Param() params: FindAllParamsDto, @Query() query: FindAllQueryDto) {
        try {
            return await this._patientService.findAll(params, query);
        } catch (error) {
            this._logger.error('Find all error outer::: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Create new patient',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async createNewPatient(@Param() params: object, @Body() body: BulkCreatePatientDto) {
        try {
            return await this._patientService.createNewPatient(body, params);
        } catch (error) {
            this._logger.error('error outer===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Put('bulkssn/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'update SSN info of patient from dentrix to adit',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async updatePatientSSN(@Param() params: { appointmentlocation: string }, @Body() body: any[]) {
        try {
            return await this._patientService.updatePatientSSN(params, body);
        } catch (error) {
            this._logger.error(`Error on updating SSN::: ${error}`);
            throw error;
        }
    }

    @Get('/unsynced/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Find all patient that is not synced in ehr',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async findAllUnsynced(@Param() params: object, @Query() query: object) {
        try {
            return await this._patientService.findAllUnsynced(params, query);
        } catch (error) {
            this._logger.error('error outer===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Put('/update-ehr-id/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'update patient ehr id after create in ehr',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async upatePatientEhrkey(@Body() body: any[]) {
        try {
            return await this._patientService.upatePatientEhrkey(body);
        } catch (error) {
            this._logger.error('error outer===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Put('/update/form/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'update patient detail by finding them using ehr id, name and mobile',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async updatePatientByFinding(@Param() params: any, @Body() body: any[]) {
        try {
            return await this._patientService.updatePatientByFinding(params, body);
        } catch (error) {
            this._logger.error('error outer===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Delete('/delete/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Delete all patient by appt loc id when it is sync/resync',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async deleteAllPatientByApptLocation(@Param() params: object) {
        try {
            return await this._patientService.deleteAllPatientByApptLocation(params);
        } catch (error) {
            this._logger.error('error outer===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/mssql')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all patient initially to MsSql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async bulkSyncPatientSql(@Param() params: ParamsPatinetPaDto, @Body() body: any) {
        try {
            return await this._paPatientService.storePatientsToSql(params.appointmentlocation, body, 'CREATE');
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }
 
    @Post('/:appointmentlocation/examdetails')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all patient exam details initially from ES to MsSql, write logic in syncrhonizer to get patinet exam details from es',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientExamDetails(@Param() params: ParamsPatinetExamDetailsPaDto, @Body() body: BodyPatinetExamDetailsPaDto[]) {
        try {
            console.log("\nHere in PA Patient ExamDetails\n");
            return await this._paPatientService.storeExamDetailsMsSql(params, body);
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }
    
    @Post('/:appointmentlocation/exams')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all patient exams initially from ES to MsSql, write logic in syncrhonizer to get patinet exam details from es',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientExams(@Param() params: ParamsPatinetExamsPaDto, @Body() body: BodyPatinetExamsPaDto) {
        try {
            console.log("\nHere in PA Patient Exams\n");
            return await this._paPatientService.storeExamsMsSql(params, body);
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/makepaymentmiscellaneousreasons')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all MakePaymentMiscellaneousReasons initially from ES to MsSql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storeMakePaymentMiscellaneousReasons(@Param() params: ParamsPatinetMPMRPaDto, @Body() body: BodyPatinetMPMRPaDto) {
        try {
            console.log("\nHere in PA MakePaymentMiscellaneousReasons");
            return await this._paPatientService.storeMakePaymentMiscellaneousReasonsMsSql(params, body);
        } catch (error) {
            console.log("in catch");

            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }
    
    @Post('/:appointmentlocation/paymentnoninvoiced')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all paymentnoninvoiced initially from ES to MsSql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientPaymentNonInvoiced(@Param() params: ParamsPatinetPaymentNonInvoicedPaDto, @Body() body: BodyPatinetPaymentNonInvoicedPaDto[]) {
        try {
            console.log("\nHere in PA Patient PaymentNonInvoiced\n");
            return await this._paPatientService.storePatientPaymentNonInvoicedMsSql(params, body);
        } catch (error) {
            console.log("in catch");
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/paymenttransactions')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all paymenttransactions initially from ES to MsSql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientpaymenttransactions(@Param() params: ParamsPatinetpaymenttransactionsPaDto, @Body() body: BodyPatinetpaymenttransactionsPaDto[]) {
        console.log("\nHere in PA Patient PaymentTransactions\n");
        try {
            return await this._paPatientService.storePatientPaymentTransactionsMsSql(params, body);
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/eyeglassorderdetails')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all eyeglassorderdetails initially from ES to MsSql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatienteyeglassorderdetails(@Param() params: ParamsPatinetEyeglassOrderDetailPaDto, @Body() body: BodyPatinetEyeglassOrderDetailPaDto[]) {
        console.log("\nHere in PA Patient EyeglassOrderDetails\n");
        try {
            return await this._paPatientService.storePatientEyeglassOrderDetailsMsSql(params, body);
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/address')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all patient address initially from ES to MsSql, write logic in syncrhonizer to get patinet ids from es (es: patient medication)',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storeAddressMsSql(@Param() params: ParamsPatinetAdressPaDto, @Body() body: BodyPatinetAdressPaDto) {
        try {
            return await this._paPatientService.storeAddressMsSql(params, body);
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/relationship')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all patient address initially from ES to MsSql, write logic in syncrhonizer to get patinet ids from es (es: patient medication)',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientRelationshipMsSql(@Param() params: ParamsPatientRelationshipPaDto, @Body() body: BodyPatinetRelationshipPaDto) {
        try {
            console.log("here relationship");
            
            return await this._paPatientService.storePatientRelationshipMsSql(params, body);
        } catch (error) {
            this._logger.error('error outer bulkSyncPatientSql===: ' + JSON.stringify(error));
            throw error;
        }
    }

    @Post('/:appointmentlocation/recares')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all patient recares initially from Dentrix to MsSql, write logic in syncrhonizer to get patinet ids from es and recares from dentrix (es: patient medication)',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientRecares(@Param() params: ParamsPatientRecaresDto, @Body() body: BodyPatientRecaresDto) {
        try {
            return await this._paPatientService.storePatientRecares(params, body);
        } catch (error) {
            this._logger.error(`Error outer storePatientRecares::: ${error}`);
            throw error;
        }
    }

    @Put('recare/:id/:type/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'update the recall data of patient in cb, es and sp',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async addUpdateDeletePatientRecall(@Param() params: any, @Body() body: any) {
        try {
            return await this._patientService.addUpdateDeletePatientRecall(params, body);
        } catch (error) {
            this._logger.error(`Error outer addUpdateDeletePatientRecall::: ${error}`);
            throw error;
        }
    }

    @Post('/:appointmentlocation/referred-patients')
    @SwaggerBinding({
        tags: 'patient',
        description: 'sync all referred patient ids initially from Dentrix to MsSql, write logic in syncrhonizer to get patinet ids from ES and referred patient ids from patient api of dentrix (es: patient medication)',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storeReferredPatients(@Param() params: ParamsReferredPatientDto, @Body() body: BodyReferredPatient) {
        try {
            return await this._paPatientService.storeReferredPatients(params, body);
        } catch (error) {
            this._logger.error(`Error outer storeReferredPatients::: ${error}`);
            throw error;
        }
    }

    @Post('/:patientId/procedures/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'store patient procedures to mssql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientProcedures(@Param() params: any, @Body() body: any) {
        try {
            return await this._paPatientService.storePatientProcedures(params, body);
        } catch (error) {
            this._logger.error(`Error outer storePatientProcedures::: ${error}`);
            throw error;
        }
    }

    @Post('/recare/practice-procedures/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'store patient recare practice procedures to mssql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientRecacePracticeProcedures(@Param() params: any, @Body() body: any) {
        try {
            return await this._paPatientService.storePatientRecacePracticeProcedures(params, body);
        } catch (error) {
            this._logger.error(`Error outer storePatientRecacePracticeProcedures::: ${error}`);
            throw error;
        }
    }

    @Post('/procedures/insurance-claim/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'store patient procedures insurance claim to mssql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientProceduresInsuranceClaim(@Param() params: any, @Body() body: any) {
        try {
            return await this._paPatientService.storePatientProceduresInsuranceClaim(params, body);
        } catch (error) {
            this._logger.error(`Error outer storePatientProceduresInsuranceClaim::: ${error}`);
            throw error;
        }
    }

    @Put('/insurance/:patient_ehr_id/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'update patient insurance to cb/es',
        summary: '',
    })
    async updatePatientInsurance(@Param() params: any, @Body() body: any) {
            return await this._patientService.updatePatientInsurance(params, body);
        
    }

    @Post(':patientId/procedures/conditions/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Create patient procedure patient condition to mssql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientProceduresPatientConditions(@Param() params: any, @Body() body: any) {
        try {
            return await this._paPatientService.storePatientProceduresPatientConditions(params, body);
        } catch (error) {
            this._logger.error(`Error outer storePatientProceduresPatientConditions::: ${error}`);
        }
    }

    @Post(':patientId/procedures/teeth/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Create patient procedure procedure teeth to mssql',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async storePatientProceduresProcedureTeeth(@Param() params: any, @Body() body: any) {
        try {
            return await this._paPatientService.storePatientProceduresProcedureTeeth(params, body);
        } catch (error) {
            this._logger.error(`Error outer storePatientProceduresProcedureTeeth::: ${error}`);
        }
    }

    @Get('/syncLocId/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'get sync location id by appt location id',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async getLocSyncId(@Param() params: any) {
        try {
            return await this._paPatientService.getLocSyncId(params);
        } catch (error) {
            this._logger.error(`Error outer getLocSyncId::: ${error}`);
            throw error;
        }
    }

    @Get('/ehr_id/:id')
    @SwaggerBinding({
        tags: 'patient',
        description: 'get patient detail by patientId',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async getById(@Param() params: any) {
        try {
            return await this._patientService.getById(params);
        } catch (error) {
            this._logger.error(`Error outer getById::: ${error}`);
            throw error;
        }
    }

    @Get('/ehrids/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'get all the patient ehr ids whose mobile number is not blank',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async getEhdIds(@Param() params: any) {
        try {
            return await this._patientService.getEhdIds(params);
        } catch (error) {
            this._logger.error(`Error outer storeReferredPatients::: ${error}`);
            throw error;
        }
    }

    // Start - realtime sync new eyefinity APIs
    @Put('/demographics/:patient_ehr_id/:appointmentlocation')
    @SwaggerBinding({
        tags: 'patient',
        description: 'update demographics info of patient from ehr to adit',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async updateDemographic(@Param() params: any, @Body() body: any) {
        console.log("\nin PUT /demographics/:patient_ehr_id/:appointmentlocation\n");
        
        return await this._patientService.updateDemographic(params, body);
    }

    @Post('/recalls/:patientId/:appointmentlocationId')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Create recalls of patient from ehr to adit',
        summary: ''
    })
    async createPatientRecall(@Param() params: any, @Body() body: any) {
        return await this._patientService.createPatientRecall(params, body);
    }

    // @Put('/recalls/:patientId/:appointmentlocationId')
    // @SwaggerBinding({
    //     tags: 'patient',
    //     description: 'Update recalls of patient from ehr to adit',
    //     summary: ''
    // })
    // async updatePatientRecall(@Param() params: any, @Body() body: any) {
    //     return await this._patientService.updatePatientRecall(params, body);
    // }

    @Get('/patient-ehr-details/location/:locationId/patient/:patientId')
    @SwaggerBinding({
        tags: 'patient',
        description: 'Get patient EHR id by patient ID',
        summary: '',
        authenticate_by: ['WHITELIST']
    })
    async getPatientEhrId(@Param() params: any) {
        return await this._patientService.getPatientEhrId(params.locationId, params.patientId);
    }
}

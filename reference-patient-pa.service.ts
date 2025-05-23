// examCptCodes: Array.isArray(examDetails.ExamCptCodes) && examDetails.ExamCptCodes.length > 0 ? examDetails.ExamCptCodes[0].Key : null,
// fittingFeeCptCodes: Array.isArray(examDetails.FittingFeeCptCodes) && examDetails.FittingFeeCptCodes.length > 0 ? examDetails.FittingFeeCptCodes[0].Key : null,
// procedureCptCodes: Array.isArray(examDetails.ProcedureCptCodes) && examDetails.ProcedureCptCodes.length > 0 ? examDetails.ProcedureCptCodes[0].Key : null,
// pqrsCptCodes: Array.isArray(examDetails.PqrsCptCodes) && examDetails.PqrsCptCodes.length > 0 ? examDetails.PqrsCptCodes[0].Key : null,
// modifierCodes: Array.isArray(examDetails.ModifierCodes) && examDetails.ModifierCodes.length > 0 ? examDetails.ModifierCodes[0].Key : null,
// diagnosticCodes: Array.isArray(examDetails.DiagnosisCodes) && examDetails.DiagnosisCodes.length > 0 ? examDetails.DiagnosisCodes[0].Key : null,
// selectedExamCptCode: Array.isArray(examDetails.ExamCptCodes) && examDetails.ExamCptCodes.length > 0 ? examDetails.ExamCptCodes[0].Key : null,
// selectedFittingFeeCptCode: Array.isArray(examDetails.FittingFeeCptCodes) && examDetails.FittingFeeCptCodes.length > 0 ? examDetails.FittingFeeCptCodes[0].Key : null,
// selectedProcedureCptCodes: Array.isArray(examDetails.ProcedureCptCodes) && examDetails.ProcedureCptCodes.length > 0 ? examDetails.ProcedureCptCodes[0].Key : null,
// selectedPqrsCptCodes: Array.isArray(examDetails.PqrsCptCodes) && examDetails.PqrsCptCodes.length > 0 ? examDetails.PqrsCptCodes[0].Key : null,

/* -------------------------------------------------------------------- */

    // async storeMakePaymentMiscellaneousReasonsMsSql(params, MPMRData) {
    //     console.log("\nstoreMakePaymentMiscellaneousReasonsMsSql - MPMRData\n",MPMRData);

    //     try {
    //         this._logger.info('MakePaymentMiscellaneousReasonsMsSql Syncing Started...' + new Date());
    //         params.patientId = MPMRData.patientId;
    //         try {
    //             await this.storeMakePaymentMiscellaneousReasons(params, MPMRData);
    //         } catch (error) {
    //             this._logger.error('Error Adding MakePaymentMiscellaneousReasonsMsSql:: >> ' + JSON.stringify(error));
    //         }
    //         return 'MakePaymentMiscellaneousReasonsMsSql synced Successfully.';
    //     } catch (error) {
    //         console.log('Error while syncing MakePaymentMiscellaneousReasonsMsSql::: ', error);
    //         this._logger.error(`Error while syncing MakePaymentMiscellaneousReasonsMsSql::: ${error}`)
    //     }
    // }

    /*
    storeMakePaymentMiscellaneousReasons - MPMRData
 {
  makePaymentMiscellaneousReasons: {
    IsRequiredNote: true,
    MiscPmtReasons: [ [Object], [Object], [Object], [Object], [Object] ]
  },
  appointmentlocation: '96c15dc6-1893-4f55-a671-f49468406e46',
  operation: 'CREATE',
  patientId: '57646670'
}
    */
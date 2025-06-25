PatientExams: Stores data related to patient exams in tbale "PatientExams". If a patient has three exams, each will have a corresponding entry in this table.

ExamDetail: Stores detailed information for each patient exam in table "ExamDetail". For example, if a patient has three exams, the details for all three are stored here. This data is retrieved via an API triggered by clicking on any of the exams using examid and orderid.

ExamProcedures: Stores the list of procedure codes associated with exams in table "ExamProcedures". These codes are extracted from the ProcedureCodesList field in the data of API of ExamDetail.

PatientExamInsurancePricing: Stores insurance pricing details for patient exams in table "PatientExamInsurancePricing". Data is extracted from the InsurancePricing field in the data of API of ExamDetail.

PatientExamCptCode: Stores all selected CPT codes in table "PatientExamCptCode". These codes are extracted from the following field in the data of API of ExamDetail: SelectedExamCptCode, SelectedFittingFeeCptCode, SelectedProcedureCptCodes, and SelectedPqrsCptCodes. All entries are stored in one table "PatientExamCptCode" with a CptCodeType field to differentiate code types.

EyeglassOrderDetail: Stores details of eyeglass orders in table "EyeglassOrderDetail". This data is retrieved via APIs triggered within the invoiced and non-invoiced eyeglass order endpoints using OrderNum.

MakePaymentMiscellaneousReasons: Stores miscellaneous reason with their IDs used while making payments in table "MakePaymentMiscellaneousReasons". Data is retrieved via the API triggered in EHR > Patient > Material Orders > Add MiscellaneousReasons Order.

PaymentTransactions: Stores all payment transactions in table "PaymentTransactions". Data is extracted from the API triggered in EHR > Patient > Material Orders > Transaction.

PaymentNonInvoiced: Stores non-invoiced payment transaction data in table "PaymentNonInvoiced". This data is fetched from the EHR > Patient > Material Orders > Non-Invoiced.

PaymentInvoice: Stores invoiced payment transaction data in table "PaymentInvoice". This data is fetched from the EHR > Patient > Material Orders > Invoiced.

LabOrder_StatusList: Stores the status list for lab orders in table "LabOrder_StatusList". This is extracted from field LabOrderStatusList from the Orders API trigger with the OrderNum from the Invoiced orders.

OrderInsurances: Stores order insurance details in table "OrderInsurances". This is extracted from field OrderInsurance from the Orders API trigger with the OrderNum from the Invoiced orders.
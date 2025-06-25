import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

//*** Start Patients DTO to sync in MsSQL ***//
export class ParamsPatinetPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class QueryPatinetPaDto {
    @ApiProperty()
    @IsString()
    location_ehr_id: string;

    @ApiProperty()
    @IsString()
    timezone: string;
}
//*** End Patients DTO to sync in MsSQL ***//

//*** Start Patient Exam Details DTO to sync in MsSQL ***//
export class ParamsPatinetExamDetailsPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}
  
  class ICPropertyKeys {
    @ApiProperty()
    @IsNumber()
    itemId: number;
  
    @ApiProperty()
    @IsNumber()
    itemTypeId: number;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    itemTypeDescription: string | null;
  
    @ApiProperty()
    @IsString()
    itemName: string;
  
    @ApiProperty()
    @IsNumber()
    retailPrice: number;
  
    @ApiProperty()
    @IsNumber()
    quantity: number;
  
    @ApiProperty()
    @IsNumber()
    patientCopayPrimary: number;
  
    @ApiProperty()
    @IsNumber()
    insuranceAllowancePrimary: number;
  
    @ApiProperty()
    @IsNumber()
    insuranceReceivablePrimary: number;
  
    @ApiProperty()
    @IsNumber()
    insuranceDiscountPrimary: number;
  
    @ApiProperty()
    @IsNumber()
    patientCopaySecondary: number;
  
    @ApiProperty()
    @IsNumber()
    insuranceAllowanceSecondary: number;
  
    @ApiProperty()
    @IsNumber()
    insuranceReceivableSecondary: number;
  
    @ApiProperty()
    @IsNumber()
    insuranceDiscountSecondary: number;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    eligibilityIdPrimary: string | null;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    eligibilityIdSecondary: string | null;
  
    @ApiProperty()
    @IsNumber()
    tax: number;
  
    @ApiProperty()
    @IsNumber()
    patientResponsibility: number;
  
    @ApiProperty()
    @IsBoolean()
    isExam: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isContactLens: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isCoating: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isFittingFee: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isProcedure: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isFrame: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isLens: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isLensExtra: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isMisc: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isCopayLine: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isGroupHeaderLine: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isTotalLine: boolean;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    isForRightEye: string | null;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    isForLeftEye: string | null;
  
    @ApiProperty()
    @IsNumber()
    patientMemberOutOfPocketPrimary: number;
  
    @ApiProperty()
    @IsNumber()
    patientMemberOutOfPocketSecondary: number;
  }

export  class BodyPatinetExamDetailsPaDto {
    @ApiProperty()
    @IsNumber()
    patientId: number;
  
    @ApiProperty()
    @IsNumber()
    orderId: number;
  
    @ApiProperty()
    @IsNumber()
    examId: number;
  
    @ApiProperty()
    @IsNumber()
    providerId: number;
  
    @ApiProperty()
    @IsBoolean()
    diabetes: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isInvoiced: boolean;
  
    @ApiProperty()
    @IsBoolean()
    hasEditPermission: boolean;
  
    @ApiProperty()
    @IsBoolean()
    telehealthFeatureAvailable: boolean;
  
    @ApiProperty()
    @IsBoolean()
    performOnTheFlyCalculations: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isLifeStyleQuestionEnabled: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isPriceTransparencyEnabled: boolean;
  
    @ApiProperty()
    @IsString()
    providers: string;
  
    @ApiProperty()
    @IsNumber()
    examCptCodes: number;
  
    @ApiProperty()
    @IsNumber()
    fittingFeeCptCodes: number;
  
    @ApiProperty()
    @IsNumber()
    procedureCptCodes: number;
  
    @ApiProperty()
    @IsNumber()
    pqrsCptCodes: number;
  
    @ApiProperty()
    @IsNumber()
    modifierCodes: number;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodes: number;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    dilationReasons: string | null;
  
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    insuranceEligibilityId: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeA: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeB: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeC: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeD: number | null;

    @ApiProperty()
    @IsNumber()
    diagnosticCodeE: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeF: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeG: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeH: number | null;
 
    @ApiProperty()
    @IsNumber()
    diagnosticCodeI: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeJ: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeK: number | null;
  
    @ApiProperty()
    @IsNumber()
    diagnosticCodeL : number | null;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    multipleExamCptWarning: string;
  
    @ApiProperty()
    @IsNumber()
    selectedExamCptCode: number;
    
    @ApiProperty()
    @IsNumber()
    selectedFittingFeeCptCode: number;
  
    @ApiProperty()
    @IsString()
    selectedProcedureCptCodes: string[];
    
    @ApiProperty()
    @IsNumber()
    selectedPqrsCptCodes: number;
    
    @ApiProperty()
    @IsString()
    dilation: string;
    
    @ApiProperty()
    @IsBoolean()
    armd: boolean;
  
    @ApiProperty()
    @IsBoolean()
    diabeticRetinopathy: boolean;
  
    @ApiProperty()
    @IsBoolean()
    highRiskPreDiabetes: boolean;
  
    @ApiProperty()
    @IsBoolean()
    glaucoma: boolean;
  
    @ApiProperty()
    @IsBoolean()
    highCholesterol: boolean;
  
    @ApiProperty()
    @IsBoolean()
    hypertension: boolean;
  
    @ApiProperty()
    @IsBoolean()
    arcus: boolean;
  
    @ApiProperty()
    @IsBoolean()
    abnormalPupil: boolean;
  
    @ApiProperty()
    @IsBoolean()
    cataract: boolean;
  
    @ApiProperty()
    @IsBoolean()
    pcp: boolean;
  
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    employeeId: number | null;
  
    @ApiProperty()
    @IsBoolean()
    isEstimated: boolean;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    primaryInsurance: string | null;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    secondaryInsurance: string | null;
  
    @ApiProperty({ type: [ICPropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ICPropertyKeys)
    itemCharges: ICPropertyKeys[];
  }

//*** End Patients Exam Details DTO to sync in MsSQL ***//


//*** Start of Patient Exams DTO to sync in MsSQL ***//
export class ParamsPatinetExamsPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class BodyPatinetExamsPaDto {

    @ApiProperty()
    @IsArray()
    @Type(() => PatinetExamsPaDto)
    patientExam: Array<PatinetExamsPaDto>

    @ApiProperty()
    @IsNumber()
    patientId: number;

    @ApiProperty()
    @IsString()
    operation : string;

    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export  class PatinetExamsPaDto {
    @ApiProperty()
    @IsNumber()
    PatientId: number;
  
    @ApiProperty()
    @IsNumber()
    ExamId: number;
    
    @ApiProperty()
    @IsNumber()
    OrderId: number;
  
    @ApiProperty()
    @IsString()
    ExamDate: string;
    
    @ApiProperty()
    @IsString()
    Doctor: string;
    
    @ApiProperty()
    @IsString()
    ProcedureCodes: string;
    
    @ApiProperty()
    @IsString()
    DiagnosisCodes: string;
    
    @ApiProperty()
    @IsString()
    Source: string;
    
    @ApiProperty()
    @IsBoolean()
    IsInvoiced: boolean;
    
    @ApiProperty()
    @IsBoolean()
    HasOrders: boolean;
    
    @ApiProperty()
    @IsString()
    OfficeNumber: string;
    
    @ApiProperty()
    @IsString()
    MultipleExamCptWarning: string;
    
    @ApiProperty()
    @IsString()
    DiagnosisCodesList: string;
    
    @ApiProperty()
    @IsString()
    DiagnosisCodeIds: string;
 
}

//*** End of Patients Exams DTO to sync in MsSQL ***//

//*** Start of Patients MakePaymentMiscellaneousReasons DTO to sync in MsSQL ***//
export class ParamsPatinetMPMRPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class MiscPmtReasonSelectedDto {
    @ApiProperty()
    @IsString()
    Description: string;

    @ApiProperty()
    @IsNumber()
    Key: number;
}

export class PatinetMPMRPaDto{
    @ApiProperty()
    @IsString()
    LastUpdated: string;

    @ApiProperty()
    @IsBoolean()
    IsRequiredNote: boolean;

    @ApiProperty()
    @IsObject()
    @Type(() => MiscPmtReasonSelectedDto)
    MiscPmtReasonSelected: MiscPmtReasonSelectedDto;
}

export class BodyPatinetMPMRPaDto{

    @ApiProperty()
    @IsObject()
    @Type(() => PatinetMPMRPaDto)
    makePaymentMiscellaneousReasons: PatinetMPMRPaDto

    @ApiProperty()
    @IsString()
    patientId: string;

    @ApiProperty()
    @IsString()
    operation : string;

    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}
//*** End of Patients MakePaymentMiscellaneousReasons DTO to sync in MsSQL ***//

//*** Start of Patients PaymentNonInvoiced DTO to sync in MsSQL ***//
export class ParamsPatinetPaymentNonInvoicedPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class PatinetPaymentNonInvoicedPaDto{
    @ApiProperty()
    @IsString()
    OfficeNumber: string;

    @ApiProperty()
    @IsString()
    PatientName: string;

    @ApiProperty()
    @IsNumber()
    PatientId: number;

    @ApiProperty()
    @IsNumber()
    OrderNum: number;

    @ApiProperty()
    @IsString()
    RemakeOrderNumberDisplay: string;

    @ApiProperty()
    @IsNumber()
    RemakeOrderNum: number;

    @ApiProperty()
    @IsString()
    OrderType: string;

    @ApiProperty()
    @IsString()
    OrderTypeDisplay: string;

    @ApiProperty()
    @IsString()
    PrimaryPhone: string;

    @ApiProperty()
    @IsString()
    SecondaryPhone: string;

    @ApiProperty()
    @IsString()
    OrderDate: string;

    @ApiProperty()
    @IsString()
    PromisedDate: string;
    
    @ApiProperty()
    @IsNumber()
    RemainingBalance: number;

    @ApiProperty()
    @IsString()
    OrderBalance: string;

    @ApiProperty()
    @IsNumber()
    PatientAmount: number;

    @ApiProperty()
    @IsString()
    OrderStatus: string;

    @ApiProperty()
    @IsString()
    InvoiceStatus: string;

    @ApiProperty()
    @IsString()
    ClaimStatus: string;

    @ApiProperty()
    @IsString()
    Price: string;

    @ApiProperty()
    @IsString()
    Payment: string;

    @ApiProperty()
    @IsBoolean()
    IsDirty: boolean;

    @ApiProperty()
    @IsString()
    LabName: string;

    @ApiProperty()
    @IsBoolean()
    HasLabJobCancellationBeenRequested: boolean;

    @ApiProperty()
    @IsBoolean()
    LabAllowsCancellation: boolean;

    @ApiProperty()
    @IsNumber()
    SortIndex: number;

    @ApiProperty()
    @IsString()
    ClaimId: string;

    @ApiProperty()
    @IsNumber()
    ClaimDataId: number;

    @ApiProperty()
    @IsNumber()
    MiscOrderWorkflowId: number;

    @ApiProperty()
    @IsString()
    LabOrderIntegrationStatus: string;

    @ApiProperty()
    @IsString()
    FrameFulfillmentOrderStatus: string;

    @ApiProperty()
    @IsString()
    ABBStatus: string;

    @ApiProperty()
    @IsString()
    CLSupplierItemStatus: string;

    @ApiProperty()
    @IsBoolean()
    IsReadyForProcessing: boolean;

    @ApiProperty()
    @IsNumber()
    InvoiceId: number;

    @ApiProperty()
    @IsString()
    PreviousPayment: string;

    @ApiProperty()
    @IsNumber()
    DefaultDepositPayment: number;

    @ApiProperty()
    @IsString()
    CanDeliver: string;
    
    @ApiProperty()
    @IsString()
    HasDeliverWFAction: string;

    @ApiProperty()
    @IsBoolean()
    IsSelected: boolean;

    @ApiProperty()
    @IsString()
    InsuranceDateRange: string;

    @ApiProperty()
    @IsBoolean()
    IsRemake: boolean;

    @ApiProperty()
    @IsString()
    NoClaimDescription: string;

    @ApiProperty()
    @IsBoolean()
    HasDetails: boolean;

    @ApiProperty()
    @IsString()
    LabSystem: string;

    @ApiProperty()
    @IsBoolean()
    AllowRetransmission: boolean;

    @ApiProperty()
    @IsString()
    HasValidDiopterIncrement: string;

    @ApiProperty()
    @IsString()
    LabStatus: string;

    @ApiProperty()
    @IsBoolean()
    IsLabOrderAtRisk: boolean;

    @ApiProperty()
    @IsBoolean()
    IsLabOrderStatusHistory: boolean;

    @ApiProperty()
    @IsString()
    Carrier: string;

    @ApiProperty()
    @IsString()
    PromotionApplied: string;

    @ApiProperty()
    @IsString()
    PromotionSavings: string;

    @ApiProperty()
    @IsString()
    Retail: string;

    @ApiProperty()
    @IsString()
    TotalDiscount: string;

    @ApiProperty()
    @IsString()
    TotalTax: string;

    @ApiProperty()
    @IsString()
    TotalInsurance: string;

    @ApiProperty()
    @IsString()
    EstimatedDeliveryDate: string;

    @ApiProperty()
    @IsNumber()
    NumberOfRetransmits: number;

    @ApiProperty()
    @IsString()
    EstimatedDeliveryDateDisplay: string;

    @ApiProperty()
    @IsBoolean()
    IsQualificationRequired: boolean;

    @ApiProperty()
    @IsBoolean()
    IsValid: boolean;

    @ApiProperty()
    @IsString()
    ValidationMessage: string;

    @ApiProperty()
    @IsBoolean()
    IsSameDayInsurancePricing: boolean;

    @ApiProperty()
    @IsBoolean()
    IsSameDayTaxesApplied: boolean;

    @ApiProperty()
    @IsBoolean()
    IsDisabled: boolean;

    @ApiProperty()
    @IsNumber()
    FrameStatus: number;

    @ApiProperty()
    @IsBoolean()
    ShowAddWarranty: boolean;

    @ApiProperty()
    @IsBoolean()
    ShowRedeemWarranty: boolean;

    @ApiProperty()
    @IsString()
    WarrantyTargetOrderId: string;

    @ApiProperty()
    @IsBoolean()
    IsWarrantyRedeemed: boolean;
    
    @ApiProperty()
    @IsString()
    DeliveryDate: string;
    
    @ApiProperty()
    @IsString()
    SaleTransactionDate: string;
    
    @ApiProperty()
    @IsBoolean()
    OverrideWarrantyAfterPurchase: boolean;
    
    @ApiProperty()
    @IsNumber()
    WarrantyAddedToOrderNum: number;
    
    @ApiProperty()
    @IsBoolean()
    ShowPrintInvoiceDetail: boolean;
    
    @ApiProperty()
    @IsNumber()
    SalePaymentId: number;
    
    @ApiProperty()
    @IsString()
    WarrantyDescription: string;
    
    @ApiProperty()
    @IsBoolean()
    IsTargetOrder: boolean;
    
    @ApiProperty()
    @IsBoolean()
    HasPatientWarranty: boolean;
}

export class BodyPatinetPaymentNonInvoicedPaDto {
    @ApiProperty()
    @IsArray()
    @Type(() => PatinetPaymentNonInvoicedPaDto)
    paymentNonInvoiced: Array<PatinetPaymentNonInvoicedPaDto>

    @ApiProperty()
    @IsNumber()
    patientId: number;

    @ApiProperty()
    @IsString()
    operation : string;

    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}
//*** End of Patients PaymentNonInvoiced DTO to sync in MsSQL ***//

//*** Start of Patients PaymentTransactions DTO to sync in MsSQL ***//
export class ParamsPatinetpaymenttransactionsPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class PatinetPaymentTransactionsPaDto {
    @ApiProperty()
    @IsNumber()
    MiscPaymentId: number;

    @ApiProperty()
    @IsNumber()
    PaymentId: number;

    @ApiProperty()
    @IsString()
    AmountDisplay: string;

    @ApiProperty()
    @IsNumber()
    Amount: number;

    @ApiProperty()
    @IsString()
    Associate: string;

    @ApiProperty()
    @IsNumber()
    EmployeeId: number;

    @ApiProperty()
    @IsString()
    OrderTypeDisplay: string;

    @ApiProperty()
    @IsString()
    OrderType: string;

    @ApiProperty()
    @IsNumber()
    OrderID: number;

    @ApiProperty()
    @IsString()
    OfficeId: string;

    @ApiProperty()
    @IsString()
    PatientName: string;

    @ApiProperty()
    @IsNumber()
    PatientID: number;

    @ApiProperty()
    @IsString()
    TransactionTypeString: string;

    @ApiProperty()
    @IsNumber()
    TransactionTypeID: number;

    @ApiProperty()
    @IsString()
    TransactionDateDisplay: string;

    @ApiProperty()
    @IsString()
    TransactionDate: string;

    @ApiProperty()
    @IsNumber()
    TransactionId: number;

    @ApiProperty()
    @IsString()
    MiscPaymentReason: string;

    @ApiProperty()
    @IsString()
    RefundReason: string;

    @ApiProperty()
    @IsString()
    ReportUrl: string;

    @ApiProperty()
    @IsBoolean()
    ReportAvailable: boolean;
}


export class BodyPatinetpaymenttransactionsPaDto {
    @ApiProperty()
    @IsArray()
    @Type(() => PatinetPaymentTransactionsPaDto)
    paymentTransactions: Array<PatinetPaymentTransactionsPaDto>

    @ApiProperty()
    @IsNumber()
    patientId: number;

    @ApiProperty()
    @IsString()
    operation : string;

    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}
//*** End of Patients PaymentTransactions DTO to sync in MsSQL ***//

//*** Start of Patients EyeglassOrderDetail DTO to sync in MsSQL ***//
export class ParamsPatinetEyeglassOrderDetailPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class PatinetEyeglassOrderDetailPaDto {
    @ApiProperty()
    @IsNumber()
    OrderNumber: number;

    @ApiProperty()
    @IsNumber()
    CopyOrderNumber: number;
    
    @ApiProperty()
    @IsString()
    OfficeNum: string;

    @ApiProperty()
    @IsString()
    OrderDate: string;

    @ApiProperty()
    @IsString()
    OrderTime: string;

    @ApiProperty()
    @IsString()
    ProcessDate: string;
    
    @ApiProperty()
    @IsString()
    DeliveryDate: string;
    
    @ApiProperty()
    @IsString()
    ExpectDate: string;
    
    @ApiProperty()
    @IsString()
    StatusCode: string;
    
    @ApiProperty()
    @IsString()
    StatusCodeChangedDate: string;
    
    @ApiProperty()
    @IsString()
    InvoiceStatus: string;
    
    @ApiProperty()
    @IsNumber()
    NumberOfRemakes: number;
    
    @ApiProperty()
    @IsBoolean()
    PhoneOrder: boolean;
    
    @ApiProperty()
    @IsBoolean()
    ClaimBilled: boolean;
    
    @ApiProperty()
    @IsBoolean()
    IsInvoiced: boolean;
    
    @ApiProperty()
    @IsBoolean()
    IsOrderStatusLabOnHold: boolean;
    
    @ApiProperty()
    @IsNumber()
    PatientExamId: number;
    
    @ApiProperty()
    @IsBoolean()
    IsOutsideDoctor: boolean;
    
    @ApiProperty()
    @IsBoolean()
    IsVsp: boolean;
    
    @ApiProperty()
    @IsString()
    RxDate: string;
    
    @ApiProperty()
    @IsString()
    EyeglassOrderType: string;
    
    @ApiProperty()
    @IsString()
    EyeglassOrderTypeDescription: string;
    
    @ApiProperty()
    @IsBoolean()
    OrderIsValid: boolean;
    
    @ApiProperty()
    @IsBoolean()
    ManualLabOrder: boolean;
    
    @ApiProperty()
    @IsString()
    SellingModel: string;
    
    @ApiProperty()
    @IsNumber()
    PatientId: number;
    
    @ApiProperty()
    @IsNumber()
    DoctorId: number;
    
    @ApiProperty()
    @IsString()
    DoctorFullName: string;
    
    @ApiProperty()
    @IsNumber()
    EmployeeId: number;
    
    @ApiProperty()
    @IsString()
    DispenseType: string;
    
    @ApiProperty()
    @IsString()
    DispenseNote: string;
    
    @ApiProperty()
    @IsString()
    OrderType: string;
    
    @ApiProperty()
    @IsNumber()
    LabId: number;
    
    @ApiProperty()
    @IsString()
    LabInstructions: string;
    
    @ApiProperty()
    @IsBoolean()
    ToMakeFrame: boolean;
    
    @ApiProperty()
    @IsBoolean()
    ToMakeLeftLens: boolean;
    
    @ApiProperty()
    @IsBoolean()
    ToMakeRightLens: boolean;
    
    @ApiProperty()
    @IsBoolean()
    ToMakeExtras: boolean;
    
    @ApiProperty()
    @IsString()
    ShipTo: string;
    
    @ApiProperty()
    @IsString()
    ShipToType: string;
    
    @ApiProperty()
    @IsNumber()
    ServiceLocationId: number;
    
    @ApiProperty()
    @IsNumber()
    RemakeOrder: number;
    
    @ApiProperty()
    @IsNumber()
    RemakeTypeId: number;
    
    @ApiProperty()
    @IsString()
    RemakeTypeOverride: string;
    
    @ApiProperty()
    @IsNumber()
    OverrideRemakeUserId: number;
    
    @ApiProperty()
    @IsString()
    RemakeType: string;
    
    @ApiProperty()
    @IsString()
    RemakeOrderDetail: string;
    
    @ApiProperty()
    @IsString()
    RemakeDisplayString: string;
    
    @ApiProperty()
    @IsString()
    RemakeReasons: string;
    
    @ApiProperty()
    @IsString()
    RemakeNote: string;
    
    @ApiProperty()
    @IsNumber()
    RemakeNoteId: number;
    
    @ApiProperty()
    @IsBoolean()
    IsOldSystemRemake: boolean;
    
    @ApiProperty()
    @IsBoolean()
    IsWarrantyRedemption: boolean;
    
    @ApiProperty()
    @IsBoolean()
    IsRemakeConfigurationEnabled: boolean;
    
    @ApiProperty()
    @IsString()
    InsurancePricing: string;
    
    @ApiProperty()
    @IsNumber()
    InsuranceEligibilityId: number;
    
    @ApiProperty()
    @IsNumber()
    WarrantyInstanceId: number;
    
    @ApiProperty()
    @IsBoolean()
    IsQualificationRequired: boolean;
    
    @ApiProperty()
    @IsNumber()
    QualificationId: number;
    
    @ApiProperty()
    @IsString()
    QualificationDateUtc: string;
    
    @ApiProperty()
    @IsNumber()
    QualificationLabId: number;
    
    @ApiProperty()
    @IsString()
    QualificationLabName: string;
    
    @ApiProperty()
    @IsNumber()
    RedeemOrderNumber: number;
    
    @ApiProperty()
    @IsNumber()
    InventoryReturnOptionID: number;
    
    @ApiProperty()
    @IsString()
    InventoryReturnOptionNote: string;
    
    @ApiProperty()
    @IsBoolean()
    RedeemExact: boolean;
    
    @ApiProperty()
    @IsBoolean()
    RedeemProductChange: boolean;
    
    @ApiProperty()
    @IsNumber()
    OverrideRedemptionUserId: number;
    
    @ApiProperty()
    @IsString()
    ItemsBeingRedeemed: string;
    
    @ApiProperty()
    @IsNumber()
    LensCoatingsRetailPrice: number;
    
    @ApiProperty()
    @IsNumber()
    LensEdgeRetailPrice: number;
    
    @ApiProperty()
    @IsNumber()
    LensTintRetailPrice: number;
    
    @ApiProperty()
    @IsNumber()
    ExtrasRetailPrice: number;
    
    @ApiProperty()
    @IsString()
    Extras: string;
    
    @ApiProperty()
    @IsString()
    Lenses: string;
    
    @ApiProperty()
    @IsString()
    Frame: string;
    
    @ApiProperty()
    @IsString()
    Lab: string;
    
    @ApiProperty()
    @IsString()
    PdType: string;
}

export class BodyPatinetEyeglassOrderDetailPaDto {
    @ApiProperty()
    @IsArray()
    @Type(() => PatinetEyeglassOrderDetailPaDto)
    eyeglassOrderDetails: Array<PatinetEyeglassOrderDetailPaDto>

    @ApiProperty()
    @IsNumber()
    patientId: number;

    @ApiProperty()
    @IsString()
    operation : string;

    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}
//*** End of Patients EyeglassOrderDetail DTO to sync in MsSQL ***//

//*** Start Patient phones DTO to sync in MsSQL ***//
export class ParamsPatinetAdressPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}
export class ParamsPatientRelationshipPaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class BodyPatinetAdressPaDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Adress)
    PatientAdress: Array<Adress>

    @ApiProperty()
    @IsNumber()
    patientId: number;

    @ApiProperty()
    @IsString()
    operation : string;
}
export class BodyPatinetRelationshipPaDto {

    @ApiProperty()
    @IsArray()
    @Type(() => PatientRelationship)
    patientRelationship: Array<PatientRelationship>

    @ApiProperty()
    @IsNumber()
    patientId: number;

    @ApiProperty()
    @IsString()
    operation : string;
}

class patientAdressDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Adress)
    PatientAdress: Array<Adress>
}

class Adress {
    @ApiProperty()
    @IsNumber()
    AddressId: number;
  
    @ApiProperty()
    @IsNumber()
    AddressTypeId: number;
  
    @ApiProperty()
    @IsString()
    Address1: string;
  
    @ApiProperty()
    @IsString()
    Address2: string;
  
    @ApiProperty()
    @IsString()
    City: string;
  
    @ApiProperty()
    @IsString()
    State: string;
  
    @ApiProperty()
    @IsString()
    ZipCode: string;
  
    @ApiProperty()
    @IsBoolean()
    IsPrimary: boolean;
  
    @ApiProperty()
    @IsString()
    AddressType: string;
  
    @ApiProperty()
    @IsString()
    Country: string;
  
    @ApiProperty()
    @IsNumber()
    CountryId: number;
}
class PatientRelationship {
    @ApiProperty()
    @IsString()
    Address: string;
  
    @ApiProperty()
    @IsNumber()
    Age: number;

    @ApiProperty()
    @IsString()
    CompanyId: string;

    @ApiProperty()
    @IsString()
    DateOfBirth: string;

    @ApiProperty()
    @IsString()
    ExamOffice: string;
  
    @ApiProperty()
    @IsString()
    FirstName: string;

    @ApiProperty()
    @IsString()
    HomeOffice: string;
  
    @ApiProperty()
    @IsString()
    InActive: string;

    @ApiProperty()
    @IsString()
    IsPatient: string;
  
    @ApiProperty()
    @IsString()
    IsResponsibleParty: string;
  
    @ApiProperty()
    @IsString()
    LastExamDate: string;
  
    @ApiProperty()
    @IsString()
    LastName: string;

    @ApiProperty()
    @IsString()
    NickName: string;

    @ApiProperty()
    @IsString()
    OrderId: string;
    
    @ApiProperty()
    @IsNumber()
    PatientId: number;
    
    @ApiProperty()
    @IsString()
    Phone: string;

    @ApiProperty()
    @IsString()
    ProfilePhoto: string;
    
    @ApiProperty()
    @IsString()
    RtePartnerCode: string;
    
}
//*** End Patient phones DTO to sync in MsSQL ***//

//*** Start Patient recares DTO to sync in MsSQL ***//
export class ParamsPatientRecaresDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

class IntervalDto {
    @ApiProperty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsNumber()
    count: number;

};

class Recares {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNumber()
    dueDate: number;

    @ApiProperty()
    @IsNumber()
    serviceDate: number;

    @ApiProperty()
    @IsNumber()
    postedDate: number;

    @ApiProperty()
    @IsNumber()
    scheduled: number;

    @ApiProperty()
    @IsNumber()
    appointmentId: number;

    @ApiProperty()
    @IsObject()
    @Type(() => IntervalDto)
    interval: IntervalDto;

    @ApiProperty()
    @IsNumber()
    typeId: number;

    @ApiProperty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    user: string;

    @ApiProperty()
    @IsObject()
    appointmentLocationId: object;

    @ApiProperty()
    @IsObject()
    recareLocationId: object;
}

export class PatientRecaresDto {
    @ApiProperty()
    @IsNumber()
    patientid: number;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Recares)
    recares: Array<Recares>
}

export class BodyPatientRecaresDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PatientRecaresDto)
    recares: Array<PatientRecaresDto>
}

/*Start - DTO for referred patients */
export class ParamsReferredPatientDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}

export class ReferredPatientId{
    @ApiProperty()
    @IsNumber()
    id: number;
}

export class ReferredPatient{
    @ApiProperty()
    @IsString()
    patientid: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=>ReferredPatientId)
    referredPatients: Array<ReferredPatientId>
}

export class BodyReferredPatient{
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=>ReferredPatient)
    referredPatients: ReferredPatient[]
}
/*End - DTO for referred patients */
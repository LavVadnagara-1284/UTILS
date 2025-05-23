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

class PropertyKeys {
    @ApiProperty()
    @IsString()
    description: string;
  
    @ApiProperty()
    @IsNumber()
    key: number;
  
    @ApiProperty()
    @IsNumber()
    keyValue: number;
  }
class MCSPropertyKeys {
    @ApiProperty()
    @IsString()
    description: string;
  
    @ApiProperty()
    @IsNumber()
    key: number;
  
    @ApiProperty()
    @IsNumber()
    keyValue: number;
    
    @ApiProperty()
    @IsString()
    keyStr: string;
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

  class SelectedExamCptCode {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    patientExamProcedureId: number | null;
  
    @ApiProperty()
    @IsBoolean()
    available: boolean;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    procedureCode: string | null;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    procedureName: string | null;
  
    @ApiProperty()
    @IsBoolean()
    isFittingFee: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isExam: boolean;
  
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode1: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode2: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode3: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode4: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode5: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode6: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode7: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode8: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode9: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode10: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode11: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString()
    diagCode12: string;
  
    @ApiProperty()
    @IsNumber()
    itemId: number;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price: number | null;
    
    @ApiProperty()
    @IsBoolean()
    allowZeroPrice: boolean;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    priceDisplay: string | null;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedDiagnosticCodeIds: number[];
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedDiagnosticCodesDisplay: string[];
  
    @ApiProperty()
    @IsNumber()
    pqrsCode: number;
    
    @ApiProperty()
    @IsString()
    pqrsDescription: string;
  
    @ApiProperty()
    @IsString()
    modifier1: string;
    
    @ApiProperty()
    @IsString()
    modifier2: string;
    
    @ApiProperty()
    @IsString()
    modifier3: string;
    
    @ApiProperty()
    @IsString()
    modifier4: string;
  
    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedModifierCodes: number[];
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedModifierCodesDisplay: string;
  }

  class SelectedFittingFeeCptCode {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    patientExamProcedureId: number | null;
  
    @ApiProperty()
    @IsBoolean()
    available: boolean;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    procedureCode: string | null;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    procedureName: string | null;
  
    @ApiProperty()
    @IsBoolean()
    isFittingFee: boolean;
  
    @ApiProperty()
    @IsBoolean()
    isExam: boolean;
  
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode1: string;
    
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode2: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode3: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode4: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode5: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode6: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode7: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode8: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode9: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode10: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode11: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    diagCode12: string;
  
    @ApiProperty()
    @IsNumber()
    itemId: number;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price: number | null;
    
    @ApiProperty()
    @IsBoolean()
    allowZeroPrice: boolean;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    priceDisplay: number | null;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedDiagnosticCodeIds: number[];
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedDiagnosticCodesDisplay: number[];
  
    @ApiProperty()
    @IsBoolean()
    pqrsCode: boolean;
    
    @ApiProperty()
    @IsBoolean()
    pqrsDescription: boolean;
  
    @ApiProperty()
    @IsBoolean()
    modifier1: boolean;
    
    @ApiProperty()
    @IsBoolean()
    modifier2: boolean;
    
    @ApiProperty()
    @IsBoolean()
    modifier3: boolean;
    
    @ApiProperty()
    @IsBoolean()
    modifier4: boolean;
  
    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedModifierCodes: string[];
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    selectedModifierCodesDisplay: string;
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
  
    @ApiProperty({ type: [PropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyKeys)
    providers: PropertyKeys[];
  
    @ApiProperty({ type: [PropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyKeys)
    examCptCodes: PropertyKeys[];
  
    @ApiProperty({ type: [PropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyKeys)
    fittingFeeCptCodes: PropertyKeys[];
  
    @ApiProperty({ type: [PropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyKeys)
    procedureCptCodes: PropertyKeys[];
  
    @ApiProperty({ type: [PropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyKeys)
    pqrsCptCodes: PropertyKeys[];
  
    @ApiProperty({ type: [MCSPropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MCSPropertyKeys)
    modifierCodes: MCSPropertyKeys[];
  
    @ApiProperty({ type: [PropertyKeys] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyKeys)
    diagnosticCodes: PropertyKeys[];
  
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
  
    @ApiProperty({ type: SelectedExamCptCode })
    @ValidateNested()
    @Type(() => SelectedExamCptCode)
    selectedExamCptCode: SelectedExamCptCode;
    
    @ApiProperty({ type: SelectedFittingFeeCptCode })
    @ValidateNested()
    @Type(() => SelectedFittingFeeCptCode)
    selectedFittingFeeCptCode: SelectedFittingFeeCptCode;
  
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

export  class BodyPatinetExamsPaDto {
    @ApiProperty()
    @IsNumber()
    patientId: number;
  
    @ApiProperty()
    @IsNumber()
    examId: number;
    
    @ApiProperty()
    @IsNumber()
    orderId: number;
  
  }

//*** End of Patients Exams DTO to sync in MsSQL ***//

//*** Start Patient phones DTO to sync in MsSQL ***//
export class ParamsPatinetPhonePaDto {
    @ApiProperty()
    @IsString()
    appointmentlocation: string;
}


class Name {
    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNumber()
    personId: number;
}

class Role {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    value: string;

    @ApiProperty()
    @IsString()
    description: string;
}

class PatientContactDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty({ type: Name })
    name: Name;

    @ApiProperty({ type: Role })
    role: Role;

    @ApiProperty()
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty()
    @IsBoolean()
    isEmergencyContact: boolean;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    emergencyContactType?: number;
}
export class BodyPatinetPhonePaDto {
    @ApiProperty()
    @IsString()
    patientid: string;

    @ApiProperty({ type: [PatientContactDto] })
    @IsArray()
    phones: PatientContactDto[];
}
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
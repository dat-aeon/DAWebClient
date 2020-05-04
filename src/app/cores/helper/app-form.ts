export interface appForm {
  daApplicationTypeId: 1;
  name: any;
  dob: any;
  nrcNo: any;
  fatherName: any;
  highestEducationTypeId: any;
  nationality: any;
  nationalityOther: any;
  gender: any;
  maritalStatus: any;
  currentAddress: any;
  currentAddressBuildingNo: any;
  currentAddressRoomNo: any;
  currentAddressFloor: any;
  currentAddressStreet: any;
  currentAddressQtr: any;
  currentAddresssCity: any;
  permanentAddress: any;
  permanentAddressBuildingNo: any;
  permanentAddressRoomNo: any;
  permanentAddressFloor: any;
  permanentAddressStreet: any;
  permanentAddressQtr: any;
  permanentAddressCity: any;
  permanentAddressTownship: any;
  typeOfResidence: any;
  typeOfResidenceOther: any;
  livingWith: any;
  livingWithOther: any;
  yearOfStayYear: any;
  yearOfStayMonth: any;
  mobileNo: any;
  residentTelNo: any;
  otherPhoneNo: any;
  email: any;
  customerId: any;
  daLoanTypeId: any;
  financeAmount: any;
  financeTerm: any;
  daProductTypeId: any;
  productDescription: any;
  channelType: 2;
  applicantCompanyInfoDto: applicantCompanyInfoDto;
  guarantorInfoDto: guarantorInfoDto;
  emergencyContactInfoDto: emergencyContactInfoDto;
  applicationInfoAttachmentDtoList: [],
}

export interface guarantorInfoDto {
  name: any;
  dob: any;
  nrcNo: any;
  nationality: any;
  nationalityOther: any;
  mobileNo: any;
  residentTelNo: any;
  relationship: any;
  relationshipOther: any;
  currentAddress: any;
  currentAddressBuildingNo: any;
  currentAddressRoomNo: any;
  currentAddressFloor: any;
  currentAddressStreet: any;
  currentAddressQtr: any;
  currentAddressCity: any;
  currentAddressTownship: any;
  typeOfResidence: any;
  typeOfResidenceOther: any;
  livingWith: any;
  livingWithOther: any;
  gender: any;
  maritalStatus: any;
  yearOfStayYear: any;
  yearOfStayMonth: any;
  companyName: any;
  companyTelNo: any;
  companyAddress: any;
  companyAddressBuildingNo: any;
  companyAddressRoomNo: any;
  companyAddressFloor: any;
  companyAddressStreet: any;
  companyAddressQtr: any;
  companyAddressCity: any;
  companyAddressTownship: any;
  department: any;
  position: any;
  yearOfServiceYear: any;
  yearOfServiceMonth: any;
  monthlyBasicIncome: any;
  totalIncome: any;
}

export interface applicantCompanyInfoDto {
  companyName: any;
  companyAddress: any;
  companyAddressBuildingNo: any;
  companyAddressRoomNo: any;
  companyAddressFloor: any;
  companyAddressStreet: any;
  companyAddressQtr: any;
  companyAddressCity: any;
  companyAddressTownship: any;
  companyTelNo: any;
  contactTimeFrom: any;
  contactTimeTo: any;
  department: any;
  position: any;
  yearOfServiceYear: any;
  yearOfServiceMonth: any;
  companyStatus: any;
  companyStatusOther: any;
  monthlyBasicIncome:any;
  otherIncome:any;
  totalIncome:any;
  salaryDate:any;
}

export interface emergencyContactInfoDto {
  name: any;
  relationship: any;
  relationshipOther: any;
  currentAddressBuildingNo: any;
  currentAddressRoomNo: any;
  currentAddressFloor: any;
  currentAddressStreet: any;
  currentAddressQtr: any;
  currentAddressCity: any;
  currentAddressTownship: any;
  mobileNo: any;
  residentTelNo: any;
  otherPhoneNo: any;
}

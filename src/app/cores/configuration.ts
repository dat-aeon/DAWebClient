import { HttpHeaders } from '@angular/common/http';
 
export const config = {
  api: 'https://ass.aeoncredit.com.mm/daso',
  base_url: 'http://localhost:8080/aeon_web/',
  apiUsername: 'vcs-api-client',
  apiPassword: 'vcs-api-client',
  inputPatten: /[^\x00-\x7F]+/ig,
  imageType: 'data:image/png;base64,',
  imageUrl: 'https://ass.aeoncredit.com.mm/daso/digital-application-image-files/',
  purchaseImgUrl: 'https://ass.aeoncredit.com.mm/daso/purchase-image-files/'
};

export const BasicAuthHeader = new HttpHeaders({
  'content-type': 'application/x-www-form-urlencoded',
  Authorization: 'Basic ' + btoa(config.apiUsername + ':' + config.apiUsername)
});

export const JSONHeader = new HttpHeaders({
  'Content-Type': 'application/json',
  'Accept': 'Application/json'
});

export function DateToJson(dateInput: any) {
  const d = new Date(dateInput);
  const dateJson: any = {};
  const dateFormat: any = {};

  dateJson.year = d.getUTCFullYear();

  if(d.getUTCMonth() < 10) {
    dateJson.month = '0' + d.getUTCMonth();
  } else {
    dateJson.month = d.getUTCMonth();
  }

  if(d.getUTCDay() < 10) {
    dateJson.day = '0' + d.getUTCDay();
  } else {
    dateJson.day = d.getUTCDay();
  }
  
  dateFormat.json = dateJson;
  dateFormat.format = dateJson.year + '-' + (dateJson.month + 1) + '-' + dateJson.day;
  return dateFormat;
}

export function nrcFormat (str: string) {
  const nrc: any = {};

  if(str === null || str === undefined) {
    return nrc;
  }
  
  if(str !== null) {
    nrc.no = Number(str.split('/')[0]);
    nrc.code = str.split(')')[1];
    nrc.list = str.split('(')[0].split('/')[1];
    nrc.type = '(' + str.split('(')[1].split(')')[0] + ')';
    return nrc;
  }

}

export function JSONtoDate (jsonFormat: any = {}) {
  if(Number(jsonFormat.month) < 10) {
    jsonFormat.month = '0' + Number(jsonFormat.month);
  }

  if(Number(jsonFormat.day) < 10) {
    jsonFormat.day = '0' + Number(jsonFormat.day);
  }
  
  const dateformat = jsonFormat.year + '-' + jsonFormat.month + '-' + jsonFormat.day;

  return dateformat;
}

export function dateToJsonFormat (dateFormat: string) {
  console.log(dateFormat);
  const jsonFormat: any = {};
  const data = dateFormat.split('-');
  return data;
}

export function compareSelected(c1: any, c2:any): boolean {    
  console.log(c2); 
  return c1 && c2 ? c1.id === c2.id : c1 === c2; 
}


export type OracleType = 'YES_NO' | 'YES_NO_MAYBE';

export enum OracleResponse {
  YES = 'YES', 
  NO = 'NO', 
  MAYBE = 'MAYBE'
}

export interface GeneratedName {
    gender: 'male' | 'female';
    firstName: string;
    lastName: string;
}

export const SERVER_TEXT = 'H3lp3r API';
export const PRETTY_PARAM = '_pretty';
export const RESPONSE_STATUS_KEY = 'response-status';
export const RESPONSE_TIME_HEADER = 'X-Response-Time';

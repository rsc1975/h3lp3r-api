
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


export type SatSection = 'reading-writing' | 'math'
export type SatForm = `practice-${4|5|6|7|8|9|10|11}-paper`
export type SatQuestion = {
  id:number;form_code:SatForm;section:SatSection;module_number:number;question_number:number
  passage:string;prompt:string;choices:{key:string;text:string}[];answer_type:'multiple-choice'|'numeric';image_path:string|null
}
export type SatDaily = {available:boolean;section?:SatSection;needed?:number;published?:number;lives:number;maxLives:number;total:number;answered:number;correct:number;finished:boolean;completionProof?:string|null;question:SatQuestion|null;feedback?:{correct:boolean;acceptedAnswers:string[];explanation:string}}
export type SatExam = {formCode:SatForm;ready:boolean;modules:{section:SatSection;module_number:number;total:number;published:number;minutes:number}[];questions:SatQuestion[]}
export type ScoreRange = {lower:number;upper:number}
export type SatGrade = {formCode:SatForm;correct:number;total:number;scoreRange:ScoreRange;scoringSource:string;note:string;
  sections:Record<SatSection,{correct:number;total:number;scoreRange:ScoreRange}>;
  modules:{section:SatSection;moduleNumber:number;correct:number;total:number}[]}

export type MextTrack = 'A'|'B'
export type MextScience = 'physics'|'biology'
export type MextSubject = 'japanese'|'english'|'math'|'chemistry'|'physics'|'biology'
export type MextQuestion = {id:number;edition:number;track:MextTrack;subject:MextSubject;section:string;item_code:string;position:number;
  prompt:string;transcript:string;asset_paths:string[];answer_type:'choice'|'numeric'|'true-false'|'text';choices:string[];
  points:number;source_url:string;source_page:number}
export type MextAvailability = {edition:number;track:MextTrack;science:MextScience|null;ready:boolean;
  subjects:{subject:MextSubject;published:number;total:number;minutes:number}[]}
export type MextExam = MextAvailability & {questions:MextQuestion[]}
export type MextDaily = {available:boolean;track:MextTrack;subject:MextSubject;needed?:number;published?:number;lives:number;maxLives:number;total:number;answered:number;correct:number;finished:boolean;completionProof?:string|null;question:MextQuestion|null;feedback?:{correct:boolean;acceptedAnswers:string[]}}
export type MextGrade = {edition:number;track:MextTrack;earned:number;maximum:number;
  sections:Record<MextSubject,{earned:number;maximum:number;correct:number;total:number}>;source:string;note:string}

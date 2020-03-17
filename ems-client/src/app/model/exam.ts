import {Question} from './question';

export class Exam {
    id: number;
    questions: Array<Question>;
    examinee: string;
    examDate: Date;
    submissionDate: Date;
    configurationName: string;
    status: string;
    correct: number;
    sum: number;
}

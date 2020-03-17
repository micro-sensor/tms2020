import { QuestionReview } from './question-review';

export class ExamReview {
    questions: Array<QuestionReview>;
    examinee: String;
    examDate: Date;
    submissionDate: Date;
    configurationName: string;
    correct: number;
    sum: number;
}

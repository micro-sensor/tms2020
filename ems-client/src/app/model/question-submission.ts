import { Choice } from './choice';

export class QuestionSubmission {
    examId: number;
    questionId: number;
    flagged: boolean;
    choiceEmsDtos: Choice[];
    textAnswer: string;
}

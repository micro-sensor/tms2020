import {Choice} from './choice';

export class Question {
    id: number;
    body: string;
    choices: Choice[];
    code: string;
    flagged: boolean;
}

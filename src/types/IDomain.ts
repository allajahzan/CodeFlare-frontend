import { IWeek } from "./IWeek";

// Interface for domains week
export interface IDomainsWeek {
    week: IWeek;
    title: string;
}

// Interface for domain
export interface IDomain {
    _id: string;
    name: string;
    domainsWeeks: IDomainsWeek[]
}
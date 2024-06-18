import { MbscCalendarEvent } from "@mobiscroll/angular";

export interface ApiCalendarEvent extends MbscCalendarEvent {
  /** A unique id for the event. If not specified, the event will get a generated id. */
  deadline: string;
  /** Start date of the event */
  start_date?: number;
  /** The name of the event. */
  name: string;

}

export interface DataJsonEvents extends TopLevel {
    "start":"2024-01-22T08:00:00.000Z",
    "end":"2024-01-25T17:00:00.000Z",
    "title":"Business of Software Conference",
    "color":"#ff6d42"
}

export interface TopLevel extends MbscCalendarEvent {
  start?:     string;
  end?:       string;
  title:      string;
  color:      string;
}

/* export interface Recurring {
  repeat:    Repeat;
  month?:    number;
  day?:      number;
  weekDays?: string;
}

export enum Repeat {
  Weekly = "weekly",
  Yearly = "yearly",
} */



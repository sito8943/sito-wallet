export interface CalendarTimeAgeLabelsType {
  ago: string;
  minute: string;
  minutes: string;
  hour: string;
  hours: string;
  yesterday: string;
  justNow: string;
}

export interface FormatCalendarTimeAgeOptionsType {
  language: string;
  labels: CalendarTimeAgeLabelsType;
  now?: Date;
}


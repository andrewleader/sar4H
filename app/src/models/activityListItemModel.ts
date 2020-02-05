import { IActivityListItem } from "../api/responses";
import moment from 'moment';

export default class ActivityListItemModel {
  id: number;
  published: boolean;
  date?: Date; // "2018-10-06T18:30:00.000Z"
  enddate?: Date;
  title: string; // The title
  lat: number;
  lng: number;
  count_attendance: number; // # of attendees, like 4
  description: string;

  constructor (source: IActivityListItem) {
    this.id = source.id;
    this.published = source.published === 1;
    if (source.date) {
      this.date = new Date(source.date);
    }
    if (source.enddate) {
      this.enddate = new Date(source.enddate);
    }
    this.title = source.ref_desc;
    this.lat = source.lat;
    this.lng = source.lng;
    this.count_attendance = source.count_attendance;
    this.description = source.description;
  }

  getFriendlyDate() {
    if (this.date) {
      return moment(this.date).calendar(undefined, {
        sameDay: '[Today], h:mm a',
        nextDay: '[Tomorrow], h:mm a',
        nextWeek: '[This] dddd, h:mm a',
        lastDay: '[Yesterday], h:mm a',
        lastWeek: '[Last] dddd, h:mm a',
        sameElse: 'dddd, MMM Do, h:mm a'
      });
    }
    return "Not scheduled";
  }
}
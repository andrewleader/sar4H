import { IIncidentListItem } from "../api/responses";

export default class MissionListItemModel {
  id: number;
  published: boolean;
  date?: Date; // "2018-10-06T18:30:00.000Z"
  enddate?: Date;
  title: string; // The title
  lat: number;
  lng: number;
  count_attendance: number; // # of attendees, like 4

  constructor (source: IIncidentListItem) {
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
  }
}
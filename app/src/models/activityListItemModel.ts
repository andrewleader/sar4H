import { IActivityListItem, IAttendanceListItem } from "../api/responses";
import moment from 'moment';
import { observable } from 'mobx';
import MembershipModel from "./membershipModel";

export enum ActivityType {
  mission,
  meeting,
  training
}

export default class ActivityListItemModel {
  id: number;
  published: boolean;
  date?: Date; // "2018-10-06T18:30:00.000Z"
  enddate?: Date;
  title: string; // The title
  lat: number;
  lng: number;
  @observable count_attendance: number; // # of attendees, like 4
  description: string;
  type: ActivityType;
  @observable attendance?: IAttendanceListItem[];
  @observable attending?: boolean;
  @observable loadingAttending: boolean = true;
  private membershipModel: MembershipModel;

  constructor (source: IActivityListItem, membershipModel: MembershipModel) {
    this.membershipModel = membershipModel;
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
    switch (source.activity) {
      case "incident":
        this.type = ActivityType.mission;
        break;
      case "event":
        this.type = ActivityType.meeting;
        break;
      default:
        this.type = ActivityType.training;
        break;
    }
  }

  private hasRequestedLoadAttendance = false;
  async loadAttendanceIfNeededAsync() {
    if (!this.hasRequestedLoadAttendance) {
      await this.loadAttendanceAsync();
    }
  }

  private async loadAttendanceAsync() {
    this.hasRequestedLoadAttendance = true;

    this.loadingAttending = true;
    this.attendance = await this.membershipModel.getAttendanceAsync(this.id);
    this.attending = this.attendance?.find(i => i.member.id === this.membershipModel.getMemberId()) !== undefined;
    this.loadingAttending = false;
    this.count_attendance = this.attendance!.length;
  }

  async setAttendingAsync() {
    this.loadingAttending = true;
    this.attending = true;
    await this.membershipModel.setAttendingAsync(this.id);
    this.loadAttendanceAsync();
  }

  async removeAttendingAsync() {
    this.loadingAttending = true;
    this.attending = false;
    var attendanceRecord = this.attendance?.find(i => i.member.id === this.membershipModel.getMemberId());
    if (attendanceRecord) {
      await this.membershipModel.removeAttendingAsync(this.id, attendanceRecord.id);
    }
    this.loadAttendanceAsync();
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

  isMission() {
    return this.type === ActivityType.mission;
  }

  getPathType() {
    switch (this.type) {
      case ActivityType.mission:
        return "missions";
      case ActivityType.meeting:
        return "meetings";
      case ActivityType.training:
        return "trainings";
      default:
        return "unknown";
    }
  }
}
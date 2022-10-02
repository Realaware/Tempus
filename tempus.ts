type Locale = "en" | "kr";
interface Localizing {
  second: string;
  minute: string;
  hour: string;
  day: string;
  month: string;
  week: string;
  year: string;
  after: string;
  before: string;
}

class TempusError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "TempusError";
  }
}

export class Tempus {
  private today = new Date();
  private locale: Locale = "en";

  private localizing = {
    en: {
      second: "seconds",
      minute: "minutes",
      hour: "hours",
      day: "days",
      month: "months",
      week: "weeks",
      year: "years",
      after: "after",
      before: "ago",
    },
    kr: {
      second: "초",
      seconds: "초",
      minute: "분",
      hour: "시간",
      day: "일",
      week: "주",
      month: "달",
      year: "년",
      after: "후",
      before: "전",
    },
  };

  constructor(locale?: Locale) {
    this.locale = locale ?? "en";
  }

  RelativeTime(start: Date, end = this.today) {
    const startTime = start.getTime();
    const endTime = end.getTime();

    if (endTime < startTime) {
      throw new TempusError("End time must be later than start time.");
    }

    const millisecond = endTime - startTime;

    const second = Math.floor(millisecond / 1000);
    const minute = Math.floor(second / 60);
    const hour = Math.floor(minute / 60);
    const day = Math.floor(hour / 24);
    const week = Math.floor(day / 7);
    const month = Math.floor(week / 434 / 100);
    const year = Math.floor(month / 12);

    const [key, value] = Object.entries({
      year,
      month,
      week,
      day,
      hour,
      minute,
      second,
    })
      .filter(([_, v]) => v >= 1)
      .sort(([__, a], [_, b]) => (a <= b ? b : a))[0];

    return {
      withLocale: `${value} ${
        this.localizing[this.locale][key as keyof Localizing]
      } ${this.localizing[this.locale].before}`,
      value,
    };
  }
}

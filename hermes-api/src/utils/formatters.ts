import * as moment from 'moment-timezone';

export class Formatters {
  static dateYmdToDmy(date: string): string {
    if (date) {
      const isCorrectFormat = moment(date, 'DD/MM/YYYY', true).isValid();
      if (isCorrectFormat) {
        return date;
      }

      return moment(date).format('DD/MM/YYYY');
    }

    return '';
  }
}

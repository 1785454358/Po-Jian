import dayjs from 'dayjs';

/** 返回当天日期 'YYYY-MM-DD' */
export function today(): string {
  return dayjs().format('YYYY-MM-DD');
}

/** 判断给定日期是否为今天 */
export function isToday(date: string): boolean {
  return date === today();
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { PaymentTypes } from '@/types';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { isSameDay, parseISO, isWithinInterval, startOfDay, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}

export function getUserNameByPaymentType(name: string, type: PaymentTypes) {
  let userName = name;
  switch (type) {
    case PaymentTypes.CashApp:
      userName = `${userName.length && userName[0] !== '$' ? '$' : ''}${userName}`
    case PaymentTypes.PayPal:
    case PaymentTypes.Venmo:
      userName = userName.length && userName[0] === '@' ? userName.slice(1) : userName
      break;
    default:
      break;
  }
  return userName;
}

const timeZone = 'Pacific/Honolulu';

export function getCurrentHSTUTCDate() {
  const nowUTC = new Date();
  const hstString = formatInTimeZone(nowUTC, timeZone, 'yyyy-MM-dd HH:mm:ss');
  const hstMomentAsUTC = zonedTimeToUtc(hstString, timeZone);
  return hstMomentAsUTC;
}

//TODO : Remove Below Date Related Code Log
export function isSameDayHSTDate(lastClaimUTC: string): boolean {
  if (!lastClaimUTC) return false;
  const nowUTC = new Date();
  console.log('**nowUTC:',nowUTC);
  const nowHST = utcToZonedTime(nowUTC, timeZone);
  console.log('**nowHST:', nowHST);
  const claimHST = utcToZonedTime(lastClaimUTC, timeZone);
  console.log('**claimHST:', claimHST);
  const isSameDayDates = isSameDay(nowHST, claimHST);
  console.log('**isSameDayDates:', isSameDayDates);
  return isSameDayDates;
}

// export function groupRecordsWithinToday(records: any[]) {
//   const now = getCurrentHSTUTCDate();
//   const todayStart = startOfDay(now);
//   const todayEnd = addDays(todayStart, 1);

//   const groupedRecords = records.filter(record => {
//     const recordDate = parseISO(record.date);
//     return isWithinInterval(recordDate, { start: todayStart, end: todayEnd });
//   });

//   return groupedRecords;
// }

// export function getDailyCheckedRecordsForToday(records: any[]) {
//   const record = groupRecordsWithinToday(records);
//   return getDailyCheckedRecords(groupedRecords);
// }

export function getDailyCheckedRecords(records: any[]) {
  return records.filter(record => {
    const isValidDailyRecord = record.dailyChecked && (record.paymentstatus === 'complete' || record.paymentstatus === 'Processing')
    return isValidDailyRecord && isSameDayHSTDate(record.isBonusInitializeTime);
  });
}

export function getVipFreePlayRecords(records: any[]) {
  return records.filter(record => {
    const isValidVIPFreePlayRecord = record.isVipFreeplay && (record.paymentstatus === 'complete' || record.paymentstatus === 'Processing')
    return isValidVIPFreePlayRecord && isSameDayHSTDate(record.vipFreeplayTime);
  });
}
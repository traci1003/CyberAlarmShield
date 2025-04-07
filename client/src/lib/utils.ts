import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MathProblem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}`;
}

export function formatAmPm(date: Date): string {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

export function formatDate(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNumber = date.getDate();
  
  return `${dayName}, ${monthName} ${dayNumber}`;
}

export function formatTimeOnly(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  return `${hour % 12 || 12}:${minutes}`;
}

export function getTimeAmPm(timeString: string): string {
  const [hours] = timeString.split(':');
  const hour = parseInt(hours);
  return hour >= 12 ? 'PM' : 'AM';
}

export function formatDays(days: string[]): string {
  if (days.length === 7) return 'Every day';
  if (days.length === 0) return 'Never';
  if (JSON.stringify(days.sort()) === JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].sort())) {
    return 'Weekdays';
  }
  if (JSON.stringify(days.sort()) === JSON.stringify(['Sat', 'Sun'].sort())) {
    return 'Weekend';
  }
  return days.join(', ');
}

export function generateMathProblem(level: number = 1): MathProblem {
  let num1, num2, num3, operation, answer, question;
  
  // Generate a math problem based on level
  switch(level) {
    case 1: // Easy
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = '+';
      answer = num1 + num2;
      question = `${num1} ${operation} ${num2} = ?`;
      break;
      
    case 2: // Medium
      // For medium difficulty, use larger numbers or mixed operations
      if (Math.random() > 0.5) {
        // Larger numbers
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * 30) + 10;
        operation = Math.random() > 0.5 ? '+' : '-';
        answer = operation === '+' ? num1 + num2 : num1 - num2;
        question = `${num1} ${operation} ${num2} = ?`;
      } else {
        // Mixed operations
        num1 = Math.floor(Math.random() * 15) + 5; 
        num2 = Math.floor(Math.random() * 5) + 2;
        num3 = Math.floor(Math.random() * 10) + 1;
        answer = (num1 * num2) + num3;
        question = `(${num1} × ${num2}) + ${num3} = ?`;
      }
      break;
      
    case 3: // Hard
      // Choose between different hard problem types
      const hardType = Math.floor(Math.random() * 3);
      
      if (hardType === 0) {
        // Multiplication
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
      } 
      else if (hardType === 1) {
        // Division with clean results
        num2 = Math.floor(Math.random() * 10) + 2; // divisor
        answer = Math.floor(Math.random() * 10) + 2; // quotient
        num1 = num2 * answer; // dividend
        question = `${num1} ÷ ${num2} = ?`;
      }
      else {
        // Complex expression
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * 10) + 5;
        num3 = Math.floor(Math.random() * 10) + 2;
        // (num1 + num2) * num3
        answer = (num1 + num2) * num3;
        question = `(${num1} + ${num2}) × ${num3} = ?`;
      }
      break;
      
    case 4: // Very Hard
      // Complex expressions with multiple operations
      const veryHardType = Math.floor(Math.random() * 2);
      
      if (veryHardType === 0) {
        // (a × b) - (c × d)
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * 5) + 2;
        num3 = Math.floor(Math.random() * 5) + 1;
        const num4 = Math.floor(Math.random() * 5) + 1;
        answer = (num1 * num2) - (num3 * num4);
        question = `(${num1} × ${num2}) - (${num3} × ${num4}) = ?`;
      } else {
        // a² + b
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 20) + 5;
        answer = (num1 * num1) + num2;
        question = `${num1}² + ${num2} = ?`;
      }
      break;
      
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = '+';
      answer = num1 + num2;
      question = `${num1} ${operation} ${num2} = ?`;
  }
  
  // Generate options with one correct answer and three wrong answers
  const answerStr = answer.toString();
  const options = [answerStr];
  
  // More clever wrong answers that are close to the real answer
  while (options.length < 4) {
    // Different wrong answer strategies
    let wrongAnswer;
    const strategy = Math.floor(Math.random() * 4);
    
    if (strategy === 0) {
      // Small deviation
      wrongAnswer = (answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1)).toString();
    } else if (strategy === 1) {
      // Larger deviation
      wrongAnswer = (answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 5)).toString();
    } else if (strategy === 2) {
      // Digit swap if multi-digit
      if (answer > 9) {
        const answerDigits = answerStr.split('');
        const pos1 = Math.floor(Math.random() * answerDigits.length);
        let pos2 = Math.floor(Math.random() * answerDigits.length);
        while (pos2 === pos1) {
          pos2 = Math.floor(Math.random() * answerDigits.length);
        }
        [answerDigits[pos1], answerDigits[pos2]] = [answerDigits[pos2], answerDigits[pos1]];
        wrongAnswer = answerDigits.join('');
      } else {
        // For single-digit numbers, just add/subtract
        wrongAnswer = (answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 2)).toString();
      }
    } else {
      // Percentage off
      const percentage = Math.floor(Math.random() * 20) + 10; // 10-30% off
      wrongAnswer = Math.round(answer * (1 + (percentage * (Math.random() > 0.5 ? 1 : -1)) / 100)).toString();
    }
    
    // Make sure it's not the same as correct answer and not already in options
    if (!options.includes(wrongAnswer) && wrongAnswer !== answerStr && parseInt(wrongAnswer) > 0) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle options
  const shuffledOptions = options.sort(() => Math.random() - 0.5);
  
  return {
    question,
    options: shuffledOptions,
    correctAnswer: answerStr
  };
}

export function getSecurityStatusColor(status: string): string {
  switch (status) {
    case 'safe':
      return 'status-safe';
    case 'warning':
      return 'status-warning';
    case 'danger':
      return 'status-danger';
    default:
      return '';
  }
}

export function getStatusColorClass(score: number): string {
  if (score >= 80) return 'status-safe';
  if (score >= 60) return 'status-warning';
  return 'status-danger';
}

export function getStatusBgClass(score: number): string {
  if (score >= 80) return 'bg-status-safe';
  if (score >= 60) return 'bg-status-warning';
  return 'bg-status-danger';
}

export function calculateStrokeDashoffset(score: number, circumference: number): number {
  return circumference - (score / 100) * circumference;
}

export function formatTimeForInput(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function convertFormAlarmToApiAlarm(formData: any): Omit<any, 'id'> {
  return {
    time: formData.time,
    label: formData.label || undefined,
    days: formData.days,
    isActive: true,
    vibrate: formData.vibrate,
    sound: formData.sound,
    mathProblem: formData.mathProblem,
    securityScan: formData.securityScan,
    phishingDrill: formData.phishingDrill,
    // Add any additional properties to store in the database
    settings: JSON.stringify({
      volumeLevel: formData.volumeLevel,
      gradualVolume: formData.gradualVolume,
      snoozeCount: formData.snoozeCount,
      snoozeDuration: formData.snoozeDuration
    })
  };
}

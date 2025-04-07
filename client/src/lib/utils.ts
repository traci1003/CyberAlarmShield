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
  let num1, num2, operation, answer, question;
  
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
      num1 = Math.floor(Math.random() * 100) + 100;
      num2 = Math.floor(Math.random() * 100) + 50;
      operation = Math.random() > 0.5 ? '+' : '-';
      answer = operation === '+' ? num1 + num2 : num1 - num2;
      question = `${num1} ${operation} ${num2} = ?`;
      break;
      
    case 3: // Hard
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10) + 2;
      operation = Math.random() > 0.5 ? 'x' : '÷';
      if (operation === 'x') {
        answer = num1 * num2;
        question = `${num1} ${operation} ${num2} = ?`;
      } else {
        // Ensure division results in whole number
        answer = num1;
        question = `${num1 * num2} ${operation} ${num2} = ?`;
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
  
  while (options.length < 4) {
    const wrongAnswer = (answer + Math.floor(Math.random() * 10) - 5).toString();
    if (!options.includes(wrongAnswer) && wrongAnswer !== answerStr) {
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

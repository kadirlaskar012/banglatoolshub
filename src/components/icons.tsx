import {
  Calculator,
  ChevronRight,
  ScanText,
  TrendingUp,
  CalendarDays,
  Receipt,
  type LucideProps,
} from 'lucide-react';

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 18.333V5.667C4 5.298 4.298 5 4.667 5h4.666C12.333 5 12.333 9 9.333 9H4.667" />
      <path d="M12.5 19l-3-9" />
      <path d="M20 19h-5" />
      <path d="M17.5 19V9.5a2.5 2.5 0 0 1 5 0V19" />
    </svg>
  ),
  calculator: Calculator,
  chevronRight: ChevronRight,
  'scan-text': ScanText,
  'trending-up': TrendingUp,
  'calendar-days': CalendarDays,
  receipt: Receipt,
};

export const iconMap = {
  calculator: Icons.calculator,
  'scan-text': Icons['scan-text'],
  'trending-up': Icons['trending-up'],
  'calendar-days': Icons['calendar-days'],
  receipt: Icons.receipt,
};

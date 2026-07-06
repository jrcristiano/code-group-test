import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  Briefcase: (props: IconProps) => (
    <IconBase {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
    </IconBase>
  ),
  Plus: (props: IconProps) => (
    <IconBase {...props}><path d="M12 5v14M5 12h14" /></IconBase>
  ),
  Search: (props: IconProps) => (
    <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconBase>
  ),
  Eye: (props: IconProps) => (
    <IconBase {...props}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></IconBase>
  ),
  Edit: (props: IconProps) => (
    <IconBase {...props}><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></IconBase>
  ),
  Trash: (props: IconProps) => (
    <IconBase {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" /></IconBase>
  ),
  ArrowLeft: (props: IconProps) => (
    <IconBase {...props}><path d="m15 18-6-6 6-6" /></IconBase>
  ),
  ArrowRight: (props: IconProps) => (
    <IconBase {...props}><path d="m9 18 6-6-6-6" /></IconBase>
  ),
  ChevronsUpDown: (props: IconProps) => (
    <IconBase {...props}><path d="m8 9 4-4 4 4M16 15l-4 4-4-4" /></IconBase>
  ),
  ArrowUp: (props: IconProps) => (
    <IconBase {...props}><path d="m7 11 5-5 5 5M12 6v12" /></IconBase>
  ),
  ArrowDown: (props: IconProps) => (
    <IconBase {...props}><path d="m7 13 5 5 5-5M12 18V6" /></IconBase>
  ),
  Alert: (props: IconProps) => (
    <IconBase {...props}><path d="M10.3 3.7 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></IconBase>
  ),
  Sparkles: (props: IconProps) => (
    <IconBase {...props}><path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2ZM5 13l-.8 2.2L2 16l2.2.8L5 19l.8-2.2L8 16l-2.2-.8ZM18 13l-1 2.7-2.7 1 2.7 1L18 20.5l1-2.8 2.7-1-2.7-1Z" /></IconBase>
  ),
  Calendar: (props: IconProps) => (
    <IconBase {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></IconBase>
  ),
  Wallet: (props: IconProps) => (
    <IconBase {...props}><path d="M4 5h14a2 2 0 0 1 2 2v12H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM16 12h4" /><circle cx="16" cy="12" r=".5" fill="currentColor" /></IconBase>
  ),
  Clock: (props: IconProps) => (
    <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></IconBase>
  ),
  Check: (props: IconProps) => (
    <IconBase {...props}><path d="m5 12 4 4L19 6" /></IconBase>
  ),
  Close: (props: IconProps) => (
    <IconBase {...props}><path d="m6 6 12 12M18 6 6 18" /></IconBase>
  ),
  FileText: (props: IconProps) => (
    <IconBase {...props}><path d="M6 2h8l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" /><path d="M14 2v5h5M8 13h8M8 17h6M8 9h2" /></IconBase>
  ),
  Shield: (props: IconProps) => (
    <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></IconBase>
  ),
  Server: (props: IconProps) => (
    <IconBase {...props}><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></IconBase>
  ),
  Database: (props: IconProps) => (
    <IconBase {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></IconBase>
  ),
  Layers: (props: IconProps) => (
    <IconBase {...props}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></IconBase>
  ),
  Activity: (props: IconProps) => (
    <IconBase {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></IconBase>
  ),
  Zap: (props: IconProps) => (
    <IconBase {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></IconBase>
  ),
  Code: (props: IconProps) => (
    <IconBase {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></IconBase>
  ),
  Globe: (props: IconProps) => (
    <IconBase {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></IconBase>
  ),
  Layout: (props: IconProps) => (
    <IconBase {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></IconBase>
  ),
  Lock: (props: IconProps) => (
    <IconBase {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></IconBase>
  ),
  CheckCircle: (props: IconProps) => (
    <IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconBase>
  ),
  BarChart: (props: IconProps) => (
    <IconBase {...props}><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></IconBase>
  ),
  ArrowRightCircle: (props: IconProps) => (
    <IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 16 16 12 12 8" /><line x1="8" y1="12" x2="16" y2="12" /></IconBase>
  ),
};

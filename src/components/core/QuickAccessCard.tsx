import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Variant =
  | "inventory"
  | "workshop"
  | "customers"
  | "reports"
  | "calendar"
  | "imports"
  | "alerts"
  | "history";

type Props = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  variant?: Variant;
};

const variantStyles: Record<Variant, string> = {
  inventory: "from-blue-50 to-blue-100 text-blue-600",
  workshop: "from-orange-50 to-orange-100 text-orange-600",
  customers: "from-green-50 to-green-100 text-green-600",
  reports: "from-purple-50 to-purple-100 text-purple-600",
  calendar: "from-teal-50 to-teal-100 text-teal-600",
  imports: "from-indigo-50 to-indigo-100 text-indigo-600",
  alerts: "from-red-50 to-red-100 text-red-600",
  history: "from-gray-50 to-gray-100 text-gray-600",
};

export default function QuickAccessCard({
  href,
  title,
  description,
  icon,
  variant = "inventory",
}: Props) {
  return (
    <Link href={href}>
      <Card className="group h-full rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <div
            className={`h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${variantStyles[variant]}`}
          >
            {icon}
          </div>

          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          {description}
        </CardContent>
      </Card>
    </Link>
  );
}

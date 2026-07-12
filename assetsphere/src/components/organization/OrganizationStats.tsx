import { Building2, Tags, Users, CheckCircle2 } from "lucide-react"

interface OrganizationStatsProps {
  stats: {
    totalDepartments: number
    activeDepartments: number
    totalEmployees: number
    totalCategories: number
  }
}

export default function OrganizationStats({ stats }: OrganizationStatsProps) {
  const cards = [
    {
      title: "Total Departments",
      value: stats.totalDepartments,
      icon: Building2,
      description: "Across all locations",
      trend: "+2% from last month",
      trendUp: true
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      description: "Active staff members",
      trend: "+5% from last month",
      trendUp: true
    },
    {
      title: "Asset Categories",
      value: stats.totalCategories,
      icon: Tags,
      description: "Classification types",
      trend: "Consistent",
      trendUp: true
    },
    {
      title: "Active Departments",
      value: stats.activeDepartments,
      icon: CheckCircle2,
      description: "Currently operational",
      trend: "100% operational",
      trendUp: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{card.value}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <card.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={card.trendUp ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {card.trend}
            </span>
            <span className="text-slate-500 ml-2">{card.description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

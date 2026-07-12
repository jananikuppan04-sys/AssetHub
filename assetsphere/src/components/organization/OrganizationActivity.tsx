import { Clock } from "lucide-react"

export default function OrganizationActivity({ activities = [] }: { activities?: any[] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <h3 className="font-semibold text-slate-900 mb-6 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-slate-400" />
        Recent Activity
      </h3>
      
      <div className="flex-1 overflow-y-auto">
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6">
                {/* Timeline vertical line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-slate-900">{activity.user?.name || "System"}</span>
                  <span className="text-slate-600 ml-1">{activity.action}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(activity.createdAt).toLocaleString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 py-12">
            No recent activity.
          </div>
        )}
      </div>
    </div>
  )
}

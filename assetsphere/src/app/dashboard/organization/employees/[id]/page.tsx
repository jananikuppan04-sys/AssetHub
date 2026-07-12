import { getEmployeeById } from "@/app/actions/organization"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Building2, Shield, Calendar, Phone, Mail, FileText, Activity, Wrench, RefreshCw, Box } from "lucide-react"
import { format } from "date-fns"

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id)

  if (!employee) {
    notFound()
  }

  const roleColors: Record<string, string> = {
    "Admin": "bg-purple-100 text-purple-800 border-purple-200",
    "Asset Manager": "bg-blue-100 text-blue-800 border-blue-200",
    "Department Head": "bg-amber-100 text-amber-800 border-amber-200",
    "Employee": "bg-slate-100 text-slate-700 border-slate-200"
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/organization" 
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {employee.profilePicture ? (
              <img src={employee.profilePicture} alt="" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-sm">
                {employee.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {employee.name}
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  employee.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
                }`}>
                  {employee.status}
                </span>
                {employee.employeeId && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    ID: {employee.employeeId}
                  </span>
                )}
              </h1>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {employee.email}</span>
                {employee.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {employee.phone}</span>}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${roleColors[employee.role] || roleColors["Employee"]}`}>
              <Shield className="w-4 h-4 mr-2" />
              {employee.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Employment Details
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  {employee.department ? (
                    <Link href={`/dashboard/organization/departments/${employee.department.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      {employee.department.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-slate-500 italic">Unassigned</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Joined Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">
                    {format(new Date(employee.createdAt), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Assets</p>
                  <span className="text-2xl font-bold text-blue-700">{employee.allocations.length}</span>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Bookings</p>
                  <span className="text-2xl font-bold text-purple-700">{employee.bookings.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {employee.activityLogs.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No activity recorded.</p>
              ) : (
                <div className="relative border-l-2 border-slate-100 ml-3 pl-4 space-y-4">
                  {employee.activityLogs.map((log: any) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-white ring-1 ring-blue-200" />
                      <p className="text-sm text-slate-700 font-medium">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-1">{format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Tabs/Tables */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Assigned Assets */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Box className="w-5 h-5 mr-2 text-blue-600" />
                Assigned Assets
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-slate-100 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3">Tag</th>
                    <th className="px-6 py-3">Assigned Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {employee.allocations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No assets currently assigned</td>
                    </tr>
                  ) : (
                    employee.allocations.map((alloc: any) => (
                      <tr key={alloc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-semibold text-slate-900">{alloc.asset.name}</td>
                        <td className="px-6 py-3 font-mono text-xs text-slate-500">{alloc.asset.assetTag}</td>
                        <td className="px-6 py-3 text-slate-600">{format(new Date(alloc.requestDate), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            alloc.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}>
                            {alloc.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maintenance Requests */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-md font-bold text-slate-900 flex items-center">
                  <Wrench className="w-4 h-4 mr-2 text-orange-500" />
                  Maintenance Requests
                </h2>
              </div>
              <div className="p-4">
                {employee.maintenanceReqs.length === 0 ? (
                  <p className="text-sm text-slate-500 italic text-center py-4">No maintenance requests</p>
                ) : (
                  <ul className="space-y-3">
                    {employee.maintenanceReqs.slice(0, 5).map((req: any) => (
                      <li key={req.id} className="flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{req.asset.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{req.issueDescription}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase">
                          {req.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-md font-bold text-slate-900 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 text-indigo-500" />
                  Booking History
                </h2>
              </div>
              <div className="p-4">
                {employee.bookings.length === 0 ? (
                  <p className="text-sm text-slate-500 italic text-center py-4">No bookings found</p>
                ) : (
                  <ul className="space-y-3">
                    {employee.bookings.slice(0, 5).map((booking: any) => (
                      <li key={booking.id} className="flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{booking.asset.name}</p>
                          <p className="text-xs text-slate-500">{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 uppercase">
                          {booking.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

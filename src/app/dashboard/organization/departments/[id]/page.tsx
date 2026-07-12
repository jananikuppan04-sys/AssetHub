import { getDepartmentById } from "@/app/actions/organization"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building2, Users, Package, Mail, MapPin, Phone, Activity } from "lucide-react"
import { format } from "date-fns"

export default async function DepartmentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const department = await getDepartmentById(params.id)

  if (!department) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/organization" 
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{department.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              department.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}>
              {department.active ? "Active" : "Inactive"}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {department.code || 'NO-CODE'}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">{department.description || "No description provided."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Department Details
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Department Head</p>
                <div className="flex items-center">
                  {department.head ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-3">
                        {department.head.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{department.head.name}</p>
                        <p className="text-xs text-slate-500">{department.head.email}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-slate-500 italic">Unassigned</p>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Parent Department</p>
                {department.parent ? (
                  <Link href={`/dashboard/organization/departments/${department.parent.id}`} className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                    <Building2 className="w-4 h-4 mr-1.5" />
                    {department.parent.name}
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-slate-500 italic">Top Level</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm font-medium text-slate-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                  {department.location || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Created On</p>
                <p className="text-sm font-medium text-slate-900">
                  {format(new Date(department.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Employees ({department._count.members})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-slate-100 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {department.members.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No employees assigned</td>
                    </tr>
                  ) : (
                    department.members.map((member: any) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <Link href={`/dashboard/organization/employees/${member.id}`} className="font-medium text-blue-600 hover:underline flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                              {member.name.charAt(0)}
                            </div>
                            {member.name}
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-slate-600">{member.role}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            member.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2 text-blue-600" />
              Asset Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Total Assets</span>
                <span className="text-lg font-bold text-slate-900">{department._count.assets}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-sm font-medium text-emerald-700">Allocated Assets</span>
                <span className="text-lg font-bold text-emerald-700">{department._count.allocations}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-900">{department.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{department.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

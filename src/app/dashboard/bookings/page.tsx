import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBookings } from "@/app/actions/bookings"
import Link from "next/link"
import { Plus, CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns"
import BookingCancelButton from "@/components/bookings/BookingCancelButton"

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const bookings = await getBookings()
  const upcomingBookings = bookings.filter(b => b.status === "Upcoming" || b.status === "Ongoing")
  const pastBookings = bookings.filter(b => b.status === "Completed" || b.status === "Cancelled")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resource Bookings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and schedule shared resources, meeting rooms, and vehicles.</p>
        </div>
        <Link href="/dashboard/bookings/new" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Book Resource
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-purple-600" />
              Upcoming Schedule
            </h2>

            <div className="space-y-6">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No upcoming bookings. Schedule one to get started!
                </div>
              ) : (
                upcomingBookings.map((booking) => {
                  const start = new Date(booking.startDate)
                  const end = new Date(booking.endDate)
                  
                  return (
                    <div key={booking.id} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 text-right">
                          <span className="text-sm font-bold text-slate-900 block">{format(start, 'h:mm a')}</span>
                          <span className="text-xs font-medium text-slate-500">{format(start, 'MMM d')}</span>
                        </div>
                      </div>
                      
                      <div className="relative flex-1 bg-slate-50 rounded-lg border border-slate-100 p-4 hover:shadow-md transition-shadow group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-lg"></div>
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg flex items-center">
                              {booking.asset.name}
                              {booking.status === 'Ongoing' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                                  Ongoing
                                </span>
                              )}
                            </h3>
                            <p className="text-sm font-medium text-purple-700 mt-1">{booking.purpose}</p>
                          </div>
                          
                          {(booking.userId === session.user.id || session.user.role === 'Admin') && booking.status === 'Upcoming' && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <BookingCancelButton bookingId={booking.id} />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                            {format(start, 'h:mm a')} - {format(end, 'h:mm a')} ({formatDistanceToNow(start, { addSuffix: true })})
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                            {booking.asset.assetTag}
                          </div>
                          <div className="flex items-center col-span-2">
                            <Users className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                            <span className="font-medium mr-1 text-slate-900">Booked by {booking.user.name}</span>
                            {booking.participants && <span className="truncate">with {booking.participants}</span>}
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-3 text-sm text-slate-500 bg-white p-3 rounded border border-slate-100 italic">
                            "{booking.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Side Panel (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Past Bookings</h2>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {pastBookings.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">No past bookings found.</div>
              ) : (
                pastBookings.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm text-slate-900">{booking.asset.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${booking.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-600'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{format(new Date(booking.startDate), 'MMM d, yyyy • h:mm a')}</div>
                    <div className="text-xs text-slate-400 mt-1 truncate">By {booking.user.name}</div>
                  </div>
                ))
              )}
            </div>
            {pastBookings.length > 10 && (
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500">Showing latest 10</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

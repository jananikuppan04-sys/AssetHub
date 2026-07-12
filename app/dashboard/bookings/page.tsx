'use client'

import { useAssetStore } from '@/lib/store'

export default function BookingsPage() {
  const store = useAssetStore()

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    confirmed: 'bg-green-500/20 text-green-700 dark:text-green-400',
    completed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resource Bookings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage shared asset usage</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
          + New Booking
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.bookings.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-500 mt-2">{store.bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-500 mt-2">{store.bookings.filter(b => b.status === 'pending').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-blue-500 mt-2">{store.bookings.filter(b => b.status === 'completed').length}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Asset</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Booked By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Purpose</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">End Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {store.bookings.length > 0 ? (
                store.bookings.map((booking) => {
                  const asset = store.assets.find(a => a.id === booking.assetId)
                  const bookedBy = store.users.find(u => u.id === booking.bookedBy)
                  return (
                    <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{asset?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{bookedBy?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{booking.purpose}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(booking.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(booking.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {booking.status === 'pending' && booking.approvalRequired && (
                            <>
                              <button className="text-green-500 hover:text-green-600 text-sm font-medium">Approve</button>
                              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Reject</button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Return</button>
                          )}
                          <button className="text-primary hover:underline text-sm font-medium">Details</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Calendar */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Booking Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-xl">📅</div>
            <div>
              <p className="font-medium text-foreground">Conflict Prevention</p>
              <p className="text-sm text-muted-foreground">System automatically prevents overlapping bookings for the same asset</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">✓</div>
            <div>
              <p className="font-medium text-foreground">Approval Workflow</p>
              <p className="text-sm text-muted-foreground">Shared resources require approval from asset managers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">⏰</div>
            <div>
              <p className="font-medium text-foreground">Time Management</p>
              <p className="text-sm text-muted-foreground">Book resources in advance to ensure availability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

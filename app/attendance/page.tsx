"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, TrendingUp, Download, Filter } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"

// Mock attendance data
const mockAttendanceData = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Product Designer",
    date: "2024-01-08",
    loginTime: "09:15",
    status: "present",
    workingHours: "8h 45m",
    initials: "AJ",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Full Stack Developer",
    date: "2024-01-08",
    loginTime: "10:45",
    status: "late",
    workingHours: "7h 15m",
    initials: "BS",
  },
  {
    id: 3,
    name: "Carol Davis",
    role: "Technical Writer",
    date: "2024-01-08",
    loginTime: "09:30",
    status: "present",
    workingHours: "8h 30m",
    initials: "CD",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "DevOps Engineer",
    date: "2024-01-08",
    loginTime: null,
    status: "absent",
    workingHours: "0h 0m",
    initials: "DW",
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "UI/UX Designer",
    date: "2024-01-08",
    loginTime: "08:45",
    status: "present",
    workingHours: "9h 15m",
    initials: "ET",
  },
  {
    id: 6,
    name: "Frank Miller",
    role: "Backend Developer",
    date: "2024-01-08",
    loginTime: "11:15",
    status: "late",
    workingHours: "6h 45m",
    initials: "FM",
  },
]

// Weekly attendance summary
const weeklyData = [
  { date: "2024-01-08", present: 4, late: 2, absent: 1 },
  { date: "2024-01-07", present: 5, late: 1, absent: 1 },
  { date: "2024-01-06", present: 6, late: 1, absent: 0 },
  { date: "2024-01-05", present: 5, late: 2, absent: 0 },
  { date: "2024-01-04", present: 6, late: 0, absent: 1 },
]

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2024-01-08")
  const [statusFilter, setStatusFilter] = useState("all")

  const currentData = mockAttendanceData.filter((record) => record.date === selectedDate)
  const filteredData = currentData.filter((record) => statusFilter === "all" || record.status === statusFilter)

  const todayStats = {
    total: currentData.length,
    present: currentData.filter((r) => r.status === "present").length,
    late: currentData.filter((r) => r.status === "late").length,
    absent: currentData.filter((r) => r.status === "absent").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "default"
      case "late":
        return "secondary"
      case "absent":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Present"
      case "late":
        return "Late"
      case "absent":
        return "Absent"
      default:
        return "Unknown"
    }
  }

  const attendancePercentage = Math.round(((todayStats.present + todayStats.late) / todayStats.total) * 100)

  return (
    <>
      <TopNavigation />
      <main className="pt-16 md:pt-20">
        <div className="p-3 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
              <p className="text-sm md:text-base text-muted-foreground">Track team attendance and working hours</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01-08">Today (Jan 8, 2024)</SelectItem>
                  <SelectItem value="2024-01-07">Yesterday (Jan 7, 2024)</SelectItem>
                  <SelectItem value="2024-01-06">Jan 6, 2024</SelectItem>
                  <SelectItem value="2024-01-05">Jan 5, 2024</SelectItem>
                  <SelectItem value="2024-01-04">Jan 4, 2024</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Attendance Rules */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Attendance Rules</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      • <strong>On Time:</strong> Login before 10:30 AM
                    </p>
                    <p>
                      • <strong>Late:</strong> Login after 10:30 AM
                    </p>
                    <p>
                      • <strong>Absent:</strong> No login recorded for the day
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Total Team</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{todayStats.total}</div>
                <p className="text-xs text-muted-foreground">Team members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Present</CardTitle>
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-green-600">{todayStats.present}</div>
                <p className="text-xs text-muted-foreground">On time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Late</CardTitle>
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-yellow-600">{todayStats.late}</div>
                <p className="text-xs text-muted-foreground">After 10:30 AM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{attendancePercentage}%</div>
                <p className="text-xs text-muted-foreground">Present + Late</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg">Daily Attendance</CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 md:p-3 font-medium text-sm">Employee</th>
                      <th className="text-left p-2 md:p-3 font-medium text-sm">Role</th>
                      <th className="text-left p-2 md:p-3 font-medium text-sm">Login Time</th>
                      <th className="text-left p-2 md:p-3 font-medium text-sm">Status</th>
                      <th className="text-left p-2 md:p-3 font-medium text-sm">Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 md:p-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8">
                              <AvatarFallback className="text-xs">{record.initials}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm md:text-base">{record.name}</span>
                          </div>
                        </td>
                        <td className="p-2 md:p-3">
                          <span className="text-sm text-muted-foreground">{record.role}</span>
                        </td>
                        <td className="p-2 md:p-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                            <span className="text-sm">{record.loginTime || "Not logged in"}</span>
                          </div>
                        </td>
                        <td className="p-2 md:p-3">
                          <Badge variant={getStatusColor(record.status)} className="text-xs">
                            {getStatusText(record.status)}
                          </Badge>
                        </td>
                        <td className="p-2 md:p-3">
                          <span className="text-sm font-mono">{record.workingHours}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyData.map((day) => {
                  const total = day.present + day.late + day.absent
                  const attendanceRate = Math.round(((day.present + day.late) / total) * 100)

                  return (
                    <div
                      key={day.date}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-green-600">{day.present} Present</span>
                          <span className="text-yellow-600">{day.late} Late</span>
                          <span className="text-red-600">{day.absent} Absent</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{attendanceRate}%</div>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

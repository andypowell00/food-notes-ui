'use client'

import React from "react"
import type { Entry } from "@/types"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { clsx, format, isSameMonth } from "@/lib/utils"

interface CalendarProps {
  entries?: Entry[]
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
}

const Calendar: React.FC<CalendarProps> = ({ entries = [], onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1))

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dark-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-dark-hover text-dark-primary"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-dark-hover text-dark-primary"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-dark-secondary">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => {
          const hasEntry = entries.some(
            (entry) => format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          )
          const isSymptomaticDay = entries.some(
            (entry) => 
              format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
              entry.symptomatic
          )
          const isNonSymptomaticDay = entries.some(
            (entry) => 
              format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
              (!entry.symptomatic)
          )
          const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          const isToday = format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={clsx(
                'aspect-square p-1 text-sm rounded-lg transition-colors relative',
                !isSameMonth(day, currentMonth) && 'text-dark-secondary',
                isSelected ? 'bg-accent text-white' : 'hover:bg-dark-hover',
                !isSelected && isToday && 'text-accent',
                isSymptomaticDay && 'bg-red-600/20 text-red-400',
                isNonSymptomaticDay && 'bg-green-600/20 text-green-400',
                'flex items-center justify-center'
              )}
            >
              {day.getDate()}
              {hasEntry && !isSymptomaticDay && !isNonSymptomaticDay && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar

import React, { useState, useMemo, useCallback } from "react";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isToday);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// 🗓️ Sample Data
const InitialEventData = [
  {
    id: 1,
    title: "Daily Standup",
    date: dayjs().format("YYYY-MM-DD"),
    time: "09:00",
    durationMinutes: 60,
    color: "#4F46E5",
    description: "Review the progress",
  },
  {
    id: 2,
    title: "Project Sync (Past)",
    date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
    time: "14:00",
    durationMinutes: 90,
    color: "#059669",
    description: "Attend interviews.",
  },
];

const getDaysInMonth = (date) => {
  const today = dayjs().startOf("day");
  const startOfMonth = dayjs(date).startOf("month");
  const startDay = startOfMonth.weekday(0);
  const days = [];
  let currentDay = startDay;
  for (let i = 0; i < 42; i++) {
    const day = currentDay.add(i, "day");
    days.push({
      date: day.format("YYYY-MM-DD"),
      dayOfMonth: day.date(),
      isCurrentMonth: day.month() === date.month(),
      isToday: day.isToday(),
      isPast: day.isBefore(today, "day"),
      dayjsObject: day,
    });
  }
  return days;
};

// 📱 Reusable Modal (adjusted for mobile)
const Modal = ({ isOpen, title, onClose, children, size = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4"
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${size} mx-2 transform transition-all`}
      >
        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

// 📅 Calendar Day — responsive padding
const CalendarDay = ({ day, events, onDayClick }) => {
  const baseClasses =
    "relative h-24 sm:h-28 p-1 sm:p-1.5 border-b border-r border-gray-200 cursor-pointer group";
  const visibleEvents = events.slice(0, 2);
  const remainingEventsCount = events.length - visibleEvents.length;
  return (
    <div
      className={`${baseClasses} bg-white hover:bg-indigo-50`}
      onClick={() => onDayClick(day, events)}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] sm:text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
          {day.dayjsObject.format("ddd").toUpperCase()}
        </span>
        <span
          className={`text-xs sm:text-sm font-semibold h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full ${
            day.isToday
              ? "bg-indigo-600 text-white"
              : "text-gray-700 group-hover:bg-indigo-50"
          }`}
        >
          {day.dayOfMonth}
        </span>
      </div>
      <div className="mt-1 space-y-0.5">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="text-[10px] sm:text-xs font-medium text-white px-1 py-0.5 rounded-md truncate shadow-sm"
            style={{ backgroundColor: event.color }}
          >
            {event.title}
          </div>
        ))}
        {remainingEventsCount > 0 && (
          <div className="text-[10px] sm:text-xs text-center text-gray-600 bg-gray-200 rounded-md mt-1 p-0.5">
            +{remainingEventsCount} more
          </div>
        )}
      </div>
    </div>
  );
};

// 📋 Sidebar responsive fix
const Sidebar = ({
  currentDate,
  setCurrentDate,
  onOpenAddForm,
  currentView,
  setCurrentView,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const todayDay = days.find((d) => d.isToday) || days[0];
  return (
    <div
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } lg:block w-64 flex-shrink-0 p-4 border-r bg-white fixed lg:relative z-40 top-0 left-0 h-full overflow-y-auto`}
    >
      <button
        onClick={() => onOpenAddForm(todayDay)}
        className="w-full mb-4 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow hover:bg-indigo-700 transition"
      >
        + Create Event
      </button>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-sm text-gray-700">
            {currentDate.format("MMMM YYYY")}
          </h4>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {weekdays.map((day, i) => (
            <div key={i} className="text-gray-500 font-medium">
              {day}
            </div>
          ))}
          {days.slice(0, 35).map((day) => (
            <div
              key={day.date}
              className={`h-6 w-6 mx-auto flex items-center justify-center rounded-full text-xs ${
                day.isToday
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {day.dayOfMonth}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t pt-4">
        <h4 className="text-xs text-gray-500 mb-2 uppercase">View</h4>
        <div className="flex flex-col space-y-2">
          {["Day", "Week", "Month", "Schedule"].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view.toLowerCase())}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                currentView === view.toLowerCase()
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-50 hover:bg-indigo-100 text-gray-700"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      {/* Close button for mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden mt-6 px-4 py-2 text-sm bg-gray-200 w-full rounded-md"
      >
        Close Menu
      </button>
    </div>
  );
};

// 🧭 Main App Component
const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events] = useState(InitialEventData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);
  const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const eventsByDate = useMemo(() => {
    return events.reduce((acc, e) => {
      acc[e.date] = acc[e.date] ? [...acc[e.date], e] : [e];
      return acc;
    }, {});
  }, [events]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between p-3 sm:p-4 bg-white border-b sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md bg-gray-100"
          >
            ☰
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-700">
            SurveySparrow Calendar
          </h1>
        </div>
        <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg shadow hover:bg-indigo-700">
          Today
        </button>
      </header>

      {/* Main Content */}
      <div className="flex relative">
        <Sidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onOpenAddForm={() => {}}
          currentView="month"
          setCurrentView={() => {}}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-grow overflow-y-auto p-2 sm:p-4 lg:ml-64">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 border-l border-t border-gray-200">
            {daysInMonth.map((day, i) => (
              <CalendarDay
                key={i}
                day={day}
                events={eventsByDate[day.date] || []}
                onDayClick={() => {}}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

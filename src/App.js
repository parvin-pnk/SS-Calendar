import React, { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';


dayjs.extend(isToday);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


const InitialEventData = [
  { 
    id: 1, 
    title: "Daily Standup", 
    date: dayjs().format('YYYY-MM-DD'), // Today's date
    time: "09:00", 
    durationMinutes: 60, 
    color: "#4F46E5", // Indigo
    description: "Review progress and plan tasks."
  },
  { 
    id: 2, 
    title: "Project Sync (Past)", 
    date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), // 3 days in the past
    time: "14:00", 
    durationMinutes: 90, 
    color: "#059669", // Emerald
    description: "Deep dive into feature A implementation."
  },
  { 
    id: 3, 
    title: "Lunch Break", 
    date: dayjs().format('YYYY-MM-DD'),
    time: "12:30", 
    durationMinutes: 60, 
    color: "#EAB308", // Yellow
    description: "Time to recharge!"
  },
  { 
    id: 4, 
    title: "Weekly Catchup (Future)", 
    date: dayjs().add(7, 'day').format('YYYY-MM-DD'), 
    time: "10:00", 
    durationMinutes: 120, 
    color: "#DC2626", // Red
    description: "Team meeting for milestone check."
  },
  // CONFLICT EXAMPLE: Overlapping event on the same day (7 days from now)
  { 
    id: 5, 
    title: "Design Review (Future)", 
    date: dayjs().add(7, 'day').format('YYYY-MM-DD'), 
    time: "10:30", // Overlaps with Weekly Catchup (10:00 - 12:00)
    durationMinutes: 60, 
    color: "#F97316", // Orange
    description: "Review final mockups for UI."
  },
];


const getDaysInMonth = (date) => {
  const today = dayjs().startOf('day');
  const startOfMonth = dayjs(date).startOf('month');
  
  // Calculate the day of the week for the first day, then go back to the starting Sunday.
  const startDay = startOfMonth.weekday(0); 

  const days = [];
  let currentDay = startDay;

  // Generate 6 weeks (42 days) for a consistent grid
  for (let i = 0; i < 42; i++) {
    const day = currentDay.add(i, 'day');
    
    days.push({
      date: day.format('YYYY-MM-DD'),
      dayOfMonth: day.date(),
      isCurrentMonth: day.month() === date.month(),
      isToday: day.isToday(),
      // NEW: Check if the day is strictly before today
      isPast: day.isBefore(today, 'day'), 
      dayjsObject: day,
    });
  }
  return days;
};


const Modal = ({ isOpen, title, onClose, children, size = 'max-w-md' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className={`bg-white rounded-xl shadow-2xl w-full ${size} transform transition-all`}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};



const EventsListViewModal = ({ events, onClose, date, onOpenAddForm, isPast }) => {
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-indigo-600 mb-4">
                {dayjs(date).format('ddd, MMM D, YYYY')} Events ({events.length})
                {isPast && <span className="ml-2 text-sm text-gray-500 font-normal">(Completed)</span>}
            </h4>
            
            {/* List of Events */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {events.map((event, index) => (
                    <div key={event.id} className="p-4 rounded-lg shadow-md border" style={{ borderColor: event.color, borderLeftWidth: '5px' }}>
                        <div className="flex justify-between items-start mb-1">
                            <h5 className="font-semibold text-lg text-gray-900">{event.title}</h5>
                            <div className="text-xs font-medium text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: event.color }}>
                                {event.time}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            Duration: <span className="font-medium">{event.durationMinutes} minutes</span>
                        </p>
                        {event.description && (
                            <p className="text-sm text-gray-500 mt-1 italic border-t border-gray-100 pt-2">{event.description}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-between">
                {/* NEW: Conditional Button to Add Event */}
                {!isPast ? (
                    <button
                        onClick={onOpenAddForm}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Add New Event</span>
                    </button>
                ) : (
                    <p className="text-sm text-gray-500 italic">Cannot schedule new events for completed days.</p>
                )}
                
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};


const AddEventForm = ({ selectedDay, onAddEvent, onClose }) => {
    const defaultColor = "#4F46E5"; 
    const [title, setTitle] = useState('');
    const [time, setTime] = useState(dayjs().format('HH:mm')); // Default to current time
    const [durationMinutes, setDurationMinutes] = useState(60);
    const [color, setColor] = useState(defaultColor);
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim() || !time) {
            console.error("Please enter a title and time.");
            return;
        }

        const newEvent = {
            id: Date.now(), // Unique ID
            title: title.trim(),
            date: selectedDay.date,
            time: time,
            durationMinutes: parseInt(durationMinutes, 10),
            color: color,
            description: description.trim(),
        };

        onAddEvent(newEvent);
        onClose();
    };

    const colorOptions = [
        { name: "Indigo", hex: "#4F46E5" }, 
        { name: "Emerald", hex: "#059669" }, 
        { name: "Yellow", hex: "#EAB308" }, 
        { name: "Red", hex: "#DC2626" },
        { name: "Orange", hex: "#F97316" },
    ];
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-lg font-medium text-gray-600">
                Scheduling for: <span className="font-bold text-indigo-600">{selectedDay.dayjsObject.format('ddd, MMM D, YYYY')}</span>
            </h4>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Event Title"
                />
            </div>

            <div className="flex space-x-4">
                
                <div className="w-1/2">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                </div>
                
                
                <div className="w-1/2">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                    <input
                        type="number"
                        id="duration"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(e.target.value)}
                        required
                        min="5"
                        max="360"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                </div>
            </div>

            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Brief details about the event."
                ></textarea>
            </div>
            
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color/Category</label>
                <div className="flex space-x-2">
                    {colorOptions.map(opt => (
                        <button
                            key={opt.hex}
                            type="button"
                            onClick={() => setColor(opt.hex)}
                            className={`h-8 w-8 rounded-full border-2 transition-all duration-150 ${color === opt.hex ? 'ring-4 ring-offset-2 ring-indigo-500' : 'hover:ring-2'}`}
                            style={{ backgroundColor: opt.hex }}
                            aria-label={`Select ${opt.name} color`}
                        />
                    ))}
                </div>
            </div>

            
            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                >
                    Schedule Event
                </button>
            </div>
        </form>
    );
};



const EventBadge = ({ event, isPast }) => {
    
    const badgeStyle = isPast 
        ? { backgroundColor: event.color, opacity: 0.6, textDecoration: 'line-through' } 
        : { backgroundColor: event.color };

    return (
        <div 
            className="text-xs font-medium text-white px-2 py-0.5 mt-0.5 rounded-md truncate shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-200"
            style={badgeStyle}
            
            title={`${event.title} (${event.time} for ${event.durationMinutes} mins): ${event.description} ${isPast ? '(Completed)' : ''}`}
        >
            {event.title}
        </div>
    );
};



const CalendarDay = ({ day, events, onDayClick }) => {
  
  
  const baseClasses = "relative h-28 p-1.5 border-b border-r transition-all duration-300 ease-in-out cursor-pointer group";
  
  let dayNumberClasses = "text-sm font-semibold h-6 w-6 flex items-center justify-center rounded-full transition-all duration-300";
  
  let cellBgClass = 'bg-white hover:bg-indigo-50';
  if (!day.isCurrentMonth) {
    cellBgClass = 'bg-gray-50/50';
  } 
  
  if (!day.isCurrentMonth) {
    dayNumberClasses += " text-gray-400";
  } else if (day.isToday) {
    dayNumberClasses += " bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300";
  } else if (day.isPast) {
    
    dayNumberClasses += " text-gray-500";
  } else {
    dayNumberClasses += " text-gray-800 group-hover:bg-indigo-50/50";
  }

  const visibleEvents = events.slice(0, 2); 
  const remainingEventsCount = events.length - visibleEvents.length;

  return (
    <div 
        className={`${baseClasses} ${cellBgClass}`}
        onClick={() => onDayClick(day, events)} // Pass the events list to the handler
    >
      
      
      <div className="flex justify-between items-center">
        
        <span className="text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {day.dayjsObject.format('ddd').toUpperCase()}
        </span>
        <span className={dayNumberClasses}>
          {day.dayOfMonth}
        </span>
      </div>
      
      
      <div className="mt-1 space-y-0.5 overflow-hidden">
        {visibleEvents.map(event => (
          
          <EventBadge key={event.id} event={event} isPast={day.isPast} />
        ))}
        
        
        {remainingEventsCount > 0 && (
          <div className="text-xs text-center text-gray-600 bg-gray-200 rounded-md mt-1 p-0.5 border border-dashed border-gray-400 transition-colors"
               title={`Click to view all ${events.length} events, including ${remainingEventsCount} conflicting or overflowing events.`}>
            +{remainingEventsCount} more events
          </div>
        )}
      </div>
    </div>
  );
};



const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState(InitialEventData);
  
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState(null); 
  
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [eventsToView, setEventsToView] = useState([]);
  const [selectedDayForView, setSelectedDayForView] = useState(null);

  
  
  const handleOpenAddFormForDate = useCallback((day) => {
    
    if (day.isPast) {
        console.warn("Cannot add events to a completed day.");
        return;
    }
    
    handleCloseViewModal(); // Close the view modal if it was open
    setSelectedDayForAdd(day);
    setIsAddModalOpen(true);
  }, []);


  
  const handleDayClick = useCallback((day, eventsOnDate) => {
    
    if (eventsOnDate && eventsOnDate.length > 0) {
      setEventsToView(eventsOnDate);
      setSelectedDayForView(day);
      setIsViewModalOpen(true);
      
      return; 
    }

    
    if (!day.isPast) {
      handleOpenAddFormForDate(day);
    } else {
       
       console.info("Cannot add events to past dates.");
    }

  }, [handleOpenAddFormForDate]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setSelectedDayForAdd(null);
  }, []);
  
  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setEventsToView([]);
    setSelectedDayForView(null);
  }, []);


  const handleAddEvent = useCallback((newEvent) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  

  const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  
  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const dateKey = event.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      
      acc[dateKey].sort((a, b) => {
        return dayjs(`${a.date} ${a.time}`).diff(dayjs(`${b.date} ${b.time}`));
      });
      return acc;
    }, {});
  }, [events]); 

  
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => prev.add(1, 'month'));
  }, []);

  const goToCurrentMonth = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

 
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        
        
        <div className="p-6 border-b flex justify-between items-center bg-indigo-700 text-white">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Calendar
          </h1>
          
          <div className="flex items-center space-x-4">
            
            <h2 className="text-2xl font-semibold">
              {currentDate.format('MMMM YYYY')}
            </h2>
            
            
            <div className="flex space-x-1">
              <button 
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-indigo-600 transition-colors"
                aria-label="Previous Month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-indigo-600 transition-colors"
                aria-label="Next Month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <button 
              onClick={goToCurrentMonth}
              className="px-4 py-2 text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-md transition-colors"
            >
              Today
            </button>
          </div>
        </div>
        
        
        <div className="grid grid-cols-7 text-center">
          
          {weekdays.map(day => (
            <div key={day} className="py-3 text-sm font-medium text-gray-500 border-b border-r bg-gray-50">
              {day}
            </div>
          ))}
          
          
          {daysInMonth.map((day, index) => (
            <CalendarDay 
              key={index} 
              day={day} 
              events={eventsByDate[day.date] || []}
              onDayClick={handleDayClick} 
            />
          ))}
        </div>
        
        

      </div>
      
      
      {selectedDayForAdd && (
        <Modal 
            isOpen={isAddModalOpen} 
            title="Schedule New Event" 
            onClose={handleCloseAddModal}
        >
            <AddEventForm 
                selectedDay={selectedDayForAdd}
                onAddEvent={handleAddEvent}
                onClose={handleCloseAddModal}
            />
        </Modal>
      )}

      
      {selectedDayForView && (
        <Modal 
            isOpen={isViewModalOpen} 
            title={`Events for ${selectedDayForView.dayjsObject.format('MMM D')}`}
            onClose={handleCloseViewModal}
            size="max-w-xl"
        >
            <EventsListViewModal 
                events={eventsToView}
                date={selectedDayForView.date}
                onClose={handleCloseViewModal}
                isPast={selectedDayForView.isPast} 
                onOpenAddForm={selectedDayForView.isPast ? null : () => handleOpenAddFormForDate(selectedDayForView)} 
            />
        </Modal>
      )}

    </div>
  );
};

export default App;
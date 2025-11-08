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
    date: dayjs().format('YYYY-MM-DD'), 
    time: "09:00", 
    durationMinutes: 60, 
    color: "#4F46E5", 
    description: "Review progress and plan tasks."
  },
  { 
    id: 2, 
    title: "Project Sync (Past)", 
    date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    time: "14:00", 
    durationMinutes: 90, 
    color: "#059669", 
    description: "Deep dive into feature A implementation."
  },
  { 
    id: 3, 
    title: "Lunch Break", 
    date: dayjs().format('YYYY-MM-DD'),
    time: "12:30", 
    durationMinutes: 60, 
    color: "#EAB308", 
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
  
  { 
    id: 5, 
    title: "Design Review (Future)", 
    date: dayjs().add(7, 'day').format('YYYY-MM-DD'), 
    time: "10:30",
    durationMinutes: 60, 
    color: "#F97316", 
    description: "Review final mockups for UI."
  },
];


const getDaysInMonth = (date) => {
  const today = dayjs().startOf('day');
  const startOfMonth = dayjs(date).startOf('month');
  
  
  const startDay = startOfMonth.weekday(0); 

  const days = [];
  let currentDay = startDay;

  
  for (let i = 0; i < 42; i++) {
    const day = currentDay.add(i, 'day');
    
    days.push({
      date: day.format('YYYY-MM-DD'),
      dayOfMonth: day.date(),
      isCurrentMonth: day.month() === date.month(),
      isToday: day.isToday(),
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

const ProfileModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all">
                    <div className="p-6 text-center">
                        <div className="h-12 w-12 bg-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white">
                            PK
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">Praveen</h4>
                        <p className="text-sm text-gray-500 mb-4">praveenkumar5pnk@outlook.com</p>
                        
                        <div className="space-y-2 border-t pt-4">
                            <button className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium py-1">Manage Account</button>
                            <button className="w-full text-gray-600 hover:text-gray-700 text-sm font-medium py-1" onClick={onClose}>Sign Out</button>
                        </div>

                        <button 
                            onClick={onClose} 
                            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const SearchModal = ({ isOpen, onClose, onSearchSubmit }) => {
    const [query, setQuery] = useState('');
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearchSubmit(query.trim());
            setQuery('');
           
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <Modal isOpen={isOpen} title="Search Calendar" onClose={onClose}>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
                <p className="text-sm text-gray-500">Search for public holidays, events, and scheduled items.</p>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter search term, e.g., 'Standup' or 'holiday'"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    autoFocus
                />
                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!query.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </form>
        </Modal>
    );
};


const EventsListViewModal = ({ events, onClose, date, onOpenAddForm, isPast }) => {
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-indigo-600 mb-4">
                {dayjs(date).format('ddd, MMM D, YYYY')} Events ({events.length})
                {isPast && <span className="ml-2 text-sm text-gray-500 font-normal">(Completed)</span>}
            </h4>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {events.map((event) => (
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

            <div className="pt-4 flex justify-between">
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
    const [time, setTime] = useState(dayjs().format('HH:mm')); 
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
            id: Date.now(), 
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
  
  
  const baseClasses = "relative h-28 p-1.5 border-b border-r border-gray-200 transition-all duration-300 ease-in-out cursor-pointer group";
  
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
        onClick={() => onDayClick(day, events)} 
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


const TimeSlotEvent = ({ event }) => {
    
    const MIN_TO_PX = 64 / 60; 

    const calculateStyles = () => {
        const start = dayjs(`${event.date} ${event.time}`);
        const startOfDay = start.startOf('day');
        
        
        const minutesFromMidnight = start.diff(startOfDay, 'minute'); 

        
        const top = minutesFromMidnight * MIN_TO_PX;
        const height = event.durationMinutes * MIN_TO_PX;
        
        
        const finalHeight = Math.max(height, 20); 

        return {
            top: `${top}px`,
            height: `${finalHeight}px`,
            backgroundColor: event.color,
            borderColor: event.color,
            
            opacity: dayjs(event.date).isBefore(dayjs().startOf('day')) ? 0.6 : 1,
        };
    };

    const style = calculateStyles();
    
    return (
        <div 
            className="absolute left-0 w-full rounded-lg text-white p-1 text-xs overflow-hidden border border-l-4 shadow-md hover:shadow-lg cursor-pointer transition-all duration-150 z-20"
            style={style}
            title={`${event.title} (${dayjs(`${event.date} ${event.time}`).format('h:mm A')} for ${event.durationMinutes} mins)`}
        >
            <div className="font-semibold truncate">{dayjs(`${event.date} ${event.time}`).format('h:mm A')}</div>
            <div className="truncate">{event.title}</div>
        </div>
    );
};



const ScheduleView = ({ events, currentDate, onOpenAddForm }) => {
    
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');

    
    const currentMonthEvents = useMemo(() => {
        return events
            .filter(event => {
                const eventDate = dayjs(event.date);
                return eventDate.isSameOrAfter(startOfMonth, 'day') && eventDate.isSameOrBefore(endOfMonth, 'day');
            })
            .sort((a, b) => dayjs(`${a.date} ${a.time}`).diff(dayjs(`${b.date} ${b.time}`)));
    }, [events, startOfMonth, endOfMonth]);

    
    const daysInCurrentMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
    const todayDay = useMemo(() => daysInCurrentMonth.find(d => d.isToday) || daysInCurrentMonth[0], [daysInCurrentMonth]);


    return (
        <div className="p-4 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
                Schedule View ({currentDate.format('MMMM YYYY')})
            </h3>
            
            <button
                onClick={() => onOpenAddForm(todayDay)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                <span>Quick Add Event</span>
            </button>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                {currentMonthEvents.length === 0 ? (
                    <p className="text-gray-500 italic">No events scheduled for this month.</p>
                ) : (
                    currentMonthEvents.map(event => {
                        const dayObj = dayjs(event.date);
                        return (
                            <div key={event.id} className="flex border-l-4 p-3 rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow" style={{ borderColor: event.color }}>
                                
                                <div className="w-28 flex-shrink-0 mr-4 pr-3">
                                    <p className="text-sm font-bold text-indigo-600">{dayObj.format('ddd, MMM D')}</p>
                                    <p className="text-base font-semibold text-gray-900 mt-0.5">{event.time}</p>
                                    <p className="text-xs text-gray-500">{event.durationMinutes} min</p>
                                </div>
                               
                                <div className="flex-grow">
                                    <h4 className="font-bold text-lg">{event.title}</h4>
                                    {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};


const SearchResultsView = ({ results, query }) => {
    return (
        <div className="p-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
                Search Results for: "<span className="text-indigo-600">{query}</span>"
            </h3>
            
            {results && results.length > 0 ? (
                <div className="space-y-8">
                    {results.map((category) => (
                        <div key={category.category} className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">{category.category} ({category.items.length})</h4>
                            <div className="space-y-3">
                                {category.items.map(item => (
                                    <div key={item.id} className="flex border-l-4 p-3 rounded-lg shadow-sm bg-white transition-shadow" style={{ borderColor: item.color }}>
                                        <div className="flex-shrink-0 mr-4">
                                            <p className="text-sm font-bold text-gray-800">{item.date}</p>
                                            {item.time && <p className="text-xs text-gray-500">{item.time}</p>}
                                        </div>
                                        <div className="flex-grow">
                                            <h5 className="font-bold text-base">{item.title}</h5>
                                            {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No scheduled events or public holidays found matching "{query}".</p>
            )}
        </div>
    );
};



const Sidebar = ({ currentDate, setCurrentDate, onOpenAddForm, currentView, setCurrentView }) => {
    
    
    const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
    
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; 

    const goToPreviousMonth = useCallback(() => {
        setCurrentDate(prev => prev.subtract(1, 'month'));
    }, [setCurrentDate]);

    const goToNextMonth = useCallback(() => {
        setCurrentDate(prev => prev.add(1, 'month'));
    }, [setCurrentDate]);

    
    const todayDay = useMemo(() => days.find(d => d.isToday) || days[0], [days]);
    
    
    return (
        <div className="w-64 flex-shrink-0 p-4 border-r overflow-y-auto bg-white h-full hidden lg:block">
            
           
            <button
                onClick={() => onOpenAddForm(todayDay)}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow font-semibold text-gray-700 mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Create</span>
            </button>
            
            
            <div className="p-2 bg-white">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm text-gray-700">
                        {currentDate.format('MMMM YYYY')}
                    </h4>
                    <div className="flex space-x-1">
                        <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {weekdays.map((day, index) => (
                        <div key={index} className="text-gray-500 font-medium">{day}</div>
                    ))}
                    {days.map((day) => {
                        const isSelectedMonth = day.isCurrentMonth;
                        const isToday = day.isToday;
                        
                        let dayClasses = "h-6 w-6 flex items-center justify-center rounded-full cursor-pointer transition-all duration-150";
                        if (isToday) {
                            dayClasses += " bg-indigo-600 text-white font-bold shadow-md";
                        } else if (isSelectedMonth) {
                            dayClasses += " text-gray-800 hover:bg-indigo-100";
                        } else {
                            dayClasses += " text-gray-400 hover:bg-gray-100";
                        }

                        return (
                            <div key={day.date} className="flex justify-center items-center">
                                <div className={dayClasses}>
                                    {day.dayOfMonth}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            
            
            <div className="mt-6 border-t pt-4 border-gray-200">
                 <h4 className="font-semibold text-xs text-gray-500 mb-2 uppercase">Current View</h4>
                 <div className="flex flex-col space-y-2 text-sm font-medium">
                    {['Day', 'Week', 'Month', 'Schedule'].map(view => (
                        <button
                            key={view}
                            onClick={() => setCurrentView(view.toLowerCase())}
                            className={`px-3 py-1.5 text-left rounded-lg transition-colors ${
                                currentView === view.toLowerCase() 
                                    ? 'bg-indigo-600 text-white shadow-inner' 
                                    : 'hover:bg-gray-100 text-gray-700 bg-white'
                            }`}
                        >
                            {view}
                        </button>
                    ))}
                 </div>
            </div>

        </div>
    );
};




const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState(InitialEventData);
  
  
  const [currentView, setCurrentView] = useState('week'); 
  
 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState(null); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [eventsToView, setEventsToView] = useState([]);
  const [selectedDayForView, setSelectedDayForView] = useState(null);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); 
  
 
  const [searchResults, setSearchResults] = useState(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');


  
  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setEventsToView([]);
    setSelectedDayForView(null);
  }, []);

  const handleOpenAddFormForDate = useCallback((day) => {
    if (day.isPast) {
        console.warn("Cannot add events to a completed day.");
        return;
    }
    handleCloseViewModal(); 
    setSelectedDayForAdd(day);
    setIsAddModalOpen(true);
  }, [handleCloseViewModal]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setSelectedDayForAdd(null);
  }, []);
  
  const handleAddEvent = useCallback((newEvent) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
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
  

  const handleSearchClick = () => {
      setIsSearchModalOpen(true); 
  };
  
  const handleCloseSearchModal = () => {
      setIsSearchModalOpen(false);
  };
  
  const handleProfileClick = () => {
      setIsProfileModalOpen(true);
  };
  
  const handleCloseProfileModal = () => {
      setIsProfileModalOpen(false);
  };

 
  const handleExecuteSearch = useCallback((query) => {
    setLastSearchQuery(query);
    handleCloseSearchModal();
    
    const lowerQuery = query.toLowerCase();
    let results = [];

    
    const eventMatches = events.filter(e => 
        e.title.toLowerCase().includes(lowerQuery) || 
        e.description.toLowerCase().includes(lowerQuery) ||
        e.date.includes(lowerQuery)
    );

    if (eventMatches.length > 0) {
        results.push({
            category: 'Scheduled Events',
            items: eventMatches.map(e => ({
                id: e.id,
                title: e.title,
                date: dayjs(e.date).format('ddd, MMM D, YYYY'),
                time: e.time,
                color: e.color,
                description: e.description
            }))
        });
    }

    
    if (lowerQuery.includes('holiday') || lowerQuery.includes('christmas') || lowerQuery.includes('year') || results.length === 0) {
        results.push({
            category: 'Public Holidays (Mock)',
            items: [
                { id: 'h1', title: 'New Year\'s Day', date: dayjs().year(currentDate.year()).month(0).date(1).format('ddd, MMM D, YYYY'), color: '#3B82F6' },
                { id: 'h2', title: 'Christmas Day', date: dayjs().year(currentDate.year()).month(11).date(25).format('ddd, MMM D, YYYY'), color: '#10B981' }
            ]
        });
    }
    
    setSearchResults(results);
    setCurrentView('search-results'); 
}, [events, currentDate]);

  
  const goToPrevious = useCallback(() => {
    
    if (currentView === 'search-results') {
        setCurrentView('week');
        return;
    }
    
    setSearchResults(null);
    switch(currentView) {
        case 'day': 
            setCurrentDate(prev => prev.subtract(1, 'day'));
            break;
        case 'week':
            setCurrentDate(prev => prev.subtract(1, 'week'));
            break;
        case 'month':
        case 'schedule':
        default:
            setCurrentDate(prev => prev.subtract(1, 'month'));
            break;
    }
  }, [currentView]);

  const goToNext = useCallback(() => {
    
    if (currentView === 'search-results') {
        setCurrentView('week');
        return;
    }

    setSearchResults(null);
    switch(currentView) {
        case 'day': 
            setCurrentDate(prev => prev.add(1, 'day'));
            break;
        case 'week':
            setCurrentDate(prev => prev.add(1, 'week'));
            break;
        case 'month':
        case 'schedule':
        default:
            setCurrentDate(prev => prev.add(1, 'month'));
            break;
    }
  }, [currentView]);

  const goToToday = useCallback(() => {
    setSearchResults(null);
    setCurrentDate(dayjs());
    setCurrentView('week'); 
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

  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  const headerTitle = useMemo(() => {
    if (currentView === 'search-results') {
        return 'Search Results';
    }
    
    switch (currentView) {
        case 'day': return currentDate.format('dddd, MMMM D, YYYY');
        case 'week': 
           
            const startOfWeek = currentDate.startOf('week');
            const endOfWeek = currentDate.endOf('week');
            if (startOfWeek.month() === endOfWeek.month()) {
                return startOfWeek.format('MMMM YYYY'); 
            }
            return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`;
        case 'month':
        case 'schedule':
        default: return currentDate.format('MMMM YYYY');
    }
  }, [currentDate, currentView]);


  
  const timeGridDays = useMemo(() => {
    if (currentView === 'day') {
        return [currentDate];
    } else if (currentView === 'week') {
        let days = [];
        let startOfWeek = currentDate.startOf('week'); 
        for (let i = 0; i < 7; i++) {
            days.push(startOfWeek.add(i, 'day'));
        }
        return days;
    }
    return [];
  }, [currentDate, currentView]);


  
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <div className="w-full h-screen flex flex-col">
        
        
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white text-gray-800 flex-shrink-0">
          
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-extrabold tracking-tight">
              📅 Calendar
            </h1>
            
            
            <button 
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100 rounded-md shadow-sm transition-colors hidden sm:block text-gray-700"
            >
              Today
            </button>
            
            
            {currentView !== 'search-results' && (
                <div className="flex space-x-0.5">
                    <button 
                        onClick={goToPrevious}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600 border border-gray-300"
                        aria-label="Previous"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    
                    <button 
                        onClick={goToNext}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600 border border-gray-300"
                        aria-label="Next"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            )}
            
          </div>


          
          <h2 className="text-xl sm:text-2xl font-normal flex-grow text-left mx-4">
            {headerTitle}
          </h2>

          
          <div className="flex items-center space-x-4">
            
            
            <div className='flex space-x-2'>
                <button 
                    onClick={handleSearchClick} 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600" 
                    aria-label="Search Public Holidays and Events"
                    title="Search public holidays and events" 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
            
            
            {currentView !== 'search-results' && (
                <div className="flex border border-gray-300 rounded-lg overflow-hidden text-xs sm:text-sm font-medium">
                    {['Day', 'Week', 'Month', 'Schedule'].map(view => (
                        <button
                            key={view}
                            onClick={() => {setCurrentView(view.toLowerCase()); setSearchResults(null);}}
                            className={`px-2 py-1 sm:px-3 sm:py-1.5 transition-colors whitespace-nowrap border-l border-gray-300 first:border-l-0 ${
                                currentView === view.toLowerCase() 
                                    ? 'bg-indigo-600 text-white shadow-inner' 
                                    : 'hover:bg-gray-100 text-gray-700 bg-white'
                            }`}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            )}

            
            <button
                onClick={handleProfileClick} 
                className="h-8 w-8 bg-pink-300 rounded-full cursor-pointer border-2 border-white hover:ring-2 ring-indigo-300 flex items-center justify-center text-xs font-bold text-white ml-4"
                title="Name: Praveen Kumar | Email: praveenkumar5pnk@outlook.com (Click for options)"
            >
                P
            </button>
          </div>
        </div>
        
        
        
        <div className="flex flex-grow overflow-hidden">
            
            
            <Sidebar 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate} 
                onOpenAddForm={handleOpenAddFormForDate}
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
            
            
            <div className="flex-grow p-0 overflow-y-auto">
              
              
              {currentView === 'month' && (
                <>
                 
                  <div className="grid grid-cols-7 text-center sticky top-0 bg-white z-10 border-b">
                    {weekdays.map(day => (
                      <div key={day} className="py-3 text-sm font-medium text-gray-500 border-r bg-gray-50 border-gray-200">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                 
                  <div className="grid grid-cols-7 border-l border-t border-gray-200">
                    {daysInMonth.map((day, index) => (
                      <CalendarDay 
                        key={index} 
                        day={day} 
                        events={eventsByDate[day.date] || []}
                        onDayClick={handleDayClick} 
                      />
                    ))}
                  </div>
                </>
              )}

              
              {currentView === 'schedule' && (
                <ScheduleView 
                    events={events} 
                    currentDate={currentDate} 
                    onOpenAddForm={handleOpenAddFormForDate}
                />
              )}
              
              
              {(currentView === 'search-results' && searchResults) && (
                <SearchResultsView results={searchResults} query={lastSearchQuery} />
              )}

              
              {(currentView === 'day' || currentView === 'week') && (
                <div className="flex">
                    
                    <div className='w-16 flex-shrink-0 text-xs text-right text-gray-500 pr-2 pt-16 border-r border-gray-200'>
                        
                        {Array.from({ length: 24 }).map((_, hour) => (
                            <div key={hour} className="h-16 relative">
                               
                                <span className='absolute -top-2 right-0'>
                                    {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    
                    <div className="flex-grow min-h-screen">
                       
                        <div className={`grid border-b border-t border-gray-200 sticky top-0 bg-white z-10`} style={{ gridTemplateColumns: `repeat(${timeGridDays.length}, minmax(0, 1fr))` }}>
                            {timeGridDays.map((day, index) => (
                                <div key={index} className="py-3 text-center border-r border-gray-200 bg-gray-50">
                                    <h4 className={`font-semibold text-sm ${day.isToday() ? 'text-indigo-600' : 'text-gray-700'}`}>
                                        {day.format('ddd')}
                                    </h4>
                                    <p className={`text-xl font-bold ${day.isToday() ? 'text-indigo-600' : 'text-gray-800'}`}>
                                        {day.format('D')}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        
                        <div className={`grid border-l border-r border-gray-200`} style={{ gridTemplateColumns: `repeat(${timeGridDays.length}, minmax(0, 1fr))` }}>
                            {timeGridDays.map((day, index) => (
                                <div key={day.format('YYYY-MM-DD')} className="border-r border-gray-200 relative">
                                    
                                    {Array.from({ length: 24 }).map((_, hour) => (
                                        <div 
                                            key={hour} 
                                            className="h-16 border-b border-dashed border-gray-200 hover:bg-indigo-50/20 cursor-pointer"
                                        >
                                            
                                        </div>
                                    ))}
                                    
                                    
                                    {eventsByDate[day.format('YYYY-MM-DD')]?.map(event => (
                                        <TimeSlotEvent key={event.id} event={event} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}

            </div>
            
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
      
      
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
      
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSearchSubmit={handleExecuteSearch}
      />

    </div>
  );
};

export default App;

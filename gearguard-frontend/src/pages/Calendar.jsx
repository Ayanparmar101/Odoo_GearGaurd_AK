import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  useEffect(() => {
    fetchEvents();
    fetchStats();
    fetchDeadlines();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/calendar/events');
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await api.get(`/calendar/stats?month=${month}&year=${year}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDeadlines = async () => {
    try {
      const response = await api.get('/calendar/deadlines?days=7');
      setDeadlines(response.data);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6';
    
    switch (event.status) {
      case 'pending':
        backgroundColor = '#6b7280';
        break;
      case 'assigned':
        backgroundColor = '#3b82f6';
        break;
      case 'in-progress':
        backgroundColor = '#8b5cf6';
        break;
      case 'on-hold':
        backgroundColor = '#f59e0b';
        break;
      case 'completed':
        backgroundColor = '#10b981';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
    }

    if (event.priority === 'critical') {
      backgroundColor = '#dc2626';
    } else if (event.priority === 'high') {
      backgroundColor = '#f97316';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px'
      }
    };
  };

  const handleSelectEvent = (event) => {
    navigate(`/maintenance-requests/${event.id}`);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
        <p className="text-gray-500 mt-1">Schedule and track maintenance activities</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-600">Scheduled</p>
            </div>
            <p className="text-2xl font-bold mt-1 text-blue-700">{stats.scheduled}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-600">Unscheduled</p>
            </div>
            <p className="text-2xl font-bold mt-1 text-yellow-700">{stats.unscheduled}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600">Overdue</p>
            </div>
            <p className="text-2xl font-bold mt-1 text-red-700">{stats.overdue}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-600">Upcoming This Week</p>
            </div>
            <p className="text-2xl font-bold mt-1 text-green-700">{stats.upcomingThisWeek}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <div className="calendar-container" style={{ height: '600px' }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              onNavigate={handleNavigate}
              view={view}
              onView={setView}
              views={['month', 'week', 'day', 'agenda']}
              popup
              tooltipAccessor={(event) => `${event.title} - ${event.status}`}
            />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {deadlines.length > 0 ? (
              deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  onClick={() => navigate(`/maintenance-requests/${deadline.id}`)}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-sm">{deadline.requestNumber}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      deadline.daysUntil <= 1 ? 'bg-red-100 text-red-800' :
                      deadline.daysUntil <= 3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {deadline.daysUntil === 0 ? 'Today' :
                       deadline.daysUntil === 1 ? 'Tomorrow' :
                       `${deadline.daysUntil} days`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{deadline.assetName}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      deadline.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      deadline.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {deadline.priority}
                    </span>
                    <span className="text-xs text-gray-500">{deadline.type}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>On Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Critical Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

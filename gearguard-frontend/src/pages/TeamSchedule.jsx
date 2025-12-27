import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Users, Clock, AlertCircle, Package } from 'lucide-react';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import api from '../services/api';

const TeamSchedule = () => {
  const { teamId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    fetchSchedule();
  }, [teamId, currentWeek]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const weekStart = startOfWeek(currentWeek);
      const weekEnd = endOfWeek(currentWeek);
      
      const response = await api.get(
        `/calendar/team/${teamId}?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`
      );
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching team schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek);
    const end = endOfWeek(currentWeek);
    return eachDayOfInterval({ start, end });
  };

  const getScheduleForDay = (day) => {
    if (!schedule || !schedule.schedule) return [];
    
    return schedule.schedule.filter(item => {
      const itemDate = new Date(item.scheduledDate || item.createdAt);
      return isSameDay(itemDate, day);
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-green-500 bg-green-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading team schedule...</div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Team not found</div>
      </div>
    );
  }

  const weekDays = getWeekDays();
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{schedule.team.name} Schedule</h1>
        <p className="text-gray-500 mt-1">Weekly maintenance schedule for the team</p>
      </div>

      {/* Team Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Team Members</p>
              <p className="text-2xl font-bold">{schedule.team.memberCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tasks</p>
              <p className="text-2xl font-bold">{schedule.schedule.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
          </div>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            →
          </button>
        </div>
      </div>

      {/* Week Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const daySchedule = getScheduleForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toISOString()}
              className={`bg-white rounded-lg shadow overflow-hidden ${
                isToday ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className={`p-3 text-center ${
                isToday ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900'
              }`}>
                <p className="text-xs font-medium">{format(day, 'EEE')}</p>
                <p className="text-lg font-bold">{format(day, 'd')}</p>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {daySchedule.length > 0 ? (
                  daySchedule.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded ${getPriorityColor(item.priority)} cursor-pointer hover:shadow transition`}
                    >
                      <p className="text-xs font-medium mb-1">{item.requestNumber}</p>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-1">{item.assetName}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {item.estimatedDuration && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.estimatedDuration}h
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.assignedToName}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unscheduled Tasks */}
      {schedule.schedule.filter(item => !item.scheduledDate).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Unscheduled Tasks</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {schedule.schedule
              .filter(item => !item.scheduledDate)
              .map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">{item.requestNumber}</p>
                  <p className="text-xs text-gray-600 mb-2">{item.assetName}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{item.assignedToName}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSchedule;

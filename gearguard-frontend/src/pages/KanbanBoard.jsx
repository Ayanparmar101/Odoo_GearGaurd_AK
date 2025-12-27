import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, AlertCircle, User, Package, Plus } from 'lucide-react';
import api from '../services/api';

const KanbanBoard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const columns = {
    'assigned': { title: 'To Do', color: 'bg-gray-100' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-100' },
    'on-hold': { title: 'On Hold', color: 'bg-yellow-100' },
    'completed': { title: 'Completed', color: 'bg-green-100' }
  };

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/maintenance-requests');
      setRequests(response.data.filter(r => r.status !== 'pending' && r.status !== 'cancelled'));
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/maintenance-requests/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    
    try {
      await api.put(`/maintenance-requests/${draggableId}`, { status: newStatus });
      
      setRequests(prev => prev.map(req => 
        req.id === draggableId ? { ...req, status: newStatus } : req
      ));
      
      fetchStats();
    } catch (error) {
      console.error('Error updating request:', error);
      alert(error.response?.data?.message || 'Failed to update request status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRequestsByStatus = (status) => {
    return requests.filter(req => req.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading kanban board...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="text-gray-500 mt-1">Manage your assigned maintenance tasks</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Assigned</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-blue-600">In Progress</p>
            <p className="text-2xl font-bold mt-1 text-blue-700">{stats.byStatus['in-progress'] || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-600">On Hold</p>
            <p className="text-2xl font-bold mt-1 text-yellow-700">{stats.byStatus['on-hold'] || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-green-600">Completed</p>
            <p className="text-2xl font-bold mt-1 text-green-700">{stats.byStatus.completed || 0}</p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg p-3 border-b-2 border-gray-300`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-sm font-medium">
                    {getRequestsByStatus(columnId).length}
                  </span>
                </div>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 space-y-2 bg-gray-50 rounded-b-lg min-h-[500px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {getRequestsByStatus(columnId).map((request, index) => (
                      <Draggable
                        key={request.id}
                        draggableId={request.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => navigate(`/maintenance-requests/${request.id}`)}
                            className={`bg-white rounded-lg p-3 shadow cursor-pointer hover:shadow-md transition ${
                              snapshot.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            {/* Priority Badge */}
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(request.priority)}`}>
                                {request.priority}
                              </span>
                              <span className="text-xs text-gray-500">{request.requestNumber}</span>
                            </div>

                            {/* Asset Info */}
                            <div className="flex items-start gap-2 mb-2">
                              <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {request.asset?.name || request.assetName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.type}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {request.description}
                            </p>

                            {/* Requester */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                              <User className="w-3 h-3" />
                              <span className="truncate">{request.requester?.name || request.requesterName}</span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Urgency indicator */}
                            {request.urgency === 'urgent' && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>Urgent</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {getRequestsByStatus(columnId).length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No tasks
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;

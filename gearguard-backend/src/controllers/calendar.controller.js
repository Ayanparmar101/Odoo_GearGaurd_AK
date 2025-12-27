import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

// Get calendar events (maintenance requests and schedules)
export const getCalendarEvents = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const { role, userId } = req.user;
    
    let events = [];
    
    // Fetch maintenance requests
    if (!type || type === 'maintenance') {
      let requestQuery = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
      
      // Role-based filtering
      if (role === 'employee') {
        requestQuery = requestQuery.where('requestedBy', '==', userId);
      } else if (role === 'technician') {
        requestQuery = requestQuery.where('assignedTo', '==', userId);
      }
      
      const requestsSnapshot = await requestQuery.get();
      
      const maintenanceEvents = await Promise.all(requestsSnapshot.docs.map(async doc => {
        const data = doc.data();
        
        // Get asset info
        let assetName = data.assetName;
        if (data.assetId) {
          const assetDoc = await db.collection(COLLECTIONS.ASSETS).doc(data.assetId).get();
          if (assetDoc.exists) {
            assetName = assetDoc.data().name;
          }
        }
        
        return {
          id: doc.id,
          title: `${data.requestNumber} - ${assetName}`,
          start: data.scheduledDate || data.createdAt,
          end: data.completedAt || data.scheduledDate || data.createdAt,
          type: 'maintenance',
          status: data.status,
          priority: data.priority,
          requestNumber: data.requestNumber,
          assetName,
          description: data.description,
          allDay: !data.scheduledDate
        };
      }));
      
      events = [...events, ...maintenanceEvents];
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      events = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= start && eventDate <= end;
      });
    }
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Failed to fetch calendar events' });
  }
};

// Schedule maintenance request
export const scheduleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { scheduledDate, scheduledTime, estimatedDuration, notes } = req.body;
    
    if (!scheduledDate) {
      return res.status(400).json({ message: 'Scheduled date is required' });
    }
    
    // Check if request exists
    const requestDoc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(requestId).get();
    if (!requestDoc.exists) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    // Combine date and time
    let fullScheduledDate = scheduledDate;
    if (scheduledTime) {
      const date = new Date(scheduledDate);
      const [hours, minutes] = scheduledTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      fullScheduledDate = date.toISOString();
    }
    
    // Update request with schedule
    await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(requestId).update({
      scheduledDate: fullScheduledDate,
      estimatedDuration: estimatedDuration || null,
      scheduleNotes: notes || null,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(requestId).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error scheduling request:', error);
    res.status(500).json({ message: 'Failed to schedule request' });
  }
};

// Get team schedule
export const getTeamSchedule = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Verify team exists
    const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(teamId).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    const team = teamDoc.data();
    
    // Get team members
    let memberIds = team.members || [];
    
    // Get all maintenance requests assigned to team members
    const scheduleItems = [];
    
    for (const memberId of memberIds) {
      const requestsSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
        .where('assignedTo', '==', memberId)
        .where('status', 'in', ['assigned', 'in-progress', 'on-hold'])
        .get();
      
      for (const doc of requestsSnapshot.docs) {
        const data = doc.data();
        
        // Get member info
        const memberDoc = await db.collection(COLLECTIONS.USERS).doc(memberId).get();
        const memberName = memberDoc.exists ? memberDoc.data().name : 'Unknown';
        
        // Get asset info
        let assetName = data.assetName;
        if (data.assetId) {
          const assetDoc = await db.collection(COLLECTIONS.ASSETS).doc(data.assetId).get();
          if (assetDoc.exists) {
            assetName = assetDoc.data().name;
          }
        }
        
        scheduleItems.push({
          id: doc.id,
          requestNumber: data.requestNumber,
          assetName,
          assignedTo: memberId,
          assignedToName: memberName,
          scheduledDate: data.scheduledDate,
          estimatedDuration: data.estimatedDuration,
          status: data.status,
          priority: data.priority,
          type: data.type,
          createdAt: data.createdAt
        });
      }
    }
    
    // Filter by date range if provided
    let filteredItems = scheduleItems;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      filteredItems = scheduleItems.filter(item => {
        const itemDate = new Date(item.scheduledDate || item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    res.json({
      team: {
        id: teamId,
        name: team.name,
        memberCount: memberIds.length
      },
      schedule: filteredItems.sort((a, b) => {
        const dateA = new Date(a.scheduledDate || a.createdAt);
        const dateB = new Date(b.scheduledDate || b.createdAt);
        return dateA - dateB;
      })
    });
  } catch (error) {
    console.error('Error fetching team schedule:', error);
    res.status(500).json({ message: 'Failed to fetch team schedule' });
  }
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { days = 7 } = req.query;
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));
    
    let query = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
      .where('status', 'in', ['assigned', 'in-progress', 'on-hold']);
    
    // Role-based filtering
    if (role === 'employee') {
      query = query.where('requestedBy', '==', userId);
    } else if (role === 'technician') {
      query = query.where('assignedTo', '==', userId);
    }
    
    const snapshot = await query.get();
    
    const deadlines = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      if (data.scheduledDate) {
        const scheduledDate = new Date(data.scheduledDate);
        
        if (scheduledDate >= now && scheduledDate <= futureDate) {
          // Get asset info
          let assetName = data.assetName;
          if (data.assetId) {
            const assetDoc = await db.collection(COLLECTIONS.ASSETS).doc(data.assetId).get();
            if (assetDoc.exists) {
              assetName = assetDoc.data().name;
            }
          }
          
          // Calculate days until deadline
          const daysUntil = Math.ceil((scheduledDate - now) / (1000 * 60 * 60 * 24));
          
          deadlines.push({
            id: doc.id,
            requestNumber: data.requestNumber,
            assetName,
            scheduledDate: data.scheduledDate,
            daysUntil,
            isOverdue: daysUntil < 0,
            priority: data.priority,
            status: data.status,
            type: data.type
          });
        }
      }
    }
    
    // Sort by scheduled date (soonest first)
    deadlines.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    
    res.json(deadlines);
  } catch (error) {
    console.error('Error fetching upcoming deadlines:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming deadlines' });
  }
};

// Get calendar statistics
export const getCalendarStats = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { month, year } = req.query;
    
    let query = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    
    // Role-based filtering
    if (role === 'employee') {
      query = query.where('requestedBy', '==', userId);
    } else if (role === 'technician') {
      query = query.where('assignedTo', '==', userId);
    }
    
    const snapshot = await query.get();
    
    const stats = {
      total: snapshot.size,
      scheduled: 0,
      unscheduled: 0,
      overdue: 0,
      completedThisMonth: 0,
      upcomingThisWeek: 0
    };
    
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    let monthStart, monthEnd;
    if (month && year) {
      monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
      monthEnd = new Date(parseInt(year), parseInt(month), 0);
    }
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Count scheduled vs unscheduled
      if (data.scheduledDate) {
        stats.scheduled++;
        
        const scheduledDate = new Date(data.scheduledDate);
        
        // Count overdue
        if (scheduledDate < now && !['completed', 'cancelled'].includes(data.status)) {
          stats.overdue++;
        }
        
        // Count upcoming this week
        if (scheduledDate >= now && scheduledDate <= weekFromNow) {
          stats.upcomingThisWeek++;
        }
      } else if (!['completed', 'cancelled'].includes(data.status)) {
        stats.unscheduled++;
      }
      
      // Count completed this month
      if (data.status === 'completed' && data.completedAt && monthStart && monthEnd) {
        const completedDate = new Date(data.completedAt);
        if (completedDate >= monthStart && completedDate <= monthEnd) {
          stats.completedThisMonth++;
        }
      }
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching calendar stats:', error);
    res.status(500).json({ message: 'Failed to fetch calendar statistics' });
  }
};

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

// Get comprehensive analytics data
export const getAnalytics = async (req, res) => {
  try {
    const { user } = req;
    const { startDate, endDate, teamId } = req.query;

    // Build base query filters
    let requestsQuery = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    
    // Role-based filtering
    if (user.role === 'employee') {
      requestsQuery = requestsQuery.where('createdBy', '==', user.userId);
    } else if (user.role === 'technician') {
      requestsQuery = requestsQuery.where('assignedTo', '==', user.userId);
    }

    // Team filter (for managers)
    if (teamId && user.role === 'manager') {
      requestsQuery = requestsQuery.where('teamId', '==', teamId);
    }

    // Date range filter
    if (startDate) {
      requestsQuery = requestsQuery.where('createdAt', '>=', new Date(startDate));
    }
    if (endDate) {
      requestsQuery = requestsQuery.where('createdAt', '<=', new Date(endDate));
    }

    const requestsSnapshot = await requestsQuery.get();
    const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate statistics
    const stats = calculateStatistics(requests);
    const trends = calculateTrends(requests);
    const teamPerformance = await calculateTeamPerformance(requests);
    const assetHealth = await calculateAssetHealth(requests);

    res.json({
      stats,
      trends,
      teamPerformance,
      assetHealth,
      totalRequests: requests.length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Calculate basic statistics
const calculateStatistics = (requests) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Status distribution
  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  // Priority distribution
  const priorityCounts = requests.reduce((acc, req) => {
    acc[req.priority] = (acc[req.priority] || 0) + 1;
    return acc;
  }, {});

  // Type distribution
  const typeCounts = requests.reduce((acc, req) => {
    acc[req.type] = (acc[req.type] || 0) + 1;
    return acc;
  }, {});

  // Recent requests (last 30 days)
  const recentRequests = requests.filter(req => 
    new Date(req.createdAt) >= thirtyDaysAgo
  );

  // Calculate completion rate
  const completedRequests = requests.filter(req => req.status === 'completed');
  const completionRate = requests.length > 0 
    ? (completedRequests.length / requests.length * 100).toFixed(1)
    : 0;

  // Average resolution time (for completed requests)
  const avgResolutionTime = completedRequests.length > 0
    ? completedRequests.reduce((sum, req) => {
        if (req.completedAt && req.createdAt) {
          const diff = new Date(req.completedAt) - new Date(req.createdAt);
          return sum + diff / (1000 * 60 * 60); // Convert to hours
        }
        return sum;
      }, 0) / completedRequests.length
    : 0;

  // Overdue requests
  const overdueRequests = requests.filter(req => {
    if (req.status === 'completed' || req.status === 'cancelled') return false;
    if (!req.scheduledDate) return false;
    return new Date(req.scheduledDate) < now;
  });

  return {
    total: requests.length,
    statusDistribution: statusCounts,
    priorityDistribution: priorityCounts,
    typeDistribution: typeCounts,
    recentCount: recentRequests.length,
    completionRate: parseFloat(completionRate),
    avgResolutionTime: Math.round(avgResolutionTime),
    overdueCount: overdueRequests.length,
    activeCount: requests.filter(r => 
      ['pending', 'assigned', 'in-progress'].includes(r.status)
    ).length
  };
};

// Calculate trends over time
const calculateTrends = (requests) => {
  const now = new Date();
  const last12Months = [];
  
  // Generate last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last12Months.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      date: date
    });
  }

  // Count requests per month
  const monthlyData = last12Months.map(({ month, date }) => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    
    const monthRequests = requests.filter(req => {
      const reqDate = new Date(req.createdAt);
      return reqDate >= date && reqDate < nextMonth;
    });

    const completed = monthRequests.filter(r => r.status === 'completed').length;
    const created = monthRequests.length;

    return {
      month,
      created,
      completed,
      pending: created - completed
    };
  });

  // Calculate week-over-week trend
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const thisWeekCount = requests.filter(r => new Date(r.createdAt) >= lastWeek).length;
  const lastWeekCount = requests.filter(r => {
    const date = new Date(r.createdAt);
    return date >= twoWeeksAgo && date < lastWeek;
  }).length;

  const weeklyTrend = lastWeekCount > 0
    ? ((thisWeekCount - lastWeekCount) / lastWeekCount * 100).toFixed(1)
    : 0;

  return {
    monthly: monthlyData,
    weeklyTrend: parseFloat(weeklyTrend)
  };
};

// Calculate team performance metrics
const calculateTeamPerformance = async (requests) => {
  try {
    const teamsSnapshot = await db.collection(COLLECTIONS.TEAMS).get();
    const teams = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const teamMetrics = await Promise.all(
      teams.map(async (team) => {
        const teamRequests = requests.filter(r => r.teamId === team.id);
        const completed = teamRequests.filter(r => r.status === 'completed');
        const active = teamRequests.filter(r => 
          ['pending', 'assigned', 'in-progress'].includes(r.status)
        );

        // Calculate average completion time
        const avgTime = completed.length > 0
          ? completed.reduce((sum, req) => {
              if (req.completedAt && req.createdAt) {
                const diff = new Date(req.completedAt) - new Date(req.createdAt);
                return sum + diff / (1000 * 60 * 60);
              }
              return sum;
            }, 0) / completed.length
          : 0;

        return {
          teamId: team.id,
          teamName: team.name,
          totalRequests: teamRequests.length,
          completed: completed.length,
          active: active.length,
          completionRate: teamRequests.length > 0 
            ? (completed.length / teamRequests.length * 100).toFixed(1)
            : 0,
          avgCompletionTime: Math.round(avgTime)
        };
      })
    );

    return teamMetrics.filter(m => m.totalRequests > 0);
  } catch (error) {
    console.error('Error calculating team performance:', error);
    return [];
  }
};

// Calculate asset health metrics
const calculateAssetHealth = async (requests) => {
  try {
    const assetsSnapshot = await db.collection(COLLECTIONS.ASSETS).get();
    const assets = assetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const assetMetrics = assets.map(asset => {
      const assetRequests = requests.filter(r => r.assetId === asset.id);
      const recent = assetRequests.filter(r => {
        const date = new Date(r.createdAt);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return date >= thirtyDaysAgo;
      });

      const critical = assetRequests.filter(r => 
        r.priority === 'critical' && r.status !== 'completed'
      );

      // Health score (0-100)
      let healthScore = 100;
      healthScore -= recent.length * 5; // -5 per recent issue
      healthScore -= critical.length * 20; // -20 per critical issue
      healthScore = Math.max(0, Math.min(100, healthScore));

      return {
        assetId: asset.id,
        assetName: asset.name,
        assetTag: asset.assetTag,
        category: asset.category,
        totalRequests: assetRequests.length,
        recentRequests: recent.length,
        criticalIssues: critical.length,
        healthScore: Math.round(healthScore),
        status: asset.status
      };
    });

    // Sort by health score (worst first)
    return assetMetrics
      .sort((a, b) => a.healthScore - b.healthScore)
      .slice(0, 20); // Top 20 assets needing attention
  } catch (error) {
    console.error('Error calculating asset health:', error);
    return [];
  }
};

// Get key performance indicators
export const getKPIs = async (req, res) => {
  try {
    const { user } = req;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let requestsQuery = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    
    // Role-based filtering
    if (user.role === 'employee') {
      requestsQuery = requestsQuery.where('createdBy', '==', user.userId);
    } else if (user.role === 'technician') {
      requestsQuery = requestsQuery.where('assignedTo', '==', user.userId);
    }

    const requestsSnapshot = await requestsQuery.get();
    const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Recent requests
    const recentRequests = requests.filter(r => new Date(r.createdAt) >= thirtyDaysAgo);

    // KPIs
    const kpis = {
      totalRequests: requests.length,
      activeRequests: requests.filter(r => 
        ['pending', 'assigned', 'in-progress'].includes(r.status)
      ).length,
      completedThisMonth: recentRequests.filter(r => r.status === 'completed').length,
      criticalOpen: requests.filter(r => 
        r.priority === 'critical' && r.status !== 'completed'
      ).length,
      overdueRequests: requests.filter(r => {
        if (r.status === 'completed' || r.status === 'cancelled') return false;
        if (!r.scheduledDate) return false;
        return new Date(r.scheduledDate) < now;
      }).length,
      avgResponseTime: calculateAvgResponseTime(requests),
      completionRate: requests.length > 0
        ? (requests.filter(r => r.status === 'completed').length / requests.length * 100).toFixed(1)
        : 0
    };

    res.json(kpis);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
};

// Helper function to calculate average response time
const calculateAvgResponseTime = (requests) => {
  const assignedRequests = requests.filter(r => r.assignedAt && r.createdAt);
  
  if (assignedRequests.length === 0) return 0;

  const totalTime = assignedRequests.reduce((sum, req) => {
    const diff = new Date(req.assignedAt) - new Date(req.createdAt);
    return sum + diff / (1000 * 60 * 60); // Convert to hours
  }, 0);

  return Math.round(totalTime / assignedRequests.length);
};

// Get request trends by category
// Get trends by category
export const getTrendsByCategory = async (req, res) => {
  try {
    const { user } = req;
    const { days = 30 } = req.query;

    let requestsQuery = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    
    if (user.role === 'employee') {
      requestsQuery = requestsQuery.where('createdBy', '==', user.userId);
    } else if (user.role === 'technician') {
      requestsQuery = requestsQuery.where('assignedTo', '==', user.userId);
    }

    const requestsSnapshot = await requestsQuery.get();
    const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Group by type
    const typeData = {};
    requests.forEach(req => {
      const type = req.type || 'other';
      if (!typeData[type]) {
        typeData[type] = {
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0
        };
      }
      typeData[type].total++;
      if (req.status === 'completed') typeData[type].completed++;
      if (req.status === 'pending') typeData[type].pending++;
      if (req.status === 'in-progress') typeData[type].inProgress++;
    });

    const trends = Object.entries(typeData).map(([type, data]) => ({
      category: type,
      ...data
    }));

    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends by category:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
};

const pool = require('../config/db');

// Get Dynamic Menu Based on Role
const getMenu = async (req, res) => {
  try {
    const menuData = [
      {
        section: "MENU UTAMA",
        items: [
          { name: "Dasbor", path: "/", icon: "lucide:layout-dashboard" }
        ]
      },
      {
        section: "PUSAT AKADEMIK",
        items: [
          { name: "Guru", path: "/teachers", icon: "lucide:users" },
          { name: "Siswa", path: "/students", icon: "lucide:graduation-cap" },
          { name: "Mata Pelajaran", path: "/subjects", icon: "lucide:book-open" },
          { name: "Kelas", path: "/classes", icon: "lucide:school" },
          { name: "Jadwal", path: "/schedules", icon: "lucide:calendar" },
          { name: "Pengumuman", path: "/announcements", icon: "lucide:megaphone" }
        ]
      }
    ];

    res.status(200).json(menuData);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Internal server error while fetching menu' });
  }
};

// Get Recent Activity from Audit Logs
const getRecentActivity = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, entity_name, action, name, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 5'
    );

    // Format the data for the frontend
    const formattedLogs = rows.map(log => {
      let description = '';
      if (log.action === 'CREATE') description = `Added new ${log.entity_name} record`;
      else if (log.action === 'UPDATE') description = `Modified ${log.entity_name} record`;
      else if (log.action === 'DELETE') description = `Removed ${log.entity_name} record`;

      return {
        id: log.id,
        title: `${log.entity_name.charAt(0).toUpperCase() + log.entity_name.slice(1)} ${log.action}`,
        description: description,
        date: log.created_at, // The frontend will format this
        user: log.name,
        color: log.action === 'CREATE' ? 'success' : (log.action === 'UPDATE' ? 'info' : 'error')
      };
    });

    res.status(200).json(formattedLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Internal server error while fetching audit logs' });
  }
};

module.exports = {
  getMenu,
  getRecentActivity
};

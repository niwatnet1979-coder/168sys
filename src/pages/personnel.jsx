import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Users,
  UserPlus,
  Users2,
  Search,
  MoreVertical,
  ShieldCheck,
  Smartphone,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  ExternalLink,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { getEmployees, deleteEmployee } from '../lib/v1/employeeManager';
import { getTeams, deleteTeam } from '../lib/v1/teamManager';
import EmployeeModal from '../components/personnel/EmployeeModal';
import TeamModal from '../components/personnel/TeamModal';
import { showConfirm, showSuccess, showError } from '../lib/sweetAlert';

/**
 * Personnel Page - ระบบจัดการทีมงานและบุคลากร (Relational Architecture)
 */
export default function PersonnelPage() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'teams'

  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [isTeamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [empRes, teamRes] = await Promise.all([
      getEmployees(),
      getTeams()
    ]);
    if (empRes.success) setEmployees(empRes.data);
    if (teamRes.success) setTeams(teamRes.data);
    setLoading(false);
  };

  const handleAdd = () => {
    if (activeTab === 'employees') {
      setSelectedEmployee(null);
      setEmployeeModalOpen(true);
    } else {
      setSelectedTeam(null);
      setTeamModalOpen(true);
    }
  };

  const handleEditEmp = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeModalOpen(true);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setTeamModalOpen(true);
  };

  const handleDeleteTeam = async (id) => {
    const confirmed = await showConfirm('คุณต้องการลบทีมนี้ใช่หรือไม่?');
    if (confirmed) {
      const res = await deleteTeam(id);
      if (res.success) {
        showSuccess('ลบทีมสำเร็จ');
        loadData();
      } else {
        showError('ลบทีมไม่สำเร็จ: ' + res.error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.eid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeams = teams.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="ทีมงานและบุคลากร">
      <div className="personnel-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              <Users size={18} />
              พนักงาน
              <span className="count-badge">{employees.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              <Users2 size={18} />
              ฝ่าย/ทีม
              <span className="count-badge">{teams.length}</span>
            </button>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน / ทีม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="primary-btn" onClick={handleAdd}>
              <Plus size={18} />
              {activeTab === 'employees' ? 'เพิ่มพนักงาน' : 'สร้างทีมใหม่'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {loading ? (
            <div className="loading-state">กำลังโหลดข้อมูล...</div>
          ) : activeTab === 'employees' ? (
            <div className="employee-grid">
              {filteredEmployees.map(emp => (
                <div key={emp.id} className="employee-card" onClick={() => handleEditEmp(emp)}>
                  <div className="card-top">
                    <div className="avatar-placeholder">
                      {emp.nickname ? emp.nickname[0].toUpperCase() : 'U'}
                    </div>
                    <div className="emp-basic">
                      <h3>{emp.nickname}</h3>
                      <p className="fullname">{emp.fullname || '-'}</p>
                      <span className="eid-tag">{emp.eid || 'No ID'}</span>
                    </div>
                    <button className="icon-btn">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="card-details">
                    <div className="detail-item">
                      <Briefcase size={14} />
                      <span>{emp.job_position || 'ไม่ระบุตำแหน่ง'}</span>
                    </div>
                    <div className="detail-item">
                      <ShieldCheck size={14} />
                      <span>ทีม: {emp.team?.name || 'ไม่มีสังกัด'}</span>
                    </div>
                    <div className="detail-item">
                      <Smartphone size={14} />
                      <span>{emp.contacts?.find(c => c.contact_type === 'phone')?.value || 'ไม่มีเบอร์โทร'}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="status-badge" data-status={emp.status}>
                      {emp.status === 'current' ? 'พนักงานปัจจุบัน' : 'ลาออก'}
                    </div>
                    <button className="secondary-btn-sm">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              ))}
              {filteredEmployees.length === 0 && (
                <div className="empty-state-container">
                  <div className="empty-state-content">
                    <Users size={64} className="empty-icon" />
                    <h3>ไม่พบข้อมูลพนักงาน</h3>
                    <p>เริ่มสร้างทะเบียนพนักงานคนแรกของคุณ โดยกดปุ่ม "เพิ่มพนักงาน" ด้านบน</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="team-grid">
              {filteredTeams.map(t => (
                <div key={t.id} className="team-card">
                  <div className="team-icon">
                    <Users2 size={24} />
                  </div>
                  <div className="team-info">
                    <h3>{t.name}</h3>
                    <p>{t.team_type}</p>
                  </div>
                  <div className="team-meta">
                    <span className="member-count">
                      พนักงาน: {employees.filter(e => e.team_id === t.id).length} คน
                    </span>
                  </div>
                  <div className="team-actions">
                    <button className="icon-btn-sm" onClick={() => handleEditTeam(t)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn-sm delete" onClick={() => handleDeleteTeam(t.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredTeams.length === 0 && (
                <div className="empty-state-container">
                  <div className="empty-state-content">
                    <Users2 size={64} className="empty-icon" />
                    <h3>ยังไม่มีข้อมูลฝ่ายหรือทีม</h3>
                    <p>สร้างกลุ่มงานเพื่อจัดระเบียบพนักงานได้ง่ายขึ้น</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        employee={selectedEmployee}
        teams={teams}
        onSaveSuccess={loadData}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        team={selectedTeam}
        onSaveSuccess={loadData}
      />

      <style jsx>{`
        .personnel-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .tab-switcher {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
          gap: 4px;
          height: 44px; /* Locked Standard */
          align-items: center;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          gap: 8px;
          padding: 0 16px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: white;
          color: var(--primary-600);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .tab-btn:hover:not(.active) {
          color: #1e293b;
          background: #e2e8f0;
        }

        .count-badge {
          background: #e2e8f0;
          color: #475569;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 11px;
        }

        .tab-btn.active .count-badge {
          background: var(--primary-100);
          color: var(--primary-600);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          justify-content: flex-end;
          min-width: 300px;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 350px;
          height: 44px; /* Locked Standard */
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          z-index: 10;
        }

        .search-box input {
          width: 100%;
          height: 100%;
          padding: 0 16px 0 48px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-box input:focus {
          border-color: var(--primary-400);
        }

        .primary-btn {
          background: var(--primary-600);
          color: white;
          border: none;
          height: 44px;
          padding: 0 24px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .primary-btn:hover {
          background: var(--primary-700);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .primary-btn:active {
          transform: translateY(0) scale(0.98);
        }


        .employee-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-6);
        }

        .employee-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .employee-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          border-color: var(--primary-200);
        }

        .avatar-placeholder {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary-100), var(--primary-50));
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #475569;
        }

        .status-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .status-badge[data-status="current"] {
          background: #f0fdf4;
          color: #16a34a;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-6);
        }

        .team-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .team-icon {
          width: 48px;
          height: 48px;
          background: var(--primary-50);
          color: var(--primary-600);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn-sm {
          padding: 6px;
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .loading-state {
          text-align: center;
          padding: 80px;
          color: #94a3b8;
          background: white;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
        }

        .empty-state-container {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 80px 20px;
          background: white;
          border-radius: 32px;
          border: 1px dashed #e2e8f0;
          transition: all 0.3s ease;
        }

        .empty-state-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          max-width: 400px;
        }

        .empty-icon {
          color: #e2e8f0;
          margin-bottom: 8px;
        }

        .empty-state-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }

        .empty-state-content p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        .primary-btn:active, .tab-btn:active {
          transform: scale(0.96);
        }

        .primary-btn {
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </MainLayout>
  );
}

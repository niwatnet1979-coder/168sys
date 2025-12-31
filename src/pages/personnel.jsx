import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Users,
  Users2,
  Search,
  Plus,
  Briefcase,
  ShieldCheck,
  Smartphone,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { getEmployees, deleteEmployee } from '../lib/v1/employeeManager';
import { getTeams, deleteTeam } from '../lib/v1/teamManager';
import EmployeeModal from '../components/personnel/EmployeeModal';
import TeamModal from '../components/personnel/TeamModal';
import { showConfirm, showSuccess, showError } from '../lib/sweetAlert';

/**
 * Personnel Page (Corrected V2.1)
 * เป้าหมาย: คลีน สมมาตร และพรีเมียม 100%
 */
export default function PersonnelPage() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employees');

  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
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

  const handleEditEmp = (emp) => {
    setSelectedEmployee(emp);
    setIsEmpModalOpen(true);
  };

  return (
    <MainLayout title="ทีมงานและบุคลากร">
      <div className="personnel-container">
        {/* 1. Header Row - Standards: 44px, Perfect Alignment */}
        <div className="header-toolbar">
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              <Users size={18} />
              <span>พนักงาน</span>
              <span className="count-pill">{employees.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              <Users2 size={18} />
              <span>ทีมงาน</span>
              <span className="count-pill">{teams.length}</span>
            </button>
          </div>

          <div className="action-row">
            {/* 🛡️ STRICT CURSORRULES PATTERN: Wrapper Relative + Icon Absolute */}
            <div className="search-wrapper-v4">
              <Search className="search-icon-v4" size={18} />
              <input
                type="text"
                className="input-field search-input-custom"
                placeholder="ค้นหาชื่อ, รหัส, หรือฝ่ายงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="button-primary"
              onClick={() => activeTab === 'employees' ? (setSelectedEmployee(null), setIsEmpModalOpen(true)) : (setSelectedTeam(null), setIsTeamModalOpen(true))}
            >
              <Plus size={20} />
              <span>{activeTab === 'employees' ? 'เพิ่มพนักงาน' : 'สร้างทีมใหม่'}</span>
            </button>
          </div>
        </div>

        {/* 2. Main Content Grid */}
        <div className="content-viewport">
          {loading ? (
            <div className="loading-stage">
              <div className="spinner"></div>
              <p>กำลังเชื่อมต่อฐานข้อมูล...</p>
            </div>
          ) : (
            <div className="data-grid">
              {activeTab === 'employees' ? (
                employees.filter(e =>
                  e.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.eid?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(emp => (
                  <div key={emp.id} className="employee-card-v2" onClick={() => handleEditEmp(emp)}>
                    <div className="card-top">
                      <div className="profile-img">
                        {emp.nickname ? emp.nickname[0] : 'E'}
                      </div>
                      <div className="profile-info">
                        <h4>{emp.nickname}</h4>
                        <p>{emp.fullname || '-'}</p>
                        <div className="tag-eid">{emp.eid || 'EP-NEW'}</div>
                      </div>
                      <button className="btn-more-minimal"><MoreVertical size={16} /></button>
                    </div>
                    <div className="card-details-box">
                      <div className="row">
                        <Briefcase size={14} />
                        <span>{emp.job_position || 'ไม่ระบุตำแหน่ง'}</span>
                      </div>
                      <div className="row">
                        <ShieldCheck size={14} />
                        <span>ฝ่าย: {emp.team?.name || 'ไม่มีสังกัด'}</span>
                      </div>
                    </div>
                    <div className="card-bottom">
                      <div className={`status-pill ${emp.status}`}>
                        {emp.status === 'current' ? 'พนักงานประจำ' : 'ลาออก'}
                      </div>
                      <div className="link-text">
                        โปรไฟล์ <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                teams.filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                  <div key={t.id} className="team-item-v2" onClick={() => { setSelectedTeam(t); setIsTeamModalOpen(true); }}>
                    <div className="team-badge">
                      <Users2 size={24} />
                    </div>
                    <div className="team-desc">
                      <h5>{t.name}</h5>
                      <p>{t.team_type || 'General Team'}</p>
                    </div>
                    <div className="team-member-count">
                      {employees.filter(e => e.team_id === t.id).length} คน
                    </div>
                    <ArrowRight size={18} className="chevron" />
                  </div>
                ))
              )}

              {((activeTab === 'employees' && employees.length === 0) ||
                (activeTab === 'teams' && teams.length === 0)) && (
                  <div className="empty-placeholder">
                    <div className="empty-illu">
                      <Users size={64} />
                    </div>
                    <h3>ยังไม่พบข้อมูล{activeTab === 'employees' ? 'บุคลากร' : 'ทีมงาน'}</h3>
                    <p>เริ่มต้นสร้างทะเบียนใหม่โดยกดปุ่มด้านบน</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <EmployeeModal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        employee={selectedEmployee}
        teams={teams}
        onSaveSuccess={loadData}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        team={selectedTeam}
        onSaveSuccess={loadData}
      />

      <style jsx>{`
                .personnel-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding-top: 8px;
                }

                /* Header Toolbar Standard (44px Rule) */
                .header-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    width: 100%;
                }

                .tab-group {
                    display: flex;
                    align-items: center;
                    background: #f1f5f9;
                    padding: 6px;
                    border-radius: 14px;
                    height: 48px;
                    gap: 4px;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0 16px;
                    height: 36px;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    font-weight: 600;
                    font-size: var(--font-body);
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .tab-btn.active {
                    background: white;
                    color: var(--primary-600);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .count-pill {
                    background: #e2e8f0;
                    color: #64748b;
                    padding: 1px 6px;
                    border-radius: 6px;
                    font-size: 11px;
                }

                .tab-btn.active .count-pill {
                    background: var(--primary-100);
                    color: var(--primary-600);
                }

                .action-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    justify-content: flex-end;
                }

                /* 🎯 FINAL SEARCH BOX CORRECTION (Rule #59, #72 + Scoping Fix) */
                .search-wrapper-v4 {
                    position: relative;
                    height: 48px;
                    width: 100%;
                    max-width: 400px;
                }

                :global(.search-icon-v4) {
                    position: absolute !important;
                    left: 16px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    color: var(--text-muted) !important;
                    pointer-events: none !important;
                    z-index: 10 !important;
                }

                .search-input-custom {
                    /* Inherit from global.css .input-field */
                    padding-left: 48px !important;
                }

                .search-input-custom:focus {
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 4px var(--primary-50);
                }

                .button-primary {
                    /* Inherit from global.css .button-primary */
                }

                /* Data Grid */
                .data-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                }

                .employee-card-v2 {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                    padding: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .employee-card-v2:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
                    border-color: var(--primary-200);
                }

                .card-top { display: flex; gap: 16px; margin-bottom: 20px; position: relative; }
                .profile-img {
                    width: 56px;
                    height: 56px;
                    background: var(--primary-50);
                    color: var(--primary-600);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 800;
                    line-height: 1;
                }

                .btn-more-minimal {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: auto;
                    transition: all 0.2s;
                }
                .btn-more-minimal:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }

                .profile-info h4 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; }
                .profile-info p { font-size: 13px; color: #64748b; margin: 2px 0 6px; }
                .tag-eid { font-size: 11px; font-weight: 700; color: var(--primary-600); background: var(--primary-50); padding: 2px 8px; border-radius: 6px; display: inline-block; }

                .card-details-box {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #475569; font-weight: 500; }
                .card-bottom { display: flex; justify-content: space-between; align-items: center; }
                .status-pill { font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; }
                .status-pill.current { background: #f0fdf4; color: #16a34a; }
                .link-text { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--primary-600); }

                /* Team Card Styling */
                .team-item-v2 {
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .team-item-v2:hover {
                    border-color: var(--primary-200);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
                }
                .team-badge {
                    width: 56px;
                    height: 56px;
                    background: #f8fafc;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                }
                .team-item-v2:hover .team-badge {
                    background: var(--primary-50);
                    color: var(--primary-600);
                }
                .team-desc { flex: 1; }
                .team-desc h5 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }
                .team-desc p { margin: 4px 0 0; font-size: 13px; color: #64748b; }
                .team-member-count {
                    background: #f1f5f9;
                    font-size: 12px;
                    font-weight: 700;
                    color: #475569;
                    padding: 4px 10px;
                    border-radius: 20px;
                }
                :global(.chevron) { color: #cbd5e1; transition: transform 0.2s; }
                .team-item-v2:hover :global(.chevron) { color: var(--primary-500); transform: translateX(4px); }

                .empty-placeholder {
                    grid-column: 1 / -1;
                    padding: 100px 20px;
                    text-align: center;
                    color: #94a3b8;
                    background: white;
                    border-radius: 32px;
                    border: 1px dashed #e2e8f0;
                }

                .empty-illu { margin-bottom: 20px; color: #e2e8f0; }
                .empty-placeholder h3 { color: #1e293b; font-size: 20px; font-weight: 800; margin: 0; }
            `}</style>
    </MainLayout>
  );
}

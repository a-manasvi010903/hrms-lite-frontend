import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeAPI, attendanceAPI } from '../api';
import PageTransition from '../components/common/PageTransition';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';
import AttendanceForm from '../components/attendance/AttendanceForm';
import AttendanceTable from '../components/attendance/AttendanceTable';
import { getTodayDate, formatDate } from '../utils/helpers';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
  });
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAttendance();
    }
  }, [selectedDate, selectedEmployee]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [employeesRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll(selectedDate),
      ]);
      
      setEmployees(employeesRes.data || []);
      const attendanceData = attendanceRes.data || [];
      setAttendance(attendanceData);
      calculateStats(attendanceData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setError(null);
      let response;
      
      if (selectedEmployee) {
        response = await attendanceAPI.getByEmployee(selectedEmployee);
      } else if (selectedDate) {
        response = await attendanceAPI.getAll(selectedDate);
      } else {
        response = await attendanceAPI.getAll();
      }
      
      const attendanceData = response.data || [];
      setAttendance(attendanceData);
      calculateStats(attendanceData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    }
  };

  const calculateStats = (data) => {
    const present = data.filter(r => r.status === 'Present').length;
    const absent = data.filter(r => r.status === 'Absent').length;
    setStats({
      present,
      absent,
      total: data.length,
    });
  };

  const handleMarkAttendance = async (data) => {
    try {
      setFormLoading(true);
      await attendanceAPI.mark(data);
      toast.success('Attendance marked successfully!', {
        style: {
          background: 'var(--success-50)',
          color: 'var(--success-700)',
          border: '1px solid var(--success-200)',
        },
        icon: '✅',
      });
      setIsFormOpen(false);
      fetchAttendance();
    } catch (err) {
      // Error is handled by API interceptor
    } finally {
      setFormLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAttendance();
  };

  const clearFilters = () => {
    setSelectedDate(getTodayDate());
    setSelectedEmployee('');
  };

  if (loading) {
    return <Loader text="Loading attendance records..." />;
  }

  return (
    <PageTransition>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="page-title-icon" style={{ background: 'var(--gradient-success)' }}>
              <Calendar size={20} />
            </div>
            Attendance
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Track and manage employee attendance
          </motion.p>
        </div>

        <motion.div
          className="page-actions"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFormOpen(true)}
            className="btn btn-success"
            disabled={employees.length === 0}
          >
            <Plus size={18} />
            Mark Attendance
          </motion.button>
        </motion.div>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={fetchAttendance}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Quick Stats */}
      {attendance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap',
          }}
        >
          {/* Total */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-5)',
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary-100)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--primary-600)',
            }}>
              <Clock size={20} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', fontWeight: 500 }}>
                Total Records
              </p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--gray-900)' }}>
                {stats.total}
              </p>
            </div>
          </motion.div>

          {/* Present */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-5)',
              background: 'linear-gradient(135deg, var(--success-50) 0%, white 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--success-200)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--gradient-success)',
              borderRadius: 'var(--radius-lg)',
              color: 'white',
              boxShadow: 'var(--shadow-success)',
            }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--success-600)', fontWeight: 500 }}>
                Present
              </p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--success-700)' }}>
                {stats.present}
              </p>
            </div>
          </motion.div>

          {/* Absent */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-5)',
              background: 'linear-gradient(135deg, var(--danger-50) 0%, white 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--danger-200)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--gradient-danger)',
              borderRadius: 'var(--radius-lg)',
              color: 'white',
              boxShadow: 'var(--shadow-danger)',
            }}>
              <XCircle size={20} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--danger-600)', fontWeight: 500 }}>
                Absent
              </p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--danger-700)' }}>
                {stats.absent}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="filters-bar"
      >
        <div className="filter-group">
          <Calendar size={18} color="var(--gray-400)" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedEmployee('');
            }}
            max={getTodayDate()}
            className="form-input"
            style={{ width: 180 }}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} color="var(--gray-400)" />
          <select
            value={selectedEmployee}
            onChange={(e) => {
              setSelectedEmployee(e.target.value);
              if (e.target.value) setSelectedDate('');
            }}
            className="form-select"
            style={{ minWidth: 220 }}
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.full_name} ({emp.employee_id})
              </option>
            ))}
          </select>
        </div>

        {(selectedDate !== getTodayDate() || selectedEmployee) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearFilters}
            className="btn btn-ghost"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            Clear Filters
          </motion.button>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginLeft: 'auto',
            fontSize: 'var(--text-sm)',
            color: 'var(--gray-500)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          {selectedDate && !selectedEmployee && (
            <span style={{
              padding: 'var(--space-1) var(--space-3)',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 500,
            }}>
              {formatDate(selectedDate, 'MMM dd, yyyy')}
            </span>
          )}
          {selectedEmployee && (
            <span style={{
              padding: 'var(--space-1) var(--space-3)',
              background: 'var(--accent-100)',
              color: 'var(--accent-700)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 500,
            }}>
              {employees.find(e => e.employee_id === selectedEmployee)?.full_name || selectedEmployee}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {employees.length === 0 ? (
          <EmptyState
            type="employees"
            title="No employees found"
            description="Add employees first before marking attendance"
            action={
              <motion.a
                href="/employees"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Go to Employees
              </motion.a>
            }
          />
        ) : attendance.length > 0 ? (
          <AttendanceTable
            records={attendance}
            showEmployee={!selectedEmployee}
          />
        ) : (
          <EmptyState
            type="attendance"
            title="No attendance records"
            description={
              selectedDate 
                ? `No attendance marked for ${formatDate(selectedDate, 'MMMM dd, yyyy')}`
                : selectedEmployee
                ? "No attendance records for this employee"
                : "Start marking attendance for your employees"
            }
            action={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="btn btn-success"
              >
                <Plus size={18} />
                Mark Attendance
              </motion.button>
            }
          />
        )}
      </motion.div>

      {/* Attendance Form Modal */}
      <AttendanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleMarkAttendance}
        employees={employees}
        loading={formLoading}
      />
    </PageTransition>
  );
};

export default Attendance;
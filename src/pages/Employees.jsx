import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../api';
import PageTransition from '../components/common/PageTransition';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';
import ConfirmModal from '../components/common/ConfirmModal';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeTable from '../components/employees/EmployeeTable';
import { debounce } from '../utils/helpers';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, selectedDepartment, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.full_name.toLowerCase().includes(search) ||
          emp.employee_id.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search)
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter((emp) => emp.department === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleAddEmployee = async (data) => {
    try {
      setFormLoading(true);
      await employeeAPI.create(data);
      toast.success('Employee added successfully!', {
        style: {
          background: 'var(--success-50)',
          color: 'var(--success-700)',
          border: '1px solid var(--success-200)',
        },
      });
      setIsFormOpen(false);
      fetchEmployees();
    } catch (err) {
      // Error is handled by API interceptor
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditEmployee = async (data) => {
    try {
      setFormLoading(true);
      await employeeAPI.update(editingEmployee.employee_id, {
        full_name: data.full_name,
        email: data.email,
        department: data.department,
      });
      toast.success('Employee updated successfully!', {
        style: {
          background: 'var(--success-50)',
          color: 'var(--success-700)',
          border: '1px solid var(--success-200)',
        },
      });
      setIsFormOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      // Error is handled by API interceptor
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      setDeleteLoading(true);
      await employeeAPI.delete(deletingEmployee.employee_id);
      toast.success('Employee deleted successfully!', {
        style: {
          background: 'var(--success-50)',
          color: 'var(--success-700)',
          border: '1px solid var(--success-200)',
        },
      });
      setDeletingEmployee(null);
      fetchEmployees();
    } catch (err) {
      // Error is handled by API interceptor
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const openDeleteModal = (employee) => {
    setDeletingEmployee(employee);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  // Get unique departments for filter
  const departments = [...new Set(employees.map((emp) => emp.department))].sort();

  if (loading) {
    return <Loader text="Loading employees..." />;
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
            <div className="page-title-icon">
              <Users size={20} />
            </div>
            Employees
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Manage your organization's employees
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
            onClick={fetchEmployees}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-primary)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add Employee
          </motion.button>
        </motion.div>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={fetchEmployees}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="filters-bar"
      >
        <div className="search-wrapper">
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)',
              }}
            />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 'var(--space-10)' }}
            />
          </div>
        </div>

        <div className="filter-group">
          <Filter size={18} color="var(--gray-400)" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="form-select"
            style={{ minWidth: 180 }}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginLeft: 'auto',
            fontSize: 'var(--text-sm)',
            color: 'var(--gray-500)',
          }}
        >
          Showing {filteredEmployees.length} of {employees.length} employees
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {filteredEmployees.length > 0 ? (
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ) : employees.length > 0 ? (
          <EmptyState
            type="search"
            title="No matches found"
            description="Try adjusting your search or filter criteria"
            action={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('');
                }}
                className="btn btn-secondary"
              >
                Clear Filters
              </motion.button>
            }
          />
        ) : (
          <EmptyState
            type="employees"
            title="No employees yet"
            description="Start by adding your first employee to the system"
            action={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary"
              >
                <Plus size={18} />
                Add First Employee
              </motion.button>
            }
          />
        )}
      </motion.div>

      {/* Employee Form Modal */}
      <EmployeeForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
        initialData={editingEmployee}
        loading={formLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteEmployee}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deletingEmployee?.full_name}? This will also remove all their attendance records. This action cannot be undone.`}
        confirmText="Delete Employee"
        type="danger"
        loading={deleteLoading}
      />
    </PageTransition>
  );
};

export default Employees;
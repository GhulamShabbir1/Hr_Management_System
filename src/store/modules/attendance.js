// src/store/modules/attendance.js

import api from '../../services/api';

function toDateOnly(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch (e) {}
  return new Date().toISOString().slice(0, 10);
}

function normalizeRecord(raw) {
  const employeeId =
    raw.userId ?? raw.user_id ?? raw.employeeId ?? raw.employee_id ?? raw.id ?? null;

  const checkIn =
    raw.checkIn ?? raw.check_in ?? raw.checkin_time ?? raw.check_in_time ?? null;

  const checkOut =
    raw.checkOut ?? raw.check_out ?? raw.checkout_time ?? raw.check_out_time ?? null;

  const dateVal =
    raw.date ??
    (checkIn ? toDateOnly(checkIn) : null) ??
    (raw.created_at ? toDateOnly(raw.created_at) : null);

  return {
    id: raw.id ?? raw._id ?? `${employeeId}-${dateVal || ''}`,
    employeeId,
    date: toDateOnly(dateVal),
    checkInTime: checkIn,
    checkOutTime: checkOut,
    status: raw.status ?? (checkOut ? 'check-out' : checkIn ? 'check-in' : 'unknown')
  };
}

export default {
  namespaced: true,

  state: {
    records: []
  },

  mutations: {
    SET_ATTENDANCE(state, records) {
      state.records = Array.isArray(records) ? records : [];
    },
    MARK_ATTENDANCE(state, record) {
      if (!Array.isArray(state.records)) state.records = [];
      state.records.push(record);
    }
  },

  actions: {
    async fetchAttendance({ commit }) {
      try {
        const res = await api.get('/attendances');
        const payload = res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];
        const normalized = list.map(normalizeRecord);
        commit('SET_ATTENDANCE', normalized);
        return { success: true };
      } catch (e) {
        commit('SET_ATTENDANCE', []);
        return { success: false, message: e?.response?.data?.message || 'Failed to fetch attendance' };
      }
    },

    async markAttendance({ commit }, { employeeId, status, location }) {
      try {
        let res;
        const lower = String(status).toLowerCase();
        if (lower === 'check-in') {
          res = await api.post('/attendance/check-in', { userId: employeeId, location });
        } else if (lower === 'check-out') {
          res = await api.post('/attendance/check-out', { userId: employeeId });
        } else {
          throw new Error('Invalid attendance status');
        }

        const raw = res?.data?.data ?? res?.data ?? {};
        const normalized = normalizeRecord({ ...raw, userId: employeeId });
        commit('MARK_ATTENDANCE', normalized);
        return { success: true, data: normalized };
      } catch (error) {
        return {
          success: false,
          message: error?.response?.data?.message || error.message || 'Attendance failed'
        };
      }
    }
  },

  getters: {
    getAttendanceByEmployee: (state) => (id) => {
      const list = Array.isArray(state.records) ? state.records : [];
      return list.filter((r) => String(r.employeeId) === String(id));
    },
    checkedInUsers: (state) => {
      const list = Array.isArray(state.records) ? state.records : [];
      return list.filter((r) => String(r.status).toLowerCase() === 'check-in');
    },
    checkedOutUsers: (state) => {
      const list = Array.isArray(state.records) ? state.records : [];
      return list.filter((r) => String(r.status).toLowerCase() === 'check-out');
    },
    allAttendance: (state) => (Array.isArray(state.records) ? state.records : [])
  }
};

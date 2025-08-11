// src/store/modules/attendance.js
import api from '../../services/api';

function toLocalDateOnlyNullable(value) {
  if (!value) return null;
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return null;
  }
}

function recordKey(rec) {
  const statusMarker =
    String(rec.status).toLowerCase() === 'check-out'
      ? 'out'
      : String(rec.status).toLowerCase() === 'check-in'
      ? 'in'
      : 'x';
  return `${String(rec.employeeId)}|${rec.date || 'nodate'}|${statusMarker}`;
}

function normalizeFetchedRecord(raw) {
  const employeeId =
    raw.userId ??
    raw.user_id ??
    raw.employeeId ??
    raw.employee_id ??
    raw.user?.id ??
    null;

  const checkIn =
    raw.checkIn ??
    raw.check_in ??
    raw.check_in_at ??
    raw.checkin_time ??
    raw.check_in_time ??
    raw.clock_in ??
    raw.in_time ??
    null;

  const checkOut =
    raw.checkOut ??
    raw.check_out ??
    raw.check_out_at ??
    raw.checkout_time ??
    raw.check_out_time ??
    raw.clock_out ??
    raw.out_time ??
    null;

  const dateVal =
    raw.date ??
    raw.attendance_date ??
    checkIn ??
    checkOut ??
    raw.created_at ??
    raw.updated_at ??
    null;

  const dateStr = toLocalDateOnlyNullable(dateVal);

  return {
    id: `${(raw.id ?? raw._id ?? employeeId ?? 'u')}-${dateStr || 'nodate'}-${checkOut ? 'out' : checkIn ? 'in' : 'x'}`,
    employeeId,
    date: dateStr,
    checkInTime: checkIn ? new Date(checkIn).toLocaleTimeString() : null,
    checkOutTime: checkOut ? new Date(checkOut).toLocaleTimeString() : null,
    status: raw.status ?? (checkOut ? 'check-out' : checkIn ? 'check-in' : 'unknown')
  };
}

function normalizeMarkedRecord(raw, employeeId, status) {
  const lower = String(status).toLowerCase();
  const now = new Date();

  const checkIn =
    raw.checkIn ??
    raw.check_in ??
    raw.check_in_at ??
    raw.checkin_time ??
    raw.check_in_time ??
    (lower === 'check-in' ? now.toISOString() : null);

  const checkOut =
    raw.checkOut ??
    raw.check_out ??
    raw.check_out_at ??
    raw.checkout_time ??
    raw.check_out_time ??
    (lower === 'check-out' ? now.toISOString() : null);

  const dateVal =
    raw.date ??
    raw.attendance_date ??
    checkIn ??
    checkOut ??
    raw.created_at ??
    now.toISOString();

  const dateStr = toLocalDateOnlyNullable(dateVal);

  return {
    id: `${(raw.id ?? raw._id ?? employeeId ?? 'u')}-${dateStr || 'nodate'}-${lower === 'check-out' ? 'out' : 'in'}`,
    employeeId,
    date: dateStr || toLocalDateOnlyNullable(now.toISOString()),
    checkInTime: checkIn ? new Date(checkIn).toLocaleTimeString() : null,
    checkOutTime: checkOut ? new Date(checkOut).toLocaleTimeString() : null,
    status: raw.status ?? lower
  };
}

export default {
  namespaced: true,
  state: { records: [] },

  mutations: {
    SET_ATTENDANCE(state, records) {
      state.records = Array.isArray(records) ? records : [];
    },
    MERGE_ATTENDANCE(state, newList) {
      const existing = Array.isArray(state.records) ? state.records : [];
      const newMap = new Map(newList.map(r => [recordKey(r), r]));
      // keep local records not present in fresh server list (prevents flash-then-disappear)
      const preserved = existing.filter(r => !newMap.has(recordKey(r)));
      state.records = [...newList, ...preserved];
    },
    MARK_ATTENDANCE(state, record) {
      if (!Array.isArray(state.records)) state.records = [];
      const key = recordKey(record);
      const idx = state.records.findIndex(r => recordKey(r) === key);
      if (idx === -1) state.records.push(record);
      else state.records.splice(idx, 1, record);
    }
  },

  actions: {
    async fetchAttendance({ commit }) {
      try {
        const res = await api.get('/attendances');
        const d = res?.data;
        const payload =
          d?.data?.data ??
          d?.data ??
          d?.items ??
          d?.attendances ??
          d ??
          [];
        const list = Array.isArray(payload) ? payload : [];
        const normalized = list
          .map(normalizeFetchedRecord)
          .filter(r => r.employeeId != null && r.date != null);
        // merge to preserve local record just added by check-in/out
        commit('MERGE_ATTENDANCE', normalized);
        return { success: true };
      } catch (e) {
        // keep existing records instead of wiping them on error
        return {
          success: false,
          message: e?.response?.data?.message || e?.message || 'Failed to fetch attendance'
        };
      }
    },

    async markAttendance({ commit }, { employeeId, status, location }) {
      try {
        const lower = String(status).toLowerCase();
        const url = lower === 'check-in' ? '/attendance/check-in' : '/attendance/check-out';

        // Try without body first (token-based APIs)
        try {
          const res0 = await api.post(url);
          const raw0 = res0?.data?.data ?? res0?.data ?? {};
          const n0 = normalizeMarkedRecord(raw0, employeeId, lower);
          commit('MARK_ATTENDANCE', n0);
          return { success: true, data: n0 };
        } catch {
          // Fallback with explicit body
        }

        const body = lower === 'check-in' ? { userId: employeeId, location } : { userId: employeeId };
        const res = await api.post(url, body);
        const raw = res?.data?.data ?? res?.data ?? {};
        const n = normalizeMarkedRecord(raw, employeeId, lower);
        commit('MARK_ATTENDANCE', n);
        return { success: true, data: n };
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
      return list.filter(r => String(r.employeeId) === String(id));
    },
    allAttendance: (state) => (Array.isArray(state.records) ? state.records : [])
  }
};
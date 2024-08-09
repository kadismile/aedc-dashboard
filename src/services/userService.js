import { client} from '../utils/api-client'
import { store } from '../redux/store';

const serverUrl = process.env.REACT_APP_API_BASE_URL ;

export const userService =  {

  loginUser: async (email, password) => {
    try {
      const url = `${serverUrl}/auth/login`
      const method = 'POST'
      const response = await client(url, method, { email, password });
      if (!response)
        throw new Error("Cannot login");
      return response
    } catch (e) {
      throw e
    }
  },

  verifyToken: async () => {
    try {
      const url = `${serverUrl}/auth/authorized`
      const method = 'POST'
      const response = await client(url, method);
      if (!response) {
        return {
          status: 'failed',
          error: true
        }
      } else {
        return response
      }
      
    } catch (e) {
      throw e
    }
  },

  getUsers:async () => {
    try {
      const url = `${serverUrl}/auth/users?limit=50`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },

  getOneUser:async (userId) => {
    try {
      const url = `${serverUrl}/auth/user/one?userId=${userId}`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },

  suspendUser:async (userId) => {
    try {
      const url = `${serverUrl}/auth/user/suspend`
      const method = 'POST'
      const response = await client(url, method, { ...userId });
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },

  deleteUser:async (userId) => {
    try {
      const url = `${serverUrl}/auth/user/delete`
      const method = 'POST'
      const response = await client(url, method, { ...userId });
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },

  addPermissions:async ({ userId, permissions }) => {
    try {
      const url = `${serverUrl}/auth/add-user-permissions`
      const method = 'POST'
      const response = await client(url, method, { userId, permissions});
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },

  fetchUserFromStore: () => {
    let staff = store?.getState()?.staff?.staff
    let token;
    if (staff) {
      token = staff.token || ''
    }
    return {
      staff,
      token
    }
  },

  searchUsers:async (data) => {
    try {
      const url = `${serverUrl}/search`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot Create bundle");
      return response
    } catch (e) {
      throw e
    }
  },

  changePassword:async (data) => {
    try {
      const url = `${serverUrl}/auth/change-password`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot change bundle");
      return response
    } catch (e) {
      throw e
    }
  },

  sendResetPassEmail: async (email) => {
    try {
      const url = `${serverUrl}/auth/send-reset-password-email`
      const method = 'POST'
      const response = await client(url, method, { email });
      return response
    } catch (e) {
      throw e
    }
  },

  verifyPasswordToken:async (passwordToken) => {
    try {
      const url = `${serverUrl}/auth/verify-passwordToken`
      const method = 'POST'
      const response = await client(url, method, { passwordToken });
      return response
    } catch (e) {
      throw e
    }
  },

  resetPassword :async (data) => {
    try {
      const url = `${serverUrl}/auth/reset-password`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      return response
    } catch (e) {
      throw e
    }
  },

  inviteUser:async (data) => {
    try {
      const url = `${serverUrl}/auth/invite`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot Invite user");
      return response
    } catch (e) {
      throw e
    }
  },

  getInvitation:async (invitationalId) => {
    try {
      const url = `${serverUrl}/auth/invitationalId?invitationalId=${invitationalId}`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },

  registerUser: async (data) => {
    try {
      const url = `${serverUrl}/auth/create`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot login");
      return response
    } catch (e) {
      throw e
    }
  },

  getStaff:async () => {
    try {
      const url = `${serverUrl}/staff/all?role=admin&role=aedc_staff`
      console.log('Url ----------------', url)
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Not Authorized");
      return response
    } catch (e) {
      throw e
    }
  },
}
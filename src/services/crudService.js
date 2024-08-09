import { client} from '../utils/api-client'
import moment from 'moment'

const serverUrl = process.env.REACT_APP_API_BASE_URL ;

export const crudService =  {

  getCustomersCount: async (vendorId) => {
    try {
      const url = `${serverUrl}/customer/state/count`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Cannot fetch Customers");
      return response
    } catch (e) {
      throw e
    }
  },

  getMeters: async (data) => {
    const { rawDate, filterReport } = data || {}
    const baseUrl = `${serverUrl}/meter`;
    const queryParams = {
      ...transformReportType(filterReport),
      ...transformDate(rawDate),
    };

    
    try {
      const url = buildUrl(baseUrl, queryParams);
      const method = 'GET'
      const response = await client(url, method);
      if (response.error === 'No permissons to access this route') {
        return {
          data: [],
          error: "No permissons to access this route"
        }
      }
      if (!response)
        throw new Error("Cannot fetch Meters");
      return response
    } catch (e) {
      throw e
    }
  },

  getMetersCount: async (vendorId) => {
    try {
      const url = `${serverUrl}/meter/vendor/count`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Cannot fetch Department");
      return response
    } catch (e) {
      throw e
    }
  },

  getVendors: async (data) => {
    const { rawDate, filterReport } = data || {}
    const baseUrl = `${serverUrl}/vendor`;
    const queryParams = {
      ...transformReportType(filterReport),
      ...transformDate(rawDate),
    };

    
    try {
      const url = buildUrl(baseUrl, queryParams);
      const method = 'GET'
      const response = await client(url, method);
      if (response.error === 'No permissons to access this route') {
        return {
          data: [],
          error: "No permissons to access this route"
        }
      }
      if (!response)
        throw new Error("Cannot fetch Complainer");
      return response
    } catch (e) {
      throw e
    }
  },

  getCustomers: async (data) => {
    const { rawDate, filterReport } = data || {}
    const baseUrl = `${serverUrl}/customer`;
    const queryParams = {
      ...transformReportType(filterReport),
      ...transformDate(rawDate),
    };

    
    try {
      const url = buildUrl(baseUrl, queryParams);
      const method = 'GET'
      const response = await client(url, method);
      if (response.error === 'No permissons to access this route') {
        return {
          data: [],
          error: "No permissons to access this route"
        }
      }
      if (!response)
        throw new Error("Cannot fetch Complainer");
      return response
    } catch (e) {
      throw e
    }
  },

  getInstallers: async (data) => {
    const { rawDate, filterReport } = data || {}
    const baseUrl = `${serverUrl}/staff/all?role=installer`;
    const queryParams = {
      ...transformReportType(filterReport),
      ...transformDate(rawDate),
    };

    
    try {
      const url = buildUrl(baseUrl, queryParams);
      const method = 'GET'
      const response = await client(url, method);
      if (response.error === 'No permissons to access this route') {
        return {
          data: [],
          error: "No permissons to access this route"
        }
      }
      if (!response)
        throw new Error("Cannot fetch Complainer");
      return response
    } catch (e) {
      throw e
    }
  },

}

const buildUrl = (baseUrl, queryParams) => {
  const url = new URL(baseUrl);
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, queryParams[key]);
    }
  });

  return url.toString();
}

const transformReportType = (data) => {
  return {
    sort: data?.sort === 1 ? 1 : undefined,
    exists: data?.userId === true ? true : data?.userId === false ? false : undefined,
    verified: data?.verified ? 'verified' : undefined,
  };

}

const transformDate = (rawDate) => {
  const today = moment().format('YYYY-MM-DD')
  if (!rawDate?.length)  return undefined
  if (Array.isArray(rawDate)) {
    if ( JSON.stringify(rawDate[0]) === JSON.stringify(today) 
        && JSON.stringify(rawDate[1]) === JSON.stringify(today)) {
      return undefined
    } else if (JSON.stringify(rawDate[0]) === JSON.stringify(rawDate[1])) {
      return {
        gte: rawDate[0],
      }
    } else {
      return {
        gte: rawDate[0],
        lt: rawDate[1]
      }
    }
  }

}

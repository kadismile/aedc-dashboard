import { client} from '../utils/api-client'
import moment from 'moment'

const serverUrl = process.env.REACT_APP_API_BASE_URL;

export const reportService =  {

  getReporter: async () => {
    try {
      const url = `${serverUrl}/report/reporter`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Cannot fetch Complainer");
      return response
    } catch (e) {
      throw e
    }
  },

  getReports: async () => {
    try {
      const url = `${serverUrl}/report`
      const method = 'GET'
      const response = await client(url, method);
      if (!response)
        throw new Error("Cannot fetch Complainer");
      return response
    } catch (e) {
      throw e
    }
  },

  getOneReport:async (reportSlug) => {
    if (!reportSlug ) 
    return {
      status: 'failed',
      message: '',
    }
    try {
      const url = `${serverUrl}/report/one?reportSlug=${reportSlug}`
      const method = 'GET'
      const response = await client(url, method);
      return response
    } catch (e) {
      throw e
    }
  },

  acceptReport:async (data) => {
    try {
      const url = `${serverUrl}/report/accept`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot Accept  Report");
      return response
    } catch (e) {
      throw e
    }
  },

  verifyReport:async (data) => {
    try {
      const url = `${serverUrl}/report/verify`
      const method = 'POST'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot Add Department");
      return response
    } catch (e) {
      throw e
    }
  },

  getReportTypes: async () => {
    try {
      const url = `${serverUrl}/report/type`;
      const method = 'GET';
      const response = await client(url, method);
      if (!response)
        throw new Error("Cannot Retrieve Report Types");
      return response
    } catch (e) {
      throw e
    }
  },

  getReportComments:async (reportId) => {
    if (!reportId ) 
    return {
      status: 'failed',
      message: '',
    }
    try {
      const url = `${serverUrl}/report/verification?reportId=${reportId}`
      const method = 'GET'
      const response = await client(url, method);
      return response
    } catch (e) {
      throw e
    }
  },

  getDraftReport:async (reportId) => {
    if (!reportId ) 
    return {
      status: 'failed',
      message: '',
    }
    try {
      const url = `${serverUrl}/report/draft?reportId=${reportId}`
      const method = 'GET'
      const response = await client(url, method);
      return response
    } catch (e) {
      throw e
    }
  },

  prepareCsvData: (data) => {
    return data.map((csv)=> {
      return {
        "_id": csv.reportSlug,
        "report-type": csv.reportTypeId.name,
        "reporter": csv.reporterId,
        "description": csv.description,
        "intervention": csv.intervention,
        "number-killed": csv.numberKilled,
        "number-displaced": csv.numberDisplaced,
        "informationSource": csv.informationSource,
        "verified": csv.verified,
        "reoccurence": csv.reoccurence,
        "state": csv.address.state,
        "localGovt": csv.address.localGovt,
        "fullAddress": csv.address.fullAddress,
        "date-created": moment(csv.createdAt).format("MMM D, YYYY")
      }
    })
  },

  createReports: async (data) => {
    try {
      const url = `${serverUrl}/report/create`
      const method = "POST"
      const contentType = "true"
      const response = await client(url, method, data, contentType)
      if (!response) throw new Error("Cannot Create a reporter")
      return response
    } catch (e) {
      throw e
    }
  },

  delReport: async (data) => {
    try {
      const url = `${serverUrl}/report`
      const method = 'DELETE'
      const response = await client(url, method, { ...data });
      if (!response)
        throw new Error("Cannot Delete Report");
      return response
    } catch (e) {
      throw e
    }
  },

  
}
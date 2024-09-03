import { userService } from '../services/userService';

export const  client = async (url, method, reqBody = undefined, contentType) => {

  const { token } = userService.fetchUserFromStore()
  let headers
  if (contentType) {
    headers = {
      'Authorization': `Bearer ${ token }`,
    };
  } else {
    headers = {
      'Authorization': `Bearer ${ token }`,
      'content-type': 'application/json',
    };
    reqBody = JSON.stringify(reqBody)
  }

  const config = {
    method,
    body: reqBody,
    headers,
  };
  try {
    const response = await window.fetch(url, config);
    return response.json()
  } catch (err) {
    console.log('Client Error -------> ', err)
    return err
  }
}

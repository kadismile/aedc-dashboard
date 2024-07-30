import { store } from '../../redux/store';

export const WithPermissions = ({permitedPermissions, children}) => {
  let staff = store?.getState()?.staff?.staff
  if (staff) {
    staff = staff.staff
  }

  const chekForPermission = () => {
    const { permissions } = staff || {}
    let permitted = false 
    if (staff?.role === 'superAdmin') {
      return true
    }
    
    for (let perm of permissions) {
      if (permitedPermissions.includes(perm)) {
        permitted = true
      }
    }
    return permitted
  }

  return (
    chekForPermission() ?  children : null
  )
}
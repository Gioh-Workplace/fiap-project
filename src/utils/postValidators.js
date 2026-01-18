import { POST_STATUS_VALUES, POST_STATUS } from "../constants/postStatus.js";
import { ROLES } from "../constants/roles.js";

export function validarStatusPost(status) {
  if (status === undefined) return true;
  return POST_STATUS_VALUES.includes(status);
}

export function alunoPodeVerPost(userRole, postStatus) {
    if (!userRole) return false;
  
    if (userRole === ROLES.PROFESSOR) return true;
  
    if (userRole === ROLES.ALUNO) {
      return postStatus === POST_STATUS.PUBLICADO;
    }
  
    return false;
  }

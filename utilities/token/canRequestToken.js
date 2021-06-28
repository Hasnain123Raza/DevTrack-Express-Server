import { getToken } from "../../services/database/collections/users/token";

export default async function canRequestToken(_id, name) {
  const token = (await getToken(_id, name))[name];

  return !(Boolean(token) && Date.now() < token.cooldown);
}

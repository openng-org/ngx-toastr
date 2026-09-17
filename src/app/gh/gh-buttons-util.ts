export async function getUser(user: string): Promise<any> {
  const url = `https://api.github.com/users/${user}`;
  return fetch(url, { method: 'GET' }).then(response => response.json());
}

export async function getRepo(user: string, repo: string): Promise<any> {
  const url = `https://api.github.com/repos/${user}/${repo}`;
  return fetch(url, { method: 'GET' }).then(response => response.json());
}

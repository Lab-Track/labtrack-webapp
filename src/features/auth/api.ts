const API_URL = import.meta.env.VITE_API_URL
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const MOCK_DELAY_MS = 300

export interface CredenciaisLogin {
  login: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function autenticarMock(): Promise<LoginResponse> {
  await delay(MOCK_DELAY_MS)
  return {
    token: 'mock-jwt-token',
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  }
}

export async function autenticar(
  credenciais: CredenciaisLogin
): Promise<LoginResponse> {
  if (USE_MOCK) return autenticarMock()

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciais),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Login ou senha inválidos.')
    }
    throw new Error(`Falha ao entrar: ${response.status}`)
  }

  return response.json()
}

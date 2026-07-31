import { useState } from 'react'

// Minimal Ethereum provider types
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  isMetaMask?: boolean
}

// Minimal Solana provider types
interface SolanaProvider {
  connect: () => Promise<{ publicKey: { toString: () => string } }>
  isPhantom?: boolean
  publicKey?: { toString: () => string }
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
    solana?: SolanaProvider
  }
}

export function useMetamask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async (): Promise<string | null> => {
    setError(null)
    if (!window.ethereum) {
      setError('MetaMask not detected. Install the MetaMask browser extension.')
      return null
    }
    setLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      return accounts[0] || null
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'MetaMask connection cancelled'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const isAvailable = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask

  return { connect, loading, error, isAvailable }
}

export function usePhantom() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async (): Promise<string | null> => {
    setError(null)
    if (!window.solana?.isPhantom) {
      setError('Phantom wallet not detected. Install the Phantom browser extension.')
      return null
    }
    setLoading(true)
    try {
      const resp = await window.solana.connect()
      return resp.publicKey.toString()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Phantom connection cancelled'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const isAvailable = typeof window !== 'undefined' && !!window.solana?.isPhantom

  return { connect, loading, error, isAvailable }
}

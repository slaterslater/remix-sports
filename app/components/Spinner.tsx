// Spinner Component

interface SpinnerProps {
  variant: string
}

export default function Spinner({ variant }: SpinnerProps) {
  const className = `lds-${variant}`
  return (
    <div className={className}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

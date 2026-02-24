import { rmSync, existsSync } from 'fs'
import { join } from 'path'

const root = join(import.meta.dirname, '..')
const nextDir = join(root, '.next')

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true })
  console.log('Deleted .next directory')
} else {
  console.log('.next directory does not exist')
}

// Also check for turbopack cache
const turboDir = join(root, '.turbo')
if (existsSync(turboDir)) {
  rmSync(turboDir, { recursive: true, force: true })
  console.log('Deleted .turbo directory')
} else {
  console.log('.turbo directory does not exist')
}

console.log('Cache cleared successfully')

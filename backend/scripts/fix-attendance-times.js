// Script to fix existing attendance records that are missing clockIn times
// This will set clockIn to createdAt for PRESENT/LATE records that don't have clockIn

const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function fixAttendanceTimes() {
  console.log('Starting attendance times fix...')
  
  try {
    // Find all attendance records that are PRESENT or LATE but missing clockIn
    const recordsToFix = await prisma.attendance.findMany({
      where: {
        OR: [
          { status: 'PRESENT' },
          { status: 'LATE' }
        ],
        clockIn: null
      }
    })

    console.log(`Found ${recordsToFix.length} records to fix`)

    if (recordsToFix.length === 0) {
      console.log('No records need fixing!')
      return
    }

    // Update each record to set clockIn to createdAt
    let fixed = 0
    for (const record of recordsToFix) {
      await prisma.attendance.update({
        where: { id: record.id },
        data: {
          clockIn: record.createdAt
        }
      })
      fixed++
      if (fixed % 10 === 0) {
        console.log(`Fixed ${fixed}/${recordsToFix.length} records...`)
      }
    }

    console.log(`✅ Successfully fixed ${fixed} attendance records!`)
    console.log('All PRESENT/LATE records now have clockIn times set.')
    
  } catch (error) {
    console.error('❌ Error fixing attendance times:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixAttendanceTimes()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })

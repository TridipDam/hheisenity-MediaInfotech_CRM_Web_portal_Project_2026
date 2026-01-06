import { StaffPortal } from "@/components/StaffPortal"
import { getDeviceInfo } from "@/lib/server-actions"

export default async function StaffPortalPage() {
  const deviceInfo = await getDeviceInfo()
  
  return <StaffPortal deviceInfo={deviceInfo} />
}
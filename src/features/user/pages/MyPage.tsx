import ProfileSection from '@/features/user/components/ProfileSection'
import MyTeamSection from '@/features/user/components/MyTeamSection'

export default function MyPage() {
  return (
    <div className='w-full pt-20'>
      <ProfileSection />
      <MyTeamSection />
    </div>
  )
}

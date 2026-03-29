import ProfileSection from '@/features/user/components/ProfileSection'
import MyTeamSection from '@/features/user/components/MyTeamSection'

export default function MyPage() {
  return (
    <div className='w-full pt-20'>
      <div className='animate-fade-up'>
        <ProfileSection />
      </div>
      <div className='animate-card-in anim-delay-[0.15s]'>
        <MyTeamSection />
      </div>
    </div>
  )
}

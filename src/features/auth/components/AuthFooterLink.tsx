interface Props {
  text: string
  linkText: string
  href: string
}

export default function AuthFooterLink({ text, linkText, href }: Props) {
  return (
    <p className='mt-8 text-center text-sm text-gray-500'>
      {text}{' '}
      <a href={href} className='text-blue-500 font-medium'>
        {linkText}
      </a>
    </p>
  )
}

import dynamic from 'next/dynamic'

const NonSSRWrapper = ({ children }) => (
    <>
        {children}
    </>
)

export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false
})
